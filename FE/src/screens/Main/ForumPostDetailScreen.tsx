import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
  TouchableOpacity,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ForumStackParamList } from '../../navigation/types';
import { ROUTES } from '../../utils/constants';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '../../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  apiGetForumPostById,
  apiLikeUnlikeForumPost,
  apiGetForumPostComments,
  apiCreateForumComment,
  ForumPost,
  ForumAuthor,
  ForumComment,
  CreateForumCommentPayload,
} from '../../services/api';

const isAuthorPopulated = (
  author: ForumAuthor | string | undefined
): author is ForumAuthor => {
  return typeof author === 'object' && author !== null && !!author && '_id' in author;
};

const formatTime = (isoDateString?: string) => {
  if (!isoDateString) return '';
  const date = new Date(isoDateString);
  return date.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Comment Item Component
interface CommentItemProps {
  comment: ForumComment;
  currentUserId?: string; // Để xác định xem có thể xóa/sửa comment không (chưa implement)
  onLikeComment?: (commentId: string) => void; // Chưa implement
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onLikeComment }) => {
  const { theme, isDarkMode } = useTheme();
  const authorName = isAuthorPopulated(comment.authorId)
    ? comment.authorId.username
    : 'Người dùng ẩn danh';
  const authorAvatar = isAuthorPopulated(comment.authorId) && comment.authorId.avatarUrl
    ? { uri: comment.authorId.avatarUrl }
    : require('../../assets/images/default-avatar.jpg');

  return (
    <View style={[styles.commentContainer, { borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)' }]}>
      <Image source={authorAvatar} style={styles.commentAvatar} />
      <View style={styles.commentContentContainer}>
        <View style={styles.commentHeader}>
            <Text style={[styles.commentAuthorName, { color: theme.colors.text }]}>{authorName}</Text>
            <Text style={[styles.commentTimestamp, { color: theme.colors.placeholder }]}>{formatTime(comment.createdAt)}</Text>
        </View>
        <Text style={[styles.commentText, { color: theme.colors.text }]}>{comment.content}</Text>
        {/* TODO: Add like button for comment if needed */}
        {/* <TouchableOpacity onPress={() => onLikeComment && onLikeComment(comment._id)} style={styles.commentLikeButton}>
          <Icon name={comment.isLikedByUser ? "heart" : "heart-outline"} size={16} color={comment.isLikedByUser ? theme.colors.error : theme.colors.placeholder} />
          <Text style={[styles.commentLikesCount, {color: theme.colors.placeholder}]}>{comment.likesCount}</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

type ForumPostDetailScreenRouteProp = RouteProp<
  ForumStackParamList,
  typeof ROUTES.MAIN.FORUM_POST_DETAIL
>;

const ForumPostDetailScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const route = useRoute<ForumPostDetailScreenRouteProp>();
  const navigation = useNavigation<StackNavigationProp<ForumStackParamList>>();
  const { postId } = route.params;

  const [post, setPost] = useState<ForumPost | null>(null);
  const [loadingPost, setLoadingPost] = useState(true);
  const [postError, setPostError] = useState<string | null>(null);
  const [isLikingPost, setIsLikingPost] = useState(false);

  const [comments, setComments] = useState<ForumComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [commentsPage, setCommentsPage] = useState(1);
  const [totalCommentPages, setTotalCommentPages] = useState(1);

  const fetchPostDetails = useCallback(async () => {
    if (!postId) {
      setPostError('Không tìm thấy ID bài đăng.');
      setLoadingPost(false);
      return;
    }
    try {
      setLoadingPost(true);
      const response = await apiGetForumPostById(postId);
      setPost(response.data);
      setPostError(null);
    } catch (err) {
      console.error("Error fetching post details:", err);
      setPostError('Không thể tải chi tiết bài đăng. Vui lòng thử lại.');
    } finally {
      setLoadingPost(false);
    }
  }, [postId]);

  const fetchComments = useCallback(async (page = 1, loadMore = false) => {
    if (!postId) return;
    setLoadingComments(!loadMore); // Full loading indicator only for initial load
    setCommentsError(null);
    try {
      const response = await apiGetForumPostComments(postId, { page, limit: 10 }); // Giả sử API có pagination
      if (response.data && Array.isArray(response.data.comments)) {
        setComments(prev => loadMore ? [...prev, ...response.data.comments] : response.data.comments);
        // Giả sử API trả về thông tin pagination
        // setCommentsPage(response.data.page || 1);
        // setTotalCommentPages(response.data.pages || 1);
      } else {
        setComments(prev => loadMore ? prev : []);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setCommentsError('Không thể tải bình luận.');
    } finally {
      setLoadingComments(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPostDetails();
  }, [fetchPostDetails]);

  useEffect(() => {
    fetchComments(1); // Fetch initial comments
  }, [fetchComments]);

  useEffect(() => {
    if (post?.title) {
      navigation.setOptions({ title: post.title });
    }
  }, [post?.title, navigation]);

  const handleTogglePostLike = async () => {
    if (!post || isLikingPost) return;
    setIsLikingPost(true);
    try {
      const response = await apiLikeUnlikeForumPost(post._id);
      setPost((prevPost) =>
        prevPost
          ? {
              ...prevPost,
              likesCount: response.data.likesCount,
              isLikedByUser: response.data.isLikedByUser,
            }
          : null
      );
    } catch (err) {
      console.error('Error toggling post like:', err);
      Alert.alert('Lỗi', 'Không thể thích bài viết. Vui lòng thử lại.');
    } finally {
      setIsLikingPost(false);
    }
  };

  const handlePostComment = async () => {
    if (!newComment.trim() || !post || isSubmittingComment) return;
    setIsSubmittingComment(true);
    try {
      const payload: CreateForumCommentPayload = { content: newComment.trim() };
      const response = await apiCreateForumComment(post._id, payload);
      setComments(prevComments => [response.data, ...prevComments]); // Add new comment to the top
      setNewComment('');
      setPost(prevPost => prevPost ? ({...prevPost, commentsCount: prevPost.commentsCount + 1}) : null);
    } catch (err) {
      console.error("Error posting comment:", err);
      Alert.alert('Lỗi', 'Không thể gửi bình luận. Vui lòng thử lại.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  // Render function for FlatList footer (load more indicator for comments)
  const renderCommentListFooter = () => {
    // if (loadingComments && comments.length > 0 && commentsPage < totalCommentPages) {
    //   return <ActivityIndicator style={{ marginVertical: SPACING.md }} size="small" color={theme.colors.primary} />;
    // }
    return null; // Hiện tại chưa có load more cho comments
  };

  if (loadingPost) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (postError) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>{postError}</Text>
        <TouchableOpacity onPress={fetchPostDetails} style={[styles.retryButton, {backgroundColor: theme.colors.primary}]}>
            <Text style={{color: theme.colors.onPrimary}}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!post) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <Text style={{ color: theme.colors.text }}>Không tìm thấy bài đăng.</Text>
      </View>
    );
  }

  const authorName = isAuthorPopulated(post.authorId)
    ? post.authorId.username
    : 'Người dùng ẩn danh';
  const authorAvatar = isAuthorPopulated(post.authorId) && post.authorId.avatarUrl
    ? { uri: post.authorId.avatarUrl }
    : require('../../assets/images/default-avatar.jpg');

  return (
    <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        style={{flex:1}}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Adjust as needed
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={{ paddingBottom: SPACING.xl * 2}}
      >
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{post.title}</Text>
          
          <View style={styles.authorSection}>
            <Image source={authorAvatar} style={styles.avatar} />
            <View>
              <Text style={[styles.authorName, { color: theme.colors.text }]}>{authorName}</Text>
              <Text style={[styles.timestamp, { color: theme.colors.placeholder }]}>
                Đăng lúc: {formatTime(post.createdAt)}
              </Text>
              {post.updatedAt !== post.createdAt && (
                  <Text style={[styles.timestamp, { color: theme.colors.placeholder, fontSize: FONT_SIZE.small - 2}]}>
                      Chỉnh sửa: {formatTime(post.updatedAt)}
                  </Text>
              )}
            </View>
          </View>

          <View style={[styles.separator, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]} />
          
          <Text style={[styles.content, { color: theme.colors.text }]}>{post.content}</Text>
          
          {post.tags && post.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {post.tags.map((tag, index) => (
                <View key={index} style={[styles.tag, { backgroundColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                  <Text style={[styles.tagText, { color: theme.colors.placeholder }]}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={[styles.separator, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }]} />

          <View style={styles.actionsBar}>
            <TouchableOpacity onPress={handleTogglePostLike} style={styles.actionButton} disabled={isLikingPost}>
              <Icon 
                  name={post.isLikedByUser ? "heart" : "heart-outline"} 
                  size={22} 
                  color={post.isLikedByUser ? theme.colors.error : theme.colors.placeholder} 
              />
              <Text style={[styles.actionText, { color: theme.colors.placeholder, marginLeft: SPACING.xs }]}>
                {post.likesCount} Thích
              </Text>
            </TouchableOpacity>
            <View style={styles.actionButton}>
              <Icon name="comment-multiple-outline" size={22} color={theme.colors.placeholder} />
              <Text style={[styles.actionText, { color: theme.colors.placeholder, marginLeft: SPACING.xs }]}>
                {post.commentsCount} Bình luận
              </Text>
            </View>
          </View>
        </View>

        {/* Comment Section */}
        <View style={[styles.card, { backgroundColor: theme.colors.surface, marginTop: SPACING.sm, marginBottom: SPACING.md }]}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>Bình luận ({post.commentsCount})</Text>
          {loadingComments && comments.length === 0 ? (
            <ActivityIndicator style={{marginVertical: SPACING.lg}} color={theme.colors.primary} />
          ) : commentsError ? (
            <Text style={[styles.errorText, {color: theme.colors.error, textAlign: 'center'}]}>{commentsError}</Text>
          ) : comments.length === 0 ? (
            <Text style={{color: theme.colors.placeholder, textAlign: 'center', paddingVertical: SPACING.lg}}>
                Chưa có bình luận nào. Hãy là người đầu tiên!
            </Text>
          ) : (
            <FlatList
              data={comments}
              renderItem={({ item }) => <CommentItem comment={item} />}
              keyExtractor={(item) => item._id}
              scrollEnabled={false} // To prevent nested scrolling issues, ScrollView handles overall scroll
              ItemSeparatorComponent={() => <View style={{height: SPACING.xs /2}} />} // Optional: small space between comments
              ListFooterComponent={renderCommentListFooter}
              // onEndReached={() => { // TODO: Implement load more for comments if API supports it well
              //   if (!loadingComments && commentsPage < totalCommentPages) {
              //     fetchComments(commentsPage + 1, true);
              //   }
              // }}
              // onEndReachedThreshold={0.5}
            />
          )}
        </View>
      </ScrollView>
      
      {/* Input for new comment - outside ScrollView, inside KeyboardAvoidingView */}
      <View style={[styles.commentInputContainer, { backgroundColor: theme.colors.surface, borderTopColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]}>
        <TextInput 
          style={[styles.commentTextInput, { color: theme.colors.text, backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'}] }
          placeholder="Viết bình luận..."
          placeholderTextColor={theme.colors.placeholder}
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity 
            onPress={handlePostComment} 
            disabled={isSubmittingComment || !newComment.trim()}
            style={[styles.sendButton, {backgroundColor: (isSubmittingComment || !newComment.trim()) ? theme.colors.disabled : theme.colors.primary }]} >
          {isSubmittingComment ? (
            <ActivityIndicator size="small" color={theme.colors.onPrimary} />
          ) : (
            <Icon name="send" size={20} color={theme.colors.onPrimary} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  card: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  title: {
    fontSize: FONT_SIZE.h1 - 2,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.md,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
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
    fontWeight: FONT_WEIGHT.medium,
  },
  timestamp: {
    fontSize: FONT_SIZE.small,
  },
  content: {
    fontSize: FONT_SIZE.body + 1,
    lineHeight: FONT_SIZE.body * 1.7,
    textAlign: 'justify',
    marginBottom: SPACING.md,
  },
  errorText: {
    fontSize: FONT_SIZE.body,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  retryButton: {
      paddingVertical: SPACING.sm, 
      paddingHorizontal: SPACING.lg, 
      borderRadius: 20
  },
  separator: {
    height: 1,
    marginVertical: SPACING.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.sm,
  },
  tag: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: 15,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  tagText: {
    fontSize: FONT_SIZE.small -1,
  },
  actionsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: SPACING.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  actionText: {
    fontSize: FONT_SIZE.body,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: FONT_WEIGHT.semiBold,
    marginBottom: SPACING.md,
  },
  // Comment Item Styles
  commentContainer: {
    flexDirection: 'row',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: SPACING.sm,
    backgroundColor: '#EAEAEA',
  },
  commentContentContainer: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs / 2,
  },
  commentAuthorName: {
    fontSize: FONT_SIZE.small + 1,
    fontWeight: FONT_WEIGHT.medium,
  },
  commentTimestamp: {
    fontSize: FONT_SIZE.small - 1,
  },
  commentText: {
    fontSize: FONT_SIZE.body,
    lineHeight: FONT_SIZE.body * 1.4,
  },
  commentLikeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: SPACING.xs,
      alignSelf: 'flex-start'
  },
  commentLikesCount: {
      fontSize: FONT_SIZE.small -1,
      marginLeft: SPACING.xs / 2,
  },
  // Comment Input Styles
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
  },
  commentTextInput: {
    flex: 1,
    paddingHorizontal: SPACING.sm,
    paddingVertical: Platform.OS === 'ios' ? SPACING.sm - 2 : SPACING.xs, // Adjust for platform differences
    borderRadius: 20,
    marginRight: SPACING.sm,
    maxHeight: 100, // Prevent very tall input
    fontSize: FONT_SIZE.body,
  },
  sendButton: {
    padding: SPACING.sm,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ForumPostDetailScreen; 