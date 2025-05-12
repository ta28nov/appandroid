import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '../../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  apiGetForumPosts,
  apiGetForumTags,
  apiToggleForumPostLike,
  ForumPost,
  ForumTag
} from '../../services/api';

const ForumScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [tags, setTags] = useState<ForumTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiking, setIsLiking] = useState<Record<string, boolean>>({});

  const [activeTag, setActiveTag] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isRefreshing) {
        setIsLoading(true);
    }
    setError(null);
    setIsLiking({});

    try {
      const [postsResponse, tagsResponse] = await Promise.all([
        apiGetForumPosts({ tag: activeTag ?? undefined }),
        apiGetForumTags()
      ]);

      setPosts(Array.isArray(postsResponse) ? postsResponse : []);
      setTags(Array.isArray(tagsResponse) ? tagsResponse : []);

    } catch (err: any) {
      console.error("Error fetching forum data:", err);
      setError("Không thể tải dữ liệu diễn đàn. Vui lòng thử lại.");
      setPosts([]);
      setTags([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [activeTag, isRefreshing]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const filteredPosts = posts;

  const formatTime = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleLike = async (postId: string) => {
    if (isLiking[postId]) return;

    setIsLiking(prev => ({ ...prev, [postId]: true }));

    try {
      await apiToggleForumPostLike(postId);
      fetchData();
    } catch (err) {
      console.error("Error toggling like:", err);
      Alert.alert("Lỗi", "Không thể thích bài viết này. Vui lòng thử lại.");
      setIsLiking(prev => ({ ...prev, [postId]: false }));
    }
  };

  const renderTag = (tag: ForumTag) => (
    <TouchableOpacity
      key={tag.id || tag.name}
      style={[
        styles.tagButton,
        {
          backgroundColor: activeTag === tag.name
            ? theme.colors.primary
            : isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
        },
      ]}
      onPress={() => setActiveTag(activeTag === tag.name ? null : tag.name)}
    >
      <Text
        style={[
          styles.tagText,
          {
            color: activeTag === tag.name
              ? theme.colors.onPrimary ?? '#FFFFFF'
              : theme.colors.text,
          },
        ]}
      >
        {tag.name}
      </Text>
    </TouchableOpacity>
  );

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
            source={item.author?.avatar ? { uri: item.author.avatar } : require('../../assets/images/default-avatar.jpg')}
            style={styles.avatar}
          />
          <View>
            <Text style={[styles.authorName, { color: theme.colors.text }]}>
              {item.author?.name || 'Người dùng ẩn'}
            </Text>
            <Text style={[styles.timestamp, { color: theme.colors.placeholder }]}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
        </View>
      </View>
      
      <Text style={[styles.postTitle, { color: theme.colors.text }]}>
        {item.title}
      </Text>
      
      {item.content && (
        <Text
          style={[styles.postContent, { color: theme.colors.placeholder }]}
          numberOfLines={3}
        >
          {item.content}
        </Text>
      )}
      
      {Array.isArray(item.tags) && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
          {item.tags.map((tag: string | { name: string }, index: number) => (
              <View
              key={index}
              style={[
                  styles.tag,
                  {
                  backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
                  },
              ]}
              >
              <Text
                  style={[
                  styles.tagTextSmall,
                  { color: theme.colors.placeholder },
                  ]}
              >
                  {typeof tag === 'string' ? tag : tag.name}
              </Text>
              </View>
          ))}
          </View>
      )}
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleLike(item.id)}
          disabled={isLiking[item.id]}
        >
          {isLiking[item.id] ? (
            <ActivityIndicator size="small" color={theme.colors.primary} />
          ) : (
            <Icon
              name={item.liked ? 'thumb-up' : 'thumb-up-outline'}
              size={20}
              color={item.liked ? theme.colors.primary : theme.colors.placeholder}
            />
          )}
          <Text
            style={[
              styles.actionText,
              {
                color: item.liked ? theme.colors.primary : theme.colors.placeholder,
                marginLeft: isLiking[item.id] ? 0 : SPACING.xs,
              },
            ]}
          >
            {!isLiking[item.id] && (item.likesCount || 0)}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Icon
            name="comment-outline"
            size={20}
            color={theme.colors.placeholder}
          />
          <Text style={[styles.actionText, { color: theme.colors.placeholder }]}>
            {item.commentsCount || 0}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Icon
            name="share-outline"
            size={20}
            color={theme.colors.placeholder}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Icon name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
        <TouchableOpacity onPress={fetchData} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
        <Icon name="magnify" size={22} color={theme.colors.placeholder} style={styles.searchIcon} />
        <TextInput
          placeholder="Tìm kiếm bài viết..."
          placeholderTextColor={theme.colors.placeholder}
          style={[styles.searchInput, { color: theme.colors.text }]}
        />
      </View>
      
      {tags.length > 0 && (
        <View style={styles.tagsScrollContainer}>
          <FlatList
            data={[...tags, { id: 'all', name: 'Tất cả' }]}
            renderItem={({ item }) => renderTag(item)}
            keyExtractor={(item) => item.id || item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
      
      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContentContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.colors.placeholder }]}>
              {activeTag ? `Không có bài viết nào với tag "${activeTag}".` : 'Chưa có bài viết nào.'}
            </Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      />
      
      <TouchableOpacity style={[styles.fab, { backgroundColor: theme.colors.primary }]}>
            <Icon name="plus" size={24} color={theme.colors.onPrimary ?? '#FFFFFF'} />
       </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  retryButtonText: {
      fontSize: FONT_SIZE.body,
      fontWeight: FONT_WEIGHT.semiBold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    margin: SPACING.md,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZE.body,
  },
  tagsScrollContainer: {
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
  },
  tagButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: 16,
    marginRight: SPACING.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagText: {
    fontSize: FONT_SIZE.small,
    fontWeight: FONT_WEIGHT.medium,
  },
   tagTextSmall: {
    fontSize: 11,
    fontWeight: FONT_WEIGHT.regular,
  },
  listContentContainer: {
    padding: SPACING.md,
    paddingTop: 0,
  },
  postContainer: {
    marginBottom: SPACING.md,
    borderRadius: 12,
    padding: SPACING.md,
    borderWidth: 1,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
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
    fontWeight: FONT_WEIGHT.semiBold,
  },
  timestamp: {
    fontSize: FONT_SIZE.small,
  },
  postTitle: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.xs,
  },
  postContent: {
    fontSize: FONT_SIZE.body,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  tag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 8,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    marginTop: SPACING.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  actionText: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZE.small,
    fontWeight: FONT_WEIGHT.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: FONT_SIZE.body,
    textAlign: 'center',
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
});

export default ForumScreen; 