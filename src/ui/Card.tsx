import React from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { useTheme } from "@/src/theme/useTheme";

type CardProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function Card({ children, style }: CardProps) {
  const { colors, radius } = useTheme();
  const styles = makeStyles(colors.surface, colors.border, radius.lg);
  return <View style={[styles.card, style]}>{children}</View>;
}

const makeStyles = (background: string, border: string, radius: number) =>
  StyleSheet.create({
    card: {
      backgroundColor: background,
      borderRadius: radius,
      borderWidth: 1,
      borderColor: border,
    },
  });
