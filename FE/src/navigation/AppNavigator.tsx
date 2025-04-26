import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'react-native';
import { ROUTES } from '../utils/constants';
import { AppStackParamList } from './types';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

// Import navigators
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

// Import screens
import SplashScreen from '../screens/Auth/SplashScreen';
import GlobalSearchResultsScreen from '../screens/Main/Search/GlobalSearchResultsScreen';

// Handle NotificationScreen import dynamically to avoid TypeScript errors
const NotificationScreen = require('../screens/Main/NotificationScreen').default;

const Stack = createStackNavigator<AppStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { theme, isDarkMode } = useTheme();

  if (isLoading) {
    // Show loading/splash screen
    return <SplashScreen />;
  }

  const renderContent = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated ? (
        <Stack.Screen name={ROUTES.STACKS.AUTH_STACK} component={AuthNavigator} />
      ) : (
        <>
          <Stack.Screen name={ROUTES.STACKS.MAIN_TABS} component={MainNavigator} />
          <Stack.Screen
            name={ROUTES.MAIN.NOTIFICATIONS}
            component={NotificationScreen}
            options={{
              headerShown: true,
              title: 'Notifications',
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.text,
              headerTitleStyle: {
                fontWeight: '700',
              },
            }}
          />
          <Stack.Screen
            name={ROUTES.MAIN.GLOBAL_SEARCH_RESULTS}
            component={GlobalSearchResultsScreen}
            options={({ route }) => ({
              headerShown: true,
              title: `Kết quả cho: ${route.params.query}`,
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.text,
              headerTitleStyle: {
                fontWeight: '600',
              },
            })}
          />
        </>
      )}
    </Stack.Navigator>
  );

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      {renderContent()}
    </NavigationContainer>
  );
};

export default AppNavigator; 