import { courses, Quiz } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useTheme } from "@/src/theme/useTheme";
import { Button } from "@/src/ui/Button";
import { Screen } from "@/src/ui/Screen";
import { State } from "@/src/ui/State";
import { Text } from "@/src/ui/Text";
import { useI18n } from "@/src/i18n";

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, radius, spacing } = useTheme();
  const styles = makeStyles(colors, radius, spacing);
  const { t } = useI18n();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  let quiz: Quiz | undefined;
  for (const course of courses) {
    if (course.quiz?.id === id) {
      quiz = course.quiz;
      break;
    }
  }

  useEffect(() => {
    if (quiz) {
      setTimeLeft(quiz.duration * 60);
      setAnswers(new Array(quiz.questions.length).fill(null));
    }
  }, [quiz?.id]);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isFinished && quiz) {
      handleFinish();
    }
  }, [timeLeft, isFinished]);

  if (!quiz) {
    return (
      <Screen>
        <State
          type="error"
          title={t("quiz.notFound")}
          message={t("common.errorGeneric")}
          actionLabel={t("common.back")}
          onAction={() => router.back()}
        />
      </Screen>
    );
  }

  const question = quiz.questions[currentIndex];
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const handleSelectAnswer = (index: number) => {
    setSelectedAnswer(index);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = index;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentIndex < quiz!.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(answers[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer(answers[currentIndex - 1]);
    }
  };

  const handleFinish = () => {
    setIsFinished(true);
  };

  const getScore = () => {
    let correct = 0;
    quiz!.questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    return Math.round((correct / quiz!.questions.length) * 100);
  };

  if (isFinished) {
    const score = getScore();
    const passed = score >= quiz.passingScore;
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <Screen>
          <View style={styles.resultContainer}>
            <View
              style={[
                styles.resultIcon,
                { backgroundColor: (passed ? colors.success : colors.danger) + "20" },
              ]}
            >
              <Ionicons
                name={passed ? "trophy" : "close-circle"}
                size={64}
                color={passed ? colors.success : colors.danger}
              />
            </View>
            <Text variant="title">{passed ? t("quiz.resultPass") : t("quiz.resultFail")}</Text>
            <Text variant="display" color={colors.primary}>
              {score}%
            </Text>
            <Text variant="bodySmall" align="center" color={colors.textSecondary}>
              {t("quiz.scoreSummary", { correct: answers.filter((a, i) => a === quiz!.questions[i].correctAnswer).length, total: quiz.questions.length })}
            </Text>
            <Button label={t("quiz.done")} onPress={() => router.back()} style={styles.doneButton} />
          </View>
        </Screen>
      </>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitle: quiz.title,
        }}
      />
      <Screen padding={false}>
        <View style={styles.header}>
          <View style={styles.timerBox}>
            <Ionicons
              name="time-outline"
              size={18}
              color={timeLeft < 60 ? colors.danger : colors.primary}
            />
            <Text
              variant="bodySmall"
              weight="600"
              color={timeLeft < 60 ? colors.danger : colors.primary}
            >
              {formatTime(timeLeft)}
            </Text>
          </View>
          <Text variant="bodySmall" color={colors.textSecondary}>
            {t("quiz.questionProgress", { current: currentIndex + 1, total: quiz.questions.length })}
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` },
            ]}
          />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text variant="subtitle">{question.question}</Text>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.option, selectedAnswer === index && styles.optionSelected]}
              onPress={() => handleSelectAnswer(index)}
            >
              <View style={[styles.optionRadio, selectedAnswer === index && styles.radioSelected]}>
                {selectedAnswer === index && <View style={styles.radioInner} />}
              </View>
              <Text
                variant="body"
                color={selectedAnswer === index ? colors.primary : colors.text}
                weight={selectedAnswer === index ? "600" : "400"}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.nav}>
          <TouchableOpacity
            style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]}
            onPress={handlePrev}
            disabled={currentIndex === 0}
          >
            <Ionicons
              name="arrow-back"
              size={20}
              color={currentIndex === 0 ? colors.textSecondary : colors.text}
            />
            <Text variant="bodySmall" color={currentIndex === 0 ? colors.textSecondary : colors.text}>
              {t("quiz.prev")}
            </Text>
          </TouchableOpacity>
          {currentIndex === quiz.questions.length - 1 ? (
            <Button label={t("quiz.submit")} onPress={handleFinish} fullWidth={false} />
          ) : (
            <Button label={t("quiz.next")} onPress={handleNext} fullWidth={false} />
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
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing.lg,
    },
    timerBox: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.xs,
    },
    progressBar: {
      height: 4,
      backgroundColor: colors.surfaceAlt,
      marginHorizontal: spacing.lg,
      borderRadius: 2,
    },
    progressFill: {
      height: "100%",
      backgroundColor: colors.primary,
      borderRadius: 2,
    },
    content: {
      flex: 1,
      padding: spacing.lg,
      gap: spacing.md,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      padding: spacing.md,
      borderRadius: radius.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.md,
    },
    optionSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primarySoft,
    },
    optionRadio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: colors.textSecondary,
      justifyContent: "center",
      alignItems: "center",
    },
    radioSelected: {
      borderColor: colors.primary,
    },
    radioInner: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    nav: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: spacing.lg,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    navBtn: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      gap: spacing.xs,
    },
    navBtnDisabled: {
      opacity: 0.6,
    },
    resultContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: spacing.xl,
      gap: spacing.sm,
    },
    resultIcon: {
      width: 120,
      height: 120,
      borderRadius: 60,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.lg,
    },
    doneButton: {
      marginTop: spacing.lg,
    },
  });
