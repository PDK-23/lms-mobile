import { CourseCard } from "@/components/CourseCard";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useCourses } from "@/src/features/course/course.hooks";
import type { CourseListParams } from "@/src/features/course/course.types";
import { useI18n } from "@/src/i18n";
import { useTheme } from "@/src/theme/useTheme";
import { Header } from "@/src/ui/Header";
import { Screen } from "@/src/ui/Screen";
import { State } from "@/src/ui/State";
import { Text } from "@/src/ui/Text";

export default function MyCoursesScreen() {
  const router = useRouter();
  const { spacing, radius, colors } = useTheme();
  const styles = makeStyles(spacing, radius, colors);
  const { t } = useI18n();

  const [params, setParams] = useState<CourseListParams>({
    pageNumber: 0,
    pageSize: 12,
    keyword: "",
    sortBy: "id",
    sortDir: "asc",
  });
  const coursesQuery = useCourses(params);
  const courses = coursesQuery.data?.content ?? [];

  if (coursesQuery.isLoading) {
    return (
      <Screen>
        <State type="loading" title={t("common.loading")} />
      </Screen>
    );
  }

  if (coursesQuery.isError) {
    return (
      <Screen>
        <State
          type="error"
          title={t("common.errorGeneric")}
          actionLabel={t("common.retry")}
          onAction={coursesQuery.refetch}
        />
      </Screen>
    );
  }

  if (courses.length === 0) {
    return (
      <Screen>
        <State
          type="empty"
          title={t("courses.emptyTitle")}
          message={t("courses.emptyMessage")}
          actionLabel={t("courses.exploreAction")}
          onAction={() => router.push("/(tabs)/explore")}
        />
      </Screen>
    );
  }

  return (
    <Screen padding={false}>
      <View style={styles.header}>
        <Header
          title={t("courses.myCourses")}
          subtitle={t("courses.subtitle", {
            count: coursesQuery.data?.totalElements ?? courses.length,
          })}
        />
      </View>

      <>
        <FlatList
          data={courses}
          renderItem={({ item }) => (
            <CourseCard course={item} onPress={() => router.push(`/course/${item.id}`)} />
          )}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.courseRow}
          contentContainerStyle={styles.courseList}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.pagination}>
          <TouchableOpacity
            style={[
              styles.pageButton,
              (params.pageNumber ?? 0) === 0 && styles.pageButtonDisabled,
            ]}
            onPress={() =>
              setParams((prev) => ({
                ...prev,
                pageNumber: Math.max(0, (prev.pageNumber ?? 0) - 1),
              }))
            }
            disabled={(params.pageNumber ?? 0) === 0}
          >
            <Text variant="bodySmall">{t("common.prev")}</Text>
          </TouchableOpacity>
          <Text variant="caption" color={colors.textSecondary}>
            {t("common.page", {
              page: (params.pageNumber ?? 0) + 1,
              total: coursesQuery.data?.totalPages ?? 1,
            })}
          </Text>
          <TouchableOpacity
            style={[
              styles.pageButton,
              coursesQuery.data?.last ? styles.pageButtonDisabled : undefined,
            ]}
            onPress={() =>
              setParams((prev) => ({
                ...prev,
                pageNumber: (prev.pageNumber ?? 0) + 1,
              }))
            }
            disabled={!!coursesQuery.data?.last}
          >
            <Text variant="bodySmall">{t("common.next")}</Text>
          </TouchableOpacity>
        </View>
      </>
    </Screen>
  );
}

const makeStyles = (
  spacing: ReturnType<typeof useTheme>["spacing"],
  radius: ReturnType<typeof useTheme>["radius"],
  colors: ReturnType<typeof useTheme>["colors"]
) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
    },
    courseList: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
    },
    courseRow: {
      justifyContent: "space-between",
    },
    pagination: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
    },
    pageButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    pageButtonDisabled: {
      opacity: 0.5,
    },
  });
