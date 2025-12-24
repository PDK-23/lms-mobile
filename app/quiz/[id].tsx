import { courses, Quiz } from '@/constants/mockData';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function QuizScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [answers, setAnswers] = useState<(number | null)[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // Find quiz
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
            const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0 && !isFinished && quiz) {
            handleFinish();
        }
    }, [timeLeft, isFinished]);

    if (!quiz) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Không tìm thấy bài kiểm tra</Text>
            </SafeAreaView>
        );
    }

    const question = quiz.questions[currentIndex];
    const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

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
                <SafeAreaView style={styles.container}>
                    <View style={styles.resultContainer}>
                        <View style={[styles.resultIcon, { backgroundColor: passed ? Colors.dark.success + '20' : Colors.dark.error + '20' }]}>
                            <Ionicons name={passed ? 'trophy' : 'close-circle'} size={64} color={passed ? Colors.dark.success : Colors.dark.error} />
                        </View>
                        <Text style={styles.resultTitle}>{passed ? 'Chúc mừng!' : 'Chưa đạt'}</Text>
                        <Text style={styles.resultScore}>{score}%</Text>
                        <Text style={styles.resultText}>
                            Bạn đã trả lời đúng {answers.filter((a, i) => a === quiz!.questions[i].correctAnswer).length}/{quiz.questions.length} câu hỏi
                        </Text>
                        <TouchableOpacity style={styles.doneButton} onPress={() => router.back()}>
                            <Text style={styles.doneButtonText}>Hoàn thành</Text>
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>
            </>
        );
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: true, headerStyle: { backgroundColor: Colors.dark.background }, headerTintColor: Colors.dark.text, headerTitle: quiz.title }} />
            <SafeAreaView style={styles.container}>
                {/* Timer & Progress */}
                <View style={styles.header}>
                    <View style={styles.timerBox}>
                        <Ionicons name="time-outline" size={18} color={timeLeft < 60 ? Colors.dark.error : Colors.dark.primary} />
                        <Text style={[styles.timer, timeLeft < 60 && { color: Colors.dark.error }]}>{formatTime(timeLeft)}</Text>
                    </View>
                    <Text style={styles.progress}>Câu {currentIndex + 1}/{quiz.questions.length}</Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${((currentIndex + 1) / quiz.questions.length) * 100}%` }]} />
                </View>

                <ScrollView style={styles.content}>
                    <Text style={styles.question}>{question.question}</Text>
                    {question.options.map((option, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[styles.option, selectedAnswer === index && styles.optionSelected]}
                            onPress={() => handleSelectAnswer(index)}
                        >
                            <View style={[styles.optionRadio, selectedAnswer === index && styles.radioSelected]}>
                                {selectedAnswer === index && <View style={styles.radioInner} />}
                            </View>
                            <Text style={[styles.optionText, selectedAnswer === index && styles.optionTextSelected]}>{option}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Navigation */}
                <View style={styles.nav}>
                    <TouchableOpacity style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]} onPress={handlePrev} disabled={currentIndex === 0}>
                        <Ionicons name="arrow-back" size={20} color={currentIndex === 0 ? Colors.dark.textSecondary : Colors.dark.text} />
                        <Text style={[styles.navBtnText, currentIndex === 0 && styles.navBtnTextDisabled]}>Trước</Text>
                    </TouchableOpacity>
                    {currentIndex === quiz.questions.length - 1 ? (
                        <TouchableOpacity style={styles.finishBtn} onPress={handleFinish}>
                            <Text style={styles.finishBtnText}>Nộp bài</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                            <Text style={styles.nextBtnText}>Tiếp</Text>
                            <Ionicons name="arrow-forward" size={20} color={Colors.dark.background} />
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark.background },
    errorText: { color: Colors.dark.text, textAlign: 'center', marginTop: 100 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.lg },
    timerBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.dark.card, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.lg },
    timer: { color: Colors.dark.primary, fontSize: 16, fontWeight: '600', marginLeft: Spacing.xs },
    progress: { color: Colors.dark.textSecondary, fontSize: 14 },
    progressBar: { height: 4, backgroundColor: Colors.dark.card, marginHorizontal: Spacing.lg },
    progressFill: { height: '100%', backgroundColor: Colors.dark.primary, borderRadius: 2 },
    content: { flex: 1, padding: Spacing.lg },
    question: { color: Colors.dark.text, fontSize: 18, fontWeight: '600', marginBottom: Spacing.xl, lineHeight: 26 },
    option: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.dark.card, padding: Spacing.md, borderRadius: BorderRadius.lg, marginBottom: Spacing.md, borderWidth: 2, borderColor: 'transparent' },
    optionSelected: { borderColor: Colors.dark.primary, backgroundColor: Colors.dark.primary + '15' },
    optionRadio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.dark.textSecondary, marginRight: Spacing.md, justifyContent: 'center', alignItems: 'center' },
    radioSelected: { borderColor: Colors.dark.primary },
    radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.dark.primary },
    optionText: { flex: 1, color: Colors.dark.text, fontSize: 15 },
    optionTextSelected: { color: Colors.dark.primary, fontWeight: '500' },
    nav: { flexDirection: 'row', justifyContent: 'space-between', padding: Spacing.lg, borderTopWidth: 1, borderTopColor: Colors.dark.border },
    navBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md },
    navBtnDisabled: { opacity: 0.5 },
    navBtnText: { color: Colors.dark.text, marginLeft: Spacing.xs },
    navBtnTextDisabled: { color: Colors.dark.textSecondary },
    nextBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.dark.primary, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg, borderRadius: BorderRadius.lg },
    nextBtnText: { color: Colors.dark.background, fontWeight: '600', marginRight: Spacing.xs },
    finishBtn: { backgroundColor: Colors.dark.success, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xl, borderRadius: BorderRadius.lg },
    finishBtnText: { color: Colors.dark.background, fontWeight: '600' },
    resultContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
    resultIcon: { width: 120, height: 120, borderRadius: 60, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg },
    resultTitle: { color: Colors.dark.text, fontSize: 24, fontWeight: '700', marginBottom: Spacing.sm },
    resultScore: { color: Colors.dark.primary, fontSize: 48, fontWeight: '700', marginBottom: Spacing.md },
    resultText: { color: Colors.dark.textSecondary, fontSize: 16, textAlign: 'center', marginBottom: Spacing.xl },
    doneButton: { backgroundColor: Colors.dark.primary, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xxl, borderRadius: BorderRadius.lg },
    doneButtonText: { color: Colors.dark.background, fontSize: 16, fontWeight: '600' },
});
