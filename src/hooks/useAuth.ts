import { useState } from "react";

import * as AuthService from "@/services/auth";

import { secureStorage } from "@/utils/secureStorage";

import { useAuthStore } from "@/store/authStore";

import {
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

export function useAuth() {
  const [loading, setLoading] =
    useState(false);

  const {
    user,
    authenticated,
    setUser,
    logout,
  } = useAuthStore();

  async function signIn(
    payload: LoginRequest
  ) {
    setLoading(true);

    try {
      const response =
        await AuthService.login(
          payload
        );

      await secureStorage.setTokens(
        response.accessToken,
        response.refreshToken
      );

      setUser(response.user);

      return response.user;
    } finally {
      setLoading(false);
    }
  }

  async function signUp(
    payload: RegisterRequest
  ) {
    setLoading(true);

    try {
      const response =
        await AuthService.register(
          payload
        );

      await secureStorage.setTokens(
        response.accessToken,
        response.refreshToken
      );

      setUser(response.user);

      return response.user;
    } finally {
      setLoading(false);
    }
  }

  async function signOut() {
    await secureStorage.clear();

    logout();
  }

  async function restoreSession() {
    const token =
      await secureStorage.getAccessToken();

    if (!token) return;

    try {
      const user =
        await AuthService.getProfile();

      setUser(user);
    } catch {
      await signOut();
    }
  }

  return {
    user,
    authenticated,
    loading,

    signIn,
    signUp,
    signOut,
    restoreSession,
  };
}