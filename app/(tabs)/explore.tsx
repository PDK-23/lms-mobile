import { CategoryChip } from "@/components/CategoryChip";
import { CourseCard } from "@/components/CourseCard";
import { SearchBar } from "@/components/SearchBar";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useAllCategories } from "@/src/features/category/category.queries";
import { usePublishedCourses } from "@/src/features/course/course.hooks";
import type { CourseListParams } from "@/src/features/course/course.types";
import { useI18n } from "@/src/i18n";
import { useTheme } from "@/src/theme/useTheme";
import { Header } from "@/src/ui/Header";
import { Screen } from "@/src/ui/Screen";
import { State } from "@/src/ui/State";
import { Text } from "@/src/ui/Text";

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { colors, spacing, radius } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(params.category || "all");
  const [listParams, setListParams] = useState<CourseListParams>({
    pageNumber: 0,
    pageSize: 12,
    keyword: "",
    sortBy: "id",
    sortDir: "asc",
  });

  const coursesQuery = usePublishedCourses(listParams);
  const categoriesQuery = useAllCategories();

  const categoryItems = useMemo(() => {
    const items =
      categoriesQuery.data?.map((category) => ({
        id: category.id,
        name: category.tag,
      })) ?? [];
    return [{ id: "all", name: "all", label: t("common.all") }, ...items];
  }, [categoriesQuery.data, t]);

  const filteredCourses = useMemo(() => {
    const courses = coursesQuery.data?.content ?? [];
    const query = searchQuery.trim().toLowerCase();
    return courses.filter((course) => {
      const instructorName =
        course.instructor && typeof course.instructor === "object"
          ? String((course.instructor as Record<string, unknown>).name ?? "")
          : "";
      const matchQuery =
        !query ||
        course.name.toLowerCase().includes(query) ||
        instructorName.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query);

      const tagNameMatches = (value: unknown) =>
        typeof value === "string" && value === selectedCategory;

      const matchCategory =
        selectedCategory === "all" ||
        course.tags?.some((tag) => {
          if (!tag || typeof tag !== "object") return false;
          const rec = tag as Record<string, unknown>;
          return (
            tagNameMatches(rec.name) ||
            tagNameMatches(rec.topicName) ||
            (rec.topic &&
              typeof rec.topic === "object" &&
              tagNameMatches((rec.topic as Record<string, unknown>).name))
          );
        });

      return matchQuery && matchCategory;
    });
  }, [coursesQuery.data, searchQuery, selectedCategory]);

  const handleCoursePress = (courseId: string | number) => {
    router.push(`/course/${courseId}`);
  };

  const renderCategoryChip = ({
    item,
  }: {
    item: (typeof categoryItems)[number];
  }) => (
    <CategoryChip
      category={{
        id: item.id,
        name: item.name,
        label: item.label,
      }}
      isSelected={selectedCategory === item.name}
      onPress={() => setSelectedCategory(item.name)}
    />
  );

  const renderCourseItem = ({
    item,
  }: {
    item: NonNullable<typeof coursesQuery.data>["content"][number];
  }) => (
    <CourseCard course={item} onPress={() => handleCoursePress(item.id)} />
  );

  if (coursesQuery.isLoading || categoriesQuery.isLoading) {
    return (
      <Screen>
        <State type="loading" title={t("common.loading")} />
      </Screen>
    );
  }

  if (coursesQuery.isError || categoriesQuery.isError) {
    return (
      <Screen>
        <State
          type="error"
          title={t("common.errorGeneric")}
          actionLabel={t("common.retry")}
          onAction={() => {
            coursesQuery.refetch();
            categoriesQuery.refetch();
          }}
        />
      </Screen>
    );
  }

  return (
    <Screen padding={false}>
      <View style={styles.header}>
        <Header title={t("explore.title")} subtitle={t("explore.subtitle")} />
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={(value) => {
            setSearchQuery(value);
            setListParams((prev) => ({ ...prev, pageNumber: 0, keyword: value }));
          }}
          placeholder={t("explore.searchPlaceholder")}
        />
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          data={categoryItems}
          renderItem={renderCategoryChip}
          keyExtractor={(item) => String(item.id)}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {filteredCourses.length > 0 ? (
        <View style={styles.resultsHeader}>
          <Text variant="bodySmall" color={colors.textSecondary}>
            {t("explore.results", { count: filteredCourses.length })}
          </Text>
        </View>
      ) : null}

      {filteredCourses.length === 0 ? (
        <State
          type="empty"
          title={t("explore.emptyTitle")}
          message={t("explore.emptyMessage")}
          actionLabel={t("explore.clearFilters")}
          onAction={() => {
            setSearchQuery("");
            setSelectedCategory("all");
          }}
        />
      ) : (
        <>
          <FlatList
            data={filteredCourses}
            renderItem={renderCourseItem}
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
                (listParams.pageNumber ?? 0) === 0 && styles.pageButtonDisabled,
              ]}
              onPress={() =>
                setListParams((prev) => ({
                  ...prev,
                  pageNumber: Math.max(0, (prev.pageNumber ?? 0) - 1),
                }))
              }
              disabled={(listParams.pageNumber ?? 0) === 0}
            >
              <Text variant="bodySmall">{t("common.prev")}</Text>
            </TouchableOpacity>
            <Text variant="caption" color={colors.textSecondary}>
              {t("common.page", {
                page: (listParams.pageNumber ?? 0) + 1,
                total: coursesQuery.data?.totalPages ?? 1,
              })}
            </Text>
            <TouchableOpacity
              style={[
                styles.pageButton,
                coursesQuery.data?.last ? styles.pageButtonDisabled : undefined,
              ]}
              onPress={() =>
                setListParams((prev) => ({
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
      )}
    </Screen>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  spacing: ReturnType<typeof useTheme>["spacing"],
  radius: ReturnType<typeof useTheme>["radius"]
) =>
  StyleSheet.create({
    header: {
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.sm,
    },
    searchContainer: {
      paddingHorizontal: spacing.lg,
      marginVertical: spacing.md,
    },
    categoryContainer: {
      marginBottom: spacing.md,
    },
    categoryList: {
      paddingHorizontal: spacing.lg,
    },
    resultsHeader: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
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
