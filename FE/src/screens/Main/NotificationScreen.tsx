import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import { COLORS } from '../../styles/theme';
import { FONT_SIZE, FONT_WEIGHT, SPACING, SHADOW } from '../../styles/globalStyles';
import { mockNotifications } from '../../utils/mockData';
import AdvancedSearchBar from '../../components/common/AdvancedSearchBar';
import AnimatedButton from '../../components/common/AnimatedButton';
import EmptyStateComponent from '../../components/common/EmptyStateComponent';

// Interface cho dữ liệu thông báo
interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

// Định nghĩa các loại thông báo
const notificationTypes = [
  { id: 'all', label: 'Tất cả' },
  { id: 'reminder', label: 'Nhắc nhở' },
  { id: 'comment', label: 'Bình luận' },
  { id: 'task', label: 'Công việc' },
  { id: 'document', label: 'Tài liệu' },
  { id: 'message', label: 'Tin nhắn' },
];

const NotificationScreen: React.FC = () => {
  const navigation = useNavigation();
  const { theme, isDarkMode } = useTheme();
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  
  // State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Lấy dữ liệu thông báo
  useEffect(() => {
    // Giả lập việc gọi API để lấy dữ liệu
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        // Trong môi trường thực tế, đây sẽ là một cuộc gọi API
        // Giả lập độ trễ mạng
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Lấy dữ liệu từ mockData và đổi tên trường 'time' thành 'createdAt'
        const adaptedNotifications = mockNotifications.map(notif => ({
          ...notif,
          createdAt: notif.time // Rename 'time' to 'createdAt'
        }));
        
        setNotifications(adaptedNotifications);
        setFilteredNotifications(adaptedNotifications);
      } catch (error) {
        console.error('Lỗi khi tải thông báo:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNotifications();
  }, []);
  
  // Lọc thông báo khi thay đổi loại hoặc truy vấn tìm kiếm
  useEffect(() => {
    filterNotifications();
  }, [selectedType, searchQuery, notifications]);
  
  // Hàm lọc thông báo
  const filterNotifications = () => {
    let filtered = [...notifications];
    
    // Lọc theo loại
    if (selectedType !== 'all') {
      filtered = filtered.filter(notification => notification.type === selectedType);
    }
    
    // Lọc theo từ khóa tìm kiếm
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        notification =>
          notification.title.toLowerCase().includes(query) ||
          notification.message.toLowerCase().includes(query)
      );
    }
    
    setFilteredNotifications(filtered);
  };
  
  // Xử lý khi nhấn vào thông báo
  const handleNotificationPress = (notification: Notification) => {
    // Đánh dấu thông báo đã đọc
    setNotifications(prev =>
      prev.map(item =>
        item.id === notification.id ? { ...item, read: true } : item
      )
    );
    
    // Điều hướng dựa trên loại thông báo
    switch (notification.type) {
      case 'task':
        // navigation.navigate('Tasks');
        break;
      case 'document':
        // navigation.navigate('Documents');
        break;
      case 'comment':
        // navigation.navigate('Comments');
        break;
      case 'message':
        // navigation.navigate('Chat');
        break;
      case 'reminder':
        // navigation.navigate('Calendar');
        break;
      default:
        break;
    }
  };
  
  // Đánh dấu tất cả thông báo đã đọc
  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev.map(item => ({ ...item, read: true }))
    );
  };
  
  // Xóa tất cả thông báo
  const handleClearAll = () => {
    setNotifications([]);
    setFilteredNotifications([]);
  };
  
  // Xử lý refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    
    // Giả lập việc làm mới dữ liệu
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Trong môi trường thực tế, đây sẽ là một cuộc gọi API để lấy dữ liệu mới
    const refreshedAdaptedNotifications = mockNotifications.map(notif => ({
      ...notif,
      createdAt: notif.time // Rename 'time' to 'createdAt'
    }));
    setNotifications(refreshedAdaptedNotifications);
    setFilteredNotifications(refreshedAdaptedNotifications);
    
    setRefreshing(false);
  };
  
  // Lấy biểu tượng dựa trên loại thông báo
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return 'bell-outline';
      case 'comment':
        return 'comment-text-outline';
      case 'task':
        return 'checkbox-marked-outline';
      case 'document':
        return 'file-document-outline';
      case 'message':
        return 'message-text-outline';
      default:
        return 'bell-outline';
    }
  };
  
  // Lấy màu sắc dựa trên loại thông báo
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'reminder':
        return colors.warning;
      case 'comment':
        return colors.info;
      case 'task':
        return colors.success;
      case 'document':
        return colors.primary;
      case 'message':
        return colors.secondary;
      default:
        return colors.primary;
    }
  };
  
  // Định dạng thời gian
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) {
      return 'Vừa xong';
    } else if (diffMins < 60) {
      return `${diffMins} phút trước`;
    } else if (diffHours < 24) {
      return `${diffHours} giờ trước`;
    } else if (diffDays < 7) {
      return `${diffDays} ngày trước`;
    } else {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
  };
  
  // Render mỗi mục thông báo
  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        {
          backgroundColor: item.read ? theme.colors.surface : `${theme.colors.surface}DD`,
        },
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View
        style={[
          styles.notificationIconContainer,
          { backgroundColor: `${getNotificationColor(item.type)}20` },
        ]}
      >
        <Icon
          name={getNotificationIcon(item.type)}
          size={24}
          color={getNotificationColor(item.type)}
        />
      </View>
      
      <View style={styles.notificationContent}>
        <Text
          style={[
            styles.notificationTitle,
            {
              color: theme.colors.text,
              fontWeight: item.read ? FONT_WEIGHT.medium : FONT_WEIGHT.bold,
            },
          ]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        
        <Text
          style={[styles.notificationMessage, { color: colors.text.secondary }]}
          numberOfLines={2}
        >
          {item.message}
        </Text>
        
        <Text style={[styles.notificationTime, { color: colors.text.secondary }]}>
          {formatTime(item.createdAt)}
        </Text>
      </View>
      
      {!item.read && <View style={[styles.unreadIndicator, { backgroundColor: theme.colors.primary }]} />}
    </TouchableOpacity>
  );
  
  // Render thanh lọc thông báo
  const renderFilterBar = () => (
    <View style={styles.filterContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScrollContent}
      >
        {notificationTypes.map(type => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.filterButton,
              {
                backgroundColor:
                  selectedType === type.id
                    ? theme.colors.primary
                    : isDarkMode
                    ? 'rgba(255, 255, 255, 0.1)'
                    : 'rgba(0, 0, 0, 0.05)',
              },
            ]}
            onPress={() => setSelectedType(type.id)}
          >
            <Text
              style={[
                styles.filterButtonText,
                {
                  color:
                    selectedType === type.id
                      ? '#FFFFFF'
                      : theme.colors.text,
                },
              ]}
            >
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
  
  // Render trạng thái rỗng khi không có thông báo
  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
            Đang tải thông báo...
          </Text>
        </View>
      );
    }
    
    return (
      <EmptyStateComponent
        title="Không có thông báo nào"
        message={
          selectedType !== 'all'
            ? `Bạn không có thông báo nào thuộc loại ${
                notificationTypes.find(t => t.id === selectedType)?.label || ''
              }`
            : searchQuery
            ? `Không tìm thấy thông báo nào khớp với "${searchQuery}"`
            : 'Bạn đã xem tất cả thông báo của mình'
        }
        icon={
          <Icon
            name="bell-off-outline"
            size={50}
            color={theme.colors.primary}
          />
        }
      />
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBarContainer}>
        <AdvancedSearchBar
          placeholder="Tìm kiếm thông báo..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          showFilterButton={false}
        />
      </View>
      
      {/* Thanh lọc theo loại thông báo */}
      {renderFilterBar()}
      
      {/* Phần đầu với các nút hành động */}
      {filteredNotifications.length > 0 && (
        <View style={styles.actionsContainer}>
          <AnimatedButton
            title="Đánh dấu tất cả đã đọc"
            onPress={handleMarkAllAsRead}
            variant="text"
            style={styles.actionButton}
          />
          <AnimatedButton
            title="Xóa tất cả"
            onPress={handleClearAll}
            variant="text"
            style={styles.actionButton}
          />
        </View>
      )}
      
      {/* Danh sách thông báo */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  filterContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  filterScrollContent: {
    paddingRight: SPACING.md,
  },
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginRight: SPACING.sm,
  },
  filterButtonText: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  actionButton: {
    paddingHorizontal: 0,
  },
  listContent: {
    padding: SPACING.md,
    paddingTop: 0,
    flexGrow: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    ...SHADOW.small,
  },
  notificationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: FONT_SIZE.button,
    marginBottom: 2,
  },
  notificationMessage: {
    fontSize: FONT_SIZE.body,
    marginBottom: 6,
  },
  notificationTime: {
    fontSize: FONT_SIZE.caption,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.body,
  },
});

export default NotificationScreen; 