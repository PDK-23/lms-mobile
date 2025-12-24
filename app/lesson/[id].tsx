import { courses, Lesson } from '@/constants/mockData';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Dimensions,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

type TabType = 'description' | 'resources' | 'comments';

export default function LessonScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('description');
    const [isCompleted, setIsCompleted] = useState(false);

    // Find the lesson across all courses
    let lesson: Lesson | undefined;
    let courseId: string | undefined;

    for (const course of courses) {
        for (const section of course.sections) {
            const found = section.lessons.find(l => l.id === id);
            if (found) {
                lesson = found;
                courseId = course.id;
                break;
            }
        }
        if (lesson) break;
    }

    if (!lesson) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Không tìm thấy bài học</Text>
            </SafeAreaView>
        );
    }

    const handleMarkComplete = () => {
        setIsCompleted(true);
        // In real app, update the backend
    };

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

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerStyle: { backgroundColor: Colors.dark.background },
                    headerTintColor: Colors.dark.text,
                    headerTitle: 'Bài học',
                    headerLeft: () => (
                        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                            <Ionicons name="arrow-back" size={24} color={Colors.dark.text} />
                        </TouchableOpacity>
                    ),
                }}
            />
            <SafeAreaView style={styles.container}>
                <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />

                {/* Video Player Placeholder */}
                <View style={styles.videoContainer}>
                    <View style={styles.videoPlaceholder}>
                        <TouchableOpacity style={styles.playButton}>
                            <Ionicons name="play" size={48} color={Colors.dark.text} />
                        </TouchableOpacity>
                        <View style={styles.videoDuration}>
                            <Text style={styles.durationText}>{lesson.duration}</Text>
                        </View>
                    </View>

                    {/* Video Controls */}
                    <View style={styles.videoControls}>
                        <TouchableOpacity style={styles.controlButton}>
                            <Ionicons name="play-back" size={24} color={Colors.dark.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.controlButton}>
                            <Ionicons name="play" size={32} color={Colors.dark.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.controlButton}>
                            <Ionicons name="play-forward" size={24} color={Colors.dark.text} />
                        </TouchableOpacity>
                        <View style={styles.controlSpacer} />
                        <TouchableOpacity style={styles.controlButton}>
                            <Ionicons name="settings-outline" size={20} color={Colors.dark.text} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.controlButton}>
                            <Ionicons name="expand-outline" size={20} color={Colors.dark.text} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Lesson Info */}
                    <View style={styles.lessonHeader}>
                        <Text style={styles.lessonTitle}>{lesson.title}</Text>
                        <View style={styles.lessonMeta}>
                            <Ionicons name="time-outline" size={16} color={Colors.dark.textSecondary} />
                            <Text style={styles.metaText}>{lesson.duration}</Text>
                        </View>
                    </View>

                    {/* Tabs */}
                    <View style={styles.tabsContainer}>
                        {renderTab('description', 'Mô tả')}
                        {renderTab('resources', 'Tài liệu')}
                        {renderTab('comments', 'Bình luận')}
                    </View>

                    {/* Tab Content */}
                    <View style={styles.tabContent}>
                        {activeTab === 'description' && (
                            <Text style={styles.description}>{lesson.description}</Text>
                        )}

                        {activeTab === 'resources' && (
                            <View style={styles.resourcesList}>
                                <TouchableOpacity style={styles.resourceItem}>
                                    <Ionicons name="document-text" size={24} color={Colors.dark.primary} />
                                    <View style={styles.resourceInfo}>
                                        <Text style={styles.resourceTitle}>Slide bài giảng</Text>
                                        <Text style={styles.resourceSize}>PDF - 2.5 MB</Text>
                                    </View>
                                    <Ionicons name="download-outline" size={24} color={Colors.dark.primary} />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.resourceItem}>
                                    <Ionicons name="code-slash" size={24} color={Colors.dark.success} />
                                    <View style={styles.resourceInfo}>
                                        <Text style={styles.resourceTitle}>Source code</Text>
                                        <Text style={styles.resourceSize}>ZIP - 1.2 MB</Text>
                                    </View>
                                    <Ionicons name="download-outline" size={24} color={Colors.dark.primary} />
                                </TouchableOpacity>
                            </View>
                        )}

                        {activeTab === 'comments' && (
                            <View style={styles.commentsList}>
                                <View style={styles.commentItem}>
                                    <View style={styles.commentAvatar}>
                                        <Text style={styles.avatarText}>TN</Text>
                                    </View>
                                    <View style={styles.commentContent}>
                                        <Text style={styles.commentAuthor}>Trần Nam</Text>
                                        <Text style={styles.commentText}>
                                            Bài giảng rất dễ hiểu, cảm ơn giảng viên!
                                        </Text>
                                        <Text style={styles.commentTime}>2 ngày trước</Text>
                                    </View>
                                </View>
                                <View style={styles.commentItem}>
                                    <View style={styles.commentAvatar}>
                                        <Text style={styles.avatarText}>LH</Text>
                                    </View>
                                    <View style={styles.commentContent}>
                                        <Text style={styles.commentAuthor}>Lê Hương</Text>
                                        <Text style={styles.commentText}>
                                            Mình có thể xem lại phần 5:30 được không ạ?
                                        </Text>
                                        <Text style={styles.commentTime}>1 tuần trước</Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                </ScrollView>

                {/* Bottom Action */}
                <View style={styles.bottomBar}>
                    {isCompleted || lesson.isCompleted ? (
                        <View style={styles.completedBadge}>
                            <Ionicons name="checkmark-circle" size={24} color={Colors.dark.success} />
                            <Text style={styles.completedText}>Đã hoàn thành bài học</Text>
                        </View>
                    ) : (
                        <TouchableOpacity style={styles.completeButton} onPress={handleMarkComplete}>
                            <Ionicons name="checkmark-circle-outline" size={24} color={Colors.dark.background} />
                            <Text style={styles.buttonText}>Đánh dấu hoàn thành</Text>
                        </TouchableOpacity>
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
        padding: Spacing.xs,
    },
    videoContainer: {
        width: width,
        backgroundColor: '#000',
    },
    videoPlaceholder: {
        width: '100%',
        height: 220,
        backgroundColor: Colors.dark.cardSecondary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: Colors.dark.primary + 'CC',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 6,
    },
    videoDuration: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: Spacing.sm,
        paddingVertical: 2,
        borderRadius: BorderRadius.sm,
    },
    durationText: {
        color: Colors.dark.text,
        fontSize: 12,
    },
    videoControls: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.card,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    controlButton: {
        padding: Spacing.sm,
    },
    controlSpacer: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: Spacing.lg,
    },
    lessonHeader: {
        marginBottom: Spacing.lg,
    },
    lessonTitle: {
        color: Colors.dark.text,
        fontSize: 20,
        fontWeight: '700',
        marginBottom: Spacing.sm,
    },
    lessonMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    metaText: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
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
    tabContent: {
        paddingBottom: 100,
    },
    description: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        lineHeight: 22,
    },
    resourcesList: {},
    resourceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.card,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.sm,
    },
    resourceInfo: {
        flex: 1,
        marginLeft: Spacing.md,
    },
    resourceTitle: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '500',
    },
    resourceSize: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    commentsList: {},
    commentItem: {
        flexDirection: 'row',
        marginBottom: Spacing.md,
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: Colors.dark.primary + '40',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    avatarText: {
        color: Colors.dark.primary,
        fontSize: 14,
        fontWeight: '600',
    },
    commentContent: {
        flex: 1,
        backgroundColor: Colors.dark.card,
        padding: Spacing.md,
        borderRadius: BorderRadius.lg,
    },
    commentAuthor: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '600',
        marginBottom: Spacing.xs,
    },
    commentText: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        lineHeight: 20,
    },
    commentTime: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        marginTop: Spacing.xs,
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
    completeButton: {
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
    completedBadge: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.success + '20',
        paddingVertical: Spacing.md,
        borderRadius: BorderRadius.lg,
        justifyContent: 'center',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    completedText: {
        color: Colors.dark.success,
        fontSize: 16,
        fontWeight: '600',
    },
});
