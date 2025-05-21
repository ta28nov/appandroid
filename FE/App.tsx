import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox, Text, View, useColorScheme, StatusBar } from 'react-native';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { CustomLightTheme } from './src/styles/theme';
import { useFonts } from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Ignore specific warnings that might appear during development
LogBox.ignoreLogs([
  'ViewPropTypes will be removed from React Native',
  'AsyncStorage has been extracted from react-native',
]);

// Create a wrapper component to ensure the app doesn't render until providers are ready
const AppWrapper = () => {
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: CustomLightTheme.colors.background }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <AppNavigator />;
};

export default function App() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    ...MaterialCommunityIcons.font,
    Inter: require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    Poppins: require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
  });
  // Lấy theme từ CustomLightTheme hoặc context nếu cần
  const theme = CustomLightTheme;
  const isDarkMode = colorScheme === 'dark';
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: CustomLightTheme.colors.background }}>
        <Text>Loading...</Text>
      </View>
    );
  }
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <ThemeProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={theme.colors.background} />
            <AppWrapper />
          </ThemeProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
