import { api, ENDPOINTS } from "./api";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "@/types/auth";

export async function login(
  payload: LoginRequest
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    ENDPOINTS.LOGIN,
    payload
  );

  return data;
}

export async function register(
  payload: RegisterRequest
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>(
    ENDPOINTS.REGISTER,
    payload
  );

  return data;
}

export async function getProfile() {
  const { data } = await api.get(
    ENDPOINTS.PROFILE
  );

  return data;
}

export async function refreshToken(
  refreshToken: string
) {
  const { data } = await api.post(
    ENDPOINTS.REFRESH,
    {
      refreshToken,
    }
  );

  return data;
}