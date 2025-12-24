import { Category } from '@/constants/mockData';
import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CategoryChipProps {
    category: Category | { id: string; name: string };
    isSelected?: boolean;
    onPress?: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
    category,
    isSelected = false,
    onPress,
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.chip,
                isSelected && styles.chipSelected,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {'icon' in category && (
                <Ionicons
                    name={category.icon as any}
                    size={16}
                    color={isSelected ? Colors.dark.background : Colors.dark.primary}
                    style={styles.icon}
                />
            )}
            <Text style={[styles.text, isSelected && styles.textSelected]}>
                {category.name}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderRadius: BorderRadius.full,
        backgroundColor: Colors.dark.card,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        marginRight: Spacing.sm,
    },
    chipSelected: {
        backgroundColor: Colors.dark.primary,
        borderColor: Colors.dark.primary,
    },
    icon: {
        marginRight: Spacing.xs,
    },
    text: {
        color: Colors.dark.text,
        fontSize: 14,
        fontWeight: '500',
    },
    textSelected: {
        color: Colors.dark.background,
    },
});
