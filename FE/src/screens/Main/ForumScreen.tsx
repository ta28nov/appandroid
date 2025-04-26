import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '../../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Dữ liệu mẫu cho bài đăng trên diễn đàn
interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  timestamp: string;
  likesCount: number;
  commentsCount: number;
  tags: string[];
  liked?: boolean;
}

const SAMPLE_POSTS: ForumPost[] = [
  {
    id: '1',
    title: 'Cách triển khai giao diện người dùng hiện đại',
    content: 'Tôi đang tìm kiếm các giải pháp UX/UI hiện đại cho ứng dụng di động. Các bạn có kinh nghiệm hoặc đề xuất gì không?',
    author: {
      id: 'user1',
      name: 'Nguyễn Văn A',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    timestamp: '2025-04-15T10:30:00Z',
    likesCount: 24,
    commentsCount: 8,
    tags: ['UI/UX', 'Mobile', 'Design'],
  },
  {
    id: '2',
    title: 'Tối ưu hóa hiệu suất React Native',
    content: 'Tôi đang gặp vấn đề về hiệu suất trong ứng dụng React Native lớn. Cách nào để cải thiện hiệu suất render và animations?',
    author: {
      id: 'user2',
      name: 'Trần Bình',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    },
    timestamp: '2025-04-14T14:45:00Z',
    likesCount: 18,
    commentsCount: 12,
    tags: ['React Native', 'Performance', 'Optimization'],
  },
  {
    id: '3',
    title: 'Thảo luận về kiến trúc microservices',
    content: 'Chúng ta nên sử dụng kiến trúc microservices hay monolithic cho dự án mới? Tôi đang cân nhắc các lựa chọn.',
    author: {
      id: 'user3',
      name: 'Lê Minh',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
    },
    timestamp: '2025-04-13T09:15:00Z',
    likesCount: 32,
    commentsCount: 15,
    tags: ['Architecture', 'Microservices', 'Backend'],
  },
];

const ForumScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const [posts, setPosts] = useState<ForumPost[]>(SAMPLE_POSTS);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  
  // Tất cả các tags từ các bài đăng
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags))
  ).sort();
  
  // Lọc bài đăng theo tag
  const filteredPosts = activeTag
    ? posts.filter(post => post.tags.includes(activeTag))
    : posts;
  
  // Định dạng thời gian
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Xử lý like bài đăng
  const toggleLike = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const liked = post.liked || false;
        return {
          ...post,
          liked: !liked,
          likesCount: liked ? post.likesCount - 1 : post.likesCount + 1
        };
      }
      return post;
    }));
  };
  
  // Render một tag
  const renderTag = (tag: string) => (
    <TouchableOpacity
      key={tag}
      style={[
        styles.tagButton,
        {
          backgroundColor: activeTag === tag 
            ? theme.colors.primary 
            : isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
        },
      ]}
      onPress={() => setActiveTag(activeTag === tag ? null : tag)}
    >
      <Text
        style={[
          styles.tagText,
          {
            color: activeTag === tag 
              ? '#FFFFFF' 
              : theme.colors.text,
          },
        ]}
      >
        {tag}
      </Text>
    </TouchableOpacity>
  );
  
  // Render một bài đăng
  const renderPost = ({ item }: { item: ForumPost }) => (
    <View
      style={[
        styles.postContainer,
        {
          backgroundColor: theme.colors.surface,
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      ]}
    >
      <View style={styles.postHeader}>
        <View style={styles.authorContainer}>
          <Image
            source={{ uri: item.author.avatar }}
            style={styles.avatar}
            defaultSource={require('../../assets/images/default-avatar.jpg')}
          />
          <View>
            <Text style={[styles.authorName, { color: theme.colors.text }]}>
              {item.author.name}
            </Text>
            <Text style={[styles.timestamp, { color: isDarkMode ? '#AEAEB2' : '#8E8E93' }]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={[styles.postTitle, { color: theme.colors.text }]}>
        {item.title}
      </Text>
      
      <Text
        style={[styles.postContent, { color: isDarkMode ? '#AEAEB2' : '#8E8E93' }]}
        numberOfLines={3}
      >
        {item.content}
      </Text>
      
      <View style={styles.tagsContainer}>
        {item.tags.map(tag => (
          <View
            key={tag}
            style={[
              styles.tag,
              {
                backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
              },
            ]}
          >
            <Text
              style={[
                styles.tagText,
                { color: theme.colors.text },
              ]}
            >
              {tag}
            </Text>
          </View>
        ))}
      </View>
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleLike(item.id)}
        >
          <Icon
            name={item.liked ? 'thumb-up' : 'thumb-up-outline'}
            size={20}
            color={item.liked ? theme.colors.primary : (isDarkMode ? '#AEAEB2' : '#8E8E93')}
          />
          <Text
            style={[
              styles.actionText,
              {
                color: item.liked ? theme.colors.primary : (isDarkMode ? '#AEAEB2' : '#8E8E93'),
              },
            ]}
          >
            {item.likesCount}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Icon
            name="comment-outline"
            size={20}
            color={isDarkMode ? '#AEAEB2' : '#8E8E93'}
          />
          <Text style={[styles.actionText, { color: isDarkMode ? '#AEAEB2' : '#8E8E93' }]}>
            {item.commentsCount}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Icon
            name="share-outline"
            size={20}
            color={isDarkMode ? '#AEAEB2' : '#8E8E93'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.surface,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            },
          ]}
        >
          <Icon
            name="magnify"
            size={20}
            color={isDarkMode ? '#AEAEB2' : '#8E8E93'}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Tìm kiếm trong diễn đàn..."
            placeholderTextColor={isDarkMode ? '#AEAEB2' : '#8E8E93'}
          />
        </View>
        
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.colors.primary }]}
        >
          <Icon name="plus" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tagsScrollContainer}>
        <FlatList
          data={allTags}
          renderItem={({ item }) => renderTag(item)}
          keyExtractor={item => item}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
      </View>
      
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.postList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: SPACING.md,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    fontSize: FONT_SIZE.body,
  },
  createButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  tagsScrollContainer: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  tagButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    marginRight: SPACING.sm,
  },
  postList: {
    padding: SPACING.md,
  },
  postContainer: {
    borderRadius: 12,
    borderWidth: 1,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.sm,
  },
  authorName: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
  },
  timestamp: {
    fontSize: FONT_SIZE.small,
  },
  postTitle: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: FONT_WEIGHT.semiBold,
    marginBottom: SPACING.sm,
  },
  postContent: {
    fontSize: FONT_SIZE.body,
    marginBottom: SPACING.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.md,
  },
  tag: {
    borderRadius: 16,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    marginRight: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  tagText: {
    fontSize: FONT_SIZE.small,
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
    paddingTop: SPACING.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
    paddingVertical: SPACING.xs,
  },
  actionText: {
    marginLeft: 4,
    fontSize: FONT_SIZE.small,
  },
});

export default ForumScreen; 