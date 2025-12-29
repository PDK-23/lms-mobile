import { create } from "zustand";
import { themeStorage } from "@/src/storage/themeStorage";

export type ThemeMode = "system" | "light" | "dark";

type ThemeState = {
  mode: ThemeMode;
  isHydrated: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  hydrate: () => Promise<void>;
};

export const useThemeStore = create<ThemeState>((set) => ({
  mode: "system",
  isHydrated: false,

  setMode: async (mode) => {
    await themeStorage.set(mode);
    set({ mode });
  },

  hydrate: async () => {
    const stored = await themeStorage.get();
    const mode =
      stored === "light" || stored === "dark" || stored === "system"
        ? stored
        : "system";
    set({
      mode,
      isHydrated: true,
    });
  },
}));
