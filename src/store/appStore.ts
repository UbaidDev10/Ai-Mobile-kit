import { create } from "zustand";

type Theme = "light" | "dark" | "system";

interface AppState {
  theme: Theme;

  initialized: boolean;

  setTheme: (
    theme: Theme
  ) => void;

  setInitialized: (
    value: boolean
  ) => void;
}

export const useAppStore =
  create<AppState>((set) => ({
    theme: "system",

    initialized: false,

    setTheme: (theme) =>
      set({
        theme,
      }),

    setInitialized: (value) =>
      set({
        initialized: value,
      }),
  }));