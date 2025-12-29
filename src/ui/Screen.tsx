import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@/src/theme/useTheme";

type ScreenProps = {
  children: React.ReactNode;
  scroll?: boolean;
  padding?: boolean;
  keyboardAvoiding?: boolean;
  keyboardOffset?: number;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  statusBarStyle?: "light-content" | "dark-content";
  statusBarBackgroundColor?: string;
};

export function Screen({
  children,
  scroll = false,
  padding = true,
  keyboardAvoiding = false,
  keyboardOffset = 0,
  style,
  contentContainerStyle,
  statusBarStyle,
  statusBarBackgroundColor,
}: ScreenProps) {
  const { colors, spacing, isDark } = useTheme();
  const styles = makeStyles(colors.background);
  const contentStyle: StyleProp<ViewStyle> = [
    padding && { padding: spacing.lg },
    contentContainerStyle,
  ];

  const content = scroll ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, contentStyle]}>{children}</View>
  );

  const inner = keyboardAvoiding ? (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={keyboardOffset}
    >
      {content}
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }, style]}>
      <StatusBar
        barStyle={statusBarStyle ?? (isDark ? "light-content" : "dark-content")}
        backgroundColor={statusBarBackgroundColor ?? colors.background}
      />
      {inner}
    </SafeAreaView>
  );
}

const makeStyles = (background: string) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: background,
    },
    scrollContent: {
      flexGrow: 1,
    },
    flex: {
      flex: 1,
    },
  });
