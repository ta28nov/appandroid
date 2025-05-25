import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ForumStackParamList } from './types';
import { ROUTES } from '../utils/constants';
import { useTheme } from '../hooks/useTheme';

// Import Screens
import ForumScreen from '../screens/Main/ForumScreen';
import CreateForumPostScreen from '../screens/Main/CreateForumPostScreen';
import ForumPostDetailScreen from '../screens/Main/ForumPostDetailScreen';

const Stack = createStackNavigator<ForumStackParamList>();

const ForumNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={ROUTES.MAIN.FORUM}
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
        },
        headerTintColor: theme.colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name={ROUTES.MAIN.FORUM}
        component={ForumScreen}
        options={{ title: 'Diễn đàn' }} 
      />
      <Stack.Screen
        name={ROUTES.MAIN.FORUM_POST_DETAIL}
        component={ForumPostDetailScreen}
        options={({ route }) => ({ 
          title: route.params?.postTitle || 'Chi tiết Bài đăng',
        })}
      />
      <Stack.Screen
        name={ROUTES.MAIN.CREATE_FORUM_POST}
        component={CreateForumPostScreen}
        options={({ route }) => ({ 
          title: route.params?.postId ? 'Chỉnh sửa Bài đăng' : 'Tạo Bài đăng mới',
        })}
      />
    </Stack.Navigator>
  );
};

export default ForumNavigator; 