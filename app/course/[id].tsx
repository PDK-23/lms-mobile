import { ProgressBar } from "@/components/ProgressBar";
import { CourseSection, getCourseById, Lesson } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
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

const { width } = Dimensions.get("window");

type TabType = "overview" | "curriculum" | "instructor";

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, radius, spacing, isDark } = useTheme();
  const styles = makeStyles(colors, radius, spacing);

  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const course = getCourseById(id || "");

  if (!course) {
    return (
      <Screen>
        <State
          type="error"
          title="Kh?ng t?m th?y kh?a h?c"
          message="Vui l?ng th? l?i ho?c quay v? trang tr??c."
          actionLabel="Quay l?i"
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

  const renderLesson = (lesson: Lesson, index: number) => (
    <TouchableOpacity
      key={lesson.id}
      style={styles.lessonItem}
      onPress={() => router.push(`/lesson/${lesson.id}`)}
    >
      <View style={[styles.lessonNumber, lesson.isCompleted && styles.lessonCompleted]}>
        {lesson.isCompleted ? (
          <Ionicons name="checkmark" size={14} color={colors.background} />
        ) : (
          <Text variant="caption" weight="600" color={colors.textSecondary}>
            {index + 1}
          </Text>
        )}
      </View>
      <View style={styles.lessonInfo}>
        <Text variant="body" weight="600">{lesson.title}</Text>
        <Text variant="caption">{lesson.duration}</Text>
      </View>
      <Ionicons name="play-circle-outline" size={24} color={colors.primary} />
    </TouchableOpacity>
  );

  const renderSection = (section: CourseSection, sectionIndex: number) => (
    <View key={section.id} style={styles.section}>
      <Text variant="subtitle">Ph?n {sectionIndex + 1}: {section.title}</Text>
      {section.lessons.map((lesson, index) => renderLesson(lesson, index))}
    </View>
  );

  const renderOverview = () => (
    <View style={styles.tabContent}>
      <Text variant="subtitle">Gi?i thi?u kh?a h?c</Text>
      <Text variant="bodySmall" color={colors.textSecondary}>
        {course.description}
      </Text>

      <View style={styles.statsGrid}>
        <Card style={styles.statBox}>
          <Ionicons name="time-outline" size={24} color={colors.primary} />
          <Text variant="body" weight="600">{course.duration}</Text>
          <Text variant="caption">Th?i l??ng</Text>
        </Card>
        <Card style={styles.statBox}>
          <Ionicons name="bar-chart-outline" size={24} color={colors.primary} />
          <Text variant="body" weight="600">{course.level}</Text>
          <Text variant="caption">Tr?nh ??</Text>
        </Card>
        <Card style={styles.statBox}>
          <Ionicons name="document-text-outline" size={24} color={colors.primary} />
          <Text variant="body" weight="600">{course.sections.length}</Text>
          <Text variant="caption">Ch??ng</Text>
        </Card>
      </View>

      {course.documents.length > 0 && (
        <TouchableOpacity style={styles.documentsBtn} onPress={() => router.push(`/documents/${course.id}`)}>
          <Ionicons name="folder-outline" size={20} color={colors.primary} />
          <Text variant="bodySmall" style={styles.actionText}>
            Xem t?i li?u ({course.documents.length} files)
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>
      )}

      {course.quiz && (
        <TouchableOpacity style={styles.quizBtn} onPress={() => router.push(`/quiz/${course.quiz!.id}`)}>
          <Ionicons name="help-circle-outline" size={20} color={colors.warning} />
          <Text variant="bodySmall" color={colors.warning} style={styles.actionText}>
            L?m b?i ki?m tra ({course.quiz.questions.length} c?u h?i)
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.warning} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderCurriculum = () => (
    <View style={styles.tabContent}>
      {course.sections.map((section, index) => renderSection(section, index))}
    </View>
  );

  const renderInstructor = () => (
    <View style={styles.tabContent}>
      <Card style={styles.instructorCard}>
        <Image source={{ uri: course.instructor.avatar }} style={styles.instructorAvatar} />
        <View style={styles.instructorInfo}>
          <Text variant="subtitle">{course.instructor.name}</Text>
          <Text variant="bodySmall" color={colors.textSecondary}>
            {course.instructor.title}
          </Text>
          <View style={styles.instructorStats}>
            <View style={styles.instructorStat}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text variant="caption">{course.instructor.rating}</Text>
            </View>
            <View style={styles.instructorStat}>
              <Ionicons name="people-outline" size={14} color={colors.textSecondary} />
              <Text variant="caption">{course.instructor.studentCount.toLocaleString()} h?c vi?n</Text>
            </View>
          </View>
        </View>
      </Card>
      <Text variant="bodySmall" color={colors.textSecondary}>
        {course.instructor.bio}
      </Text>
    </View>
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
      <Screen padding={false} statusBarBackgroundColor="transparent" statusBarStyle={isDark ? "light-content" : "dark-content"}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.heroContainer}>
            <Image source={{ uri: course.thumbnail }} style={styles.heroImage} />
            <View style={styles.heroOverlay} />
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={32} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.categoryBadge}>
              <Text variant="caption" weight="600" color={colors.primary}>
                {course.category}
              </Text>
            </View>
            <Text variant="title">{course.title}</Text>

            <View style={styles.metaRow}>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text variant="bodySmall" weight="600">{course.rating}</Text>
                <Text variant="bodySmall" color={colors.textSecondary}>
                  ({course.ratingCount})
                </Text>
              </View>
              <Text variant="bodySmall" color={colors.textSecondary}>
                b?i {course.instructor.name}
              </Text>
            </View>

            {course.isEnrolled && course.progress !== undefined && (
              <Card style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text variant="bodySmall" color={colors.textSecondary}>
                    Ti?n ?? h?c t?p
                  </Text>
                  <Text variant="bodySmall" color={colors.primary} weight="600">
                    {course.progress}%
                  </Text>
                </View>
                <ProgressBar progress={course.progress} height={8} />
              </Card>
            )}

            <View style={styles.tabsContainer}>
              {renderTab("overview", "T?ng quan")}
              {renderTab("curriculum", "N?i dung")}
              {renderTab("instructor", "Gi?ng vi?n")}
            </View>

            {activeTab === "overview" && renderOverview()}
            {activeTab === "curriculum" && renderCurriculum()}
            {activeTab === "instructor" && renderInstructor()}
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          {course.isEnrolled ? (
            <Button
              label="Ti?p t?c h?c"
              onPress={() => {
                const firstIncomplete = course.sections
                  .flatMap((s) => s.lessons)
                  .find((l) => !l.isCompleted);
                if (firstIncomplete) {
                  router.push(`/lesson/${firstIncomplete.id}`);
                }
              }}
            />
          ) : (
            <View style={styles.priceRow}>
              <View>
                <Text variant="caption" color={colors.textSecondary}>
                  Gi? kh?a h?c
                </Text>
                <Text variant="title" color={colors.primary}>
                  ${course.price}
                </Text>
              </View>
              <Button label="??ng k? ngay" onPress={() => {}} fullWidth={false} />
            </View>
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
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    progressSection: {
      padding: spacing.md,
    },
    progressHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: spacing.sm,
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
    documentsBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      padding: spacing.md,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    quizBtn: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.warning + "15",
      padding: spacing.md,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.warning + "55",
    },
    actionText: {
      flex: 1,
      marginLeft: spacing.sm,
    },
    section: {
      marginBottom: spacing.lg,
      gap: spacing.sm,
    },
    lessonItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      padding: spacing.md,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.md,
    },
    lessonNumber: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: colors.surfaceAlt,
      justifyContent: "center",
      alignItems: "center",
    },
    lessonCompleted: {
      backgroundColor: colors.success,
    },
    lessonInfo: {
      flex: 1,
      gap: 2,
    },
    instructorCard: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.md,
      gap: spacing.md,
    },
    instructorAvatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.surfaceAlt,
    },
    instructorInfo: {
      flex: 1,
      gap: 4,
    },
    instructorStats: {
      flexDirection: "row",
      gap: spacing.md,
      marginTop: spacing.xs,
    },
    instructorStat: {
      flexDirection: "row",
      alignItems: "center",
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
