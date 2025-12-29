import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const KEY = "locale";

export const localeStorage = {
  async get(): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(KEY);
    }
    const ok = await SecureStore.isAvailableAsync();
    if (!ok) return null;
    return await SecureStore.getItemAsync(KEY);
  },

  async set(locale: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.setItem(KEY, locale);
      return;
    }
    const ok = await SecureStore.isAvailableAsync();
    if (!ok) return;
    await SecureStore.setItemAsync(KEY, locale);
  },
};
