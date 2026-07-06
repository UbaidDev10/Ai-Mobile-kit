export type MessageRole =
  | "user"
  | "assistant"
  | "system";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface StreamMessage {
  role: MessageRole;
  content: string;
}

export interface ChatRequest {
  message: string;
}

export interface ChatResponse {
  answer: string;
}

export interface StreamChatRequest {
  messages: StreamMessage[];
  conversationId?: string;
}

export type StreamEventType = "token" | "done" | "error";

export interface StreamTokenEvent {
  type: "token";
  content: string;
}

export interface StreamDoneEvent {
  type: "done";
}

export interface StreamErrorEvent {
  type: "error";
  message: string;
}

export type StreamEvent =
  | StreamTokenEvent
  | StreamDoneEvent
  | StreamErrorEvent;
