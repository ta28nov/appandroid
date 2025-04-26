import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Task interface
interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
}

const TaskManagementScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  
  // State
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Hoàn thành báo cáo tháng', completed: false, priority: 'high', dueDate: '2025-04-20' },
    { id: '2', title: 'Họp team dự án mới', completed: false, priority: 'medium', dueDate: '2025-04-18' },
    { id: '3', title: 'Review code PR', completed: true, priority: 'medium', dueDate: '2025-04-15' },
    { id: '4', title: 'Cập nhật tài liệu API', completed: false, priority: 'low', dueDate: '2025-04-22' },
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Toggle task completion
  const toggleTask = (id: string) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Add new task
  const addTask = () => {
    if (newTaskTitle.trim() === '') return;
    
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false,
      priority: 'medium',
    };
    
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
  };

  // Delete task
  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
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
  const renderTaskItem = ({ item }: { item: Task }) => (
    <View
      style={[
        styles.taskItem,
        {
          backgroundColor: theme.colors.surface,
          borderColor: isDarkMode ? '#38383A' : '#E5E5EA',
        },
      ]}
    >
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleTask(item.id)}
      >
        <Icon
          name={item.completed ? 'checkbox-marked' : 'checkbox-blank-outline'}
          size={24}
          color={item.completed ? theme.colors.primary : (isDarkMode ? '#AEAEB2' : '#8E8E93')}
        />
      </TouchableOpacity>
      
      <View style={styles.taskContent}>
        <Text
          style={[
            styles.taskTitle,
            {
              color: theme.colors.text,
              textDecorationLine: item.completed ? 'line-through' : 'none',
              opacity: item.completed ? 0.6 : 1,
            },
          ]}
        >
          {item.title}
        </Text>
        
        {item.dueDate && (
          <Text
            style={[
              styles.dueDate,
              { color: isDarkMode ? '#AEAEB2' : '#8E8E93' },
            ]}
          >
            Hạn: {item.dueDate}
          </Text>
        )}
      </View>
      
      <View style={styles.taskActions}>
        <View
          style={[
            styles.priorityIndicator,
            { backgroundColor: getPriorityColor(item.priority) },
          ]}
        />
        
        <TouchableOpacity
          onPress={() => deleteTask(item.id)}
          style={styles.deleteButton}
        >
          <Icon
            name="delete-outline"
            size={22}
            color={isDarkMode ? '#AEAEB2' : '#8E8E93'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.colors.surface,
            borderColor: isDarkMode ? '#38383A' : '#E5E5EA',
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            { color: theme.colors.text },
          ]}
          placeholder="Thêm công việc mới..."
          placeholderTextColor={isDarkMode ? '#AEAEB2' : '#8E8E93'}
          value={newTaskTitle}
          onChangeText={setNewTaskTitle}
          onSubmitEditing={addTask}
        />
        
        <TouchableOpacity
          style={[
            styles.addButton,
            { backgroundColor: theme.colors.primary },
          ]}
          onPress={addTask}
        >
          <Icon name="plus" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          renderItem={renderTaskItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon
            name="checkbox-marked-circle-outline"
            size={50}
            color={isDarkMode ? '#AEAEB2' : '#8E8E93'}
          />
          <Text
            style={[
              styles.emptyText,
              { color: isDarkMode ? '#AEAEB2' : '#8E8E93' },
            ]}
          >
            Không có công việc nào. Thêm công việc mới!
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZE.body,
  },
  addButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default TaskManagementScreen; 