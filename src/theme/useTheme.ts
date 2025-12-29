import { useMemo } from "react";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { colors } from "./colors";
import { radius } from "./radius";
import { spacing } from "./spacing";
import { typography } from "./typography";

export type Theme = {
  colors: (typeof colors)["light"];
  radius: typeof radius;
  spacing: typeof spacing;
  typography: typeof typography;
  isDark: boolean;
};

export function useTheme(): Theme {
  const scheme = useColorScheme();
  return useMemo(() => {
    const palette = colors[scheme === "dark" ? "dark" : "light"];
    return {
      colors: palette,
      radius,
      spacing,
      typography,
      isDark: scheme === "dark",
    };
  }, [scheme]);
}
