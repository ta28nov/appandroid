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
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { COLORS } from '../../styles/theme';
import { FONT_SIZE, FONT_WEIGHT, SPACING, SHADOW } from '../../styles/globalStyles';
import { Snackbar, Provider as PaperProvider, Button } from 'react-native-paper';
import { apiGetNotifications, apiMarkNotificationsRead, apiMarkAllNotificationsRead, apiDeleteAllNotifications, apiDeleteNotification } from '../../services/api';
import AdvancedSearchBar from '../../components/common/AdvancedSearchBar';
import AnimatedButton from '../../components/common/AnimatedButton';
import EmptyStateComponent from '../../components/common/EmptyStateComponent';

// Interface cho dữ liệu thông báo
interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
  relatedEntity?: {
    entityType: string;
    entityId: string;
  };
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

const NOTIFICATIONS_PER_PAGE = 20; // Số lượng thông báo mỗi lần tải

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
  const [loadingMore, setLoadingMore] = useState(false); // State cho việc tải thêm
  const [page, setPage] = useState(1); // State cho trang hiện tại
  const [hasMore, setHasMore] = useState(true); // State kiểm tra còn dữ liệu để tải không
  const [initialLoadComplete, setInitialLoadComplete] = useState(false); // State mới theo dõi tải lần đầu
  const [snackbar, setSnackbar] = useState<{ visible: boolean; message: string; type?: 'error' | 'success' }>({ visible: false, message: '' });
  
  const fetchNotifications = async (isRefreshing = false, isLoadMore = false) => {
    console.log('[NotificationScreen] fetchNotifications called. isRefreshing:', isRefreshing, 'isLoadMore:', isLoadMore, 'currentPage:', page);
    let currentLoadingState = true;
    if (isLoadMore) {
      setLoadingMore(true);
      currentLoadingState = false; // Không set setLoading(true) khi load more
    } else {
      setLoading(true);
      setPage(1); 
      setHasMore(true); 
      if (!isRefreshing) {
        setInitialLoadComplete(false); // Reset khi fetch mới hoàn toàn (không phải refresh)
      }
    }

    try {
      const currentPage = isLoadMore ? page + 1 : 1;
      const res = await apiGetNotifications({ limit: NOTIFICATIONS_PER_PAGE, page: currentPage });
      console.log('[NotificationScreen] API Response:', JSON.stringify(res.data, null, 2)); // Log chi tiết res.data
      const newNotifications = Array.isArray(res.data)
        ? res.data
        : (res.data && typeof res.data === 'object' && Array.isArray((res.data as any).notifications)
          ? (res.data as any).notifications
          : []);
      console.log('[NotificationScreen] newNotifications:', newNotifications);
      
      if (isLoadMore) {
        setNotifications(prev => [...prev, ...newNotifications]);
        setPage(currentPage);
      } else {
        setNotifications(newNotifications);
        // filterNotifications() sẽ được gọi bởi useEffect khi notifications thay đổi
      }
      
      if (newNotifications.length < NOTIFICATIONS_PER_PAGE) {
        setHasMore(false);
      }
      // Quan trọng: Đảm bảo filterNotifications được gọi sau khi notifications CÓ THỂ đã được cập nhật
      // và setLoading(false) được gọi sau cùng.

    } catch (error) {
      console.error("Error fetching notifications:", error); // Log lỗi ra console
      setSnackbar({ visible: true, message: 'Lỗi khi tải thông báo. Vui lòng thử lại.', type: 'error' });
      if (!isLoadMore) { 
        setNotifications([]); // Reset notifications nếu fetch đầu lỗi
      }
      setHasMore(false); // Dừng load more nếu có lỗi
    } finally {
      if (isLoadMore) {
        setLoadingMore(false);
      } else {
        setLoading(false); // setLoading(false) ở đây
        setInitialLoadComplete(true); // Đánh dấu tải lần đầu hoàn tất
        console.log('[NotificationScreen] Initial load complete. initialLoadComplete:', true);
      }
      if (isRefreshing) {
        setRefreshing(false);
      }
    }
  };
  
  useEffect(() => {
    fetchNotifications(); // Gọi fetch lần đầu
  }, []);
  
  // Lọc thông báo khi thay đổi loại, truy vấn tìm kiếm, hoặc khi notifications được cập nhật SAU KHI tải lần đầu hoàn tất
  useEffect(() => {
    if (initialLoadComplete) { // Chỉ filter khi tải lần đầu đã xong
      console.log('[NotificationScreen] useEffect for filter. Dependencies:');
      console.log('  selectedType:', selectedType);
      console.log('  searchQuery:', searchQuery);
      console.log('  notifications count:', notifications.length);
      console.log('  initialLoadComplete:', initialLoadComplete);
      filterNotifications();
    }
  }, [selectedType, searchQuery, notifications, initialLoadComplete]);
  
  // Hàm lọc thông báo
  const filterNotifications = () => {
    console.log('[NotificationScreen] filterNotifications called. notifications count:', notifications.length);
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
    console.log('[NotificationScreen] filteredNotifications count:', filtered.length);
  };
  
  // Xử lý khi nhấn vào thông báo
  const handleNotificationPress = async (notification: Notification) => {
    // Đánh dấu đã đọc nếu chưa đọc
    if (!notification.read) {
      try {
        await apiMarkNotificationsRead([notification._id]);
        setNotifications(prev => prev.map(n => n._id === notification._id ? {...n, read: true} : n));
      } catch (error) {
        setSnackbar({ visible: true, message: 'Không thể đánh dấu đã đọc', type: 'error' });
      }
    }

    // Điều hướng dựa trên relatedEntity
    if (notification.relatedEntity) {
      const { entityType, entityId } = notification.relatedEntity;
      switch (entityType) {
        case 'task':
          Alert.alert("Điều hướng", `Đến chi tiết Task ID: ${entityId}`);
          break;
        case 'chat':
          Alert.alert("Điều hướng", `Đến Chat ID: ${entityId}`);
          break;
        case 'post':
          Alert.alert("Điều hướng", `Đến Bài viết ID: ${entityId}`);
          break;
        case 'project':
          Alert.alert("Điều hướng", `Đến Dự án ID: ${entityId}`);
          break;
        case 'document':
          Alert.alert("Điều hướng", `Đến Tài liệu ID: ${entityId}`);
          break;
        default:
          console.log(`Không có xử lý điều hướng cho entityType: ${entityType}`);
          break;
      }
    }
  };
  
  // Đánh dấu tất cả thông báo đã đọc
  const handleMarkAllAsRead = async () => {
    try {
      await apiMarkAllNotificationsRead();
      setSnackbar({ visible: true, message: 'Đã đánh dấu tất cả đã đọc', type: 'success' });
      fetchNotifications(false); // Fetch lại trang đầu
    } catch (error) {
      setSnackbar({ visible: true, message: 'Không thể đánh dấu tất cả đã đọc', type: 'error' });
    }
  };
  
  // Xóa tất cả thông báo
  const handleClearAll = async () => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa tất cả thông báo không? Hành động này không thể hoàn tác.",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa tất cả", style: "destructive", onPress: async () => {
            try {
              await apiDeleteAllNotifications();
              setSnackbar({ visible: true, message: 'Đã xóa tất cả thông báo', type: 'success' });
              fetchNotifications(false); // Fetch lại trang đầu
            } catch (error) {
              setSnackbar({ visible: true, message: 'Không thể xóa tất cả thông báo', type: 'error' });
            }
          }
        }
      ]
    );
  };

  const handleDeleteOneNotification = async (notificationId: string) => {
    Alert.alert(
      "Xác nhận xóa",
      "Bạn có chắc chắn muốn xóa thông báo này không?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", style: "destructive", onPress: async () => {
            try {
              await apiDeleteNotification(notificationId);
              setNotifications(prev => prev.filter(n => n._id !== notificationId));
              setSnackbar({ visible: true, message: 'Đã xóa thông báo', type: 'success' });
            } catch (error) {
              setSnackbar({ visible: true, message: 'Không thể xóa thông báo', type: 'error' });
            }
          }
        }
      ]
    );
  };
  
  // Xử lý refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications(true); // isRefreshing = true
  };

  const handleLoadMore = () => {
    if (hasMore && !loadingMore && !loading) { // Chỉ load more khi có thêm dữ liệu và không đang loading
      fetchNotifications(false, true); // isLoadMore = true
    }
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
      
      <View style={styles.itemActionsContainer}>
        {!item.read && <View style={[styles.unreadIndicator, { backgroundColor: theme.colors.primary }]} />}
        <TouchableOpacity onPress={() => handleDeleteOneNotification(item._id)} style={styles.deleteButton}>
            <Icon name="trash-can-outline" size={22} color={theme.colors.error} />
        </TouchableOpacity>
      </View>
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
    // Ưu tiên hiển thị loading nếu setLoading(true) đang active (kể cả khi initialLoadComplete chưa xong hẳn)
    console.log('[NotificationScreen] renderEmptyState called.');
    console.log('  loading:', loading, 'initialLoadComplete:', initialLoadComplete, 'filteredNotifications.length:', filteredNotifications.length);

    if (loading && !initialLoadComplete) { // Chỉ hiển thị loading chính khi đang fetch lần đầu tiên
      console.log('[NotificationScreen] renderEmptyState: Showing initial loading indicator.');
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
            Đang tải thông báo...
          </Text>
        </View>
      );
    }
    // Nếu không phải loading lần đầu, và list rỗng, thì hiển thị empty state bình thường
    if (initialLoadComplete && filteredNotifications.length === 0) {
        console.log('[NotificationScreen] renderEmptyState: Showing empty state component.');
        return (
            <EmptyStateComponent
                title="Không có thông báo nào"
                message={
                selectedType !== 'all'
                    ? `Bạn không có thông báo nào thuộc loại ${notificationTypes.find(t => t.id === selectedType)?.label || ''
                    }`
                    : searchQuery
                    ? `Không tìm thấy thông báo nào khớp với "${searchQuery}"`
                    : 'Bạn hiện chưa có thông báo nào.' // Thông báo chung hơn khi không có filter
                }
                icon={<Icon name="bell-off-outline" size={50} color={theme.colors.placeholder} />}
            />
        );
    }
    return null; // Không hiển thị gì nếu có dữ liệu hoặc đang loading ngầm (load more)
  };
  
  const renderListFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  };

  return (
    <PaperProvider>
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
        {(notifications.length > 0 || loading) && !searchQuery && ( // Chỉ hiển thị khi có thông báo hoặc đang tải và không có query search
          <View style={styles.actionsContainer}>
            <AnimatedButton
              title="Đánh dấu tất cả đã đọc"
              onPress={handleMarkAllAsRead}
              variant="text"
              style={styles.actionButton}
              textStyle={{ fontSize: FONT_SIZE.small, color: theme.colors.primary }}
            />
            <AnimatedButton
              title="Xóa tất cả"
              onPress={handleClearAll}
              variant="text"
              style={styles.actionButton}
              textStyle={{ fontSize: FONT_SIZE.small, color: theme.colors.error }}
            />
          </View>
        )}
        
        {/* Danh sách thông báo */}
        <FlatList
          data={filteredNotifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={
            // Hiển thị listContentEmpty khi initialLoadComplete và không có filteredNotifications
            initialLoadComplete && filteredNotifications.length === 0
              ? styles.listContentEmpty
              : styles.listContent
          }
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[theme.colors.primary]}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={renderEmptyState} // renderEmptyState sẽ tự xử lý loading và empty
          ListFooterComponent={renderListFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
        <Snackbar
          visible={snackbar.visible}
          onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
          duration={2500}
          style={{ backgroundColor: snackbar.type === 'error' ? '#D32F2F' : theme.colors.primary }}
        >
          {snackbar.message}
        </Snackbar>
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  filterContainer: {
    paddingVertical: SPACING.sm, // Thêm padding dọc
    // paddingHorizontal: SPACING.md, // Bỏ nếu scrollview đã có contentContainerStyle
    // marginBottom: SPACING.sm, // Bỏ nếu actionsContainer đã có
  },
  filterScrollContent: {
    paddingHorizontal: SPACING.md, // Đảm bảo có padding cho scrollview
  },
  filterButton: {
    paddingHorizontal: SPACING.lg, // Tăng padding cho dễ nhấn hơn
    paddingVertical: SPACING.sm - 2,
    borderRadius: 20,
    marginRight: SPACING.sm,
    borderWidth: 1, // Thêm viền nhẹ
    borderColor: 'transparent', // Viền trong suốt ban đầu
  },
  filterButtonText: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs, // Giảm padding dọc một chút
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  actionButton: {
    paddingHorizontal: 0, 
    paddingVertical: SPACING.xs,
  },
  listContent: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md, // Để có không gian cho footer loader
    // paddingTop: 0, // Bỏ nếu không cần
    flexGrow: 1,
  },
  listContentEmpty: { // Style riêng cho content container khi list rỗng
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    // backgroundColor: // sẽ được set inline dựa trên item.read
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
    justifyContent: 'center', // Căn giữa nội dung nếu chiều cao item lớn hơn
  },
  notificationTitle: {
    fontSize: FONT_SIZE.subtitle, // Tăng kích thước title
    // fontWeight sẽ được set inline
    marginBottom: SPACING.xs / 2,
  },
  notificationMessage: {
    fontSize: FONT_SIZE.body,
    marginBottom: SPACING.xs,
    lineHeight: FONT_SIZE.body * 1.4, // Cải thiện đọc cho message dài
  },
  notificationTime: {
    fontSize: FONT_SIZE.small, // Tăng nhẹ kích thước time
  },
  itemActionsContainer: { // Container cho unreadIndicator và nút xóa
    flexDirection: 'column',
    alignItems: 'flex-end',
    justifyContent: 'space-between', // Đẩy unread lên trên, nút xóa xuống dưới (nếu muốn) hoặc 'center'
    marginLeft: SPACING.sm,
  },
  unreadIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    // alignSelf: 'flex-start', // Bỏ nếu đã trong itemActionsContainer
    // marginTop: 8, // Bỏ
  },
  deleteButton: {
    padding: SPACING.xs / 2, // Tạo vùng chạm nhỏ cho nút xóa
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
    textAlign: 'center', // Căn giữa text cho đẹp hơn
    paddingHorizontal: SPACING.lg, // Thêm padding ngang cho text dài
  },
  footerLoader: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
  }
});

export default NotificationScreen;