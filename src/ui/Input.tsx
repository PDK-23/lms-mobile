import React from "react";
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@/src/theme/useTheme";
import { Text } from "./Text";

type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
};

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  ...props
}: InputProps) {
  const { colors, radius, spacing } = useTheme();
  const styles = makeStyles(colors, radius, spacing);
  const hasError = Boolean(error);

  return (
    <View style={containerStyle}>
      {label ? (
        <Text variant="bodySmall" weight="600" color={colors.text}>
          {label}
        </Text>
      ) : null}
      <View style={[styles.inputContainer, hasError && styles.inputError]}>
        {leftIcon ? <View style={styles.iconLeft}>{leftIcon}</View> : null}
        <TextInput
          {...props}
          style={[styles.input, style]}
          placeholderTextColor={colors.textSecondary}
        />
        {rightIcon ? <View style={styles.iconRight}>{rightIcon}</View> : null}
      </View>
      {hasError ? (
        <Text variant="caption" color={colors.danger} style={styles.errorText}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  radius: ReturnType<typeof useTheme>["radius"],
  spacing: ReturnType<typeof useTheme>["spacing"]
) =>
  StyleSheet.create({
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      height: 52,
      borderWidth: 1,
      borderColor: colors.border,
      marginTop: spacing.xs,
    },
    inputError: {
      borderColor: colors.danger,
      backgroundColor: colors.danger + "10",
    },
    input: {
      flex: 1,
      color: colors.text,
      fontSize: 16,
      height: "100%",
    },
    iconLeft: {
      marginRight: spacing.sm,
    },
    iconRight: {
      marginLeft: spacing.sm,
    },
    errorText: {
      marginTop: spacing.xs,
    },
  });
