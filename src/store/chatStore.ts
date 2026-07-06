import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { ChatMessage } from "@/types/chat";
import { createId } from "@/utils/createId";

export interface Conversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
}

interface ChatState {
  conversations: Conversation[];
  activeId: string | null;
  loading: boolean;
  streaming: boolean;
  error: string | null;

  newChat: () => string;
  clearAll: () => void;
  selectConversation: (id: string) => void;
  deleteConversation: (id: string) => void;
  removeLastAssistant: () => void;
  addMessage: (message: ChatMessage) => void;
  updateLastMessage: (token: string) => void;
  setLoading: (loading: boolean) => void;
  setStreaming: (streaming: boolean) => void;
  setError: (error: string | null) => void;
}

export function getActiveConversation(state: ChatState) {
  return state.conversations.find((c) => c.id === state.activeId) ?? null;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      conversations: [],
      activeId: null,
      loading: false,
      streaming: false,
      error: null,

      newChat: () => {
        const id = createId();
        const conversation: Conversation = {
          id,
          title: "New chat",
          messages: [],
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          conversations: [conversation, ...state.conversations],
          activeId: id,
          error: null,
        }));

        return id;
      },

      clearAll: () =>
        set({
          conversations: [],
          activeId: null,
          error: null,
        }),

      selectConversation: (id) => set({ activeId: id, error: null }),

      deleteConversation: (id) =>
        set((state) => {
          const conversations = state.conversations.filter((c) => c.id !== id);
          const activeId =
            state.activeId === id
              ? conversations[0]?.id ?? null
              : state.activeId;
          return { conversations, activeId };
        }),

      removeLastAssistant: () =>
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== state.activeId || c.messages.length === 0) return c;
            const last = c.messages[c.messages.length - 1];
            if (last.role !== "assistant") return c;
            return {
              ...c,
              messages: c.messages.slice(0, -1),
            };
          }),
        })),

      addMessage: (message) =>
        set((state) => ({
          conversations: state.conversations.map((c) =>
            c.id === state.activeId
              ? {
                  ...c,
                  messages: [...c.messages, message],
                  title:
                    c.messages.length === 0 && message.role === "user"
                      ? message.content.slice(0, 40)
                      : c.title,
                }
              : c
          ),
        })),

      updateLastMessage: (token) =>
        set((state) => ({
          conversations: state.conversations.map((c) => {
            if (c.id !== state.activeId || c.messages.length === 0) return c;

            const messages = [...c.messages];
            const lastIndex = messages.length - 1;
            const last = messages[lastIndex];

            messages[lastIndex] = {
              ...last,
              content: last.content + token,
            };

            return { ...c, messages };
          }),
        })),

      setLoading: (loading) => set({ loading }),
      setStreaming: (streaming) => set({ streaming }),
      setError: (error) => set({ error }),
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        conversations: state.conversations,
        activeId: state.activeId,
      }),
    }
  )
);
