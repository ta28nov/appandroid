import { MD3LightTheme as DefaultTheme, MD3DarkTheme as DarkTheme } from 'react-native-paper';

export const COLORS = {
  // Light theme colors
  light: {
    primary: '#00695C', // Deep Teal
    secondary: '#FFA000', // Amber
    success: '#28A745', // Green
    error: '#DC3545',   // Red
    warning: '#FFC107', // Yellow
    info: '#17A2B8',    // Cyan/Info Blue
    background: '#F8F9FA', // Off-white, very light gray
    surface: '#FFFFFF',    // White
    text: {
      primary: '#212529',   // Near Black
      secondary: '#6C757D', // Medium Gray
    },
    border: '#DEE2E6',     // Light Gray Border
    disabled: '#ADB5BD',   // Gray for disabled elements
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  // Dark theme colors
  dark: {
    primary: '#4DB6AC', // Lighter Teal for dark mode
    secondary: '#FFCA28', // Lighter Amber for dark mode
    success: '#66BB6A', // Lighter Green for dark mode
    error: '#EF5350',   // Lighter Red for dark mode
    warning: '#FFEE58', // Lighter Yellow for dark mode
    info: '#4DD0E1',    // Lighter Cyan/Info Blue for dark mode
    background: '#121212',    // Very Dark Gray, standard for dark themes
    surface: '#1E1E1E',     // Dark Gray, slightly lighter than background
    text: {
      primary: '#E0E0E0',   // Light Gray, almost white
      secondary: '#B0B0B0', // Medium-Light Gray
    },
    border: '#424242',     // Medium Dark Gray Border
    disabled: '#757575',   // Dark Gray for disabled elements
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