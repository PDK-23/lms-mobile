import { create } from "zustand";
import type { AuthResponse } from "@/src/features/auth/auth.service";
import { tokenStorage } from "@/src/storage/tokenStorage";

type AuthState = {
  token: string | null;
  user: Omit<AuthResponse, "token"> | null;
  isHydrated: boolean;

  hydrate: () => Promise<void>;
  setSession: (res: AuthResponse) => Promise<void>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isHydrated: false,

  hydrate: async () => {
    const token = await tokenStorage.get();
    set({ token: token ?? null, isHydrated: true });
  },

  setSession: async (res) => {
    await tokenStorage.set(res.token);
    const { token, ...user } = res;
    set({ token, user });
  },

  logout: async () => {
    await tokenStorage.remove();
    set({ token: null, user: null });
  },
}));
