import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { COLORS } from '../styles/theme';
import { CustomLightTheme, CustomDarkTheme } from '../styles/theme';

// Create a fallback theme that doesn't depend on context
const createFallbackTheme = (isDark = false) => {
  const colorSet = isDark ? COLORS.dark : COLORS.light;
  
  return {
    theme: isDark ? CustomDarkTheme : CustomLightTheme,
    themeType: isDark ? 'dark' : 'light',
    isDarkMode: isDark,
    toggleTheme: () => {},
    setThemeType: () => {},
  };
};

export const useTheme = () => {
  try {
    const context = useContext(ThemeContext);
    
    if (!context || context === undefined) {
      console.warn('ThemeContext not found, using fallback theme');
      return createFallbackTheme(false);
    }
    
    // Make sure theme is defined
    if (!context.theme || !context.theme.colors) {
      console.warn('Theme or theme.colors is undefined, using fallback');
      return createFallbackTheme(context.isDarkMode || false);
    }
    
    return context;
  } catch (error) {
    console.error('Error in useTheme:', error);
    return createFallbackTheme(false);
  }
}; 