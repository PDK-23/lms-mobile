import { create } from "zustand";
import { localeStorage } from "@/src/storage/localeStorage";

export type Locale = "vi" | "en";

type LocaleState = {
  locale: Locale;
  isHydrated: boolean;
  setLocale: (locale: Locale) => Promise<void>;
  hydrate: () => Promise<void>;
};

const detectDeviceLocale = (): Locale => {
  let value = "en";
  if (typeof Intl !== "undefined") {
    value = Intl.DateTimeFormat().resolvedOptions().locale ?? value;
  } else {
    const nav = typeof globalThis !== "undefined" ? (globalThis as any).navigator : undefined;
    if (nav?.language) {
      value = nav.language;
    }
  }
  return value.toLowerCase().startsWith("vi") ? "vi" : "en";
};

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: detectDeviceLocale(),
  isHydrated: false,

  setLocale: async (locale) => {
    await localeStorage.set(locale);
    set({ locale });
  },

  hydrate: async () => {
    const stored = await localeStorage.get();
    set({
      locale: stored === "vi" || stored === "en" ? stored : detectDeviceLocale(),
      isHydrated: true,
    });
  },
}));
