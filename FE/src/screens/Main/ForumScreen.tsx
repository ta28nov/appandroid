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
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ForumStackParamList } from '../../navigation/types';
import { ROUTES } from '../../utils/constants';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '../../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  apiGetForumPosts,
  apiGetForumTags,
  apiLikeUnlikeForumPost,
  ForumPost,
  ForumTag,
  ForumAuthor
} from '../../services/api';

const isAuthorPopulated = (author: ForumAuthor | string): author is ForumAuthor => {
  return typeof author === 'object' && author !== null && '_id' in author;
};

const ForumScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation<StackNavigationProp<ForumStackParamList, typeof ROUTES.MAIN.FORUM>>();

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [tags, setTags] = useState<ForumTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLiking, setIsLiking] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [activeTag, setActiveTag] = useState<string | null>(null);

  const fetchData = useCallback(async (page = 1, refreshing = false) => {
    console.log(`[ForumScreen] fetchData called with page: ${page}, refreshing: ${refreshing}, activeTag: ${activeTag}`);
    if (!refreshing && page === 1) {
        setIsLoading(true);
    }
    if (refreshing) {
      setIsRefreshing(true);
    }
    setError(null);

    try {
      const postsResponse = await apiGetForumPosts({ 
        tag: activeTag ?? undefined, 
        page,
        limit: 10
      });
      console.log('[ForumScreen] Raw postsResponse:', JSON.stringify(postsResponse, null, 2));
      if (postsResponse && postsResponse.data) {
        const newPosts = postsResponse.data.posts;
        console.log('[ForumScreen] Fetched new posts:', newPosts.length > 0 ? newPosts[0] : 'No new posts');
        setPosts(page === 1 ? newPosts : [...posts, ...newPosts]);
        setCurrentPage(postsResponse.data.page);
        setTotalPages(postsResponse.data.pages);
      } else {
        console.warn('[ForumScreen] No data in postsResponse or postsResponse itself is nullish');
        setPosts(page === 1 ? [] : posts);
      }

      if (page === 1 && !refreshing) {
        const tagsResponse = await apiGetForumTags();
        console.log('[ForumScreen] Raw tagsResponse:', JSON.stringify(tagsResponse, null, 2));
        if (tagsResponse && tagsResponse.data) {
          setTags(Array.isArray(tagsResponse.data.tags) ? tagsResponse.data.tags : []);
        } else {
          setTags([]);
        }
      }

    } catch (err: any) {
      console.error("Error fetching forum data:", err);
      setError("Không thể tải dữ liệu diễn đàn. Vui lòng thử lại.");
      if (page === 1) {
          setPosts([]);
          setTags([]);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [activeTag, posts]);

  useFocusEffect(
    useCallback(() => {
      console.log('[ForumScreen] Screen FOCUSED, activeTag:', activeTag);
      fetchData(1, false);
      return () => {
        console.log('[ForumScreen] Screen UNFOCUSED');
      };
    }, [activeTag])
  );

  const handleRefresh = () => {
    fetchData(1, true);
  };

  const handleLoadMore = () => {
    if (!isLoading && currentPage < totalPages) {
      fetchData(currentPage + 1);
    }
  };

  const formatTime = (isoDateString: string) => {
    if (!isoDateString) return '';
    const date = new Date(isoDateString);
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const toggleLike = async (postId: string) => {
    if (isLiking[postId]) return;
    setIsLiking(prev => ({ ...prev, [postId]: true }));

    try {
      const response = await apiLikeUnlikeForumPost(postId);
      setPosts(prevPosts => 
        prevPosts.map(p => 
          p._id === postId 
            ? { 
                ...p, 
                likesCount: response.data?.likesCount !== undefined ? response.data.likesCount : p.likesCount + (p.isLikedByUser ? -1 : 1),
                isLikedByUser: response.data?.isLikedByUser !== undefined ? response.data.isLikedByUser : !p.isLikedByUser
              }
            : p
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
      Alert.alert("Lỗi", "Không thể thích bài viết này. Vui lòng thử lại.");
    } finally {
      setIsLiking(prev => ({ ...prev, [postId]: false }));
    }
  };

  const renderTag = (tag: ForumTag) => (
    <TouchableOpacity
      key={tag._id}
      style={[
        styles.tagButton,
        {
          backgroundColor: activeTag === tag.name 
            ? theme.colors.primary
            : isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
        },
      ]}
      onPress={() => {
        if (activeTag === tag.name) {
          setActiveTag(null);
        } else {
          setActiveTag(tag.name); 
          setPosts([]);
          setCurrentPage(1);
          setTotalPages(1);
        }
      }}
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

  const renderPost = ({ item }: { item: ForumPost }) => {
    console.log('[ForumScreen] Rendering post:', item._id, 'Title:', item.title);
    const authorName = isAuthorPopulated(item.authorId) ? item.authorId.username : 'Người dùng ẩn danh';
    const authorAvatar = isAuthorPopulated(item.authorId) && item.authorId.avatarUrl ? { uri: item.authorId.avatarUrl } : require('../../assets/images/default-avatar.jpg');
    
    return (
    <TouchableOpacity 
      style={[
        styles.postContainer,
        {
          backgroundColor: theme.colors.surface,
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      ]}
      onPress={() => navigation.navigate(ROUTES.MAIN.FORUM_POST_DETAIL, { postId: item._id, postTitle: item.title })}
    >
      <View style={styles.postHeader}>
        <View style={styles.authorContainer}>
          <Image
            source={authorAvatar}
            style={styles.avatar}
          />
          <View>
            <Text style={[styles.authorName, { color: theme.colors.text }]}>
              {authorName}
            </Text>
            <Text style={[styles.timestamp, { color: theme.colors.placeholder }]}>
              {formatTime(item.createdAt)}
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
          {item.tags.map((tag: string, index: number) => (
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
                  {tag}
              </Text>
              </View>
          ))}
          </View>
      )}
      
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => toggleLike(item._id)}
          disabled={isLiking[item._id]}
        >
          <Icon 
            name={item.isLikedByUser ? "heart" : "heart-outline"}
            size={20} 
            color={item.isLikedByUser ? theme.colors.error : theme.colors.placeholder} 
          />
          <Text style={[styles.actionText, { color: theme.colors.placeholder, marginLeft: SPACING.xs }]}>
            {item.likesCount} Thích
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate(ROUTES.MAIN.FORUM_POST_DETAIL, { postId: item._id, postTitle: item.title } )}>
          <Icon name="comment-outline" size={20} color={theme.colors.placeholder} />
          <Text style={[styles.actionText, { color: theme.colors.placeholder, marginLeft: SPACING.xs }]}>
            {item.commentsCount} Bình luận
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )};

  if (isLoading && posts.length === 0) {
    console.log('[ForumScreen] STATE: isLoading (initial) or refreshing and no posts yet');
    return (
      <View style={[styles.centeredMessageContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.emptyMessage, { color: theme.colors.text, marginTop: SPACING.sm }]}>Đang tải bài viết...</Text>
      </View>
    );
  }

  if (error) {
    console.log('[ForumScreen] STATE: Error - ', error);
    return (
      <View style={[styles.centeredMessageContainer, { backgroundColor: theme.colors.background }]}>
        <Icon name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>
        <TouchableOpacity onPress={() => fetchData(1, true)} style={[styles.retryButton, {backgroundColor: theme.colors.primary}]}>
            <Text style={{color: theme.colors.onPrimary}}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (posts.length === 0 && !isLoading) {
    console.log('[ForumScreen] STATE: No posts and not loading. Active Tag:', activeTag);
    return (
      <View style={[styles.centeredMessageContainer, { backgroundColor: theme.colors.background }]}>
        <Icon name="forum-outline" size={60} color={theme.colors.placeholder} />
        <Text style={[styles.emptyMessage, { color: theme.colors.text }]}>
            {activeTag ? `Không có bài viết nào cho tag "${activeTag}".` : "Chưa có bài viết nào."}
        </Text>
        <TouchableOpacity 
            style={[styles.button, {backgroundColor: theme.colors.primary, marginTop: SPACING.md}]}
            onPress={() => navigation.navigate(ROUTES.MAIN.CREATE_FORUM_POST, {})}
        >
            <Text style={[styles.buttonText, {color: theme.colors.onPrimary}]}>Tạo bài viết đầu tiên</Text>
        </TouchableOpacity>
      </View>
    );
  }

  console.log(`[ForumScreen] STATE: Rendering FlatList with ${posts.length} posts. Page: ${currentPage}/${totalPages}`);
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
        <View style={styles.tagsListContainer}>
          <FlatList
            data={tags}
            renderItem={({item}) => renderTag(item)}
            keyExtractor={(tag) => tag._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: SPACING.md }}
          />
        </View>
      )}
      
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{ paddingHorizontal: SPACING.md, paddingBottom: SPACING.xl * 2 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => {
          if (isLoading && posts.length > 0 && currentPage < totalPages) {
            return <ActivityIndicator style={{ marginVertical: SPACING.md }} size="small" color={theme.colors.primary} />;
          }
          return null;
        }}
      />
      
      {posts.length > 0 && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate(ROUTES.MAIN.CREATE_FORUM_POST, {})}
          activeOpacity={0.8}
        >
          <Icon name="plus" size={24} color={theme.colors.onPrimary ?? '#FFFFFF'} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    fontSize: FONT_SIZE.h2,
    fontWeight: FONT_WEIGHT.bold,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  tagsListContainer: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  tagButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm - 2,
    borderRadius: 16,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  tagText: {
    fontSize: FONT_SIZE.small,
    fontWeight: FONT_WEIGHT.medium,
  },
  postContainer: {
    borderRadius: 8,
    marginVertical: SPACING.sm - 2,
    padding: SPACING.md,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
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
    backgroundColor: '#E0E0E0',
  },
  authorName: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.semiBold,
  },
  timestamp: {
    fontSize: FONT_SIZE.small - 1,
  },
  postTitle: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.xs,
  },
  postContent: {
    fontSize: FONT_SIZE.body,
    lineHeight: FONT_SIZE.body * 1.5,
    marginBottom: SPACING.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  tag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 12,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  tagTextSmall: {
    fontSize: FONT_SIZE.small - 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: SPACING.sm,
    marginTop: SPACING.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.lg,
  },
  actionText: {
    fontSize: FONT_SIZE.small,
  },
  centeredMessageContainer: {
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
        borderRadius: 20,
        marginTop: SPACING.md,
    },
    emptyMessage: {
        fontSize: FONT_SIZE.body,
        textAlign: 'center',
        marginTop: SPACING.md,
    },
    button: {
      paddingVertical: SPACING.md,
      paddingHorizontal: SPACING.lg,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: FONT_SIZE.body,
      fontWeight: FONT_WEIGHT.medium,
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
        shadowRadius: 3,
    },
});

export default ForumScreen; 