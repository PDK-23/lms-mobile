import { queryClient } from "@/src/queryClient";
import { useAuthStore } from "@/src/stores/auth.store";

export function useLogout() {
  const logout = useAuthStore((s) => s.logout);

  return async () => {
    await logout();
    queryClient.clear();
  };
}
