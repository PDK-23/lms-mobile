import { ProgressBar } from '@/components/ProgressBar';
import { Course, getEnrolledCourses } from '@/constants/mockData';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type FilterType = 'all' | 'inProgress' | 'completed';

export default function MyCoursesScreen() {
    const router = useRouter();
    const [filter, setFilter] = useState<FilterType>('all');
    const enrolledCourses = getEnrolledCourses();

    const filteredCourses = enrolledCourses.filter((course) => {
        if (filter === 'inProgress') return course.progress! > 0 && course.progress! < 100;
        if (filter === 'completed') return course.progress === 100;
        return true;
    });

    const handleCoursePress = (course: Course) => {
        router.push(`/course/${course.id}`);
    };

    const renderFilterButton = (type: FilterType, label: string) => (
        <TouchableOpacity
            style={[styles.filterButton, filter === type && styles.filterButtonActive]}
            onPress={() => setFilter(type)}
        >
            <Text style={[styles.filterText, filter === type && styles.filterTextActive]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    const renderCourseItem = ({ item }: { item: Course }) => (
        <TouchableOpacity
            style={styles.courseCard}
            onPress={() => handleCoursePress(item)}
            activeOpacity={0.8}
        >
            <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
            <View style={styles.courseInfo}>
                <View style={styles.courseHeader}>
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{item.category}</Text>
                    </View>
                    <Text style={styles.level}>{item.level}</Text>
                </View>
                <Text style={styles.courseTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.instructorName}>{item.instructor.name}</Text>
                <View style={styles.progressSection}>
                    <ProgressBar progress={item.progress || 0} />
                    <View style={styles.progressInfo}>
                        <Text style={styles.progressText}>{item.progress}% hoàn thành</Text>
                        <Text style={styles.duration}>{item.duration}</Text>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={styles.continueButton}>
                <Ionicons name="play-circle" size={40} color={Colors.dark.primary} />
            </TouchableOpacity>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Khóa học của tôi</Text>
                <Text style={styles.subtitle}>
                    {enrolledCourses.length} khóa học đã đăng ký
                </Text>
            </View>

            {/* Filter Buttons */}
            <View style={styles.filterContainer}>
                {renderFilterButton('all', 'Tất cả')}
                {renderFilterButton('inProgress', 'Đang học')}
                {renderFilterButton('completed', 'Hoàn thành')}
            </View>

            {/* Course List */}
            {filteredCourses.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="folder-open-outline" size={64} color={Colors.dark.textSecondary} />
                    <Text style={styles.emptyTitle}>Không có khóa học</Text>
                    <Text style={styles.emptySubtitle}>
                        Bạn chưa đăng ký khóa học nào trong danh mục này
                    </Text>
                    <TouchableOpacity
                        style={styles.exploreButton}
                        onPress={() => router.push('/(tabs)/explore')}
                    >
                        <Text style={styles.exploreButtonText}>Khám phá khóa học</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredCourses}
                    renderItem={renderCourseItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.courseList}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.lg,
        paddingBottom: Spacing.md,
    },
    title: {
        color: Colors.dark.text,
        fontSize: 28,
        fontWeight: '700',
    },
    subtitle: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        marginTop: Spacing.xs,
    },
    filterContainer: {
        flexDirection: 'row',
        paddingHorizontal: Spacing.lg,
        marginBottom: Spacing.lg,
        gap: Spacing.sm,
    },
    filterButton: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.dark.card,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    filterButtonActive: {
        backgroundColor: Colors.dark.primary,
        borderColor: Colors.dark.primary,
    },
    filterText: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '500',
    },
    filterTextActive: {
        color: Colors.dark.background,
    },
    courseList: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: Spacing.xl,
    },
    courseCard: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.md,
        overflow: 'hidden',
    },
    thumbnail: {
        width: 100,
        height: 120,
        backgroundColor: Colors.dark.cardSecondary,
    },
    courseInfo: {
        flex: 1,
        padding: Spacing.sm,
    },
    courseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.xs,
    },
    categoryBadge: {
        backgroundColor: Colors.dark.primary + '20',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
    },
    categoryText: {
        color: Colors.dark.primary,
        fontSize: 10,
        fontWeight: '600',
    },
    level: {
        color: Colors.dark.textSecondary,
        fontSize: 10,
    },
    courseTitle: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: Spacing.xs,
    },
    instructorName: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        marginBottom: Spacing.sm,
    },
    progressSection: {
        marginTop: 'auto',
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    progressText: {
        color: Colors.dark.primary,
        fontSize: 11,
        fontWeight: '500',
    },
    duration: {
        color: Colors.dark.textSecondary,
        fontSize: 11,
    },
    continueButton: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.sm,
    },
    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Spacing.xl,
    },
    emptyTitle: {
        color: Colors.dark.text,
        fontSize: 18,
        fontWeight: '600',
        marginTop: Spacing.md,
    },
    emptySubtitle: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        textAlign: 'center',
        marginTop: Spacing.sm,
    },
    exploreButton: {
        backgroundColor: Colors.dark.primary,
        paddingHorizontal: Spacing.xl,
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginTop: Spacing.lg,
    },
    exploreButtonText: {
        color: Colors.dark.background,
        fontSize: 16,
        fontWeight: '600',
    },
});
