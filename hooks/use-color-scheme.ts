import { useEffect } from "react";
import { useColorScheme as useRNColorScheme } from "react-native";
import { useThemeStore } from "@/src/stores/theme.store";

export function useColorScheme() {
  const system = useRNColorScheme() ?? "light";
  const mode = useThemeStore((s) => s.mode);
  const hydrate = useThemeStore((s) => s.hydrate);
  const isHydrated = useThemeStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) hydrate();
  }, [hydrate, isHydrated]);

  if (mode === "system") return system;
  return mode;
}
