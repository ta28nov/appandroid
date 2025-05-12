import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/types';
import { ROUTES } from '../../utils/constants';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../styles/theme';
import { FONT_SIZE, FONT_WEIGHT, SPACING, SHADOW } from '../../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FAB } from 'react-native-paper';
import AIChatModal from '../../components/feature-specific/AI/AIChatModal';

// Import API services
import {
  apiGetTasks,
  apiGetNotifications,
  apiGetDocuments,
} from '../../services/api';

// Định nghĩa types cần thiết (hoặc import từ nơi khác nếu có)
interface Task {
  id: string;
  title: string;
  description?: string; // Thêm optional nếu cần
  assignedTo?: string;
  priority: string;
  completed: boolean;
  dueDate: string;
  overdue: boolean;
}

interface Document {
  id: string;
  title: string;
  description?: string;
  type: string;
  size: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  shared?: boolean;
  tags?: string[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

type HomeScreenNavigationProp = BottomTabNavigationProp<
  MainTabParamList,
  typeof ROUTES.MAIN.HOME
>;

// Hàm tạo styles động dựa trên theme
const getStyles = (theme: any, isDarkMode: boolean) => StyleSheet.create({
  containerWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background, // Sử dụng theme ở đây
  },
  scrollContentContainer: {
    paddingBottom: 80,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
    backgroundColor: theme.colors.background, // Sử dụng theme ở đây
  },
  errorText: {
    fontSize: FONT_SIZE.body,
    textAlign: 'center',
    color: theme.colors.error, // Sử dụng theme ở đây
    marginTop: SPACING.sm,
  },
  retryButton: {
    marginTop: SPACING.md,
    backgroundColor: theme.colors.primary, // Sử dụng theme ở đây
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
  },
  retryButtonText: {
    color: theme.colors.onPrimary, // Sử dụng theme ở đây
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.semiBold,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
    backgroundColor: theme.colors.surface, // Sử dụng theme ở đây
    ...SHADOW.small,
  },
  notificationBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: theme.colors.error, // Sử dụng theme ở đây
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: theme.colors.onError ?? '#FFFFFF', // Sử dụng theme, fallback về màu trắng cố định
    fontSize: 10,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: FONT_SIZE.body,
    color: theme.colors.text, // Sử dụng theme ở đây
  },
  username: {
    fontSize: FONT_SIZE.h2,
    fontWeight: FONT_WEIGHT.bold,
    marginTop: 4,
    color: theme.colors.text, // Sử dụng theme ở đây
  },
  sectionCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
    backgroundColor: theme.colors.surface, // Sử dụng theme ở đây
    ...SHADOW.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: FONT_WEIGHT.semiBold,
    color: theme.colors.text, // Sử dụng theme ở đây
  },
  viewAllText: {
      color: theme.colors.primary // Sử dụng theme ở đây
  },
  emptyStateContainer: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: FONT_SIZE.body,
    color: theme.colors.disabled, // Sử dụng theme ở đây
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  listItemBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.disabled, // Sử dụng theme ở đây
  },
  listItemDetails: {
    flex: 1,
    marginLeft: SPACING.sm,
  },
  listItemTitle: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: 2,
    color: theme.colors.text, // Sử dụng theme ở đây
  },
  listItemSubtitle: {
    fontSize: FONT_SIZE.small,
    color: theme.colors.disabled, // Sử dụng theme ở đây
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary, // Sử dụng theme ở đây
    marginLeft: SPACING.sm,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary, // Sử dụng theme ở đây
  },
  fabIcon: {
      color: theme.colors.onPrimary // Sử dụng theme ở đây
  }
});

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const styles = getStyles(theme, isDarkMode); // Tạo styles bên trong component
  
  // State for API data
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('');
  
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);

  const fetchHomeScreenData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Gọi song song các API
      const [tasksResponse, notificationsResponse, documentsResponse] = await Promise.all([
        apiGetTasks({ limit: 5, sortBy: 'dueDate:asc', status: 'pending' }),
        apiGetNotifications({ limit: 5, read: false }),
        apiGetDocuments({ limit: 3, sortBy: 'updatedAt:desc' })
      ]);

      // API functions might return array directly due to generic types <Task[]>, <Notification[]>
      // Add safety check to ensure the response is actually an array.
      // For apiGetDocuments, we assume data is in response.data as no generic was used.
      setMyTasks(Array.isArray(tasksResponse) ? tasksResponse : []);
      setRecentNotifications(Array.isArray(notificationsResponse) ? notificationsResponse : []);
      setRecentDocuments(Array.isArray(documentsResponse?.data?.data) ? documentsResponse.data.data : []); // Keep .data.data for this one as it didn't use generic

    } catch (err: any) {
      console.error('Error fetching home screen data:', err);
      // Set states to empty arrays in case of error to prevent crashes
      setMyTasks([]);
      setRecentNotifications([]);
      setRecentDocuments([]);
      setError('Không thể tải dữ liệu. Vui lòng thử lại.');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchHomeScreenData();

    const hours = new Date().getHours();
    let newGreeting = '';
    if (hours < 12) newGreeting = 'Chào buổi sáng';
    else if (hours < 18) newGreeting = 'Chào buổi chiều';
    else newGreeting = 'Chào buổi tối';
    setGreeting(newGreeting);
  }, [fetchHomeScreenData]);
  
  const handleRefresh = () => {
    fetchHomeScreenData();
  };
  
  const handleNotificationPress = () => navigation.navigate(ROUTES.MAIN.NOTIFICATIONS);
  const handleSettingsPress = () => navigation.navigate(ROUTES.MAIN.SETTINGS_NAVIGATOR, { screen: ROUTES.MAIN.SETTINGS });
  const handleTasksPress = () => navigation.navigate(ROUTES.MAIN.TASKS);
  const handleDocumentsPress = () => navigation.navigate(ROUTES.MAIN.DOCUMENTS);
  
  const openChatModal = () => setIsChatModalVisible(true);
  const closeChatModal = () => setIsChatModalVisible(false);

  const renderEmptyState = (message: string) => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateText}>{message}</Text>
    </View>
  );

  if (isLoading && !myTasks.length && !recentNotifications.length && !recentDocuments.length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ marginTop: SPACING.sm, color: theme.colors.text }}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Icon name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.containerWrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}</Text>
            <Text style={styles.username}>{user?.name || 'Người dùng'}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={handleNotificationPress}>
              <Icon name="bell-outline" size={22} color={theme.colors.text} />
              {recentNotifications.filter(n => !n.read).length > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>
                    {recentNotifications.filter(n => !n.read).length > 99 ? '99+' : recentNotifications.filter(n => !n.read).length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleSettingsPress}>
              <Icon name="cog-outline" size={22} color={theme.colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Công việc của tôi ({myTasks.length})</Text>
            <TouchableOpacity onPress={handleTasksPress}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          {myTasks.length === 0 && !isLoading && renderEmptyState('Không có công việc nào cần làm ngay.')}
          {myTasks.slice(0, 3).map((task, idx) => (
            <View key={task.id} style={[styles.listItem, idx < myTasks.slice(0, 3).length - 1 && styles.listItemBorder]}>
              <Icon
                name={task.completed ? 'checkbox-marked-circle-outline' : task.overdue ? 'alert-circle-outline' : 'clock-outline'}
                size={22}
                color={task.completed ? theme.colors.success : task.overdue ? theme.colors.error : theme.colors.secondary}
              />
              <View style={styles.listItemDetails}>
                <Text style={styles.listItemTitle} numberOfLines={1}>{task.title}</Text>
                <Text style={styles.listItemSubtitle}>
                  Hạn: {new Date(task.dueDate).toLocaleDateString('vi-VN')} - Ưu tiên: {task.priority}
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={theme.colors.disabled} />
            </View>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Thông báo gần đây ({recentNotifications.length})</Text>
            <TouchableOpacity onPress={handleNotificationPress}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          {recentNotifications.length === 0 && !isLoading && renderEmptyState('Không có thông báo mới.')}
          {recentNotifications.slice(0,3).map((item, idx) => (
             <TouchableOpacity key={item.id} onPress={() => {/* Navigate to notification detail or related screen */}}>
                <View style={[styles.listItem, idx < recentNotifications.slice(0, 3).length - 1 && styles.listItemBorder]}>
                  <Icon 
                    name={item.type === 'task' ? 'clipboard-text-outline' : item.type === 'document' ? 'file-document-outline' : 'comment-alert-outline' } 
                    size={22} 
                    color={item.read ? theme.colors.disabled : theme.colors.primary}
                  />
                  <View style={styles.listItemDetails}>
                    <Text style={[styles.listItemTitle, {fontWeight: item.read ? FONT_WEIGHT.regular : FONT_WEIGHT.bold }]} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.listItemSubtitle} numberOfLines={1}>{item.message}</Text>
                    <Text style={[styles.listItemSubtitle, {fontSize: FONT_SIZE.small}]}>{new Date(item.createdAt).toLocaleString('vi-VN')}</Text>
                  </View>
                  {!item.read && <View style={styles.unreadDot} />}
               </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tài liệu gần đây ({recentDocuments.length})</Text>
            <TouchableOpacity onPress={handleDocumentsPress}>
              <Text style={styles.viewAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          {recentDocuments.length === 0 && !isLoading && renderEmptyState('Không có tài liệu nào được cập nhật gần đây.')}
          {recentDocuments.map((doc, idx) => (
            <View key={doc.id} style={[styles.listItem, idx < recentDocuments.length - 1 && styles.listItemBorder]}>
              <Icon
                name={
                  doc.type === 'pdf' ? 'file-pdf-box' :
                  doc.type === 'doc' || doc.type === 'docx' ? 'file-word-box' :
                  doc.type === 'xls' || doc.type === 'xlsx' ? 'file-excel-box' :
                  doc.type === 'ppt' || doc.type === 'pptx' ? 'file-powerpoint-box' :
                  'file-document-outline'
                }
                size={24}
                color={theme.colors.primary}
              />
              <View style={styles.listItemDetails}>
                <Text style={styles.listItemTitle} numberOfLines={1}>{doc.title}</Text>
                <Text style={styles.listItemSubtitle}>
                  {doc.size} • Cập nhật: {new Date(doc.updatedAt).toLocaleDateString('vi-VN')}
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={theme.colors.disabled} />
            </View>
          ))}
        </View>

      </ScrollView>

      <FAB
        style={styles.fab}
        icon="robot-outline"
        color={styles.fabIcon.color}
        onPress={openChatModal}
      />
      <AIChatModal visible={isChatModalVisible} onClose={closeChatModal} />
    </View>
  );
};

export default HomeScreen;