import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomLightTheme, CustomDarkTheme, AppTheme } from '../styles/theme';

type ThemeType = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  theme: AppTheme;
  themeType: ThemeType;
  isDarkMode: boolean;
  toggleTheme: () => void;
  setThemeType: (type: ThemeType) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: CustomLightTheme,
  themeType: 'system',
  isDarkMode: false,
  toggleTheme: () => {},
  setThemeType: () => {},
});

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_PREFERENCE_KEY = '@theme_preference';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const colorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('system');
  
  // Calculate if dark mode is active based on theme type and system preference
  const isDarkMode = 
    themeType === 'dark' || (themeType === 'system' && colorScheme === 'dark');
  
  // Select the appropriate theme based on dark mode status
  const theme = isDarkMode ? CustomDarkTheme : CustomLightTheme;

  // Load saved theme preference
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedThemeType = await AsyncStorage.getItem(THEME_PREFERENCE_KEY);
        if (savedThemeType) {
          setThemeType(savedThemeType as ThemeType);
        }
      } catch (error) {
        console.error('Failed to load theme preference', error);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem(THEME_PREFERENCE_KEY, themeType);
      } catch (error) {
        console.error('Failed to save theme preference', error);
      }
    };

    saveThemePreference();
  }, [themeType]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setThemeType(isDarkMode ? 'light' : 'dark');
  };

  // Set specific theme type
  const setThemeTypeHandler = (type: ThemeType) => {
    setThemeType(type);
  };

  const contextValue: ThemeContextProps = {
    theme,
    themeType,
    isDarkMode,
    toggleTheme,
    setThemeType: setThemeTypeHandler,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
}; 