import { MD3LightTheme as DefaultTheme, MD3DarkTheme as DarkTheme } from 'react-native-paper';

export const COLORS = {
  // Light theme colors
  light: {
    primary: '#007AFF',
    secondary: '#FF9500',
    success: '#34C759',
    error: '#FF3B30',
    warning: '#FF9500',
    info: '#007AFF',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    text: {
      primary: '#333333',
      secondary: '#8E8E93',
    },
    border: '#E5E5EA',
    disabled: '#C7C7CC',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  // Dark theme colors
  dark: {
    primary: '#0A84FF',
    secondary: '#FF9F0A',
    success: '#30D158',
    error: '#FF453A',
    warning: '#FF9F0A',
    info: '#0A84FF',
    background: '#1C1C1E',
    surface: '#2C2C2E',
    text: {
      primary: '#FFFFFF',
      secondary: '#AEAEB2',
    },
    border: '#38383A',
    disabled: '#48484A',
    backdrop: 'rgba(0, 0, 0, 0.8)',
  },
};

// Extended theme interface to include our additional colors
export interface ExtendedColors {
  primary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  disabled: string;
  placeholder: string;
  error: string;
  // Additional colors
  success: string;
  warning: string;
  info: string;
}

export const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.light.primary,
    accent: COLORS.light.secondary,
    background: COLORS.light.background,
    surface: COLORS.light.surface,
    text: COLORS.light.text.primary,
    disabled: COLORS.light.disabled,
    placeholder: COLORS.light.text.secondary,
    error: COLORS.light.error,
    // Add our additional colors
    success: COLORS.light.success,
    warning: COLORS.light.warning,
    info: COLORS.light.info,
  },
};

export const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: COLORS.dark.primary,
    accent: COLORS.dark.secondary,
    background: COLORS.dark.background,
    surface: COLORS.dark.surface,
    text: COLORS.dark.text.primary,
    disabled: COLORS.dark.disabled,
    placeholder: COLORS.dark.text.secondary,
    error: COLORS.dark.error,
    // Add our additional colors
    success: COLORS.dark.success,
    warning: COLORS.dark.warning,
    info: COLORS.dark.info,
  },
};

export type AppTheme = typeof CustomLightTheme; 