import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { DocumentStackParamList } from './types';
import { ROUTES } from '../utils/constants';
import { useTheme } from '../hooks/useTheme';

// Import Screens
import DocumentScreen from '../screens/Main/DocumentScreen';
import DocumentDetailScreen from '../screens/Main/DocumentDetailScreen'; // Giả sử file này tồn tại

const Stack = createStackNavigator<DocumentStackParamList>();

const DocumentNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
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
        name={ROUTES.MAIN.DOCUMENTS}
        component={DocumentScreen}
        options={{ title: 'Tài liệu' }} // Hoặc bạn có thể muốn ẩn header này nếu TabNavigator đã có title
      />
      <Stack.Screen
        name={ROUTES.MAIN.DOCUMENT_DETAIL}
        component={DocumentDetailScreen}
        options={({ route }) => ({ 
          title: 'Chi tiết Tài liệu', // Tiêu đề có thể được cập nhật dựa trên route.params
          // headerBackTitleVisible: false, // Tùy chọn nếu bạn muốn ẩn chữ "Back"
        })}
      />
    </Stack.Navigator>
  );
};

export default DocumentNavigator; 