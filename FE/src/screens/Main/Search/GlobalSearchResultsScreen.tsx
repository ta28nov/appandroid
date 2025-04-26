import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SectionList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../../styles/globalStyles';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AdvancedSearchBar from '../../../components/common/AdvancedSearchBar';
import EmptyStateComponent from '../../../components/common/EmptyStateComponent';
import { mockTasks, mockDocuments } from '../../../utils/mockData';

// Định nghĩa các loại kết quả tìm kiếm
type SearchResultType = 'task' | 'document' | 'user' | 'message' | 'forum';

// Interface cho kết quả tìm kiếm
interface SearchResult {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  type: SearchResultType;
  timestamp?: string;
  avatar?: string;
  icon?: string;
  iconColor?: string;
}

// Định nghĩa kiểu dữ liệu cho params
type SearchParamList = {
  GlobalSearchResults: {
    query: string;
  };
};

/**
 * Màn hình hiển thị kết quả tìm kiếm toàn cục
 */
const GlobalSearchResultsScreen: React.FC = () => {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const route = useRoute<RouteProp<SearchParamList, 'GlobalSearchResults'>>();
  const { theme, isDarkMode } = useTheme();
  
  // State
  const [searchQuery, setSearchQuery] = useState(route.params?.query || '');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ title: string; data: SearchResult[] }[]>([]);
  
  // Lọc kết quả khi query thay đổi
  useEffect(() => {
    if (searchQuery) {
      performSearch(searchQuery);
    } else {
      setResults([]);
    }
  }, [searchQuery]);
  
  // Thực hiện tìm kiếm
  const performSearch = (query: string) => {
    setLoading(true);
    
    // Giả lập độ trễ mạng
    setTimeout(() => {
      const filteredResults = getSearchResults(query);
      setResults(filteredResults);
      setLoading(false);
    }, 800);
  };
  
  // Lấy kết quả tìm kiếm dựa trên query
  const getSearchResults = (query: string): { title: string; data: SearchResult[] }[] => {
    const lowercaseQuery = query.toLowerCase();
    
    // Tìm kiếm trong nhiệm vụ
    const taskResults = mockTasks
      .filter(
        task =>
          task.title.toLowerCase().includes(lowercaseQuery) ||
          task.description.toLowerCase().includes(lowercaseQuery)
      )
      .map(task => ({
        id: task.id,
        title: task.title,
        subtitle: task.completed ? 'Hoàn thành' : task.overdue ? 'Quá hạn' : 'Đang thực hiện',
        description: task.description,
        type: 'task' as SearchResultType,
        timestamp: task.dueDate,
        icon: 'checkbox-marked-outline',
        iconColor: task.priority === 'High' ? '#F44336' : task.priority === 'Medium' ? '#FF9800' : '#4CAF50',
      }));
    
    // Tìm kiếm trong tài liệu
    const documentResults = mockDocuments
      .filter(
        doc =>
          doc.title.toLowerCase().includes(lowercaseQuery) ||
          doc.description.toLowerCase().includes(lowercaseQuery) ||
          doc.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      )
      .map(doc => ({
        id: doc.id,
        title: doc.title,
        subtitle: doc.type.split('/').pop()?.toUpperCase(),
        description: doc.description,
        type: 'document' as SearchResultType,
        timestamp: doc.updatedAt,
        icon: 'file-document-outline',
        iconColor: '#2196F3',
      }));
    
    // Tìm kiếm trong người dùng (mẫu)
    const userResults: SearchResult[] = [
      {
        id: 'user1',
        title: 'Nguyễn Văn A',
        subtitle: 'Quản lý dự án',
        type: 'user' as SearchResultType,
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      {
        id: 'user2',
        title: 'Trần Thị B',
        subtitle: 'Thiết kế UI/UX',
        type: 'user' as SearchResultType,
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
    ].filter(user => user.title.toLowerCase().includes(lowercaseQuery) || user.subtitle?.toLowerCase().includes(lowercaseQuery));
    
    // Tìm kiếm trong tin nhắn (mẫu)
    const messageResults: SearchResult[] = [
      {
        id: 'msg1',
        title: 'Dự án mới',
        subtitle: 'Nguyễn Văn A',
        description: 'Chúng ta cần hoàn thành đề xuất dự án trước thứ 6.',
        type: 'message' as SearchResultType,
        timestamp: '10:30 AM',
        icon: 'message-text-outline',
        iconColor: '#9C27B0',
      },
      {
        id: 'msg2',
        title: 'Cuộc họp sáng nay',
        subtitle: 'Trần Thị B',
        description: 'Gửi cho tôi biên bản cuộc họp sáng nay nhé.',
        type: 'message' as SearchResultType,
        timestamp: 'Hôm qua',
        icon: 'message-text-outline',
        iconColor: '#9C27B0',
      },
    ].filter(
      msg =>
        msg.title.toLowerCase().includes(lowercaseQuery) ||
        msg.subtitle?.toLowerCase().includes(lowercaseQuery) ||
        msg.description?.toLowerCase().includes(lowercaseQuery)
    );
    
    // Tìm kiếm trong diễn đàn (mẫu)
    const forumResults: SearchResult[] = [
      {
        id: 'post1',
        title: 'Đề xuất cải tiến quy trình làm việc',
        subtitle: 'Lê Văn C',
        description: 'Tôi có một số ý tưởng để cải thiện quy trình làm việc hiện tại...',
        type: 'forum' as SearchResultType,
        timestamp: '2 ngày trước',
        icon: 'forum-outline',
        iconColor: '#FF5722',
      },
      {
        id: 'post2',
        title: 'Các công cụ tăng năng suất',
        subtitle: 'Phạm Thị D',
        description: 'Danh sách các công cụ và ứng dụng hữu ích để tăng năng suất làm việc...',
        type: 'forum' as SearchResultType,
        timestamp: '1 tuần trước',
        icon: 'forum-outline',
        iconColor: '#FF5722',
      },
    ].filter(
      post =>
        post.title.toLowerCase().includes(lowercaseQuery) ||
        post.subtitle?.toLowerCase().includes(lowercaseQuery) ||
        post.description?.toLowerCase().includes(lowercaseQuery)
    );
    
    // Tạo danh sách kết quả theo nhóm
    const sections = [
      { title: 'Nhiệm vụ', data: taskResults },
      { title: 'Tài liệu', data: documentResults },
      { title: 'Người dùng', data: userResults },
      { title: 'Tin nhắn', data: messageResults },
      { title: 'Diễn đàn', data: forumResults },
    ].filter(section => section.data.length > 0);
    
    return sections;
  };
  
  // Xử lý khi nhấn vào một kết quả
  const handleResultPress = (item: SearchResult) => {
    // Chuyển hướng dựa trên loại kết quả
    switch (item.type) {
      case 'task':
        // navigation.navigate('TaskDetail', { taskId: item.id });
        console.log('Navigate to task detail:', item.id);
        break;
      case 'document':
        // navigation.navigate('DocumentDetail', { documentId: item.id });
        console.log('Navigate to document detail:', item.id);
        break;
      case 'user':
        // navigation.navigate('UserProfile', { userId: item.id });
        console.log('Navigate to user profile:', item.id);
        break;
      case 'message':
        // navigation.navigate('ChatDetail', { messageId: item.id });
        console.log('Navigate to chat detail:', item.id);
        break;
      case 'forum':
        // navigation.navigate('ForumPostDetail', { postId: item.id });
        console.log('Navigate to forum post detail:', item.id);
        break;
    }
  };
  
  // Render tiêu đề mỗi phần
  const renderSectionHeader = ({ section }: { section: { title: string; data: SearchResult[] } }) => (
    <View
      style={[
        styles.sectionHeader,
        { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)' },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        {section.title} ({section.data.length})
      </Text>
    </View>
  );
  
  // Render mỗi kết quả
  const renderItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={[styles.resultItem, { backgroundColor: theme.colors.surface }]}
      onPress={() => handleResultPress(item)}
    >
      {/* Icon hoặc avatar */}
      {item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      ) : (
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: `${item.iconColor}20` || 'rgba(0, 0, 0, 0.1)' },
          ]}
        >
          <Icon
            name={item.icon || 'help-circle-outline'}
            size={24}
            color={item.iconColor || theme.colors.primary}
          />
        </View>
      )}
      
      {/* Nội dung kết quả */}
      <View style={styles.resultContent}>
        <View style={styles.resultTitleRow}>
          <Text
            style={[styles.resultTitle, { color: theme.colors.text }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          
          {item.timestamp && (
            <Text
              style={[
                styles.resultTimestamp,
                { color: isDarkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)' },
              ]}
            >
              {item.timestamp}
            </Text>
          )}
        </View>
        
        {item.subtitle && (
          <Text
            style={[
              styles.resultSubtitle,
              { color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' },
            ]}
            numberOfLines={1}
          >
            {item.subtitle}
          </Text>
        )}
        
        {item.description && (
          <Text
            style={[
              styles.resultDescription,
              { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' },
            ]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
  
  // Render footer với nút Xem thêm (nếu có nhiều kết quả)
  const renderSectionFooter = ({ section }: { section: { title: string; data: SearchResult[] } }) => {
    if (section.data.length > 5) {
      return (
        <TouchableOpacity
          style={[styles.viewMoreButton, { backgroundColor: theme.colors.surface }]}
          onPress={() => console.log(`View more ${section.title}`)}
        >
          <Text style={[styles.viewMoreText, { color: theme.colors.primary }]}>
            Xem tất cả {section.data.length} kết quả
          </Text>
          <Icon name="chevron-right" size={16} color={theme.colors.primary} />
        </TouchableOpacity>
      );
    }
    return null;
  };
  
  // Render trạng thái rỗng
  const renderEmptyComponent = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            Đang tìm kiếm...
          </Text>
        </View>
      );
    }
    
    if (searchQuery) {
      return (
        <EmptyStateComponent
          title="Không tìm thấy kết quả"
          message={`Không có kết quả nào cho "${searchQuery}". Hãy thử từ khóa khác.`}
          icon={<Icon name="magnify-close" size={50} color={theme.colors.primary} />}
        />
      );
    }
    
    return (
      <EmptyStateComponent
        title="Tìm kiếm trong Workspace"
        message="Nhập từ khóa để tìm kiếm nhiệm vụ, tài liệu, tin nhắn và nhiều hơn nữa."
        icon={<Icon name="magnify" size={50} color={theme.colors.primary} />}
      />
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBarContainer}>
        <AdvancedSearchBar
          placeholder="Tìm kiếm trong Workspace..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          showFilterButton={true}
          autoFocus={true}
          filterOptions={[
            { id: 'type', label: 'Loại', value: '', type: 'select', options: [
              { label: 'Tất cả', value: 'all' },
              { label: 'Nhiệm vụ', value: 'task' },
              { label: 'Tài liệu', value: 'document' },
              { label: 'Người dùng', value: 'user' },
              { label: 'Tin nhắn', value: 'message' },
              { label: 'Diễn đàn', value: 'forum' },
            ]},
            { id: 'date', label: 'Ngày', value: '', type: 'date' },
          ]}
        />
      </View>
      
      {/* Danh sách kết quả */}
      <SectionList
        sections={results}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        renderSectionFooter={renderSectionFooter}
        stickySectionHeadersEnabled={true}
        ListEmptyComponent={renderEmptyComponent}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  listContent: {
    flexGrow: 1,
  },
  sectionHeader: {
    padding: SPACING.sm,
    paddingLeft: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  resultItem: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  resultContent: {
    flex: 1,
  },
  resultTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  resultTitle: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
    flex: 1,
  },
  resultTimestamp: {
    fontSize: FONT_SIZE.caption,
    marginLeft: SPACING.sm,
  },
  resultSubtitle: {
    fontSize: FONT_SIZE.caption,
    marginBottom: 2,
  },
  resultDescription: {
    fontSize: FONT_SIZE.small,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  viewMoreText: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
    marginRight: SPACING.xs,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  emptyText: {
    fontSize: FONT_SIZE.body,
    marginTop: SPACING.md,
  },
});

export default GlobalSearchResultsScreen; 