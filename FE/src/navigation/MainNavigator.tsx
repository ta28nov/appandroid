import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES } from '../utils/constants';
import { MainTabParamList } from './types';
import { useTheme } from '../hooks/useTheme';
import { Text } from 'react-native';
import SettingsNavigator from './SettingsNavigator';
import ChatNavigator from './ChatNavigator';
import DocumentNavigator from './DocumentNavigator';
import TaskNavigator from './TaskNavigator';
import ForumNavigator from './ForumNavigator';

// Import screens/navigators for Tab items
import HomeScreen from '../screens/Main/HomeScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator = () => {
  const { theme, isDarkMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: isDarkMode ? '#AEAEB2' : '#8E8E93',
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: isDarkMode ? '#38383A' : '#E5E5EA',
        },
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Tab.Screen
        name={ROUTES.MAIN.HOME}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color: color }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.MAIN.DOCUMENTS}
        component={DocumentNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color: color }}>📄</Text>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ROUTES.MAIN.TASKS}
        component={TaskNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color: color }}>✅</Text>
          ),
          headerShown: false,
          title: 'Công việc',
        }}
      />
      <Tab.Screen
        name={ROUTES.MAIN.FORUM}
        component={ForumNavigator}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color: color }}>💬</Text>
          ),
          headerShown: false,
          title: 'Diễn đàn',
        }}
      />
      <Tab.Screen
        name={ROUTES.MAIN.CHAT_LIST}
        component={ChatNavigator}
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color: color }}>💬</Text>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={ROUTES.MAIN.SETTINGS_NAVIGATOR}
        component={SettingsNavigator}
        options={{
          title: 'Cài đặt',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Text style={{ fontSize: size, color: color }}>⚙️</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;