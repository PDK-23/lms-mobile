import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useAllCategories } from "@/src/features/category/category.queries";
import { Screen } from "@/src/ui/Screen";
import { Header } from "@/src/ui/Header";
import { State } from "@/src/ui/State";
import { Card } from "@/src/ui/Card";
import { Text } from "@/src/ui/Text";
import { useTheme } from "@/src/theme/useTheme";
import { useI18n } from "@/src/i18n";

export default function CategoriesScreen() {
  const { colors, spacing, radius } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  const { t } = useI18n();
  const { data, isLoading, isError, refetch } = useAllCategories();

  if (isLoading) {
    return (
      <Screen>
        <State type="loading" title={t("common.loading")} />
      </Screen>
    );
  }

  if (isError) {
    return (
      <Screen>
        <State
          type="error"
          title={t("common.errorGeneric")}
          actionLabel={t("common.retry")}
          onAction={refetch}
        />
      </Screen>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Screen>
        <State
          type="empty"
          title={t("categories.emptyTitle")}
          message={t("categories.emptyMessage")}
        />
      </Screen>
    );
  }

  return (
    <Screen padding={false}>
      <View style={styles.header}>
        <Header title={t("categories.title")} />
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.item}>
            <Text variant="body" weight="600">{item.tag}</Text>
            <Text variant="caption" color={colors.textSecondary}>ID: {item.id}</Text>
          </Card>
        )}
      />
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
    list: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
      gap: spacing.md,
    },
    item: {
      padding: spacing.md,
      borderRadius: radius.lg,
      gap: 4,
    },
  });
