import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ROUTES } from '../utils/constants';
import { MainTabParamList } from './types';
import { useTheme } from '../hooks/useTheme';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import SettingsNavigator from './SettingsNavigator';
import ChatNavigator from './ChatNavigator';

// Import screens/navigators for Tab items
import HomeScreen from '../screens/Main/HomeScreen';
import DocumentScreen from '../screens/Main/DocumentScreen';
import TaskManagementScreen from '../screens/Main/TaskManagementScreen';
import ForumScreen from '../screens/Main/ForumScreen';

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
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.MAIN.DOCUMENTS}
        component={DocumentScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="file-document-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.MAIN.TASKS}
        component={TaskManagementScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="checkbox-marked-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.MAIN.FORUM}
        component={ForumScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="forum-outline" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={ROUTES.MAIN.CHAT_LIST}
        component={ChatNavigator}
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <Icon name="message-outline" color={color} size={size} />
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
            <Icon name="cog-outline" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;