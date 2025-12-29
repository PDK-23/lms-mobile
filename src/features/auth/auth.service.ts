import { api } from "@/src/api/client";
import type { LoginInput } from "./auth.schema";

export type AuthResponse = {
  token: string;
  username: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  message?: string;
};

export async function login(payload: LoginInput) {
  const { data } = await api.post<AuthResponse>("/auth/login", payload);
  return data;
}
