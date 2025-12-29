import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const KEY = "theme_mode";

export const themeStorage = {
  async get(): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(KEY);
    }
    const ok = await SecureStore.isAvailableAsync();
    if (!ok) return null;
    return await SecureStore.getItemAsync(KEY);
  },

  async set(mode: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.setItem(KEY, mode);
      return;
    }
    const ok = await SecureStore.isAvailableAsync();
    if (!ok) return;
    await SecureStore.setItemAsync(KEY, mode);
  },
};
