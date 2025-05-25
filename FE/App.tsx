import React, { useEffect, useState, useContext } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LogBox, Text, View, useColorScheme, StatusBar } from 'react-native';
import * as Font from 'expo-font';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { AuthProvider, AuthContext } from './src/contexts/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import { CustomLightTheme } from './src/styles/theme';


// Ignore specific warnings that might appear during development
LogBox.ignoreLogs([
  'ViewPropTypes will be removed from React Native',
  'AsyncStorage has been extracted from react-native',
]);
LogBox.ignoreAllLogs(true);

const AppWrapper = () => { 
  const authContext = useContext(AuthContext);

  console.log('[AppWrapper] authContext.isLoading:', authContext?.isLoading, 'authContext.isAuthenticated:', authContext?.isAuthenticated, 'authContext.user exists:', !!authContext?.user);

  // AppNavigator sẽ tự hiển thị SplashScreen nếu authContext.isLoading là true
  // Hoặc tự quyết định Auth vs Main stack dựa trên isAuthenticated
  // Do đó, AppWrapper không cần làm gì phức tạp ở đây nữa.
  if (authContext.isLoading) { // Chỉ hiển thị loading nếu AuthProvider đang tự đánh dấu là loading
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: CustomLightTheme.colors.background }}>
        <Text>Đang tải ứng dụng (Auth)...</Text>
      </View>
    );
  }

  return <AppNavigator />;
};

export default function App() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          ...MaterialCommunityIcons.font,
        });
      } catch (e) {
        console.warn(e);
      } finally {
        setFontsLoaded(true);
      }
    }
    loadFonts();
  }, []);

  const theme = CustomLightTheme;
  const isDarkMode = colorScheme === 'dark';

  if (!fontsLoaded) { // Hiển thị màn hình chờ tải font ở cấp cao nhất
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: CustomLightTheme.colors.background }}>
        <Text>Đang tải fonts...</Text>
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
