import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

const KEY = "access_token";

export const tokenStorage = {
  async get(): Promise<string | null> {
    if (Platform.OS === "web") {
      return localStorage.getItem(KEY);
    }
    const ok = await SecureStore.isAvailableAsync();
    if (!ok) return null;
    return await SecureStore.getItemAsync(KEY);
  },

  async set(token: string): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.setItem(KEY, token);
      return;
    }
    const ok = await SecureStore.isAvailableAsync();
    if (!ok) return;
    await SecureStore.setItemAsync(KEY, token);
  },

  async remove(): Promise<void> {
    if (Platform.OS === "web") {
      localStorage.removeItem(KEY);
      return;
    }
    const ok = await SecureStore.isAvailableAsync();
    if (!ok) return;
    await SecureStore.deleteItemAsync(KEY);
  },
};
