import { Course } from '@/constants/mockData';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProgressBar } from './ProgressBar';

const { width } = Dimensions.get('window');

interface CourseCardProps {
    course: Course;
    variant?: 'horizontal' | 'vertical';
    onPress?: () => void;
    showProgress?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
    course,
    variant = 'vertical',
    onPress,
    showProgress = false,
}) => {
    const formatPrice = (price: number, currency: string) => {
        if (currency === 'USD') {
            return `$${price.toFixed(2)}`;
        }
        return `${price.toLocaleString('vi-VN')}đ`;
    };

    if (variant === 'horizontal') {
        return (
            <TouchableOpacity style={styles.horizontalCard} onPress={onPress} activeOpacity={0.8}>
                <Image source={{ uri: course.thumbnail }} style={styles.horizontalImage} />
                <View style={styles.horizontalContent}>
                    <Text style={styles.horizontalTitle} numberOfLines={2}>{course.title}</Text>
                    <Text style={styles.instructorName}>{course.instructor.name}</Text>
                    {showProgress && course.progress !== undefined && (
                        <View style={styles.progressContainer}>
                            <ProgressBar progress={course.progress} />
                            <Text style={styles.progressText}>{course.progress}%</Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity style={styles.verticalCard} onPress={onPress} activeOpacity={0.8}>
            <Image source={{ uri: course.thumbnail }} style={styles.verticalImage} />
            <View style={styles.verticalContent}>
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{course.category}</Text>
                </View>
                <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
                <Text style={styles.instructorName}>{course.instructor.name}</Text>
                <View style={styles.footer}>
                    <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.rating}>{course.rating}</Text>
                        <Text style={styles.ratingCount}>({course.ratingCount})</Text>
                    </View>
                    {!course.isEnrolled && (
                        <Text style={styles.price}>{formatPrice(course.price, course.currency)}</Text>
                    )}
                </View>
                {showProgress && course.progress !== undefined && course.isEnrolled && (
                    <View style={styles.progressContainer}>
                        <ProgressBar progress={course.progress} />
                        <Text style={styles.progressText}>{course.progress}% hoàn thành</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    // Vertical Card Styles
    verticalCard: {
        width: (width - Spacing.lg * 3) / 2,
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.md,
        overflow: 'hidden',
    },
    verticalImage: {
        width: '100%',
        height: 100,
        backgroundColor: Colors.dark.cardSecondary,
    },
    verticalContent: {
        padding: Spacing.sm,
    },
    categoryBadge: {
        backgroundColor: Colors.dark.primary + '20',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
        alignSelf: 'flex-start',
        marginBottom: Spacing.xs,
    },
    categoryText: {
        color: Colors.dark.primary,
        fontSize: 10,
        fontWeight: '600',
    },
    title: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: Spacing.xs,
    },
    instructorName: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        marginBottom: Spacing.xs,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    rating: {
        color: Colors.dark.text,
        fontSize: 12,
        fontWeight: '600',
    },
    ratingCount: {
        color: Colors.dark.textSecondary,
        fontSize: 11,
    },
    price: {
        color: Colors.dark.primary,
        fontSize: 14,
        fontWeight: '700',
    },
    progressContainer: {
        marginTop: Spacing.sm,
    },
    progressText: {
        color: Colors.dark.textSecondary,
        fontSize: 11,
        marginTop: 4,
    },

    // Horizontal Card Styles
    horizontalCard: {
        width: 280,
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        marginRight: Spacing.md,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    horizontalImage: {
        width: 100,
        height: 100,
        backgroundColor: Colors.dark.cardSecondary,
    },
    horizontalContent: {
        flex: 1,
        padding: Spacing.sm,
        justifyContent: 'center',
    },
    horizontalTitle: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: Spacing.xs,
    },
});
