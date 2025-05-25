import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../styles/globalStyles';
import { apiGetTasks, apiCreateTask, apiUpdateTask, apiDeleteTask } from '../../services/api';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TaskStackParamList } from '../../navigation/types';
import { ROUTES } from '../../utils/constants';

// Task interface
export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  overdue?: boolean;
  projectId?: string;
}

const TaskManagementScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation<StackNavigationProp<TaskStackParamList, typeof ROUTES.MAIN.TASKS_LIST>>();
  
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTaskDueDate, setNewTaskDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [isSaving, setIsSaving] = useState(false);
  
  // Các tùy chọn ngày
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    if (!isRefreshing) {
      setIsLoading(true);
    }
    setError(null);
    
    try {
      const response = await apiGetTasks();
      // Lấy tasks từ response.data.tasks, đảm bảo là mảng
      const taskData = response?.data?.tasks && Array.isArray(response.data.tasks) ? response.data.tasks : [];
      setTasks(taskData);
    } catch (err) {
      console.error('Lỗi khi tải danh sách công việc:', err);
      setError('Không thể tải danh sách công việc. Vui lòng thử lại.');
      setTasks([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  // Load tasks when component mounts and when screen is focused
  useFocusEffect(
    useCallback(() => {
      console.log('TaskManagementScreen focused, fetching tasks...');
      fetchTasks();
      return () => {
        // Optional: Cleanup if needed when the screen is unfocused
        // console.log('TaskManagementScreen unfocused');
      };
    }, [fetchTasks]) // fetchTasks đã được bọc trong useCallback
  );

  // Handle refresh
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTasks();
  };

  // Toggle task completion
  const toggleTask = async (id: string) => {
    const taskToUpdate = tasks.find(task => task._id === id);
    if (!taskToUpdate) {
      console.error('Không tìm thấy công việc với ID:', id);
      return;
    }
    
    try {
      // Cập nhật UI trước để tạo cảm giác phản hồi nhanh
      setTasks(
        tasks.map(task =>
          task._id === id ? { ...task, completed: !task.completed } : task
        )
      );
      
      // Gọi API với dữ liệu đúng định dạng
      const response = await apiUpdateTask(id, { 
        completed: !taskToUpdate.completed,
        // Giữ nguyên các trường khác để tránh ghi đè
        title: taskToUpdate.title,
        priority: taskToUpdate.priority,
        dueDate: taskToUpdate.dueDate,
        description: taskToUpdate.description,
        // projectId: taskToUpdate.projectId, // Backend hiện không hỗ trợ cập nhật projectId qua hàm này
      });
      
      console.log('Cập nhật trạng thái thành công:', response);
    } catch (err: any) {
      // Hoàn tác thay đổi UI nếu API gặp lỗi
      setTasks(
        tasks.map(task =>
          task._id === id ? { ...task, completed: task.completed } : task
        )
      );
      
      // Hiển thị thông báo lỗi chi tiết hơn
      console.error('Lỗi khi cập nhật trạng thái công việc:', err);
      const errorMessage = err.response?.data?.message || 'Không thể cập nhật trạng thái công việc. Vui lòng thử lại.';
      Alert.alert('Lỗi', errorMessage);
    }
  };

  // Reset form
  const resetForm = () => {
    setNewTaskTitle('');
    setNewTaskDescription('');
    setNewTaskPriority('medium');
    
    const defaultDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    setNewTaskDueDate(defaultDate);
    setSelectedDay(defaultDate.getDate());
    setSelectedMonth(defaultDate.getMonth() + 1);
    setSelectedYear(defaultDate.getFullYear());
  };

  // Open modal
  const openAddTaskModal = () => {
    resetForm();
    setModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
  };

  // Cập nhật ngày từ các giá trị đã chọn
  const updateSelectedDate = () => {
    // Đảm bảo ngày hợp lệ (tháng 2 không quá 29 ngày với năm nhuận, hoặc 28 với năm không nhuận)
    let maxDay = 31;
    if (selectedMonth === 2) {
      maxDay = (selectedYear % 4 === 0 && selectedYear % 100 !== 0) || selectedYear % 400 === 0 ? 29 : 28;
    } else if ([4, 6, 9, 11].includes(selectedMonth)) {
      maxDay = 30;
    }
    
    const validDay = Math.min(selectedDay, maxDay);
    const newDate = new Date(selectedYear, selectedMonth - 1, validDay);
    setNewTaskDueDate(newDate);
  };
  
  // Cập nhật ngày khi các giá trị thay đổi
  useEffect(() => {
    updateSelectedDate();
  }, [selectedDay, selectedMonth, selectedYear]);

  // Tạo mảng các ngày, tháng, năm để hiển thị
  const getDaysInMonth = (month: number, year: number) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const days = getDaysInMonth(selectedMonth, selectedYear);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);

  // Đảm bảo mỗi item trong FlatList có key duy nhất
  const keyExtractor = (item: Task) => item._id.toString();

  // Add new task
  const addTask = async () => {
    if (newTaskTitle.trim() === '') {
      Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề công việc');
      return;
    }

    setIsSaving(true);
    // Đảm bảo ngày được định dạng đúng chuẩn YYYY-MM-DD cho API
    const formattedDate = newTaskDueDate.toISOString().split('T')[0];
    
    const newTask = {
      title: newTaskTitle,
      description: newTaskDescription || '',  // Đảm bảo không gửi undefined
      completed: false,
      priority: newTaskPriority,
      dueDate: formattedDate,
    };

    try {
      console.log('Đang gửi dữ liệu công việc mới:', newTask);
      const response = await apiCreateTask(newTask);
      
      if (response && response.data) {
        // Thêm task mới vào state với ID từ server
        const createdTaskWithId = { ...response.data }; // Giả sử response.data là task đã có _id
        console.log('Tạo công việc thành công:', createdTaskWithId);
        
        setTasks(prevTasks => [...prevTasks, createdTaskWithId]);
        closeModal();
        resetForm();
        
        // Hiển thị thông báo thành công
        Alert.alert('Thành công', 'Đã thêm công việc mới');
      }
    } catch (err: any) {
      console.error('Lỗi khi tạo công việc mới:', err);
      const errorMessage = err.response?.data?.message || 'Không thể tạo công việc mới. Vui lòng thử lại.';
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Delete task
  const deleteTask = async (id: string) => {
    try {
      await apiDeleteTask(id);
      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error('Lỗi khi xóa công việc:', err);
      Alert.alert('Lỗi', 'Không thể xóa công việc. Vui lòng thử lại.');
    }
  };

  // Priority color
  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return '#FF3B30';
      case 'medium':
        return '#FF9500';
      case 'low':
        return '#34C759';
      default:
        return '#8E8E93';
    }
  };

  // Render task item
  const renderTaskItem = ({ item }: { item: Task }) => {
    return (
      <TouchableOpacity
        style={[styles.taskItem, { backgroundColor: theme.colors.surface, borderColor: isDarkMode ? '#38383A' : '#E5E5EA' }]}
        onPress={() => navigation.navigate(ROUTES.MAIN.TASK_DETAIL, { taskId: item._id })}
        activeOpacity={0.7}
      >
        <TouchableOpacity onPress={(e) => { e.stopPropagation(); toggleTask(item._id); }} style={styles.checkbox}>
          {item.completed ? (
            <Text style={{fontSize: 24, color: theme.colors.primary}}>✓</Text>
          ) : (
            <Text style={{fontSize: 24, color: theme.colors.text}}>☐</Text>
          )}
        </TouchableOpacity>

        <View style={styles.taskContent}>
          <Text style={[styles.taskTitle, { color: theme.colors.text, textDecorationLine: item.completed ? 'line-through' : 'none' }]}>
            {item.title}
          </Text>

          {item.description ? (
            <Text style={{ color: theme.colors.text, opacity: 0.7, marginTop: 2, textDecorationLine: item.completed ? 'line-through' : 'none' }}>
              {item.description}
            </Text>
          ) : null}

          {item.dueDate ? (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Text style={{fontSize: 16, color: theme.colors.primary, marginRight: 4}}>📅</Text>
              <Text style={[styles.dueDate, { color: theme.colors.text }]}>
                {new Date(item.dueDate).toLocaleDateString('vi-VN')}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.taskActions}>
          <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor(item.priority) }]} />

          <TouchableOpacity onPress={() => deleteTask(item._id)} style={styles.deleteButton}>
            <Text style={{fontSize: 20, color: theme.colors.error}}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // Render loading state
  if (isLoading && !isRefreshing && tasks.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: SPACING.sm, color: theme.colors.text }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // Render empty state
  if (!isLoading && !error && tasks.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text style={{fontSize: 48, color: theme.colors.primary}}>📋</Text>
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          Chưa có công việc nào. Hãy thêm công việc mới!
        </Text>

        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={openAddTaskModal}
          activeOpacity={0.7}
        >
          <Text style={{fontSize: 24, color: "#FFFFFF"}}>+</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View style={styles.headerContainer}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Công việc của tôi</Text>
        </View>

        {tasks.length > 0 ? (
          <FlatList
            data={tasks}
            renderItem={renderTaskItem}
            keyExtractor={keyExtractor}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                colors={[theme.colors.primary]}
                tintColor={theme.colors.primary}
              />
            }
          />
        ) : null}

        {/* FAB để thêm công việc mới */}
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={openAddTaskModal}
          activeOpacity={0.7}
        >
          <Text style={{fontSize: 24, color: "#FFFFFF"}}>+</Text>
        </TouchableOpacity>

        {/* Modal thêm công việc mới */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalView, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Thêm công việc mới</Text>
              
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Tiêu đề *</Text>
              <TextInput
                style={[styles.modalInput, { color: theme.colors.text, borderColor: isDarkMode ? '#38383A' : '#E5E5EA' }]}
                placeholder="Nhập tiêu đề công việc"
                placeholderTextColor={isDarkMode ? '#AEAEB2' : '#8E8E93'}
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
              />
              
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Mô tả</Text>
              <TextInput
                style={[styles.modalInput, styles.textArea, { color: theme.colors.text, borderColor: isDarkMode ? '#38383A' : '#E5E5EA' }]}
                placeholder="Nhập mô tả chi tiết (tùy chọn)"
                placeholderTextColor={isDarkMode ? '#AEAEB2' : '#8E8E93'}
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
              
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Mức độ ưu tiên</Text>
              <View style={styles.priorityContainer}>
                <TouchableOpacity 
                  style={[styles.priorityButton, newTaskPriority === 'low' && styles.priorityButtonActive, newTaskPriority === 'low' && { backgroundColor: '#34C759' }]}
                  onPress={() => setNewTaskPriority('low')}
                >
                  <Text style={[styles.priorityText, newTaskPriority === 'low' && styles.priorityTextActive]}>Thấp</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.priorityButton, newTaskPriority === 'medium' && styles.priorityButtonActive, newTaskPriority === 'medium' && { backgroundColor: '#FF9500' }]}
                  onPress={() => setNewTaskPriority('medium')}
                >
                  <Text style={[styles.priorityText, newTaskPriority === 'medium' && styles.priorityTextActive]}>Trung bình</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.priorityButton, newTaskPriority === 'high' && styles.priorityButtonActive, newTaskPriority === 'high' && { backgroundColor: '#FF3B30' }]}
                  onPress={() => setNewTaskPriority('high')}
                >
                  <Text style={[styles.priorityText, newTaskPriority === 'high' && styles.priorityTextActive]}>Cao</Text>
                </TouchableOpacity>
              </View>
              
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>Ngày hạn</Text>
              <View style={styles.datePickerContainer}>
                {/* Chọn ngày */}
                <View style={styles.datePickerColumn}>
                  <Text style={[styles.datePickerLabel, { color: theme.colors.text }]}>Ngày</Text>
                  <ScrollView 
                    style={[styles.datePickerScroll, { borderColor: isDarkMode ? '#38383A' : '#E5E5EA' }]} 
                    showsVerticalScrollIndicator={false}
                  >
                    {days.map(day => (
                      <TouchableOpacity 
                        key={`day-${day}`}
                        style={[styles.datePickerItem, selectedDay === day && styles.datePickerItemSelected]}
                        onPress={() => setSelectedDay(day)}
                      >
                        <Text style={[styles.datePickerItemText, selectedDay === day && { color: theme.colors.primary, fontWeight: 'bold' }]}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                {/* Chọn tháng */}
                <View style={styles.datePickerColumn}>
                  <Text style={[styles.datePickerLabel, { color: theme.colors.text }]}>Tháng</Text>
                  <ScrollView 
                    style={[styles.datePickerScroll, { borderColor: isDarkMode ? '#38383A' : '#E5E5EA' }]} 
                    showsVerticalScrollIndicator={false}
                  >
                    {months.map(month => (
                      <TouchableOpacity 
                        key={`month-${month}`}
                        style={[styles.datePickerItem, selectedMonth === month && styles.datePickerItemSelected]}
                        onPress={() => setSelectedMonth(month)}
                      >
                        <Text style={[styles.datePickerItemText, selectedMonth === month && { color: theme.colors.primary, fontWeight: 'bold' }]}>
                          {month}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                
                {/* Chọn năm */}
                <View style={styles.datePickerColumn}>
                  <Text style={[styles.datePickerLabel, { color: theme.colors.text }]}>Năm</Text>
                  <ScrollView 
                    style={[styles.datePickerScroll, { borderColor: isDarkMode ? '#38383A' : '#E5E5EA' }]} 
                    showsVerticalScrollIndicator={false}
                  >
                    {years.map(year => (
                      <TouchableOpacity 
                        key={`year-${year}`}
                        style={[styles.datePickerItem, selectedYear === year && styles.datePickerItemSelected]}
                        onPress={() => setSelectedYear(year)}
                      >
                        <Text style={[styles.datePickerItemText, selectedYear === year && { color: theme.colors.primary, fontWeight: 'bold' }]}>
                          {year}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
              
              <View style={styles.selectedDateContainer}>
                <Text style={[styles.selectedDateText, { color: theme.colors.text }]}>
                  Ngày đã chọn: {newTaskDueDate.toLocaleDateString('vi-VN')}
                </Text>
              </View>
              
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton, { borderColor: theme.colors.primary }]}
                  onPress={closeModal}
                >
                  <Text style={{ color: theme.colors.primary }}>Hủy</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton, { backgroundColor: theme.colors.primary, opacity: isSaving ? 0.7 : 1}]}
                  onPress={addTask}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={{ color: '#FFFFFF' }}>Lưu</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  headerContainer: {
    marginBottom: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZE.h2,
    fontWeight: FONT_WEIGHT.bold,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZE.body,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  retryButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    marginTop: SPACING.md,
  },
  retryButtonText: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.semiBold,
  },
  fab: {
    position: 'absolute',
    margin: SPACING.lg,
    right: 0,
    bottom: 0,
    borderRadius: 28,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  listContainer: {
    paddingBottom: SPACING.lg,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: SPACING.sm,
  },
  checkbox: {
    marginRight: SPACING.sm,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
  },
  dueDate: {
    fontSize: FONT_SIZE.small,
    marginTop: SPACING.xs,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priorityIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.sm,
  },
  deleteButton: {
    padding: SPACING.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.body,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    width: '90%',
    borderRadius: 12,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: FONT_SIZE.h3,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: SPACING.xs,
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.body,
    marginBottom: SPACING.md,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  priorityButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  priorityButtonActive: {
    borderWidth: 0,
  },
  priorityText: {
    fontSize: FONT_SIZE.small,
  },
  priorityTextActive: {
    color: '#FFFFFF',
    fontWeight: FONT_WEIGHT.bold,
  },
  datePickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  datePickerColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  datePickerLabel: {
    fontSize: FONT_SIZE.small,
    textAlign: 'center',
    marginBottom: 4,
  },
  datePickerScroll: {
    height: 120,
    borderWidth: 1,
    borderRadius: 8,
  },
  datePickerItem: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerItemSelected: {
    backgroundColor: 'rgba(0,122,255,0.1)',
  },
  datePickerItemText: {
    fontSize: FONT_SIZE.body,
  },
  selectedDateContainer: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  selectedDateText: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  modalButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    marginRight: SPACING.sm,
    borderWidth: 1,
  },
  saveButton: {
    marginLeft: SPACING.sm,
  },
});

export default TaskManagementScreen; 