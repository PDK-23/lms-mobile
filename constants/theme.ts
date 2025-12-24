/**
 * LMS App Theme - Dark mode with cyan accents
 * Based on Google Stitch design
 */

import { Platform } from 'react-native';

// Primary accent color - Cyan/Electric Blue
const primaryCyan = '#00D9FF';
const primaryCyanLight = '#5EEAFF';
const primaryCyanDark = '#00A8CC';

export const Colors = {
  light: {
    text: '#11181C',
    textSecondary: '#687076',
    background: '#fff',
    tint: primaryCyan,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: primaryCyan,
    card: '#F5F5F5',
    border: '#E0E0E0',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    primary: primaryCyan,
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#9BA1A6',
    background: '#121212',
    backgroundSecondary: '#1E1E1E',
    tint: primaryCyan,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: primaryCyan,
    card: '#1E1E1E',
    cardSecondary: '#2A2A2A',
    border: '#333333',
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    primary: primaryCyan,
    primaryLight: primaryCyanLight,
    primaryDark: primaryCyanDark,
  },
};

// Spacing constants
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border radius
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
