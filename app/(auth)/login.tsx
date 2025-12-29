import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useMutation } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { login } from "@/src/features/auth/auth.service";
import { loginSchema } from "@/src/features/auth/auth.schema";
import { useAuthStore } from "@/src/stores/auth.store";
import { router } from "expo-router";
import { z } from "zod";
import { useTheme } from "@/src/theme/useTheme";
import { Button } from "@/src/ui/Button";
import { Input } from "@/src/ui/Input";
import { Screen } from "@/src/ui/Screen";
import { Text } from "@/src/ui/Text";

export default function LoginScreen() {
  const { colors, spacing } = useTheme();
  const styles = makeStyles(spacing);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const setSession = useAuthStore((s) => s.setSession);

  const m = useMutation({
    mutationFn: async (payload: z.infer<typeof loginSchema>) => {
      return login(payload);
    },
    onSuccess: async (res) => {
      await setSession(res);
      router.replace("/");
    },
    onError: (e: any) => {
      const msg =
        e?.response?.data?.message ?? e?.message ?? "Đăng nhập thất bại";
      setErrors((prev) => ({ ...prev, password: msg }));
    },
  });

  const handleLogin = () => {
    setErrors({});

    const result = loginSchema.safeParse({
      username,
      password,
      rememberMe: true,
    });

    if (!result.success) {
      const formattedErrors: any = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0]] = err.message;
        }
      });
      setErrors(formattedErrors);
      return;
    }

    m.mutate(result.data);
  };

  return (
    <Screen scroll keyboardAvoiding padding>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: colors.primarySoft }]}>
            <Ionicons name="school-outline" size={40} color={colors.primary} />
          </View>
          <Text variant="title">Welcome Back!</Text>
          <Text variant="bodySmall" color={colors.textSecondary}>
            Sign in to access your courses
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Username"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              if (errors.username) setErrors({ ...errors, username: undefined });
            }}
            autoCapitalize="none"
            leftIcon={
              <Ionicons
                name="person-outline"
                size={20}
                color={errors.username ? colors.danger : colors.textSecondary}
              />
            }
            error={errors.username}
          />

          <Input
            label="Password"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            secureTextEntry={!showPassword}
            leftIcon={
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={errors.password ? colors.danger : colors.textSecondary}
              />
            }
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            }
            error={errors.password}
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text variant="bodySmall" color={colors.primary} weight="600">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <Button label="Sign In" onPress={handleLogin} loading={m.isPending} />
        </View>

        <View style={styles.footer}>
          <Text variant="bodySmall" color={colors.textSecondary}>
            Don't have an account?
          </Text>
          <TouchableOpacity>
            <Text variant="bodySmall" color={colors.primary} weight="700">
              Contact Admin
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}

const makeStyles = (spacing: ReturnType<typeof useTheme>["spacing"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
    },
    header: {
      alignItems: "center",
      marginBottom: spacing.xl,
      gap: spacing.sm,
    },
    logoContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    form: {
      gap: spacing.md,
    },
    forgotPassword: {
      alignSelf: "flex-end",
      marginTop: 4,
      marginBottom: spacing.sm,
    },
    footer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: spacing.lg,
      gap: spacing.xs,
    },
  });
