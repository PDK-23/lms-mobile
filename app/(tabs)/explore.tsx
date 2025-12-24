import { CategoryChip } from '@/components/CategoryChip';
import { CourseCard } from '@/components/CourseCard';
import { SearchBar } from '@/components/SearchBar';
import { categories, Course, getCoursesByCategory } from '@/constants/mockData';
import { Colors, Spacing } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(params.category || 'All');

  const allCategories = [{ id: 'all', name: 'All' }, ...categories];

  const filteredCourses = useMemo(() => {
    let result = getCoursesByCategory(selectedCategory);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.instructor.name.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query)
      );
    }
    return result;
  }, [selectedCategory, searchQuery]);

  const handleCoursePress = (course: Course) => {
    router.push(`/course/${course.id}`);
  };

  const renderCategoryChip = ({ item }: { item: typeof allCategories[0] }) => (
    <CategoryChip
      category={item}
      isSelected={selectedCategory === item.name}
      onPress={() => setSelectedCategory(item.name)}
    />
  );

  const renderCourseItem = ({ item }: { item: Course }) => (
    <CourseCard course={item} onPress={() => handleCoursePress(item)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Khám phá</Text>
        <Text style={styles.subtitle}>Tìm kiếm khóa học phù hợp với bạn</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Tìm kiếm khóa học, giảng viên..."
        />
      </View>

      {/* Category Filters */}
      <View style={styles.categoryContainer}>
        <FlatList
          data={allCategories}
          renderItem={renderCategoryChip}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryList}
        />
      </View>

      {/* Results Count */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsText}>
          {filteredCourses.length} khóa học được tìm thấy
        </Text>
      </View>

      {/* Course List */}
      <FlatList
        data={filteredCourses}
        renderItem={renderCourseItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.courseRow}
        contentContainerStyle={styles.courseList}
        showsVerticalScrollIndicator={false}
      />
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
    paddingBottom: Spacing.sm,
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
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    marginVertical: Spacing.md,
  },
  categoryContainer: {
    marginBottom: Spacing.md,
  },
  categoryList: {
    paddingHorizontal: Spacing.lg,
  },
  resultsHeader: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  resultsText: {
    color: Colors.dark.textSecondary,
    fontSize: 14,
  },
  courseList: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  courseRow: {
    justifyContent: 'space-between',
  },
});
