import { Platform } from "react-native";

import { ENDPOINTS } from "@/services/api/endpoints";
import { getAuthToken } from "@/services/authToken";
import { parseSSEChunk } from "@/utils/sseParser";
import type { StreamChatRequest, StreamEvent } from "@/types/chat";

const API = process.env.EXPO_PUBLIC_API_URL;

function apiUrl(path: string): string {
  if (!API) {
    throw new Error(
      "API URL is not configured. Set EXPO_PUBLIC_API_URL in your .env file."
    );
  }
  return `${API.replace(/\/$/, "")}${path}`;
}

function toNetworkError(error: unknown): Error {
  if (error instanceof Error) {
    if (
      error.message === "Network request failed" ||
      error.message.includes("Failed to connect")
    ) {
      return new Error(
        `Cannot reach API at ${API ?? "(not set)"}. Run npm run backend and ensure your phone is on the same Wi‑Fi.`
      );
    }
    return error;
  }
  return new Error("Streaming failed.");
}

function dispatchEvents(
  events: StreamEvent[],
  onEvent: (event: StreamEvent) => void
) {
  for (const event of events) {
    onEvent(event);

    if (event.type === "error") {
      throw new Error(event.message);
    }
  }
}

function consumeChunk(
  buffer: string,
  chunk: string,
  onEvent: (event: StreamEvent) => void
): string {
  const { events, remainder } = parseSSEChunk(buffer + chunk);
  dispatchEvents(events, onEvent);
  return remainder;
}

async function streamWithFetch(
  url: string,
  payload: StreamChatRequest,
  headers: Record<string, string>,
  signal: AbortSignal,
  onEvent: (event: StreamEvent) => void
) {
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      errorBody || `Streaming request failed (${response.status}).`
    );
  }

  if (response.body) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer = consumeChunk(buffer, decoder.decode(value, { stream: true }), onEvent);
    }

    return;
  }

  const text = await response.text();
  consumeChunk("", text, onEvent);
}

function streamWithXHR(
  url: string,
  payload: StreamChatRequest,
  headers: Record<string, string>,
  signal: AbortSignal,
  onEvent: (event: StreamEvent) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    let buffer = "";
    let lastLength = 0;
    let settled = false;

    const finish = (action: () => void) => {
      if (settled) return;
      settled = true;
      action();
    };

    const processDelta = () => {
      const delta = xhr.responseText.slice(lastLength);
      lastLength = xhr.responseText.length;
      if (!delta) return;

      buffer = consumeChunk(buffer, delta, onEvent);
    };

    xhr.open("POST", url);
    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value);
    }

    xhr.onprogress = processDelta;

    xhr.onload = () => {
      if (xhr.status >= 400) {
        finish(() =>
          reject(
            new Error(
              xhr.responseText || `Streaming request failed (${xhr.status}).`
            )
          )
        );
        return;
      }

      try {
        processDelta();
        finish(resolve);
      } catch (error) {
        finish(() => reject(error));
      }
    };

    xhr.onerror = () => finish(() => reject(new Error("Network request failed")));
    xhr.onabort = () => finish(resolve);

    signal.addEventListener("abort", () => xhr.abort(), { once: true });
    xhr.send(JSON.stringify(payload));
  });
}

export interface StreamCallbacks {
  onStart?: () => void;
  onEvent: (event: StreamEvent) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export interface StreamHandle {
  abort: () => void;
}

export async function streamMessage(
  payload: StreamChatRequest,
  callbacks: StreamCallbacks
): Promise<StreamHandle> {
  const abortController = new AbortController();

  const run = async () => {
    try {
      callbacks.onStart?.();

      const token = await getAuthToken();
      const url = apiUrl(ENDPOINTS.STREAM);
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "text/event-stream",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      };

      if (Platform.OS === "web") {
        await streamWithFetch(
          url,
          payload,
          headers,
          abortController.signal,
          callbacks.onEvent
        );
      } else {
        await streamWithXHR(
          url,
          payload,
          headers,
          abortController.signal,
          callbacks.onEvent
        );
      }

      callbacks.onComplete?.();
    } catch (error) {
      if (abortController.signal.aborted) {
        return;
      }

      callbacks.onError?.(toNetworkError(error));
    }
  };

  void run();

  return {
    abort: () => abortController.abort(),
  };
}
