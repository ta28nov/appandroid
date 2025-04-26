import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from '../utils/constants';
import { SettingsStackParamList } from './types'; // Assuming types.ts will be updated
import { useTheme } from '../hooks/useTheme';

// Import Setting Screens
import SettingsScreen from '../screens/Main/Settings/SettingsScreen'; // To be created
import ProfileScreen from '../screens/Main/Settings/ProfileScreen';
import IntegrationSettingsScreen from '../screens/Main/Settings/IntegrationSettingsScreen';
import PendingSyncScreen from '../screens/Main/Settings/PendingSyncScreen';

const Stack = createStackNavigator<SettingsStackParamList>();

const SettingsNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={ROUTES.MAIN.SETTINGS} // Restore initial route
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen 
        name={ROUTES.MAIN.SETTINGS}
        component={SettingsScreen}
        options={{ title: 'Cài đặt' }}
      />
      <Stack.Screen
        name={ROUTES.MAIN.PROFILE}
        component={ProfileScreen}
        options={{ title: 'Chỉnh sửa Hồ sơ' }}
      />
       <Stack.Screen
        name={ROUTES.MAIN.INTEGRATIONS}
        component={IntegrationSettingsScreen}
        options={{ title: 'Cài đặt Tích hợp' }}
      />
       <Stack.Screen
        name={ROUTES.MAIN.PENDING_SYNC}
        component={PendingSyncScreen}
        options={{ title: 'Đồng bộ đang chờ' }}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavigator; 