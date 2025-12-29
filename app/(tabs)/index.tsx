import { CourseCard } from "@/components/CourseCard";
import { CategoryChip } from "@/components/CategoryChip";
import { SearchBar } from "@/components/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useAllCategories } from "@/src/features/category/category.queries";
import { usePublishedCourses } from "@/src/features/course/course.hooks";
import type { CourseListParams } from "@/src/features/course/course.types";
import { useI18n } from "@/src/i18n";
import { useAuthStore } from "@/src/stores/auth.store";
import { useTheme } from "@/src/theme/useTheme";
import { Screen } from "@/src/ui/Screen";
import { State } from "@/src/ui/State";
import { Text } from "@/src/ui/Text";

export default function HomeScreen() {
  const router = useRouter();
  const { colors, radius, spacing } = useTheme();
  const styles = makeStyles(colors, radius, spacing);
  const { t } = useI18n();
  const user = useAuthStore((s) => s.user);

  const [searchQuery, setSearchQuery] = useState("");
  const [params, setParams] = useState<CourseListParams>({
    pageNumber: 0,
    pageSize: 8,
    keyword: "",
    sortBy: "id",
    sortDir: "asc",
  });

  const courseQuery = usePublishedCourses(params);
  const categoriesQuery = useAllCategories();
  const categoriesData = categoriesQuery.data ?? [];
  const courses = courseQuery.data?.content ?? [];

  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const query = searchQuery.trim().toLowerCase();
    return courses.filter((course) => {
      const instructorName =
        course.instructor && typeof course.instructor === "object"
          ? String((course.instructor as Record<string, unknown>).name ?? "")
          : "";
      return (
        course.name.toLowerCase().includes(query) ||
        instructorName.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query)
      );
    });
  }, [courses, searchQuery]);

  const continueLearning = filteredCourses.slice(0, 5);
  const featuredCourses = filteredCourses;
  const categoryItems = categoriesData.map((category) => ({
    id: category.id,
    name: category.tag,
  }));

  const handleCoursePress = (courseId: string | number) => {
    router.push(`/course/${courseId}`);
  };

  const renderContinueLearningItem = ({
    item,
  }: {
    item: (typeof courses)[number];
  }) => (
    <CourseCard
      course={item}
      variant="horizontal"
      onPress={() => handleCoursePress(item.id)}
    />
  );

  const renderCategoryItem = ({
    item,
  }: {
    item: (typeof categoryItems)[number];
  }) => (
    <CategoryChip
      category={item}
      onPress={() => router.push(`/(tabs)/explore?category=${item.name}`)}
    />
  );

  if (courseQuery.isLoading || categoriesQuery.isLoading) {
    return (
      <Screen>
        <State type="loading" title={t("common.loading")} />
      </Screen>
    );
  }

  if (courseQuery.isError || categoriesQuery.isError) {
    return (
      <Screen>
        <State
          type="error"
          title={t("common.errorGeneric")}
          actionLabel={t("common.retry")}
          onAction={() => {
            courseQuery.refetch();
            categoriesQuery.refetch();
          }}
        />
      </Screen>
    );
  }

  const displayName = user?.firstName || user?.username || user?.email || "-";

  return (
    <Screen scroll padding={false}>
      <View style={styles.header}>
        <View>
          <Text variant="bodySmall" color={colors.textSecondary}>
            {t("home.greeting")}
          </Text>
          <Text variant="title">{displayName}</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons
            name="notifications-outline"
            size={22}
            color={colors.text}
          />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={(value) => {
            setSearchQuery(value);
            setParams((prev) => ({ ...prev, pageNumber: 0, keyword: value }));
          }}
          placeholder={t("common.searchPlaceholder")}
        />
      </View>

      {continueLearning.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="subtitle">{t("home.continueLearning")}</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/my-courses")}>
              <Text variant="bodySmall" color={colors.primary} weight="600">
                {t("home.seeAll")}
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={continueLearning}
            renderItem={renderContinueLearningItem}
            keyExtractor={(item) => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="subtitle">{t("home.categories")}</Text>
        </View>
        <FlatList
          data={categoryItems}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => String(item.id)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="subtitle">{t("home.featured")}</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
            <Text variant="bodySmall" color={colors.primary} weight="600">
              {t("home.seeAll")}
            </Text>
          </TouchableOpacity>
        </View>
        {featuredCourses.length === 0 ? (
          <State
            type="empty"
            title={t("common.noData")}
            message={t("explore.emptyMessage")}
          />
        ) : (
          <View style={styles.coursesGrid}>
            {featuredCourses.slice(0, 4).map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onPress={() => handleCoursePress(course.id)}
              />
            ))}
          </View>
        )}
      </View>

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
            total: courseQuery.data?.totalPages ?? 1,
          })}
        </Text>
        <TouchableOpacity
          style={[
            styles.pageButton,
            courseQuery.data?.last ? styles.pageButtonDisabled : undefined,
          ]}
          onPress={() =>
            setParams((prev) => ({
              ...prev,
              pageNumber: (prev.pageNumber ?? 0) + 1,
            }))
          }
          disabled={!!courseQuery.data?.last}
        >
          <Text variant="bodySmall">{t("common.next")}</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  radius: ReturnType<typeof useTheme>["radius"],
  spacing: ReturnType<typeof useTheme>["spacing"]
) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
    },
    notificationBtn: {
      width: 44,
      height: 44,
      borderRadius: radius.full,
      backgroundColor: colors.surface,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    notificationBadge: {
      position: "absolute",
      top: 10,
      right: 10,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.danger,
    },
    searchContainer: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
    },
    horizontalList: {
      paddingHorizontal: spacing.lg,
    },
    coursesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: spacing.lg,
      gap: spacing.md,
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
