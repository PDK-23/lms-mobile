import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface SearchBarProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onSubmit?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChangeText,
    placeholder = 'Tìm kiếm khóa học...',
    onSubmit,
}) => {
    return (
        <View style={styles.container}>
            <Ionicons name="search" size={20} color={Colors.dark.textSecondary} style={styles.icon} />
            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder}
                placeholderTextColor={Colors.dark.textSecondary}
                onSubmitEditing={onSubmit}
                returnKeyType="search"
            />
            {value.length > 0 && (
                <TouchableOpacity onPress={() => onChangeText('')} style={styles.clearButton}>
                    <Ionicons name="close-circle" size={20} color={Colors.dark.textSecondary} />
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.dark.card,
        borderRadius: BorderRadius.lg,
        paddingHorizontal: Spacing.md,
        height: 48,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    icon: {
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        color: Colors.dark.text,
        fontSize: 16,
        height: '100%',
    },
    clearButton: {
        padding: Spacing.xs,
    },
});
