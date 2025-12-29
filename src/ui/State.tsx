import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/src/theme/useTheme";
import { Button } from "./Button";
import { Text } from "./Text";

type StateType = "loading" | "empty" | "error";

type StateProps = {
  type: StateType;
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function State({
  type,
  title,
  message,
  actionLabel,
  onAction,
}: StateProps) {
  const { colors, spacing } = useTheme();
  const styles = makeStyles(spacing);

  const iconName =
    type === "empty" ? "folder-open-outline" : type === "error" ? "alert-circle-outline" : "time-outline";
  const iconColor =
    type === "error" ? colors.danger : type === "empty" ? colors.textSecondary : colors.primary;

  return (
    <View style={styles.container}>
      {type === "loading" ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <Ionicons name={iconName} size={64} color={iconColor} />
      )}
      {title ? (
        <Text variant="subtitle" align="center" style={styles.title}>
          {title}
        </Text>
      ) : null}
      {message ? (
        <Text variant="bodySmall" align="center" style={styles.message}>
          {message}
        </Text>
      ) : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} style={styles.action} />
      ) : null}
    </View>
  );
}

const makeStyles = (spacing: ReturnType<typeof useTheme>["spacing"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.xl,
    },
    title: {
      marginTop: spacing.md,
    },
    message: {
      marginTop: spacing.sm,
    },
    action: {
      marginTop: spacing.lg,
    },
  });
