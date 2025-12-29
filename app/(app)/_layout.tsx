import { Stack, Redirect } from "expo-router";
import { useAuthStore } from "@/src/stores/auth.store";

export default function AppLayout() {
  const { token, isHydrated } = useAuthStore();
  if (!isHydrated) return null;
  if (!token) return <Redirect href="/(auth)/login" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
