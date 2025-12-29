import { Course } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/src/theme/useTheme";
import { Text } from "@/src/ui/Text";
import { ProgressBar } from "./ProgressBar";

const { width } = Dimensions.get("window");

interface CourseCardProps {
  course: Course;
  variant?: "horizontal" | "vertical";
  onPress?: () => void;
  showProgress?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  variant = "vertical",
  onPress,
  showProgress = false,
}) => {
  const { colors, radius, spacing } = useTheme();
  const styles = makeStyles(colors, radius, spacing);

  const formatPrice = (price: number, currency: string) => {
    if (currency === "USD") {
      return `$${price.toFixed(2)}`;
    }
    return `${price.toLocaleString("vi-VN")}đ`;
  };

  if (variant === "horizontal") {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={onPress} activeOpacity={0.8}>
        <Image source={{ uri: course.thumbnail }} style={styles.horizontalImage} />
        <View style={styles.horizontalContent}>
          <Text variant="body" weight="600" numberOfLines={2}>
            {course.title}
          </Text>
          <Text variant="caption">{course.instructor.name}</Text>
          {showProgress && course.progress !== undefined && (
            <View style={styles.progressContainer}>
              <ProgressBar progress={course.progress} />
              <Text variant="caption">{course.progress}%</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.verticalCard} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: course.thumbnail }} style={styles.verticalImage} />
      <View style={styles.verticalContent}>
        <View style={styles.categoryBadge}>
          <Text variant="caption" color={colors.primary} weight="600">
            {course.category}
          </Text>
        </View>
        <Text variant="body" weight="600" numberOfLines={2}>
          {course.title}
        </Text>
        <Text variant="caption">{course.instructor.name}</Text>
        <View style={styles.footer}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text variant="caption" weight="600">
              {course.rating}
            </Text>
            <Text variant="caption">({course.ratingCount})</Text>
          </View>
          {!course.isEnrolled && (
            <Text variant="bodySmall" color={colors.primary} weight="700">
              {formatPrice(course.price, course.currency)}
            </Text>
          )}
        </View>
        {showProgress && course.progress !== undefined && course.isEnrolled && (
          <View style={styles.progressContainer}>
            <ProgressBar progress={course.progress} />
            <Text variant="caption">{course.progress}% hoàn thành</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  radius: ReturnType<typeof useTheme>["radius"],
  spacing: ReturnType<typeof useTheme>["spacing"]
) =>
  StyleSheet.create({
    verticalCard: {
      width: (width - spacing.lg * 3) / 2,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      marginBottom: spacing.md,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    verticalImage: {
      width: "100%",
      height: 110,
      backgroundColor: colors.surfaceAlt,
    },
    verticalContent: {
      padding: spacing.sm,
      gap: spacing.xs,
    },
    categoryBadge: {
      backgroundColor: colors.primarySoft,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.sm,
      alignSelf: "flex-start",
    },
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    progressContainer: {
      marginTop: spacing.sm,
    },
    horizontalCard: {
      width: 280,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      marginRight: spacing.md,
      flexDirection: "row",
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    horizontalImage: {
      width: 110,
      height: 110,
      backgroundColor: colors.surfaceAlt,
    },
    horizontalContent: {
      flex: 1,
      padding: spacing.sm,
      justifyContent: "center",
      gap: spacing.xs,
    },
  });
