import { Stack, Redirect } from "expo-router";
import { useAuthStore } from "@/src/stores/auth.store";

export default function AuthLayout() {
  const { token, isHydrated } = useAuthStore();
  if (!isHydrated) return null;
  if (token) return <Redirect href="/" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
