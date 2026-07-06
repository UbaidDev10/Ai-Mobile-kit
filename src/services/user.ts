import { api, ENDPOINTS } from "./api";

export async function getProfile() {
  const { data } = await api.get(
    ENDPOINTS.PROFILE
  );

  return data;
}