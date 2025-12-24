import { BorderRadius, Colors } from '@/constants/theme';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ProgressBarProps {
    progress: number;
    height?: number;
    backgroundColor?: string;
    progressColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
    progress,
    height = 6,
    backgroundColor = Colors.dark.cardSecondary,
    progressColor = Colors.dark.primary,
}) => {
    const clampedProgress = Math.min(Math.max(progress, 0), 100);

    return (
        <View style={[styles.container, { height, backgroundColor }]}>
            <View
                style={[
                    styles.progress,
                    {
                        width: `${clampedProgress}%`,
                        backgroundColor: progressColor,
                    },
                ]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: BorderRadius.full,
        overflow: 'hidden',
    },
    progress: {
        height: '100%',
        borderRadius: BorderRadius.full,
    },
});
