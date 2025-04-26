import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox, Text, View } from 'react-native';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { CustomLightTheme } from './src/styles/theme';

// Ignore specific warnings that might appear during development
LogBox.ignoreLogs([
  'ViewPropTypes will be removed from React Native',
  'AsyncStorage has been extracted from react-native',
]);

// Create a wrapper component to ensure the app doesn't render until providers are ready
const AppWrapper = () => {
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    // Small delay to ensure context is properly initialized
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100); // Increase delay to 100ms to ensure everything loads
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: CustomLightTheme.colors.background }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <AppNavigator />
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppWrapper />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
