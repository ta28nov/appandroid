import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../../styles/globalStyles';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import EmptyStateComponent from '../../../components/common/EmptyStateComponent';
import NetworkStatusIndicator from '../../../components/common/NetworkStatusIndicator';

// Interface định nghĩa dữ liệu cho thay đổi đang chờ đồng bộ
interface PendingChange {
  id: string;
  type: 'create' | 'update' | 'delete';
  entityType: 'task' | 'document' | 'message' | 'comment' | 'profile';
  entityId: string;
  entityName: string;
  timestamp: string;
  conflicted?: boolean;
}

const PendingSyncScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  
  // State
  const [pendingChanges, setPendingChanges] = useState<PendingChange[]>([]);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'connecting' | 'syncing'>('offline');
  const [loading, setLoading] = useState(true);
  
  // Tải dữ liệu mẫu
  useEffect(() => {
    // Giả lập việc tải dữ liệu
    setLoading(true);
    setTimeout(() => {
      // Dữ liệu mẫu
      setPendingChanges([
        {
          id: '1',
          type: 'create',
          entityType: 'task',
          entityId: 'task123',
          entityName: 'Chuẩn bị tài liệu họp',
          timestamp: '15:30, 10/07/2023',
        },
        {
          id: '2',
          type: 'update',
          entityType: 'document',
          entityId: 'doc456',
          entityName: 'Báo cáo tài chính Q2',
          timestamp: '14:45, 10/07/2023',
          conflicted: true,
        },
        {
          id: '3',
          type: 'delete',
          entityType: 'comment',
          entityId: 'cmt789',
          entityName: 'Bình luận về tiến độ dự án',
          timestamp: '13:20, 10/07/2023',
        },
        {
          id: '4',
          type: 'update',
          entityType: 'profile',
          entityId: 'user001',
          entityName: 'Thông tin cá nhân',
          timestamp: '10:15, 10/07/2023',
        },
        {
          id: '5',
          type: 'create',
          entityType: 'message',
          entityId: 'msg567',
          entityName: 'Tin nhắn cho Nguyễn Văn A',
          timestamp: '09:30, 10/07/2023',
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Xử lý khi nhấn vào nút đồng bộ
  const handleSync = () => {
    if (networkStatus === 'offline') {
      Alert.alert(
        'Không có kết nối',
        'Bạn đang ở chế độ ngoại tuyến. Vui lòng kết nối mạng để đồng bộ dữ liệu.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    // Giả lập quá trình đồng bộ
    setNetworkStatus('syncing');
    
    setTimeout(() => {
      setPendingChanges([]);
      setNetworkStatus('online');
      
      Alert.alert(
        'Đồng bộ thành công',
        'Tất cả dữ liệu đã được đồng bộ thành công.',
        [{ text: 'OK' }]
      );
    }, 2000);
  };
  
  // Xử lý khi nhấn vào một mục thay đổi
  const handleItemPress = (item: PendingChange) => {
    // Trong ứng dụng thực, có thể mở chi tiết thay đổi hoặc thực thể
    Alert.alert(
      'Chi tiết thay đổi',
      `Loại: ${item.type}\nĐối tượng: ${item.entityType}\nTên: ${item.entityName}\nThời gian: ${item.timestamp}`,
      [{ text: 'OK' }]
    );
  };
  
  // Xử lý khi giải quyết xung đột
  const handleResolveConflict = (item: PendingChange) => {
    Alert.alert(
      'Giải quyết xung đột',
      'Chọn phiên bản bạn muốn giữ lại:',
      [
        { text: 'Phiên bản thiết bị', onPress: () => console.log('Chọn phiên bản thiết bị') },
        { text: 'Phiên bản máy chủ', onPress: () => console.log('Chọn phiên bản máy chủ') },
        { text: 'Hủy', style: 'cancel' },
      ]
    );
  };
  
  // Lấy icon cho loại thay đổi
  const getChangeTypeIcon = (type: PendingChange['type']): string => {
    switch (type) {
      case 'create':
        return 'plus-circle-outline';
      case 'update':
        return 'pencil-outline';
      case 'delete':
        return 'delete-outline';
      default:
        return 'alert-circle-outline';
    }
  };
  
  // Lấy màu cho loại thay đổi
  const getChangeTypeColor = (type: PendingChange['type']): string => {
    switch (type) {
      case 'create':
        return theme.colors.success;
      case 'update':
        return theme.colors.info || theme.colors.primary;
      case 'delete':
        return theme.colors.error;
      default:
        return theme.colors.warning;
    }
  };
  
  // Lấy icon cho loại đối tượng
  const getEntityTypeIcon = (type: PendingChange['entityType']): string => {
    switch (type) {
      case 'task':
        return 'checkbox-marked-outline';
      case 'document':
        return 'file-document-outline';
      case 'message':
        return 'message-text-outline';
      case 'comment':
        return 'comment-outline';
      case 'profile':
        return 'account-outline';
      default:
        return 'help-circle-outline';
    }
  };
  
  // Render từng mục thay đổi
  const renderItem = ({ item }: { item: PendingChange }) => (
    <Card
      style={styles.card}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.cardContent}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${getChangeTypeColor(item.type)}20` },
          ]}
        >
          <Icon
            name={getChangeTypeIcon(item.type)}
            size={24}
            color={getChangeTypeColor(item.type)}
          />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={[styles.entityType, { color: theme.colors.text }]}>
              <Icon
                name={getEntityTypeIcon(item.entityType)}
                size={16}
                color={theme.colors.text}
              />{' '}
              {item.entityType.charAt(0).toUpperCase() + item.entityType.slice(1)}
            </Text>
            
            <Text style={[styles.timestamp, { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' }]}>
              {item.timestamp}
            </Text>
          </View>
          
          <Text style={[styles.entityName, { color: theme.colors.text }]}>
            {item.entityName}
          </Text>
          
          <View style={styles.footerRow}>
            <Text
              style={[
                styles.changeTypeText,
                { color: getChangeTypeColor(item.type) },
              ]}
            >
              {item.type === 'create'
                ? 'Đã tạo mới'
                : item.type === 'update'
                ? 'Đã cập nhật'
                : 'Đã xóa'}
            </Text>
            
            {item.conflicted && (
              <TouchableOpacity
                style={[
                  styles.conflictButton,
                  { backgroundColor: `${theme.colors.warning}20` },
                ]}
                onPress={() => handleResolveConflict(item)}
              >
                <Icon name="alert" size={14} color={theme.colors.warning} />
                <Text
                  style={[
                    styles.conflictText,
                    { color: theme.colors.warning },
                  ]}
                >
                  Xung đột
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
  
  // Render trạng thái rỗng
  const renderEmptyState = () => (
    <EmptyStateComponent
      title="Không có thay đổi đang chờ"
      message="Tất cả dữ liệu của bạn đã được đồng bộ."
      icon={<Icon name="check-circle-outline" size={50} color={theme.colors.success} />}
    />
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Thanh trạng thái mạng */}
      <View style={[styles.statusBar, { backgroundColor: theme.colors.surface }]}>
        <NetworkStatusIndicator
          status={networkStatus}
          pendingSyncCount={pendingChanges.length}
        />
        
        <Button
          title="Đồng bộ ngay"
          onPress={handleSync}
          disabled={networkStatus === 'syncing' || pendingChanges.length === 0}
          icon={<Icon name="sync" size={18} color="#FFFFFF" />}
          iconPosition="left"
          size="small"
        />
      </View>
      
      {/* Danh sách thay đổi */}
      <FlatList
        data={pendingChanges}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  listContent: {
    padding: SPACING.md,
    flexGrow: 1,
  },
  card: {
    marginBottom: SPACING.sm,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  entityType: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.medium,
  },
  timestamp: {
    fontSize: FONT_SIZE.caption,
  },
  entityName: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: 4,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeTypeText: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.medium,
  },
  conflictButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: SPACING.sm,
  },
  conflictText: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.medium,
    marginLeft: 2,
  },
});

export default PendingSyncScreen; 