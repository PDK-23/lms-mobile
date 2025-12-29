import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { login } from "@/src/features/auth/auth.service";
import { loginSchema } from "@/src/features/auth/auth.schema";
import { useAuthStore } from "@/src/stores/auth.store";
import { router } from "expo-router";
import { z } from "zod";

const COLORS = {
  primary: "#4F46E5",
  secondary: "#E0E7FF",
  text: "#1F2937",
  textLight: "#6B7280",
  inputBg: "#F3F4F6",
  white: "#FFFFFF",
  error: "#EF4444", // Màu đỏ báo lỗi
};

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // State lưu lỗi validation
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const setSession = useAuthStore((s) => s.setSession);

  const m = useMutation({
    mutationFn: async (payload: z.infer<typeof loginSchema>) => {
      // Payload đã được validate ở handleLogin, nên ở đây gọi thẳng service
      return login(payload);
    },
    onSuccess: async (res) => {
      await setSession(res);
      router.replace("/");
    },
    onError: (e: any) => {
      // Nếu API trả về lỗi chung (sai pass, tk bị khóa...), ta set vào state lỗi
      // Tùy vào format API của bạn, ở đây tôi giả định hiển thị lỗi chung dưới Password
      const msg =
        e?.response?.data?.message ?? e?.message ?? "Đăng nhập thất bại";
      setErrors((prev) => ({ ...prev, password: msg }));
    },
  });

  const handleLogin = () => {
    // 1. Reset lỗi cũ
    setErrors({});

    // 2. Validate dữ liệu local bằng Zod schema trước khi gọi API
    const result = loginSchema.safeParse({
      username,
      password,
      rememberMe: true,
    });

    if (!result.success) {
      // 3. Nếu validate sai, map lỗi từ Zod vào state errors
      const formattedErrors: any = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          formattedErrors[err.path[0]] = err.message;
        }
      });
      setErrors(formattedErrors);
      return; // Dừng lại, không gọi API
    }

    // 4. Nếu đúng hết, gọi mutation
    m.mutate(result.data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="school-outline" size={40} color={COLORS.primary} />
          </View>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Sign in to access your courses</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Username Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Username</Text>
            <View
              style={[
                styles.inputContainer,
                errors.username && styles.inputError, // Đổi màu viền nếu có lỗi
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={errors.username ? COLORS.error : COLORS.textLight}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Enter your username"
                placeholderTextColor="#9CA3AF"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (errors.username)
                    setErrors({ ...errors, username: undefined }); // Xóa lỗi khi user gõ lại
                }}
                autoCapitalize="none"
                style={styles.input}
              />
            </View>
            {/* Hiển thị dòng lỗi */}
            {errors.username && (
              <Text style={styles.errorText}>{errors.username}</Text>
            )}
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Password</Text>
            <View
              style={[
                styles.inputContainer,
                errors.password && styles.inputError,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={errors.password ? COLORS.error : COLORS.textLight}
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color={COLORS.textLight}
                />
              </TouchableOpacity>
            </View>
            {/* Hiển thị dòng lỗi */}
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 8 }}>
              <Text style={styles.forgotPassword}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {/* Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={m.isPending}
            style={[styles.button, m.isPending && styles.buttonDisabled]}
          >
            {m.isPending ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity>
            <Text style={styles.linkText}>Contact Admin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  contentContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.secondary,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textLight,
  },
  form: {
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.inputBg,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "transparent", // Mặc định không viền
  },
  // Style khi có lỗi
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: "#FEF2F2", // Nền đỏ nhạt
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    height: "100%",
  },
  forgotPassword: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  button: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  footerText: {
    color: COLORS.textLight,
    fontSize: 15,
  },
  linkText: {
    color: COLORS.primary,
    fontWeight: "700",
    fontSize: 15,
  },
});
