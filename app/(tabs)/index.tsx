import { CourseCard } from "@/components/CourseCard";
import { SearchBar } from "@/components/SearchBar";
import {
  categories,
  Course,
  currentUser,
  getContinueLearning,
  getFeaturedCourses,
} from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/src/theme/useTheme";
import { Screen } from "@/src/ui/Screen";
import { Text } from "@/src/ui/Text";

export default function HomeScreen() {
  const router = useRouter();
  const { colors, radius, spacing } = useTheme();
  const styles = makeStyles(colors, radius, spacing);

  const [searchQuery, setSearchQuery] = useState("");
  const continueLearning = getContinueLearning();
  const featuredCourses = getFeaturedCourses();

  const handleCoursePress = (course: Course) => {
    router.push(`/course/${course.id}`);
  };

  const renderContinueLearningItem = ({ item }: { item: Course }) => (
    <CourseCard
      course={item}
      variant="horizontal"
      showProgress
      onPress={() => handleCoursePress(item)}
    />
  );

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => router.push(`/(tabs)/explore?category=${item.name}`)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color + "20" }]}> 
        <Ionicons name={item.icon as any} size={24} color={item.color} />
      </View>
      <Text variant="bodySmall" weight="500">
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Screen scroll padding={false}>
      <View style={styles.header}>
        <View>
          <Text variant="bodySmall" color={colors.textSecondary}>
            Ch?o bu?i s?ng,
          </Text>
          <Text variant="title">{currentUser.name} ??</Text>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={22} color={colors.text} />
          <View style={styles.notificationBadge} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="T?m ki?m kh?a h?c..."
        />
      </View>

      {continueLearning.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="subtitle">?ang h?c</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/my-courses')}>
              <Text variant="bodySmall" color={colors.primary} weight="600">
                Xem t?t c?
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={continueLearning}
            renderItem={renderContinueLearningItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>
      )}

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="subtitle">Danh m?c</Text>
        </View>
        <FlatList
          data={categories}
          renderItem={renderCategoryItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="subtitle">Kh?a h?c n?i b?t</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
            <Text variant="bodySmall" color={colors.primary} weight="600">
              Xem t?t c?
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.coursesGrid}>
          {featuredCourses.slice(0, 4).map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={() => handleCoursePress(course)}
            />
          ))}
        </View>
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
    categoryItem: {
      alignItems: "center",
      marginRight: spacing.lg,
      gap: spacing.xs,
    },
    categoryIcon: {
      width: 56,
      height: 56,
      borderRadius: radius.lg,
      justifyContent: "center",
      alignItems: "center",
    },
    coursesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: spacing.lg,
      gap: spacing.md,
    },
  });
