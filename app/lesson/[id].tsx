import { courses, Lesson } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "@/src/theme/useTheme";
import { Button } from "@/src/ui/Button";
import { Card } from "@/src/ui/Card";
import { Screen } from "@/src/ui/Screen";
import { State } from "@/src/ui/State";
import { Text } from "@/src/ui/Text";
import { useI18n } from "@/src/i18n";

const { width } = Dimensions.get("window");

type TabType = "description" | "resources" | "comments";

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, radius, spacing, isDark } = useTheme();
  const styles = makeStyles(colors, radius, spacing);
  const { t } = useI18n();

  const [activeTab, setActiveTab] = useState<TabType>("description");
  const [isCompleted, setIsCompleted] = useState(false);

  let lesson: Lesson | undefined;
  for (const course of courses) {
    for (const section of course.sections) {
      const found = section.lessons.find((l) => l.id === id);
      if (found) {
        lesson = found;
        break;
      }
    }
    if (lesson) break;
  }

  if (!lesson) {
    return (
      <Screen>
        <State
          type="error"
          title={t("lesson.notFound")}
          message={t("common.errorGeneric")}
          actionLabel={t("common.back")}
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const handleMarkComplete = () => {
    setIsCompleted(true);
  };

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

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitle: t("lesson.title"),
          headerLeft: () => (
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
          ),
        }}
      />
      <Screen padding={false} statusBarStyle={isDark ? "light-content" : "dark-content"}>
        <View style={styles.videoContainer}>
          <View style={styles.videoPlaceholder}>
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={48} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.videoDuration}>
              <Text variant="caption" color={colors.text}>
                {lesson.duration}
              </Text>
            </View>
          </View>
          <View style={styles.videoControls}>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="play-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="play" size={32} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="play-forward" size={24} color={colors.text} />
            </TouchableOpacity>
            <View style={styles.controlSpacer} />
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="settings-outline" size={20} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Ionicons name="expand-outline" size={20} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.lessonHeader}>
            <Text variant="subtitle">{lesson.title}</Text>
            <View style={styles.lessonMeta}>
              <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
              <Text variant="caption">{lesson.duration}</Text>
            </View>
          </View>

          <View style={styles.tabsContainer}>
            {renderTab("description", t("lesson.descriptionTab"))}
            {renderTab("resources", t("lesson.resourcesTab"))}
            {renderTab("comments", t("lesson.commentsTab"))}
          </View>

          <View style={styles.tabContent}>
            {activeTab === "description" && (
              <Text variant="bodySmall" color={colors.textSecondary}>
                {lesson.description}
              </Text>
            )}

            {activeTab === "resources" && (
              <View style={styles.resourcesList}>
                <Card style={styles.resourceItem}>
                  <Ionicons name="document-text" size={24} color={colors.primary} />
                  <View style={styles.resourceInfo}>
                    <Text variant="body" weight="500">{t("lesson.resourceSlides")}</Text>
                    <Text variant="caption">{t("lesson.resourceFormat", { type: "PDF", size: "2.5 MB" })}</Text>
                  </View>
                  <Ionicons name="download-outline" size={24} color={colors.primary} />
                </Card>
                <Card style={styles.resourceItem}>
                  <Ionicons name="code-slash" size={24} color={colors.success} />
                  <View style={styles.resourceInfo}>
                    <Text variant="body" weight="500">{t("lesson.resourceSourceCode")}</Text>
                    <Text variant="caption">{t("lesson.resourceFormat", { type: "ZIP", size: "1.2 MB" })}</Text>
                  </View>
                  <Ionicons name="download-outline" size={24} color={colors.primary} />
                </Card>
              </View>
            )}

            {activeTab === "comments" && (
              <View style={styles.commentsList}>
                <View style={styles.commentItem}>
                  <View style={styles.commentAvatar}>
                    <Text variant="caption" weight="600" color={colors.primary}>TN</Text>
                  </View>
                  <Card style={styles.commentContent}>
                    <Text variant="body" weight="600">{t("lesson.commentsAuthor1")}</Text>
                    <Text variant="bodySmall" color={colors.textSecondary}>
                      {t("lesson.comment1")}
                    </Text>
                    <Text variant="caption" color={colors.textSecondary}>
                      {t("lesson.commentTime1")}
                    </Text>
                  </Card>
                </View>
                <View style={styles.commentItem}>
                  <View style={styles.commentAvatar}>
                    <Text variant="caption" weight="600" color={colors.primary}>LH</Text>
                  </View>
                  <Card style={styles.commentContent}>
                    <Text variant="body" weight="600">{t("lesson.commentsAuthor2")}</Text>
                    <Text variant="bodySmall" color={colors.textSecondary}>
                      {t("lesson.comment2")}
                    </Text>
                    <Text variant="caption" color={colors.textSecondary}>
                      {t("lesson.commentTime2")}
                    </Text>
                  </Card>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          {isCompleted || lesson.isCompleted ? (
            <Card style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              <Text variant="body" weight="600" color={colors.success}>
                {t("lesson.completed")}
              </Text>
            </Card>
          ) : (
            <Button
              label={t("lesson.markComplete")}
              onPress={handleMarkComplete}
            />
          )}
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
      padding: spacing.xs,
    },
    videoContainer: {
      width: width,
      backgroundColor: "#000",
    },
    videoPlaceholder: {
      width: "100%",
      height: 220,
      backgroundColor: colors.surfaceAlt,
      justifyContent: "center",
      alignItems: "center",
    },
    playButton: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary + "CC",
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: 6,
    },
    videoDuration: {
      position: "absolute",
      bottom: 10,
      right: 10,
      backgroundColor: "rgba(0,0,0,0.7)",
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.sm,
    },
    videoControls: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    controlButton: {
      padding: spacing.sm,
    },
    controlSpacer: {
      flex: 1,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
    },
    lessonHeader: {
      marginBottom: spacing.lg,
      gap: spacing.sm,
    },
    lessonMeta: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    tabsContainer: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.xs,
      marginBottom: spacing.lg,
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
      paddingBottom: 120,
      gap: spacing.md,
    },
    resourcesList: {
      gap: spacing.sm,
    },
    resourceItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.md,
      gap: spacing.md,
    },
    resourceInfo: {
      flex: 1,
      gap: 2,
    },
    commentsList: {
      gap: spacing.md,
    },
    commentItem: {
      flexDirection: "row",
      gap: spacing.md,
    },
    commentAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primarySoft,
      justifyContent: "center",
      alignItems: "center",
    },
    commentContent: {
      flex: 1,
      padding: spacing.md,
      gap: spacing.xs,
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
    completedBadge: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      paddingVertical: spacing.md,
    },
  });
