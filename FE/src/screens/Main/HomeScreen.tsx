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
import IconComponent from '../../components/common/IconComponent';
import { FAB } from 'react-native-paper';
import AIChatModal from '../../components/feature-specific/AI/AIChatModal';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../navigation/types';

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
  read: boolean;
  createdAt: string;
  relatedEntity?: {
    entityType: string; // e.g., 'task', 'document', 'chat'
    entityId: string;
    entityName?: string; // For chat title, etc.
    chatAvatar?: string; // Specifically for chat notifications if available
  };
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
    color: theme.colors.onPrimary, 
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.semiBold,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
    backgroundColor: theme.colors.header || theme.colors.surface, // Reverted to theme color, ensures header has a background
    // borderBottomWidth: 1, // Keeping this commented as shadow provides separation
    // borderBottomColor: theme.colors.border,
    ...SHADOW.medium, 
  },
  headerLeft: {
    flex: 1,
    marginRight: SPACING.md,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
    backgroundColor: theme.colors.background, // Change to main background color
    borderWidth: 1, // Add border
    borderColor: theme.colors.border, // Use theme border color
    // ...SHADOW.small, // Shadow might be too much with a border, consider removing or adjusting
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
    color: theme.colors.textSecondary || theme.colors.text, // Use textSecondary if available, else main text
    marginBottom: SPACING.xs / 2,
    opacity: theme.colors.textSecondary ? 1 : 0.7, // Dim main text if textSecondary isn't used
  },
  username: {
    fontSize: FONT_SIZE.h1,
    fontWeight: FONT_WEIGHT.bold,
    color: theme.colors.textPrimary || theme.colors.text, // Use textPrimary if available
  },
  sectionCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 12,
    backgroundColor: theme.colors.surface, // Use surface for cards, contrasting with background
    ...SHADOW.small, // Reverted to SHADOW.small, or .medium if more emphasis desired
    borderWidth: 1,
    borderColor: theme.colors.border, // Use theme border color
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
    color: theme.colors.text, 
  },
  viewAllText: {
      color: theme.colors.primary // Reverted to theme primary color
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
    color: theme.colors.disabled, // Changed from theme.colors.placeholder to theme.colors.disabled
    marginTop: 2,
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
  const [greetingText, setGreetingText] = useState('');
  
  const [myTasks, setMyTasks] = useState<Task[]>([]);
  const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
  const [recentDocuments, setRecentDocuments] = useState<Document[]>([]);
  const [totalUnreadNotifications, setTotalUnreadNotifications] = useState(0); // For the badge
  
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // Thêm state cho RefreshControl

  const fetchHomeScreenData = useCallback(async () => {
    if (!refreshing) setIsLoading(true); // Chỉ set loading nếu không phải là refresh
    setError(null);
    try {
      const [tasksResponse, notificationsResponse, documentsResponse] = await Promise.all([
        apiGetTasks({ limit: 5, sortBy: 'dueDate', sortOrder: 'asc', completed: false }), // Lấy task chưa hoàn thành, sắp hết hạn
        apiGetNotifications({ limit: 5, read: false, page: 1 }), // Lấy 5 thông báo chưa đọc
        apiGetDocuments({ limit: 5, sortBy: 'updatedAt:desc' }) // Lấy 5 tài liệu cập nhật gần nhất
      ]);

      // Xử lý Tasks
      if (tasksResponse.data && Array.isArray(tasksResponse.data.tasks)) {
        setMyTasks(tasksResponse.data.tasks.map((task: any) => ({ 
          ...task, 
          id: task._id, // Đảm bảo trường id tồn tại
          // dueDate: task.dueDate ? new Date(task.dueDate).toLocaleDateString('vi-VN') : 'N/A' // Ví dụ định dạng ngày
        })));
      } else {
        setMyTasks([]);
        console.warn('[HomeScreen] Invalid tasks data received:', tasksResponse.data);
      }

      // Xử lý Notifications
      if (notificationsResponse.data && notificationsResponse.data.notifications && Array.isArray(notificationsResponse.data.notifications)) {
        const notificationsData = notificationsResponse.data.notifications;
        setRecentNotifications(notificationsData.map((notif: any) => ({
          id: notif._id,
          title: notif.title,
          message: notif.message,
          read: notif.read,
          createdAt: notif.createdAt,
          relatedEntity: notif.relatedEntity,
        })));
        // Use unreadCount from API for the badge if available
        if (typeof notificationsResponse.data.unreadCount === 'number') {
          setTotalUnreadNotifications(notificationsResponse.data.unreadCount);
        } else {
          // Fallback: count unread items from the fetched list (less accurate for total)
          setTotalUnreadNotifications(notificationsData.filter(n => !n.read).length);
        }
      } else {
        setRecentNotifications([]);
        setTotalUnreadNotifications(0);
        console.warn('[HomeScreen] Invalid or empty notifications data structure received:', notificationsResponse.data);
      }

      // Xử lý Documents
      // Giả sử apiGetDocuments trả về một object có key là 'documents' chứa mảng tài liệu
      // Hoặc nếu API trả về trực tiếp mảng, thì documentsResponse.data sẽ là mảng đó.
      let docsData = [];
      if (documentsResponse.data) {
        if (Array.isArray(documentsResponse.data.documents)) { // Ưu tiên .data.documents
            docsData = documentsResponse.data.documents;
        } else if (Array.isArray(documentsResponse.data)) { // Sau đó đến .data là mảng
            docsData = documentsResponse.data;
        }
      }
      
      if (docsData.length > 0) {
        setRecentDocuments(docsData.map((doc: any) => ({ 
            ...doc, 
            id: doc._id, 
            // updatedAt: new Date(doc.updatedAt).toLocaleDateString('vi-VN') 
        })));
      } else {
        setRecentDocuments([]);
        if (documentsResponse.data) { // Chỉ log nếu có data nhưng không đúng cấu trúc mong đợi
             console.warn('[HomeScreen] Invalid documents data received or empty:', documentsResponse.data);
        }
      }

    } catch (err: any) {
      console.error('Failed to fetch home screen data:', err);
      setError('Không thể tải dữ liệu cho trang chủ. Vui lòng thử lại.');
      // Set các mảng data về rỗng khi có lỗi
      setMyTasks([]);
      setRecentNotifications([]);
      setRecentDocuments([]);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  }, [refreshing]); // Thêm refreshing vào dependency array

  useEffect(() => {
    fetchHomeScreenData();
  }, [fetchHomeScreenData]);

  // Lời chào dựa trên thời gian trong ngày
  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreetingText('Chào buổi sáng');
    } else if (currentHour < 18) {
      setGreetingText('Chào buổi chiều');
    } else {
      setGreetingText('Chào buổi tối');
    }
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHomeScreenData();
  }, [fetchHomeScreenData]);

  // Navigation handlers
  const handleNotificationPress = () => {
    // Vì NOTIFICATIONS nằm trong AppStack (parent của MainTabs)
    const parentNav = navigation.getParent<StackNavigationProp<AppStackParamList>>();
    if (parentNav) {
        parentNav.navigate(ROUTES.MAIN.NOTIFICATIONS);
    } else {
        // Fallback or error log - this shouldn't typically happen from a screen within MainTabs
        console.warn("Could not get parent navigator to navigate to Notifications");
        // navigation.navigate(ROUTES.MAIN.NOTIFICATIONS as any); // Tạm thời nếu getParent phức tạp
    }
  };
  const handleSettingsPress = () => navigation.navigate(ROUTES.MAIN.SETTINGS_NAVIGATOR, { screen: ROUTES.MAIN.SETTINGS });
  const handleTasksPress = () => navigation.navigate(ROUTES.MAIN.TASKS, { screen: ROUTES.MAIN.TASKS_LIST });
  const handleDocumentsPress = () => navigation.navigate(ROUTES.MAIN.DOCUMENTS, { screen: ROUTES.MAIN.DOCUMENTS });

  const openChatModal = () => setIsChatModalVisible(true);
  const closeChatModal = () => setIsChatModalVisible(false);

  const handleSearchPress = () => {
    // Điều hướng đến màn hình tìm kiếm toàn cục
    // navigation.navigate(ROUTES.MAIN.GLOBAL_SEARCH_RESULTS, { query: '' }); // Cần AppStackParamList
    const parentNav = navigation.getParent<StackNavigationProp<AppStackParamList>>();
    if (parentNav) {
        parentNav.navigate(ROUTES.MAIN.GLOBAL_SEARCH_RESULTS, { query: '' });
    } else {
        console.warn("Could not get parent navigator to navigate to Global Search");
    }
  };

  const handleNavigateToTaskDetail = (taskId: string) => {
    navigation.navigate(ROUTES.MAIN.TASKS, { 
      screen: ROUTES.MAIN.TASK_DETAIL, 
      params: { taskId }
    });
  };

  const handleNavigateToDocumentDetail = (documentId: string, documentTitle?: string) => {
    navigation.navigate(ROUTES.MAIN.DOCUMENTS, { 
      screen: ROUTES.MAIN.DOCUMENT_DETAIL, 
      params: { documentId, documentTitle }
    });
  };

  const handleNotificationItemPress = (notification: Notification) => {
    if (notification.relatedEntity) {
      const { entityType, entityId, entityName, chatAvatar } = notification.relatedEntity;
      // const parentNav = navigation.getParent<StackNavigationProp<AppStackParamList>>(); // Not needed for this revised chat navigation

      // TODO: Consider marking notification as read here or on the detail screen
      // For example: apiMarkNotificationsRead([notification.id]);

      switch (entityType) {
        case 'task':
          handleNavigateToTaskDetail(entityId);
          break;
        case 'document':
          handleNavigateToDocumentDetail(entityId, entityName);
          break;
        case 'chat':
          // Navigate to the ChatList tab, then to the specific Chat screen
          navigation.navigate(ROUTES.MAIN.CHAT_LIST, { 
            screen: ROUTES.MAIN.CHAT, 
            params: {
              chatId: entityId,
              chatName: entityName || 'Chat',
              chatAvatar: chatAvatar || undefined,
            }
          });
          break;
        default:
          console.log('Notification pressed, unhandled entity type:', entityType);
          // Optionally navigate to a generic notification detail screen or show an alert
          // For now, just navigate to the main notifications list as a fallback
          handleNotificationPress(); 
          break;
      }
    }
  };

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
        <IconComponent name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
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
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>{greetingText}</Text>
            <Text style={styles.username} numberOfLines={1}>{user?.name || 'Người dùng'}</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={handleSearchPress}>
              <IconComponent name="magnify" size={22} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleNotificationPress}>
              <IconComponent name="bell-outline" size={22} color={theme.colors.text} />
              {totalUnreadNotifications > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>
                    {totalUnreadNotifications > 9 ? '9+' : totalUnreadNotifications}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton} onPress={handleSettingsPress}>
              <IconComponent name="cog-outline" size={22} color={theme.colors.text} />
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
            <TouchableOpacity key={task.id} onPress={() => handleNavigateToTaskDetail(task.id)}>
              <View  style={[styles.listItem, idx < myTasks.slice(0, 3).length - 1 && styles.listItemBorder]}>
                <IconComponent
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
                <IconComponent name="chevron-right" size={20} color={theme.colors.disabled} />
              </View>
            </TouchableOpacity>
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
             <TouchableOpacity key={item.id} onPress={() => handleNotificationItemPress(item)}>
                <View style={[styles.listItem, idx < recentNotifications.slice(0, 3).length - 1 && styles.listItemBorder]}>
                  <IconComponent 
                    name={
                      item.relatedEntity?.entityType === 'task' ? 'clipboard-text-outline' :
                      item.relatedEntity?.entityType === 'document' ? 'file-document-outline' :
                      item.relatedEntity?.entityType === 'chat' ? 'chat-outline' : // Added chat icon
                      'comment-alert-outline' // Fallback icon
                    } 
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
            <TouchableOpacity key={doc.id} onPress={() => handleNavigateToDocumentDetail(doc.id, doc.title)}>
              <View style={[styles.listItem, idx < recentDocuments.length - 1 && styles.listItemBorder]}>
                <IconComponent
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
                <IconComponent name="chevron-right" size={20} color={theme.colors.disabled} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>

      <FAB
        style={styles.fab}
        icon={() => <IconComponent name="robot-outline" size={24} color={styles.fabIcon.color} />}
        onPress={openChatModal}
      />
      <AIChatModal visible={isChatModalVisible} onClose={closeChatModal} />
    </View>
  );
};

export default HomeScreen;