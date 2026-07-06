import type { StreamEvent } from "@/types/chat";

interface ParsedSSE {
  event: string;
  data: string;
}

export function parseSSEChunk(buffer: string): {
  events: StreamEvent[];
  remainder: string;
} {
  const events: StreamEvent[] = [];
  const blocks = buffer.split("\n\n");
  const remainder = blocks.pop() ?? "";

  for (const block of blocks) {
    if (!block.trim()) continue;

    const parsed = parseSSEBlock(block);
    if (!parsed) continue;

    const streamEvent = toStreamEvent(parsed);
    if (streamEvent) {
      events.push(streamEvent);
    }
  }

  return { events, remainder };
}

function parseSSEBlock(block: string): ParsedSSE | null {
  let event = "message";
  let data = "";

  for (const line of block.split("\n")) {
    if (line.startsWith("event:")) {
      event = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      data = line.slice(5).trim();
    }
  }

  if (!data) return null;

  return { event, data };
}

function toStreamEvent(parsed: ParsedSSE): StreamEvent | null {
  try {
    const payload = JSON.parse(parsed.data) as Record<string, unknown>;

    if (parsed.event === "token" && typeof payload.content === "string") {
      return { type: "token", content: payload.content };
    }

    if (parsed.event === "done") {
      return { type: "done" };
    }

    if (parsed.event === "error") {
      return {
        type: "error",
        message:
          typeof payload.message === "string"
            ? payload.message
            : "Streaming failed.",
      };
    }
  } catch {
    return null;
  }

  return null;
}
