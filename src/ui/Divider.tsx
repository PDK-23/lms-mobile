import React from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";
import { useTheme } from "@/src/theme/useTheme";

type DividerProps = {
  style?: ViewStyle;
};

export function Divider({ style }: DividerProps) {
  const { colors } = useTheme();
  const styles = makeStyles(colors.border);
  return <View style={[styles.divider, style]} />;
}

const makeStyles = (border: string) =>
  StyleSheet.create({
    divider: {
      height: 1,
      backgroundColor: border,
      width: "100%",
    },
  });
