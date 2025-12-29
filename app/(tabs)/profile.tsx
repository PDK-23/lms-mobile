import { currentUser, getEnrolledCourses } from '@/constants/mockData';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Alert,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useLogout } from '@/src/features/auth/useLogout';

interface SettingItem {
    id: string;
    icon: string;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    color?: string;
}

export default function ProfileScreen() {
    const router = useRouter();
    const logout = useLogout();
    const enrolledCourses = getEnrolledCourses();
    const completedCourses = enrolledCourses.filter(c => c.progress === 100).length;

    const handleLogout = async () => {
        if (Platform.OS === 'web') {
            const ok =
                typeof window !== 'undefined'
                    ? window.confirm('Ban co chac muon dang xuat?')
                    : true;
            if (!ok) return;
            await logout();
            router.replace('/(auth)/login');
            return;
        }

        Alert.alert(
            'Dang xuat',
            'Ban co chac muon dang xuat?',
            [
                { text: 'Huy', style: 'cancel' },
                {
                    text: 'Dang xuat',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/(auth)/login');
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const settingsGroups: SettingItem[][] = [
        [
            { id: '1', icon: 'person-outline', title: 'Chỉnh sửa hồ sơ', showArrow: true },
            { id: '2', icon: 'card-outline', title: 'Thanh toán', subtitle: 'Quản lý phương thức thanh toán', showArrow: true },
            { id: '3', icon: 'notifications-outline', title: 'Thông báo', showArrow: true },
        ],
        [
            { id: '4', icon: 'language-outline', title: 'Ngôn ngữ', subtitle: 'Tiếng Việt', showArrow: true },
            { id: '5', icon: 'moon-outline', title: 'Giao diện tối', subtitle: 'Đang bật' },
            { id: '6', icon: 'download-outline', title: 'Tải xuống', subtitle: '3 khóa học đã lưu', showArrow: true },
        ],
        [
            { id: '7', icon: 'help-circle-outline', title: 'Trợ giúp & Hỗ trợ', showArrow: true },
            { id: '8', icon: 'document-text-outline', title: 'Điều khoản sử dụng', showArrow: true },
            { id: '9', icon: 'shield-checkmark-outline', title: 'Chính sách bảo mật', showArrow: true },
        ],
        [
            {
                id: '10',
                icon: 'log-out-outline',
                title: 'Đăng xuất',
                color: Colors.dark.error,
                onPress: handleLogout,
            },
        ],
    ];

    const renderSettingItem = (item: SettingItem) => (
        <TouchableOpacity
            key={item.id}
            style={styles.settingItem}
            activeOpacity={0.7}
            onPress={item.onPress}
        >
            <View style={[styles.settingIcon, item.color && { backgroundColor: item.color + '20' }]}>
                <Ionicons
                    name={item.icon as any}
                    size={22}
                    color={item.color || Colors.dark.primary}
                />
            </View>
            <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, item.color && { color: item.color }]}>
                    {item.title}
                </Text>
                {item.subtitle && (
                    <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
                )}
            </View>
            {item.showArrow && (
                <Ionicons name="chevron-forward" size={20} color={Colors.dark.textSecondary} />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Header */}
                <View style={styles.header}>
                    <View style={styles.avatarContainer}>
                        <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
                        <TouchableOpacity style={styles.editAvatarBtn}>
                            <Ionicons name="camera" size={16} color={Colors.dark.background} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.userName}>{currentUser.name}</Text>
                    <Text style={styles.userEmail}>{currentUser.email}</Text>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{enrolledCourses.length}</Text>
                        <Text style={styles.statLabel}>Khóa học</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{completedCourses}</Text>
                        <Text style={styles.statLabel}>Hoàn thành</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>12</Text>
                        <Text style={styles.statLabel}>Chứng chỉ</Text>
                    </View>
                </View>

                {/* Settings Groups */}
                {settingsGroups.map((group, index) => (
                    <View key={index} style={styles.settingsGroup}>
                        {group.map(renderSettingItem)}
                    </View>
                ))}

                {/* Version */}
                <Text style={styles.version}>Phiên bản 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.dark.background,
    },
    header: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: Spacing.md,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: Colors.dark.primary,
    },
    editAvatarBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: Colors.dark.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: Colors.dark.background,
    },
    userName: {
        color: Colors.dark.text,
        fontSize: 22,
        fontWeight: '700',
    },
    userEmail: {
        color: Colors.dark.textSecondary,
        fontSize: 14,
        marginTop: Spacing.xs,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: Colors.dark.card,
        marginHorizontal: Spacing.lg,
        borderRadius: BorderRadius.lg,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        color: Colors.dark.primary,
        fontSize: 24,
        fontWeight: '700',
    },
    statLabel: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        marginTop: Spacing.xs,
    },
    statDivider: {
        width: 1,
        backgroundColor: Colors.dark.border,
        marginVertical: Spacing.xs,
    },
    settingsGroup: {
        backgroundColor: Colors.dark.card,
        marginHorizontal: Spacing.lg,
        borderRadius: BorderRadius.lg,
        marginBottom: Spacing.md,
        overflow: 'hidden',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    settingIcon: {
        width: 40,
        height: 40,
        borderRadius: BorderRadius.md,
        backgroundColor: Colors.dark.primary + '20',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    settingContent: {
        flex: 1,
    },
    settingTitle: {
        color: Colors.dark.text,
        fontSize: 16,
        fontWeight: '500',
    },
    settingSubtitle: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        marginTop: 2,
    },
    version: {
        color: Colors.dark.textSecondary,
        fontSize: 12,
        textAlign: 'center',
        paddingVertical: Spacing.xl,
    },
});
