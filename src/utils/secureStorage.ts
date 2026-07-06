import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";

export const secureStorage = {
  async getAccessToken() {
    return SecureStore.getItemAsync(ACCESS_TOKEN);
  },

  async getRefreshToken() {
    return SecureStore.getItemAsync(REFRESH_TOKEN);
  },

  async setTokens(
    accessToken: string,
    refreshToken: string
  ) {
    await SecureStore.setItemAsync(
      ACCESS_TOKEN,
      accessToken
    );

    await SecureStore.setItemAsync(
      REFRESH_TOKEN,
      refreshToken
    );
  },

  async clear() {
    await SecureStore.deleteItemAsync(
      ACCESS_TOKEN
    );

    await SecureStore.deleteItemAsync(
      REFRESH_TOKEN
    );
  },
};