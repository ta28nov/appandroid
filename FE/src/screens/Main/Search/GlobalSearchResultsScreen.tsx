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
import apiClient from '../../../services/api';

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
  const performSearch = async (query: string) => {
    setLoading(true);
    try {
      // Gọi API tìm kiếm task và document
      const [tasksRes, documentsRes] = await Promise.all([
        apiClient.get('/tasks', { params: { search: query } }),
        apiClient.get('/documents', { params: { search: query } }),
      ]);
      const taskResults: SearchResult[] = (tasksRes.data?.tasks || []).map((task: any) => ({
        id: task._id || task.id,
        title: task.title,
        subtitle: task.completed ? 'Hoàn thành' : task.overdue ? 'Quá hạn' : 'Đang thực hiện',
        description: task.description,
        type: 'task',
        timestamp: task.dueDate,
        icon: 'checkbox-marked-outline',
        iconColor: task.priority === 'High' ? '#F44336' : task.priority === 'Medium' ? '#FF9800' : '#4CAF50',
      }));
      const documentResults: SearchResult[] = (documentsRes.data?.documents || []).map((doc: any) => ({
        id: doc._id || doc.id,
        title: doc.title,
        subtitle: doc.type?.toUpperCase(),
        description: doc.description,
        type: 'document',
        timestamp: doc.updatedAt,
        icon: 'file-document-outline',
        iconColor: '#2196F3',
      }));
      // Static user/message/forum results (or empty)
      const userResults: SearchResult[] = [];
      const messageResults: SearchResult[] = [];
      const forumResults: SearchResult[] = [];
      const sections = [
        { title: 'Nhiệm vụ', data: taskResults },
        { title: 'Tài liệu', data: documentResults },
        { title: 'Người dùng', data: userResults },
        { title: 'Tin nhắn', data: messageResults },
        { title: 'Diễn đàn', data: forumResults },
      ].filter(section => section.data.length > 0);
      setResults(sections);
    } catch (error) {
      setResults([]);
    }
    setLoading(false);
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