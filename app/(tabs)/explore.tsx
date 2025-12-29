import { CategoryChip } from "@/components/CategoryChip";
import { CourseCard } from "@/components/CourseCard";
import { SearchBar } from "@/components/SearchBar";
import { categories, Course, getCoursesByCategory } from "@/constants/mockData";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useTheme } from "@/src/theme/useTheme";
import { Header } from "@/src/ui/Header";
import { Screen } from "@/src/ui/Screen";
import { State } from "@/src/ui/State";
import { Text } from "@/src/ui/Text";

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { colors, spacing } = useTheme();
  const styles = makeStyles(spacing);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(params.category || "All");

  const allCategories = [{ id: "all", name: "All" }, ...categories];

  const filteredCourses = useMemo(() => {
    let result = getCoursesByCategory(selectedCategory);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.instructor.name.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query)
      );
    }
    return result;
  }, [selectedCategory, searchQuery]);

  const handleCoursePress = (course: Course) => {
    router.push(`/course/${course.id}`);
  };

  const renderCategoryChip = ({ item }: { item: typeof allCategories[0] }) => (
    <CategoryChip
      category={item}
      isSelected={selectedCategory === item.name}
      onPress={() => setSelectedCategory(item.name)}
    />
  );

  const renderCourseItem = ({ item }: { item: Course }) => (
    <CourseCard course={item} onPress={() => handleCoursePress(item)} />
  );

  return (
    <Screen padding={false}>
      <View style={styles.header}>
        <Header
          title="Kh?m ph?"
          subtitle="T?m ki?m kh?a h?c ph? h?p v?i b?n"
        />
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="T?m ki?m kh?a h?c, gi?ng vi?n..."
        />
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          data={allCategories}
          renderItem={renderCategoryChip}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {filteredCourses.length > 0 ? (
        <View style={styles.resultsHeader}>
          <Text variant="bodySmall" color={colors.textSecondary}>
            {filteredCourses.length} kh?a h?c ???c t?m th?y
          </Text>
        </View>
      ) : null}

      {filteredCourses.length === 0 ? (
        <State
          type="empty"
          title="Kh?ng c? kh?a h?c"
          message="Th? ??i b? l?c ho?c t? kh?a t?m ki?m."
          actionLabel="X?a b? l?c"
          onAction={() => {
            setSearchQuery("");
            setSelectedCategory("All");
          }}
        />
      ) : (
        <FlatList
          data={filteredCourses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.courseRow}
          contentContainerStyle={styles.courseList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Screen>
  );
}

const makeStyles = (spacing: ReturnType<typeof useTheme>["spacing"]) =>
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
  });
