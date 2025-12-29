import React from "react";
import {
  StyleSheet,
  Text as RNText,
  type TextProps as RNTextProps,
  type TextStyle,
} from "react-native";
import { useTheme } from "@/src/theme/useTheme";

type Variant =
  | "display"
  | "title"
  | "subtitle"
  | "body"
  | "bodySmall"
  | "caption";

type TextProps = RNTextProps & {
  variant?: Variant;
  color?: string;
  align?: TextStyle["textAlign"];
  weight?: TextStyle["fontWeight"];
};

export function Text({
  variant = "body",
  color,
  align,
  weight,
  style,
  ...props
}: TextProps) {
  const { colors, typography } = useTheme();
  const styles = makeStyles(typography, colors.text, colors.textSecondary);

  const variantStyle = styles[variant];
  return (
    <RNText
      {...props}
      style={[
        variantStyle,
        align && { textAlign: align },
        color && { color },
        weight && { fontWeight: weight },
        style,
      ]}
    />
  );
}

const makeStyles = (
  typography: typeof import("@/src/theme/typography").typography,
  text: string,
  textSecondary: string
) =>
  StyleSheet.create({
    display: {
      fontSize: typography.sizes.display,
      lineHeight: typography.lineHeights.display,
      fontWeight: typography.weights.bold,
      color: text,
    },
    title: {
      fontSize: typography.sizes.title,
      lineHeight: typography.lineHeights.title,
      fontWeight: typography.weights.bold,
      color: text,
    },
    subtitle: {
      fontSize: typography.sizes.subtitle,
      lineHeight: typography.lineHeights.subtitle,
      fontWeight: typography.weights.semibold,
      color: text,
    },
    body: {
      fontSize: typography.sizes.body,
      lineHeight: typography.lineHeights.body,
      fontWeight: typography.weights.regular,
      color: text,
    },
    bodySmall: {
      fontSize: typography.sizes.bodySmall,
      lineHeight: typography.lineHeights.bodySmall,
      fontWeight: typography.weights.regular,
      color: textSecondary,
    },
    caption: {
      fontSize: typography.sizes.caption,
      lineHeight: typography.lineHeights.caption,
      fontWeight: typography.weights.regular,
      color: textSecondary,
    },
  });
