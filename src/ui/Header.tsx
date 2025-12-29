import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/src/theme/useTheme";
import { Text } from "./Text";

type HeaderProps = {
  title: string;
  subtitle?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
};

export function Header({ title, subtitle, left, right }: HeaderProps) {
  const { colors, spacing } = useTheme();
  const styles = makeStyles(spacing);

  return (
    <View style={styles.container}>
      {left ? <View style={styles.side}>{left}</View> : null}
      <View style={styles.center}>
        <Text variant="title">{title}</Text>
        {subtitle ? (
          <Text variant="bodySmall" color={colors.textSecondary}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {right ? <View style={styles.side}>{right}</View> : null}
    </View>
  );
}

const makeStyles = (spacing: ReturnType<typeof useTheme>["spacing"]) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.md,
    },
    center: {
      flex: 1,
    },
    side: {
      width: 44,
      alignItems: "center",
      justifyContent: "center",
    },
  });
