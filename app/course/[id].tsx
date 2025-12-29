import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useCourse } from "@/src/features/course/course.hooks";
import { useI18n } from "@/src/i18n";
import { useTheme } from "@/src/theme/useTheme";
import { Button } from "@/src/ui/Button";
import { Card } from "@/src/ui/Card";
import { Screen } from "@/src/ui/Screen";
import { State } from "@/src/ui/State";
import { Text } from "@/src/ui/Text";

const { width } = Dimensions.get("window");

type TabType = "overview" | "curriculum" | "instructor";

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, radius, spacing, isDark } = useTheme();
  const styles = makeStyles(colors, radius, spacing);
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<TabType>("overview");

  const courseQuery = useCourse(id ?? "");
  const course = courseQuery.data;

  const imageUri = useMemo(
    () => (course?.imageUrl ? course.imageUrl.replace(/\\/g, "/") : ""),
    [course?.imageUrl]
  );

  const price = course?.price ?? 0;
  const discount = course?.discount ?? 0;
  const finalPrice = discount ? price * (1 - discount) : price;

  const formatPrice = (price: number) => {
    if (!price || price <= 0) return t("course.free");
    return `${price.toLocaleString("vi-VN")} VND`;
  };

  if (courseQuery.isLoading) {
    return (
      <Screen>
        <State type="loading" title={t("common.loading")} />
      </Screen>
    );
  }

  if (courseQuery.isError || !course) {
    return (
      <Screen>
        <State
          type="error"
          title={t("course.notFound")}
          message={t("common.errorGeneric")}
          actionLabel={t("common.back")}
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const renderTab = (tab: TabType, label: string) => (
    <TouchableOpacity
      style={[styles.tab, activeTab === tab && styles.tabActive]}
      onPress={() => setActiveTab(tab)}
    >
      <Text
        variant="bodySmall"
        weight="600"
        color={activeTab === tab ? colors.background : colors.textSecondary}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <Text variant="subtitle">{t("course.aboutTitle")}</Text>
      <Text variant="bodySmall" color={colors.textSecondary}>
        {course.description || t("common.noData")}
      </Text>

      <View style={styles.statsGrid}>
        <Card style={styles.statBox}>
          <Ionicons name="time-outline" size={24} color={colors.primary} />
          <Text variant="body" weight="600">
            {course.durationWeeks ?? "-"}
          </Text>
          <Text variant="caption">{t("course.duration")}</Text>
        </Card>
        <Card style={styles.statBox}>
          <Ionicons name="bar-chart-outline" size={24} color={colors.primary} />
          <Text variant="body" weight="600">
            {course.level ?? "-"}
          </Text>
          <Text variant="caption">{t("course.level")}</Text>
        </Card>
        <Card style={styles.statBox}>
          <Ionicons name="pricetag-outline" size={24} color={colors.primary} />
          <Text variant="body" weight="600">
            {course.tags?.length ?? 0}
          </Text>
          <Text variant="caption">{t("course.tagsTitle")}</Text>
        </Card>
      </View>

      {course.tags?.length ? (
        <View style={styles.listSection}>
          <Text variant="subtitle">{t("course.tagsTitle")}</Text>
          <View style={styles.tagList}>
            {course.tags.map((tag, index) => {
              const tagName =
                tag && typeof tag === "object"
                  ? String((tag as Record<string, unknown>).name ?? "")
                  : "";
              if (!tagName) return null;
              return (
                <View key={`${tagName}-${index}`} style={styles.tagItem}>
                  <Text variant="caption" color={colors.primary} weight="600">
                    {tagName}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      ) : null}

      {course.prerequisites?.length ? (
        <View style={styles.listSection}>
          <Text variant="subtitle">{t("course.prerequisitesTitle")}</Text>
          {course.prerequisites.map((item, index) => {
            const name =
              item && typeof item === "object"
                ? String((item as Record<string, unknown>).name ?? "")
                : "";
            if (!name) return null;
            return (
              <Text key={`${name}-${index}`} variant="bodySmall">
                {name}
              </Text>
            );
          })}
        </View>
      ) : null}
    </View>
  );

  const renderCurriculum = () => (
    <State
      type="empty"
      title={t("course.curriculumEmptyTitle")}
      message={t("course.curriculumEmptyMessage")}
    />
  );

  const instructorName =
    course.instructor && typeof course.instructor === "object"
      ? String((course.instructor as Record<string, unknown>).name ?? "")
      : "";

  const renderInstructor = () =>
    instructorName ? (
      <View style={styles.tabContent}>
        <Card style={styles.instructorCard}>
          <View style={styles.instructorInfo}>
            <Text variant="subtitle">{instructorName}</Text>
            <Text variant="caption" color={colors.textSecondary}>
              {t("course.byInstructor", { name: instructorName })}
            </Text>
          </View>
        </Card>
      </View>
    ) : (
      <State
        type="empty"
        title={t("course.instructorEmptyTitle")}
        message={t("course.instructorEmptyMessage")}
      />
    );

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <Screen
        padding={false}
        statusBarBackgroundColor="transparent"
        statusBarStyle={isDark ? "light-content" : "dark-content"}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.heroContainer}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.heroImage} />
            ) : (
              <View style={styles.heroImage} />
            )}
            <View style={styles.heroOverlay} />
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={32} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.categoryBadge}>
            <Text variant="caption" weight="600" color={colors.primary}>
              {course.code || course.level || "-"}
            </Text>
          </View>
          <Text variant="title">{course.name}</Text>

          <View style={styles.metaRow}>
            <Text variant="bodySmall" color={colors.textSecondary}>
              {t("course.byInstructor", { name: instructorName || "-" })}
            </Text>
            <Text variant="bodySmall" color={colors.textSecondary}>
              {t("course.level")}: {course.level ?? "-"}
            </Text>
            </View>

            <View style={styles.tabsContainer}>
              {renderTab("overview", t("course.overview"))}
              {renderTab("curriculum", t("course.curriculum"))}
              {renderTab("instructor", t("course.instructor"))}
            </View>

            {activeTab === "overview" && renderOverview()}
            {activeTab === "curriculum" && renderCurriculum()}
            {activeTab === "instructor" && renderInstructor()}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <View style={styles.priceRow}>
            <View>
              <Text variant="caption" color={colors.textSecondary}>
                {t("course.priceLabel")}
              </Text>
              <Text variant="title" color={colors.primary}>
                {formatPrice(finalPrice)}
              </Text>
            </View>
            <Button label={t("course.enrollNow")} onPress={() => {}} fullWidth={false} />
          </View>
        </View>
      </Screen>
    </>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  radius: ReturnType<typeof useTheme>["radius"],
  spacing: ReturnType<typeof useTheme>["spacing"]
) =>
  StyleSheet.create({
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface + "CC",
      justifyContent: "center",
      alignItems: "center",
    },
    heroContainer: {
      width: width,
      height: 250,
      position: "relative",
    },
    heroImage: {
      width: "100%",
      height: "100%",
      backgroundColor: colors.surfaceAlt,
    },
    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.overlay,
    },
    playButton: {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginLeft: -30,
      marginTop: -30,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary + "CC",
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: 4,
    },
    content: {
      padding: spacing.lg,
      paddingBottom: 120,
      gap: spacing.md,
    },
    categoryBadge: {
      backgroundColor: colors.primarySoft,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: radius.sm,
      alignSelf: "flex-start",
    },
    metaRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    tabsContainer: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.xs,
      borderWidth: 1,
      borderColor: colors.border,
    },
    tab: {
      flex: 1,
      paddingVertical: spacing.sm,
      alignItems: "center",
      borderRadius: radius.md,
    },
    tabActive: {
      backgroundColor: colors.primary,
    },
    tabContent: {
      gap: spacing.md,
    },
    statsGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    statBox: {
      flex: 1,
      padding: spacing.md,
      borderRadius: radius.lg,
      alignItems: "center",
      gap: spacing.xs,
    },
    listSection: {
      gap: spacing.sm,
    },
    tagList: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    tagItem: {
      backgroundColor: colors.primarySoft,
      paddingHorizontal: spacing.sm,
      paddingVertical: 4,
      borderRadius: radius.full,
    },
    instructorCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.md,
      gap: spacing.md,
    },
    instructorInfo: {
      flex: 1,
      gap: 4,
    },
    bottomBar: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    priceRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
  });
