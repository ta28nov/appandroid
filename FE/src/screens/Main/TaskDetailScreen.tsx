import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TaskStackParamList } from '../../navigation/types';
import { ROUTES } from '../../utils/constants';
import { useTheme } from '../../hooks/useTheme';
import { apiGetTaskById, apiUpdateTask, apiDeleteTask } from '../../services/api';
import { Task } from './TaskManagementScreen'; // Import Task interface từ TaskManagementScreen
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';

type TaskDetailScreenRouteProp = RouteProp<
  TaskStackParamList,
  typeof ROUTES.MAIN.TASK_DETAIL
>;

type TaskDetailNavigationProp = StackNavigationProp<
  TaskStackParamList,
  typeof ROUTES.MAIN.TASK_DETAIL
>;

const TaskDetailScreen: React.FC = () => {
  const route = useRoute<TaskDetailScreenRouteProp>();
  const navigation = useNavigation<TaskDetailNavigationProp>();
  const { theme } = useTheme();
  const taskId = route.params?.taskId;

  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (taskId) {
      const fetchTaskDetails = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await apiGetTaskById(taskId);
          setTaskDetails(response.data); // API trả về trực tiếp Task object
        } catch (err: any) {
          console.error("Lỗi khi tải chi tiết task:", err.response?.data || err.message);
          setError(err.response?.data?.message || 'Không thể tải chi tiết task.');
        } finally {
          setLoading(false);
        }
      };
      fetchTaskDetails();
    }
  }, [taskId]);

  const handleDeleteTask = () => {
    if (!taskDetails?._id) return;
    Alert.alert(
      'Xóa Công việc',
      `Bạn có chắc muốn xóa công việc "${taskDetails.title}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await apiDeleteTask(taskDetails._id);
              Alert.alert('Thành công', 'Công việc đã được xóa.');
              navigation.goBack(); // Quay lại màn hình danh sách
              // TODO: Cần có cơ chế để cập nhật lại danh sách ở TaskManagementScreen
            } catch (err) {
              console.error('Lỗi xóa task:', err);
              Alert.alert('Lỗi', 'Không thể xóa công việc.');
            }
          },
        },
      ]
    );
  };
  
  const toggleCompletion = async () => {
    if (!taskDetails) return;
    const updatedTaskData = { 
        ...taskDetails, 
        completed: !taskDetails.completed 
    };
    // Loại bỏ _id và các trường không cần thiết cho update payload
    const { _id, overdue, ...payload } = updatedTaskData;

    try {
        const response = await apiUpdateTask(taskDetails._id, payload);
        setTaskDetails(response.data); // Cập nhật UI với dữ liệu mới từ server
        Alert.alert('Thành công', 'Trạng thái công việc đã được cập nhật.');
    } catch (error) {
        console.error("Lỗi cập nhật task:", error);
        Alert.alert('Lỗi', 'Không thể cập nhật trạng thái công việc.');
        // Không cần rollback ở đây vì chúng ta set state từ response
    }
  };

  // Priority color (tương tự TaskManagementScreen)
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '#FF3B30';
      case 'medium': return '#FF9500';
      case 'low': return '#34C759';
      default: return theme.colors.disabled || '#8E8E93';
    }
  };

  if (!taskId) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Lỗi: Không tìm thấy ID công việc.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.error }}>Lỗi: {error}</Text>
      </View>
    );
  }

  if (!taskDetails) {
    return (
      <View style={[styles.centeredContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Không tìm thấy thông tin công việc.</Text>
      </View>
    );
  }

  const priorityColor = getPriorityColor(taskDetails.priority);

  return (
    <ScrollView style={[styles.scrollContainer, { backgroundColor: theme.colors.background }]}>
      <View style={styles.contentView}>
        <View style={styles.headerSection}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{taskDetails.title}</Text>
            <View style={[styles.priorityBadge, {backgroundColor: priorityColor}]}>
                <Text style={styles.priorityText}>{taskDetails.priority.toUpperCase()}</Text>
            </View>
        </View>

        {taskDetails.description && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Mô tả</Text>
            <Text style={[styles.descriptionText, { color: theme.colors.text }]}>{taskDetails.description}</Text>
          </View>
        )}

        <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Trạng thái</Text>
            <TouchableOpacity onPress={toggleCompletion} style={styles.statusContainer}>
                <Icon 
                    name={taskDetails.completed ? "checkbox-marked-circle" : "checkbox-blank-circle-outline"} 
                    size={24} 
                    color={taskDetails.completed ? theme.colors.success : theme.colors.disabled}
                />
                <Text style={[styles.statusText, { color: taskDetails.completed ? theme.colors.success : theme.colors.text, marginLeft: 8 }]}>
                    {taskDetails.completed ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                </Text>
            </TouchableOpacity>
        </View>

        {taskDetails.dueDate && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Ngày hết hạn</Text>
            <Text style={[styles.dateText, { color: theme.colors.text }]}>
              {new Date(taskDetails.dueDate).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
          </View>
        )}
        
        {/* TODO: Hiển thị ProjectId nếu có */}
        {taskDetails.projectId && (
            <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Dự án</Text>
                <Text style={[styles.text, { color: theme.colors.text }]}>{taskDetails.projectId}</Text> 
                {/* Sẽ tốt hơn nếu populate tên dự án */}
            </View>
        )}

        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: theme.colors.error }]} onPress={handleDeleteTask}>
            <Icon name="delete-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Xóa</Text>
          </TouchableOpacity>
          {/* Nút Sửa - Ví dụ:
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.colors.primary, marginLeft: 10 }]} 
            onPress={() => {
              // TODO: Điều hướng đến màn hình sửa task hoặc mở modal sửa task
              // Ví dụ: navigation.navigate(ROUTES.MAIN.TASK_EDIT, { taskId: taskDetails._id });
              Alert.alert("Chức năng Sửa", "Sẽ được triển khai!");
            }}
          >
            <Icon name="pencil-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Sửa</Text>
          </TouchableOpacity>
          */}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  contentView: {
    padding: 20,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    flexShrink: 1, // Cho phép title thu nhỏ nếu priorityBadge quá lớn
    marginRight: 10,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statusText: {
    fontSize: 16,
  },
  dateText: {
    fontSize: 16,
  },
  text: {
      fontSize: 16,
  },
  actionsContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default TaskDetailScreen; 