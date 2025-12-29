import type { CourseDTO } from "@/src/features/course/course.types";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/src/theme/useTheme";
import { Text } from "@/src/ui/Text";
import { useI18n } from "@/src/i18n";
import { ProgressBar } from "./ProgressBar";

const { width } = Dimensions.get("window");

interface CourseCardProps {
  course: CourseDTO;
  variant?: "horizontal" | "vertical";
  onPress?: () => void;
  progress?: number;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  variant = "vertical",
  onPress,
  progress,
}) => {
  const { colors, radius, spacing } = useTheme();
  const styles = makeStyles(colors, radius, spacing);
  const { t } = useI18n();

  const price = course.price ?? 0;
  const discount = course.discount ?? 0;
  const finalPrice = discount ? price * (1 - discount) : price;
  const imageUri = course.imageUrl?.replace(/\\/g, "/");

  const formatPrice = (price: number) => {
    if (!price || price <= 0) return t("course.free");
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  const tagName =
    course.tags?.[0] && typeof course.tags[0] === "object"
      ? String((course.tags[0] as Record<string, unknown>).name ?? "")
      : "";
  const badgeLabel = tagName || course.level || course.code;
  const instructorName =
    course.instructor && typeof course.instructor === "object"
      ? String((course.instructor as Record<string, unknown>).name ?? "-")
      : "-";

  if (variant === "horizontal") {
    return (
      <TouchableOpacity style={styles.horizontalCard} onPress={onPress} activeOpacity={0.8}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.horizontalImage} />
        ) : (
          <View style={styles.horizontalImage} />
        )}
        <View style={styles.horizontalContent}>
          <Text variant="body" weight="600" numberOfLines={2}>
            {course.name}
          </Text>
          <Text variant="caption">{instructorName}</Text>
          {progress !== undefined && (
            <View style={styles.progressContainer}>
              <ProgressBar progress={progress} />
              <Text variant="caption">{t("courses.progress", { percent: progress })}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.verticalCard} onPress={onPress} activeOpacity={0.8}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.verticalImage} />
      ) : (
        <View style={styles.verticalImage} />
      )}
      <View style={styles.verticalContent}>
        {badgeLabel ? (
          <View style={styles.categoryBadge}>
            <Text variant="caption" color={colors.primary} weight="600">
              {badgeLabel}
            </Text>
          </View>
        ) : null}
        <Text variant="body" weight="600" numberOfLines={2}>
          {course.name}
        </Text>
        <Text variant="caption">{instructorName}</Text>
        <View style={styles.footer}>
          <View style={styles.levelContainer}>
            <Ionicons name="bar-chart-outline" size={14} color={colors.textSecondary} />
            <Text variant="caption" color={colors.textSecondary}>
              {course.level ?? "-"}
            </Text>
          </View>
          <Text variant="bodySmall" color={colors.primary} weight="700">
            {formatPrice(finalPrice)}
          </Text>
        </View>
        {progress !== undefined && (
          <View style={styles.progressContainer}>
            <ProgressBar progress={progress} />
            <Text variant="caption">{t("courses.progress", { percent: progress })}</Text>
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
    levelContainer: {
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
