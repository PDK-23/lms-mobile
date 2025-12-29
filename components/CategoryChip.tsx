import { Category } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/src/theme/useTheme";
import { Text } from "@/src/ui/Text";

interface CategoryChipProps {
  category: Category | { id: string; name: string };
  isSelected?: boolean;
  onPress?: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  isSelected = false,
  onPress,
}) => {
  const { colors, radius, spacing } = useTheme();
  const styles = makeStyles(colors, radius, spacing);

  return (
    <TouchableOpacity
      style={[styles.chip, isSelected && styles.chipSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {"icon" in category && (
        <Ionicons
          name={category.icon as any}
          size={16}
          color={isSelected ? colors.background : colors.primary}
          style={styles.icon}
        />
      )}
      <Text
        variant="bodySmall"
        weight="500"
        color={isSelected ? colors.background : colors.text}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  radius: ReturnType<typeof useTheme>["radius"],
  spacing: ReturnType<typeof useTheme>["spacing"]
) =>
  StyleSheet.create({
    chip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.full,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: spacing.sm,
    },
    chipSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    icon: {
      marginRight: spacing.xs,
    },
  });
