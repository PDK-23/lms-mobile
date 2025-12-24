import { Document, getCourseById } from '@/constants/mockData';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const getIcon = (type: Document['type']) => {
    const icons: Record<string, { name: string; color: string }> = {
        pdf: { name: 'document-text', color: '#FF5252' },
        slides: { name: 'easel', color: '#FF9800' },
        code: { name: 'code-slash', color: '#4CAF50' },
        video: { name: 'videocam', color: '#2196F3' },
    };
    return icons[type] || { name: 'document', color: Colors.dark.textSecondary };
};

export default function DocumentsScreen() {
    const { courseId } = useLocalSearchParams<{ courseId: string }>();
    const router = useRouter();
    const course = getCourseById(courseId || '');

    if (!course) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>Không tìm thấy khóa học</Text>
            </SafeAreaView>
        );
    }

    const renderItem = ({ item }: { item: Document }) => {
        const icon = getIcon(item.type);
        return (
            <TouchableOpacity style={styles.card}>
                <View style={[styles.iconBox, { backgroundColor: icon.color + '20' }]}>
                    <Ionicons name={icon.name as any} size={28} color={icon.color} />
                </View>
                <View style={styles.info}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.meta}>{item.type.toUpperCase()} • {item.size}</Text>
                </View>
                <TouchableOpacity style={styles.downloadBtn}>
                    <Ionicons name="download-outline" size={24} color={Colors.dark.primary} />
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <Stack.Screen options={{ headerShown: true, headerStyle: { backgroundColor: Colors.dark.background }, headerTintColor: Colors.dark.text, headerTitle: 'Tài liệu' }} />
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.courseTitle}>{course.title}</Text>
                    <Text style={styles.count}>{course.documents.length} tài liệu</Text>
                </View>
                <FlatList data={course.documents} renderItem={renderItem} keyExtractor={(i) => i.id} contentContainerStyle={styles.list} />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.dark.background },
    errorText: { color: Colors.dark.text, textAlign: 'center', marginTop: 100 },
    header: { padding: Spacing.lg, borderBottomWidth: 1, borderBottomColor: Colors.dark.border },
    courseTitle: { color: Colors.dark.text, fontSize: 18, fontWeight: '700' },
    count: { color: Colors.dark.textSecondary, fontSize: 14, marginTop: 4 },
    list: { padding: Spacing.lg },
    card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.dark.card, padding: Spacing.md, borderRadius: BorderRadius.lg, marginBottom: Spacing.md },
    iconBox: { width: 50, height: 50, borderRadius: BorderRadius.md, justifyContent: 'center', alignItems: 'center', marginRight: Spacing.md },
    info: { flex: 1 },
    title: { color: Colors.dark.text, fontSize: 14, fontWeight: '500' },
    meta: { color: Colors.dark.textSecondary, fontSize: 12, marginTop: 4 },
    downloadBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.dark.primary + '20', justifyContent: 'center', alignItems: 'center' },
});
