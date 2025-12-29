import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
  type PressableProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@/src/theme/useTheme";
import { Text } from "./Text";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type ButtonProps = PressableProps & {
  label: string;
  variant?: Variant;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
};

export function Button({
  label,
  variant = "primary",
  loading = false,
  fullWidth = true,
  disabled,
  style,
  ...props
}: ButtonProps) {
  const { colors, radius, spacing } = useTheme();
  const styles = makeStyles(colors, radius, spacing);

  const isDisabled = disabled || loading;
  const buttonStyle = [
    styles.base,
    styles[variant],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    style,
  ];
  const textColor =
    variant === "ghost" || variant === "secondary" ? colors.text : "#FFFFFF";

  return (
    <Pressable
      {...props}
      disabled={isDisabled}
      style={({ pressed }) => [
        ...buttonStyle,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Text variant="body" weight="600" color={textColor}>
            {label}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  radius: ReturnType<typeof useTheme>["radius"],
  spacing: ReturnType<typeof useTheme>["spacing"]
) =>
  StyleSheet.create({
    base: {
      borderRadius: radius.lg,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.lg,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: "transparent",
    },
    content: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    fullWidth: {
      alignSelf: "stretch",
    },
    pressed: {
      opacity: 0.85,
    },
    disabled: {
      opacity: 0.6,
    },
    primary: {
      backgroundColor: colors.primary,
    },
    secondary: {
      backgroundColor: colors.surfaceAlt,
      borderColor: colors.border,
    },
    ghost: {
      backgroundColor: "transparent",
      borderColor: colors.border,
    },
    danger: {
      backgroundColor: colors.danger,
    },
  });
