import { ProgressBar } from "@/components/ProgressBar";
import { Course, getEnrolledCourses } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@/src/theme/useTheme";
import { Header } from "@/src/ui/Header";
import { Screen } from "@/src/ui/Screen";
import { State } from "@/src/ui/State";
import { Text } from "@/src/ui/Text";

type FilterType = "all" | "inProgress" | "completed";

export default function MyCoursesScreen() {
  const router = useRouter();
  const { colors, radius, spacing } = useTheme();
  const styles = makeStyles(colors, radius, spacing);

  const [filter, setFilter] = useState<FilterType>("all");
  const enrolledCourses = getEnrolledCourses();

  const filteredCourses = enrolledCourses.filter((course) => {
    if (filter === "inProgress") return course.progress! > 0 && course.progress! < 100;
    if (filter === "completed") return course.progress === 100;
    return true;
  });

  const handleCoursePress = (course: Course) => {
    router.push(`/course/${course.id}`);
  };

  const renderFilterButton = (type: FilterType, label: string) => (
    <TouchableOpacity
      style={[styles.filterButton, filter === type && styles.filterButtonActive]}
      onPress={() => setFilter(type)}
    >
      <Text
        variant="bodySmall"
        weight="600"
        color={filter === type ? colors.background : colors.text}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderCourseItem = ({ item }: { item: Course }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => handleCoursePress(item)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
      <View style={styles.courseInfo}>
        <View style={styles.courseHeader}>
          <View style={styles.categoryBadge}>
            <Text variant="caption" weight="600" color={colors.primary}>
              {item.category}
            </Text>
          </View>
          <Text variant="caption" color={colors.textSecondary}>
            {item.level}
          </Text>
        </View>
        <Text variant="body" weight="600" numberOfLines={2}>
          {item.title}
        </Text>
        <Text variant="caption">{item.instructor.name}</Text>
        <View style={styles.progressSection}>
          <ProgressBar progress={item.progress || 0} />
          <View style={styles.progressInfo}>
            <Text variant="caption" color={colors.primary} weight="600">
              {item.progress}% ho?n th?nh
            </Text>
            <Text variant="caption">{item.duration}</Text>
          </View>
        </View>
      </View>
      <View style={styles.continueButton}>
        <Ionicons name="play-circle" size={40} color={colors.primary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <Screen padding={false}>
      <View style={styles.header}>
        <Header
          title="Kh?a h?c c?a t?i"
          subtitle={`${enrolledCourses.length} kh?a h?c ?? ??ng k?`}
        />
      </View>

      <View style={styles.filterContainer}>
        {renderFilterButton("all", "T?t c?")}
        {renderFilterButton("inProgress", "?ang h?c")}
        {renderFilterButton("completed", "Ho?n th?nh")}
      </View>

      {filteredCourses.length === 0 ? (
        <State
          type="empty"
          title="Kh?ng c? kh?a h?c"
          message="B?n ch?a ??ng k? kh?a h?c n?o trong danh m?c n?y."
          actionLabel="Kh?m ph? kh?a h?c"
          onAction={() => router.push('/(tabs)/explore')}
        />
      ) : (
        <FlatList
          data={filteredCourses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.courseList}
          showsVerticalScrollIndicator={false}
        />
      )}
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
      paddingHorizontal: spacing.lg,
      paddingTop: spacing.lg,
      paddingBottom: spacing.md,
    },
    filterContainer: {
      flexDirection: "row",
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.lg,
      gap: spacing.sm,
    },
    filterButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.full,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    filterButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    courseList: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
    },
    courseCard: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      marginBottom: spacing.md,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    thumbnail: {
      width: 100,
      height: 120,
      backgroundColor: colors.surfaceAlt,
    },
    courseInfo: {
      flex: 1,
      padding: spacing.sm,
      gap: spacing.xs,
    },
    courseHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    categoryBadge: {
      backgroundColor: colors.primarySoft,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.sm,
    },
    progressSection: {
      marginTop: "auto",
    },
    progressInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 4,
    },
    continueButton: {
      justifyContent: "center",
      alignItems: "center",
      paddingHorizontal: spacing.sm,
    },
  });
