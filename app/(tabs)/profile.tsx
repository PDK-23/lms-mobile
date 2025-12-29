import { currentUser, getEnrolledCourses } from "@/constants/mockData";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useLogout } from "@/src/features/auth/useLogout";
import { useTheme } from "@/src/theme/useTheme";
import { Card } from "@/src/ui/Card";
import { Screen } from "@/src/ui/Screen";
import { Text } from "@/src/ui/Text";

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
  const { colors, radius, spacing } = useTheme();
  const styles = makeStyles(colors, radius, spacing);

  const enrolledCourses = getEnrolledCourses();
  const completedCourses = enrolledCourses.filter((c) => c.progress === 100).length;

  const handleLogout = async () => {
    if (Platform.OS === "web") {
      const ok = typeof window !== "undefined" ? window.confirm("Bạn có chắc muốn đăng xuất?") : true;
      if (!ok) return;
      await logout();
      router.replace('/(auth)/login');
      return;
    }

    Alert.alert(
      "Đăng xuất",
      "Bạn có chắc muốn đăng xuất?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
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
      { id: "1", icon: "person-outline", title: "Ch?nh s?a h? s?", showArrow: true },
      { id: "2", icon: "card-outline", title: "Thanh to?n", subtitle: "Qu?n l? ph??ng th?c thanh to?n", showArrow: true },
      { id: "3", icon: "notifications-outline", title: "Th?ng b?o", showArrow: true },
    ],
    [
      { id: "4", icon: "language-outline", title: "Ng?n ng?", subtitle: "Ti?ng Vi?t", showArrow: true },
      { id: "5", icon: "moon-outline", title: "Giao di?n t?i", subtitle: "?ang b?t" },
      { id: "6", icon: "download-outline", title: "T?i xu?ng", subtitle: "3 kh?a h?c ?? l?u", showArrow: true },
    ],
    [
      { id: "7", icon: "help-circle-outline", title: "Tr? gi?p & H? tr?", showArrow: true },
      { id: "8", icon: "document-text-outline", title: "?i?u kho?n s? d?ng", showArrow: true },
      { id: "9", icon: "shield-checkmark-outline", title: "Ch?nh s?ch b?o m?t", showArrow: true },
    ],
    [
      {
        id: "10",
        icon: "log-out-outline",
        title: "??ng xu?t",
        color: colors.danger,
        onPress: handleLogout,
      },
    ],
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      style={styles.settingItem}
      activeOpacity={0.7}
      onPress={item.onPress}
      disabled={!item.onPress}
    >
      <View style={[styles.settingIcon, item.color && { backgroundColor: item.color + "20" }]}> 
        <Ionicons
          name={item.icon as any}
          size={22}
          color={item.color || colors.primary}
        />
      </View>
      <View style={styles.settingContent}>
        <Text variant="body" weight="500" color={item.color || colors.text}>
          {item.title}
        </Text>
        {item.subtitle ? (
          <Text variant="caption" color={colors.textSecondary}>
            {item.subtitle}
          </Text>
        ) : null}
      </View>
      {item.showArrow ? (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <Screen padding={false}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: currentUser.avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={16} color={colors.background} />
            </TouchableOpacity>
          </View>
          <Text variant="subtitle" weight="700">
            {currentUser.name}
          </Text>
          <Text variant="caption">{currentUser.email}</Text>
        </View>

        <Card style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text variant="title" color={colors.primary} weight="700">
              {enrolledCourses.length}
            </Text>
            <Text variant="caption">Kh?a h?c</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text variant="title" color={colors.primary} weight="700">
              {completedCourses}
            </Text>
            <Text variant="caption">Ho?n th?nh</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text variant="title" color={colors.primary} weight="700">
              12
            </Text>
            <Text variant="caption">Ch?ng ch?</Text>
          </View>
        </Card>

        {settingsGroups.map((group, index) => (
          <Card key={index} style={styles.settingsGroup}>
            {group.map((item, idx) => (
              <View key={item.id} style={idx < group.length - 1 ? styles.settingDivider : undefined}>
                {renderSettingItem(item)}
              </View>
            ))}
          </Card>
        ))}

        <Text variant="caption" align="center" color={colors.textSecondary} style={styles.version}>
          Phi?n b?n 1.0.0
        </Text>
      </ScrollView>
    </Screen>
  );
}

const makeStyles = (
  colors: ReturnType<typeof useTheme>["colors"],
  radius: ReturnType<typeof useTheme>["radius"],
  spacing: ReturnType<typeof useTheme>["spacing"]
) =>
  StyleSheet.create({
    header: {
      alignItems: "center",
      paddingVertical: spacing.xl,
      gap: spacing.xs,
    },
    avatarContainer: {
      position: "relative",
      marginBottom: spacing.md,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: colors.primary,
    },
    editAvatarBtn: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 3,
      borderColor: colors.background,
    },
    statsCard: {
      flexDirection: "row",
      marginHorizontal: spacing.lg,
      borderRadius: radius.lg,
      padding: spacing.lg,
      marginBottom: spacing.lg,
      justifyContent: "space-between",
    },
    scrollContent: {
      paddingBottom: spacing.xl,
    },
    statItem: {
      flex: 1,
      alignItems: "center",
      gap: spacing.xs,
    },
    statDivider: {
      width: 1,
      backgroundColor: colors.border,
      marginVertical: spacing.xs,
    },
    settingsGroup: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      overflow: "hidden",
    },
    settingItem: {
      flexDirection: "row",
      alignItems: "center",
      padding: spacing.md,
    },
    settingDivider: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.md,
      backgroundColor: colors.primarySoft,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.md,
    },
    settingContent: {
      flex: 1,
      gap: 2,
    },
    version: {
      paddingVertical: spacing.xl,
    },
  });
