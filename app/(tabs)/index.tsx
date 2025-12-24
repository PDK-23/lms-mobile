import { CourseCard } from '@/components/CourseCard';
import { SearchBar } from '@/components/SearchBar';
import {
  categories,
  Course,
  currentUser,
  getContinueLearning,
  getFeaturedCourses,
} from '@/constants/mockData';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const continueLearning = getContinueLearning();
  const featuredCourses = getFeaturedCourses();

  const handleCoursePress = (course: Course) => {
    router.push(`/course/${course.id}`);
  };

  const renderContinueLearningItem = ({ item }: { item: Course }) => (
    <CourseCard
      course={item}
      variant="horizontal"
      showProgress
      onPress={() => handleCoursePress(item)}
    />
  );

  const renderCategoryItem = ({ item }: { item: typeof categories[0] }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => router.push(`/(tabs)/explore?category=${item.name}`)}
    >
      <View style={[styles.categoryIcon, { backgroundColor: item.color + '20' }]}>
        <Ionicons name={item.icon as any} size={24} color={item.color} />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Chào buổi sáng,</Text>
            <Text style={styles.userName}>{currentUser.name} 👋</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="notifications-outline" size={24} color={Colors.dark.text} />
            <View style={styles.notificationBadge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Tìm kiếm khóa học..."
          />
        </View>

        {/* Continue Learning Section */}
        {continueLearning.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Đang học</Text>
              <TouchableOpacity onPress={() => router.push('/(tabs)/my-courses')}>
                <Text style={styles.seeAll}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={continueLearning}
              renderItem={renderContinueLearningItem}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
          </View>
        )}

        {/* Categories Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          />
        </View>

        {/* Featured Courses Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Khóa học nổi bật</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/explore')}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.coursesGrid}>
            {featuredCourses.slice(0, 4).map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onPress={() => handleCoursePress(course)}
              />
            ))}
          </View>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  headerLeft: {},
  greeting: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
  },
  userName: {
    color: Colors.dark.text,
    fontSize: 22,
    fontWeight: '700',
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.dark.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.dark.error,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    color: Colors.dark.text,
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  seeAll: {
    color: Colors.dark.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  horizontalList: {
    paddingHorizontal: Spacing.lg,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  categoryName: {
    color: Colors.dark.text,
    fontSize: 12,
    fontWeight: '500',
  },
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
});
