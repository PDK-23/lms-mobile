import { Document, getCourseById } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/src/theme/useTheme";
import { Card } from "@/src/ui/Card";
import { Screen } from "@/src/ui/Screen";
import { State } from "@/src/ui/State";
import { Text } from "@/src/ui/Text";

const getIcon = (type: Document['type']) => {
  const icons: Record<string, { name: string; color: string }> = {
    pdf: { name: 'document-text', color: '#FF5252' },
    slides: { name: 'easel', color: '#FF9800' },
    code: { name: 'code-slash', color: '#4CAF50' },
    video: { name: 'videocam', color: '#2196F3' },
  };
  return icons[type];
};

export default function DocumentsScreen() {
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const router = useRouter();
  const { colors, radius, spacing } = useTheme();
  const styles = makeStyles(colors, radius, spacing);

  const course = getCourseById(courseId || '');

  if (!course) {
    return (
      <Screen>
        <State
          type="error"
          title="Kh?ng t?m th?y kh?a h?c"
          message="Vui l?ng th? l?i ho?c quay v? trang tr??c."
          actionLabel="Quay l?i"
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const renderItem = ({ item }: { item: Document }) => {
    const icon = getIcon(item.type);
    return (
      <Card style={styles.card}>
        <View style={[styles.iconBox, { backgroundColor: icon.color + '20' }]}>
          <Ionicons name={icon.name as any} size={28} color={icon.color} />
        </View>
        <View style={styles.info}>
          <Text variant="body" weight="600">{item.title}</Text>
          <Text variant="caption">{item.type.toUpperCase()} ? {item.size}</Text>
        </View>
        <TouchableOpacity style={styles.downloadBtn}>
          <Ionicons name="download-outline" size={22} color={colors.primary} />
        </TouchableOpacity>
      </Card>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitle: 'T?i li?u',
        }}
      />
      <Screen padding={false}>
        <View style={styles.header}>
          <Text variant="subtitle">{course.title}</Text>
          <Text variant="bodySmall" color={colors.textSecondary}>
            {course.documents.length} t?i li?u
          </Text>
        </View>
        <FlatList
          data={course.documents}
          renderItem={renderItem}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      </Screen>
    </>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  radius: ReturnType<typeof useTheme>["radius"],
  spacing: ReturnType<typeof useTheme>["spacing"]
) =>
  StyleSheet.create({
    header: {
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: spacing.xs,
    },
    list: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    card: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.md,
      gap: spacing.md,
    },
    iconBox: {
      width: 50,
      height: 50,
      borderRadius: radius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    info: {
      flex: 1,
      gap: 2,
    },
    downloadBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primarySoft,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
