import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TaskStackParamList } from './types';
import { ROUTES } from '../utils/constants';
import { useTheme } from '../hooks/useTheme';

// Import Screens
import TaskManagementScreen from '../screens/Main/TaskManagementScreen';
import TaskDetailScreen from '../screens/Main/TaskDetailScreen';

const Stack = createStackNavigator<TaskStackParamList>();

const TaskNavigator = () => {
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      initialRouteName={ROUTES.MAIN.TASKS_LIST} // Đảm bảo màn hình danh sách là default
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
        name={ROUTES.MAIN.TASKS_LIST}
        component={TaskManagementScreen}
        options={{ title: 'Quản lý Công việc' }} 
      />
      <Stack.Screen
        name={ROUTES.MAIN.TASK_DETAIL}
        component={TaskDetailScreen}
        options={({ route }) => ({ 
          title: 'Chi tiết Công việc', // Tiêu đề có thể được cập nhật động
          // headerBackTitle: 'DS Công việc', // Chữ cho nút back nếu muốn
        })}
      />
      {/* Thêm màn hình EditTaskScreen ở đây nếu cần */}
      {/* <Stack.Screen name={ROUTES.MAIN.TASK_EDIT} component={EditTaskScreen} /> */}
    </Stack.Navigator>
  );
};

export default TaskNavigator; 