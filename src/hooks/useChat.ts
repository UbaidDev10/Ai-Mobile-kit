import { useCallback, useRef } from "react";

import { sendMessage } from "@/services/chat";
import { streamMessage, type StreamHandle } from "@/services/chatStream";
import {
  getActiveConversation,
  useChatStore,
} from "@/store/chatStore";
import type { ChatMessage, StreamMessage } from "@/types/chat";
import { createId } from "@/utils/createId";

function toStreamMessages(messages: ChatMessage[]): StreamMessage[] {
  return messages.map(({ role, content }) => ({ role, content }));
}

export function useChat() {
  const streamRef = useRef<StreamHandle | null>(null);

  const {
    conversations,
    activeId,
    loading,
    streaming,
    error,
    newChat,
    clearAll,
    selectConversation,
    deleteConversation,
    removeLastAssistant,
    addMessage,
    updateLastMessage,
    setLoading,
    setStreaming,
    setError,
  } = useChatStore();

  const active = useChatStore(getActiveConversation);
  const messages = active?.messages ?? [];

  const streamFromMessages = useCallback(
    async (conversationId: string, nextMessages: ChatMessage[]) => {
      setError(null);
      setStreaming(true);

      streamRef.current = await streamMessage(
        {
          messages: toStreamMessages(nextMessages),
          conversationId,
        },
        {
          onEvent: (event) => {
            if (event.type === "token") {
              updateLastMessage(event.content);
            }
          },
          onComplete: () => {
            setStreaming(false);
            streamRef.current = null;
          },
          onError: (err) => {
            setError(err.message);
            setStreaming(false);
            streamRef.current = null;
          },
        }
      );
    },
    [setError, setStreaming, updateLastMessage]
  );

  const ask = useCallback(
    async (message: string) => {
      setLoading(true);
      setError(null);

      try {
        return await sendMessage({ message });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Request failed.";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setError, setLoading]
  );

  const sendStreamingMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || streaming) return;

      let conversationId = activeId;
      if (!conversationId) {
        conversationId = newChat();
      }

      const currentMessages =
        useChatStore
          .getState()
          .conversations.find((c) => c.id === conversationId)?.messages ?? [];

      const userMessage: ChatMessage = {
        id: createId(),
        role: "user",
        content: trimmed,
        createdAt: new Date().toISOString(),
      };

      const assistantMessage: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: "",
        createdAt: new Date().toISOString(),
      };

      const nextMessages = [...currentMessages, userMessage];
      addMessage(userMessage);
      addMessage(assistantMessage);

      await streamFromMessages(conversationId, nextMessages);
    },
    [activeId, addMessage, newChat, streamFromMessages, streaming]
  );

  const regenerateLastResponse = useCallback(async () => {
    if (streaming) return;

    const state = useChatStore.getState();
    const conversation = getActiveConversation(state);
    if (!conversation || conversation.messages.length < 2) return;

    const last = conversation.messages[conversation.messages.length - 1];
    if (last.role !== "assistant") return;

    removeLastAssistant();

    const refreshedMessages =
      useChatStore
        .getState()
        .conversations.find((c) => c.id === conversation.id)?.messages ?? [];

    const assistantMessage: ChatMessage = {
      id: createId(),
      role: "assistant",
      content: "",
      createdAt: new Date().toISOString(),
    };

    addMessage(assistantMessage);

    await streamFromMessages(conversation.id, refreshedMessages);
  }, [addMessage, removeLastAssistant, streamFromMessages, streaming]);

  const cancelStream = useCallback(() => {
    streamRef.current?.abort();
    streamRef.current = null;
    setStreaming(false);
  }, [setStreaming]);

  return {
    messages,
    activeConversation: active,
    conversations,
    activeId,
    loading,
    streaming,
    error,
    ask,
    sendStreamingMessage,
    regenerateLastResponse,
    cancelStream,
    newChat,
    clearAll,
    selectConversation,
    deleteConversation,
  };
}
