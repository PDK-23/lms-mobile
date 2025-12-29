import React, { useMemo, useState } from "react";
import { Alert, FlatList, Platform, StyleSheet, View } from "react-native";
import { useTheme } from "@/src/theme/useTheme";
import { Screen } from "@/src/ui/Screen";
import { Header } from "@/src/ui/Header";
import { State } from "@/src/ui/State";
import { Card } from "@/src/ui/Card";
import { Text } from "@/src/ui/Text";
import { Button } from "@/src/ui/Button";
import { Input } from "@/src/ui/Input";
import { useI18n } from "@/src/i18n";
import { TagService } from "@/src/features/tag/tag.service";
import { useAllTags, useImportTags, useTagCount, useTagsByTopic } from "@/src/features/tag/tag.queries";

export default function TagsScreen() {
  const { colors, spacing, radius } = useTheme();
  const styles = makeStyles(colors, spacing, radius);
  const { t } = useI18n();

  const [topicId, setTopicId] = useState("");
  const topicKey = topicId.trim();

  const countQuery = useTagCount();
  const allTagsQuery = useAllTags();
  const tagsByTopicQuery = useTagsByTopic(topicKey);
  const importMutation = useImportTags();

  const listData = useMemo(() => {
    if (topicKey) return tagsByTopicQuery.data ?? [];
    return allTagsQuery.data ?? [];
  }, [topicKey, tagsByTopicQuery.data, allTagsQuery.data]);

  const isLoading = allTagsQuery.isLoading || tagsByTopicQuery.isLoading;
  const isError = allTagsQuery.isError || tagsByTopicQuery.isError;

  const handleImport = () => {
    if (Platform.OS !== "web") {
      Alert.alert(t("common.ok"), t("tags.notSupported"));
      return;
    }
    if (typeof document === "undefined") return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".csv,.xlsx,.xls";
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) importMutation.mutate(file);
    };
    input.click();
  };

  const handleExport = async () => {
    if (Platform.OS !== "web") {
      Alert.alert(t("common.ok"), t("tags.notSupported"));
      return;
    }
    if (typeof window === "undefined") return;

    const blob = await TagService.exportFile();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tags-export";
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
          onAction={() => {
            allTagsQuery.refetch();
            tagsByTopicQuery.refetch();
            countQuery.refetch();
          }}
        />
      </Screen>
    );
  }

  return (
    <Screen padding={false}>
      <View style={styles.header}>
        <Header title={t("tags.title")} />
        <Text variant="caption" color={colors.textSecondary}>
          {t("tags.count", { count: countQuery.data ?? 0 })}
        </Text>
      </View>

      <View style={styles.toolbar}>
        <Input
          label={t("tags.byTopic")}
          value={topicId}
          onChangeText={setTopicId}
          placeholder={t("tags.topicPlaceholder")}
          keyboardType="number-pad"
          containerStyle={styles.topicInput}
        />
        <View style={styles.actions}>
          <Button label={t("tags.import")} onPress={handleImport} loading={importMutation.isPending} />
          <Button label={t("tags.export")} variant="secondary" onPress={handleExport} />
        </View>
      </View>

      {listData.length === 0 ? (
        <View style={styles.emptyState}>
          <State
            type="empty"
            title={t("tags.emptyTitle")}
            message={t("tags.emptyMessage")}
          />
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Card style={styles.item}>
              <View style={styles.itemHeader}>
                <Text variant="body" weight="600">{item.name}</Text>
                <Text variant="caption" color={colors.textSecondary}>{item.topicName}</Text>
              </View>
              <Text variant="caption" color={colors.textSecondary}>ID: {item.id}</Text>
            </Card>
          )}
        />
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
      gap: spacing.xs,
    },
    toolbar: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.md,
      gap: spacing.md,
    },
    topicInput: {
      marginBottom: spacing.sm,
    },
    actions: {
      gap: spacing.sm,
    },
    emptyState: {
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
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
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
