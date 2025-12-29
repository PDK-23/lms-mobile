import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "@/src/theme/useTheme";

interface ProgressBarProps {
  progress: number;
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 6,
  backgroundColor,
  progressColor,
}) => {
  const { colors, radius } = useTheme();
  const styles = makeStyles(radius.full);
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: backgroundColor ?? colors.surfaceAlt,
        },
      ]}
    >
      <View
        style={[
          styles.progress,
          {
            width: `${clampedProgress}%`,
            backgroundColor: progressColor ?? colors.primary,
          },
        ]}
      />
    </View>
  );
};

const makeStyles = (radius: number) =>
  StyleSheet.create({
    container: {
      width: "100%",
      borderRadius: radius,
      overflow: "hidden",
    },
    progress: {
      height: "100%",
      borderRadius: radius,
    },
  });
