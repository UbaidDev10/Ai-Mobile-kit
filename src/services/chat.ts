import { api, ENDPOINTS } from "./api";
import {
  ChatRequest,
  ChatResponse,
} from "@/types/chat";

export async function sendMessage(
  payload: ChatRequest
): Promise<ChatResponse> {
  const { data } =
    await api.post<ChatResponse>(
      ENDPOINTS.CHAT,
      payload
    );

  return data;
}