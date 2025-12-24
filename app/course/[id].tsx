import { ProgressBar } from '@/components/ProgressBar';
import { CourseSection, getCourseById, Lesson } from '@/constants/mockData';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

type TabType = 'overview' | 'curriculum' | 'instructor';

export default function CourseDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    const course = getCourseById(id || '');

    if (!course) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Không tìm thấy khóa học</Text>
            </SafeAreaView>
        );
    }

    const renderTab = (tab: TabType, label: string) => (
        <TouchableOpacity
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
        >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
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
                    <Ionicons name="checkmark" size={14} color={Colors.dark.background} />
                ) : (
                    <Text style={styles.lessonNumberText}>{index + 1}</Text>
                )}
            </View>
            <View style={styles.lessonInfo}>
                <Text style={styles.lessonTitle}>{lesson.title}</Text>
                <Text style={styles.lessonDuration}>{lesson.duration}</Text>
            </View>
            <Ionicons name="play-circle-outline" size={24} color={Colors.dark.primary} />
        </TouchableOpacity>
    );

    const renderSection = (section: CourseSection, sectionIndex: number) => (
        <View key={section.id} style={styles.section}>
            <Text style={styles.sectionTitle}>
                Phần {sectionIndex + 1}: {section.title}
            </Text>
            {section.lessons.map((lesson, index) => renderLesson(lesson, index))}
        </View>
    );

    const renderOverview = () => (
        <View style={styles.tabContent}>
            <Text style={styles.descriptionTitle}>Giới thiệu khóa học</Text>
            <Text style={styles.description}>{course.description}</Text>

            <View style={styles.statsGrid}>
                <View style={styles.statBox}>
                    <Ionicons name="time-outline" size={24} color={Colors.dark.primary} />
                    <Text style={styles.statValue}>{course.duration}</Text>
                    <Text style={styles.statLabel}>Thời lượng</Text>
                </View>
                <View style={styles.statBox}>
                    <Ionicons name="bar-chart-outline" size={24} color={Colors.dark.primary} />
                    <Text style={styles.statValue}>{course.level}</Text>
                    <Text style={styles.statLabel}>Trình độ</Text>
                </View>
                <View style={styles.statBox}>
                    <Ionicons name="document-text-outline" size={24} color={Colors.dark.primary} />
                    <Text style={styles.statValue}>{course.sections.length}</Text>
                    <Text style={styles.statLabel}>Chương</Text>
                </View>
            </View>

            {course.documents.length > 0 && (
                <TouchableOpacity
                    style={styles.documentsBtn}
                    onPress={() => router.push(`/documents/${course.id}`)}
                >
                    <Ionicons name="folder-outline" size={20} color={Colors.dark.primary} />
                    <Text style={styles.documentsBtnText}>
                        Xem tài liệu ({course.documents.length} files)
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color={Colors.dark.primary} />
                </TouchableOpacity>
            )}

            {course.quiz && (
                <TouchableOpacity
                    style={styles.quizBtn}
                    onPress={() => router.push(`/quiz/${course.quiz!.id}`)}
                >
                    <Ionicons name="help-circle-outline" size={20} color={Colors.dark.warning} />
                    <Text style={styles.quizBtnText}>
                        Làm bài kiểm tra ({course.quiz.questions.length} câu hỏi)
                    </Text>
                    <Ionicons name="chevron-forward" size={20} color={Colors.dark.warning} />
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
            <View style={styles.instructorCard}>
                <Image
                    source={{ uri: course.instructor.avatar }}
                    style={styles.instructorAvatar}
                />
                <View style={styles.instructorInfo}>
                    <Text style={styles.instructorName}>{course.instructor.name}</Text>
                    <Text style={styles.instructorTitle}>{course.instructor.title}</Text>
                    <View style={styles.instructorStats}>
                        <View style={styles.instructorStat}>
                            <Ionicons name="star" size={14} color="#FFD700" />
                            <Text style={styles.instructorStatText}>{course.instructor.rating}</Text>
                        </View>
                        <View style={styles.instructorStat}>
                            <Ionicons name="people-outline" size={14} color={Colors.dark.textSecondary} />
                            <Text style={styles.instructorStatText}>
                                {course.instructor.studentCount.toLocaleString()} học viên
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
            <Text style={styles.instructorBio}>{course.instructor.bio}</Text>
        </View>
    );

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTransparent: true,
                    headerTitle: '',
                    headerLeft: () => (
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color={Colors.dark.text} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Hero Image */}
                    <View style={styles.heroContainer}>
                        <Image source={{ uri: course.thumbnail }} style={styles.heroImage} />
                        <View style={styles.heroOverlay} />
                        <TouchableOpacity style={styles.playButton}>
                            <Ionicons name="play" size={32} color={Colors.dark.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Course Info */}
                    <View style={styles.content}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{course.category}</Text>
                        </View>
                        <Text style={styles.title}>{course.title}</Text>

                        <View style={styles.metaRow}>
                            <View style={styles.ratingContainer}>
                                <Ionicons name="star" size={16} color="#FFD700" />
                                <Text style={styles.rating}>{course.rating}</Text>
                                <Text style={styles.ratingCount}>({course.ratingCount})</Text>
                            </View>
                            <Text style={styles.instructorNameSmall}>
                                bởi {course.instructor.name}
                            </Text>
                        </View>

                        {course.isEnrolled && course.progress !== undefined && (
                            <View style={styles.progressSection}>
                                <View style={styles.progressHeader}>
                                    <Text style={styles.progressLabel}>Tiến độ học tập</Text>
                                    <Text style={styles.progressValue}>{course.progress}%</Text>
                                </View>
                                <ProgressBar progress={course.progress} height={8} />
                            </View>
                        )}

                        {/* Tabs */}
                        <View style={styles.tabsContainer}>
                            {renderTab('overview', 'Tổng quan')}
                            {renderTab('curriculum', 'Nội dung')}
                            {renderTab('instructor', 'Giảng viên')}
                        </View>

                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'curriculum' && renderCurriculum()}
                        {activeTab === 'instructor' && renderInstructor()}
                    </View>
                </ScrollView>

                {/* Bottom Button */}
                <View style={styles.bottomBar}>
                    {course.isEnrolled ? (
                        <TouchableOpacity
                            style={styles.continueButton}
                            onPress={() => {
                                const firstIncomplete = course.sections
                                    .flatMap(s => s.lessons)
                                    .find(l => !l.isCompleted);
                                if (firstIncomplete) {
                                    router.push(`/lesson/${firstIncomplete.id}`);
                                }
                            }}
                        >
                            <Text style={styles.buttonText}>Tiếp tục học</Text>
                            <Ionicons name="arrow-forward" size={20} color={Colors.dark.background} />
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.priceRow}>
                            <View>
                                <Text style={styles.priceLabel}>Giá khóa học</Text>
                                <Text style={styles.price}>${course.price}</Text>
                            </View>
                            <TouchableOpacity style={styles.joinButton}>
                                <Text style={styles.buttonText}>Đăng ký ngay</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    errorText: {
        color: Colors.dark.text,
        textAlign: 'center',
        marginTop: 100,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.dark.card + 'CC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroContainer: {
        width: width,
        height: 250,
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
        backgroundColor: Colors.dark.cardSecondary,
    },
    heroOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    playButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginLeft: -30,
        marginTop: -30,
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: Colors.dark.primary + 'CC',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 4,
    },
    content: {
        padding: Spacing.lg,
        paddingBottom: 100,
    },
    categoryBadge: {
        backgroundColor: Colors.dark.primary + '20',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs,
        borderRadius: BorderRadius.sm,
        alignSelf: 'flex-start',
        marginBottom: Spacing.sm,
    },
    categoryText: {
        color: Colors.dark.primary,
        fontSize: 12,
        fontWeight: '600',
    },
    title: {
        color: Colors.dark.text,
        fontSize: 24,
        fontWeight: '700',
        marginBottom: Spacing.sm,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    rating: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 4,
    },
    ratingCount: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        marginLeft: 4,
    },
    instructorNameSmall: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
    },
    progressSection: {
        backgroundColor: Colors.dark.card,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.lg,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.sm,
    },
    progressLabel: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
    },
    progressValue: {
        color: Colors.dark.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.xs,
        marginBottom: Spacing.lg,
    },
    tab: {
        flex: 1,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
        borderRadius: BorderRadius.md,
    },
    tabActive: {
        backgroundColor: Colors.dark.primary,
    },
    tabText: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        fontWeight: '500',
    },
    tabTextActive: {
        color: Colors.dark.background,
    },
    tabContent: {},
    descriptionTitle: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: Spacing.sm,
    },
    description: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        lineHeight: 22,
        marginBottom: Spacing.lg,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Spacing.lg,
    },
    statBox: {
        flex: 1,
        backgroundColor: Colors.dark.card,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        marginHorizontal: Spacing.xs,
    },
    statValue: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '600',
        marginTop: Spacing.sm,
    },
    statLabel: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    documentsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.card,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.sm,
    },
    documentsBtnText: {
        flex: 1,
        color: Colors.dark.text,
        fontSize: 14,
        marginLeft: Spacing.sm,
    },
    quizBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.warning + '20',
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    quizBtnText: {
        flex: 1,
        color: Colors.dark.warning,
        fontSize: 14,
        marginLeft: Spacing.sm,
    },
    section: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '600',
        marginBottom: Spacing.md,
    },
    lessonItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.card,
        padding: Spacing.md,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
    },
    lessonNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: Colors.dark.cardSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    lessonCompleted: {
        backgroundColor: Colors.dark.success,
    },
    lessonNumberText: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        fontWeight: '600',
    },
    lessonInfo: {
        flex: 1,
    },
    lessonTitle: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '500',
    },
    lessonDuration: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    instructorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.md,
    },
    instructorAvatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: Spacing.md,
    },
    instructorInfo: {
        flex: 1,
    },
    instructorName: {
        color: Colors.dark.text,
        fontSize: 18,
        fontWeight: '600',
    },
    instructorTitle: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        marginTop: 2,
    },
    instructorStats: {
        flexDirection: 'row',
        marginTop: Spacing.sm,
        gap: Spacing.md,
    },
    instructorStat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    instructorStatText: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
    },
    instructorBio: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        lineHeight: 22,
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.dark.card,
        padding: Spacing.lg,
        borderTopWidth: 1,
        borderTopColor: Colors.dark.border,
    },
    continueButton: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.primary,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    buttonText: {
        color: Colors.dark.background,
        fontSize: 16,
        fontWeight: '600',
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceLabel: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
    },
    price: {
        color: Colors.dark.primary,
        fontSize: 24,
        fontWeight: '700',
    },
    joinButton: {
        backgroundColor: Colors.dark.primary,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderRadius: BorderRadius.lg,
    },
});
