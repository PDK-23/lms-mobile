import { Platform } from "react-native";

const fontFamily = Platform.select({
  ios: {
    regular: "System",
    medium: "System",
    semibold: "System",
    bold: "System",
  },
  android: {
    regular: "sans-serif",
    medium: "sans-serif-medium",
    semibold: "sans-serif-medium",
    bold: "sans-serif",
  },
  default: {
    regular: "system-ui",
    medium: "system-ui",
    semibold: "system-ui",
    bold: "system-ui",
  },
});

export const typography = {
  fontFamily,
  sizes: {
    display: 32,
    title: 24,
    subtitle: 18,
    body: 16,
    bodySmall: 14,
    caption: 12,
  },
  lineHeights: {
    display: 40,
    title: 32,
    subtitle: 24,
    body: 24,
    bodySmall: 20,
    caption: 16,
  },
  weights: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
} as const;
