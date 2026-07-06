import { create } from "zustand";

import { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  authenticated: boolean;

  setAuth: (
    user: User,
    accessToken: string
  ) => void;

  setUser: (user: User) => void;

  updateUser: (user: User) => void;

  logout: () => void;
}

export const useAuthStore =
  create<AuthState>((set) => ({
    user: null,
    accessToken: null,
    authenticated: false,

    setAuth: (user, accessToken) =>
      set({
        user,
        accessToken,
        authenticated: true,
      }),

    setUser: (user) =>
      set({
        user,
        authenticated: true,
      }),

    updateUser: (user) =>
      set({
        user,
      }),

    logout: () =>
      set({
        user: null,
        accessToken: null,
        authenticated: false,
      }),
  }));