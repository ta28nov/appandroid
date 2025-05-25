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
  Alert,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../styles/globalStyles';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChatStackParamList } from '../../navigation/types';
import { ROUTES } from '../../utils/constants';
import { apiGetChats, ChatData, UserSnippet } from '../../services/api';
import { useTempAuth } from '../../contexts/TempAuthContext';

// Helper function to determine the other participant in a 1-on-1 chat
const getOtherParticipant = (chat: ChatData, currentUserId: string | undefined): UserSnippet | null => {
  if (!currentUserId || !chat.participant) return null;
  // Lọc ra participant không phải là currentUser và là object (đã populate)
  const other = chat.participant.find(p => {
    const participantObject = p as UserSnippet; // Ép kiểu để truy cập _id
    return typeof participantObject === 'object' && participantObject._id && participantObject._id !== currentUserId;
  });
  return typeof other === 'object' ? (other as UserSnippet) : null;
};

const formatChatTimestamp = (isoDateString?: string) => {
  if (!isoDateString) return '';
  const date = new Date(isoDateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 1 && date.getDate() === now.getDate()) { // Hôm nay
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }
  if (diffDays < 2 && date.getDate() === now.getDate() - 1) { // Hôm qua
    return 'Hôm qua';
  } 
  if (diffDays < 7) { // Trong tuần này, hiển thị thứ
    return date.toLocaleDateString('vi-VN', { weekday: 'long' });
  }
  return date.toLocaleDateString('vi-VN', { day: 'numeric', month: 'short' }); // Cũ hơn thì ngày/tháng
};

const ChatListScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation<StackNavigationProp<ChatStackParamList, typeof ROUTES.MAIN.CHAT_LIST>>(); 
  const { user: currentUser } = useTempAuth(); 
  
  const [chats, setChats] = useState<ChatData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    searchContainer: {
      flexDirection: 'row',
      padding: SPACING.md,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.surfaceVariant, 
      paddingHorizontal: SPACING.md,
    },
    searchInput: {
      flex: 1,
      marginLeft: SPACING.sm,
      fontSize: FONT_SIZE.body,
      color: theme.colors.text,
    },
    chatItem: {
      flexDirection: 'row',
      paddingVertical: SPACING.md + SPACING.xs,
      paddingHorizontal: SPACING.md,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
    },
    avatarContainer: {
      marginRight: SPACING.md,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.colors.placeholder,
    },
    chatContent: {
      flex: 1,
      justifyContent: 'center',
    },
    chatHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: SPACING.xs / 2,
    },
    userName: {
      fontSize: FONT_SIZE.subtitle,
      fontWeight: FONT_WEIGHT.semiBold,
      color: theme.colors.text,
      flexShrink: 1,
      marginRight: SPACING.xs,
    },
    timestamp: {
      fontSize: FONT_SIZE.small,
      color: theme.colors.placeholder,
    },
    messageRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: SPACING.xs / 2,
    },
    messageText: {
      flexShrink: 1,
      fontSize: FONT_SIZE.body,
      color: theme.colors.onSurfaceVariant,
    },
    unreadBadge: {
      minWidth: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: SPACING.sm,
      paddingHorizontal: SPACING.xs + 2,
    },
    unreadCount: {
      color: theme.colors.onPrimary,
      fontSize: FONT_SIZE.small,
      fontWeight: FONT_WEIGHT.bold,
    },
    fab: {
      position: 'absolute',
      bottom: SPACING.lg,
      right: SPACING.lg,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3,
    },
    centeredMessageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.xl,
    },
    emptyText: {
      fontSize: FONT_SIZE.body,
      color: theme.colors.placeholder,
      textAlign: 'center',
      marginTop: SPACING.md,
    },
    errorText: {
        fontSize: FONT_SIZE.body,
        color: theme.colors.error,
        textAlign: 'center',
        marginBottom: SPACING.md,
    },
    retryButton: {
        marginTop: SPACING.md,
        backgroundColor: theme.colors.primary,
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.lg,
        borderRadius: 20,
    },
    retryButtonText: {
        color: theme.colors.onPrimary,
        fontWeight: FONT_WEIGHT.medium,
    }
  });

  const fetchData = useCallback(async (isSilent = false) => {
    if (!isRefreshing && !isSilent) setLoading(true);
    if (!isSilent) setError(null);
    try {
      const response = await apiGetChats();
      if (response && response.data && Array.isArray(response.data.chats)) {
        const normalizedChats = response.data.chats.map(chat => {
          let participantArray = chat.participant; // As per ChatData, this should be an array

          // Check if participant exists but is not an array (e.g., a single object from API)
          if (chat.participant && !Array.isArray(chat.participant)) {
            // Type assertion needed here as TS expects chat.participant to be an array based on ChatData
            // but we are catering for an API inconsistency.
            participantArray = [chat.participant as unknown as (UserSnippet | string)];
          } else if (!chat.participant) {
            // If participant is null or undefined, ensure it's an empty array for safety
            participantArray = [];
          }
          // Ensure objects within participantArray are actual UserSnippet objects if they are strings (IDs)
          // This might be overly complex if backend always populates, but good for robustness
          // For now, we assume backend sends UserSnippet objects or the string IDs are handled elsewhere if needed.

          return { ...chat, participant: participantArray };
        });

        const sortedChats = normalizedChats.sort((a, b) => {
          const timeA = a.lastMessage?.timestamp ? new Date(a.lastMessage.timestamp).getTime() : new Date(a.updatedAt).getTime();
          const timeB = b.lastMessage?.timestamp ? new Date(b.lastMessage.timestamp).getTime() : new Date(b.updatedAt).getTime();
          return timeB - timeA; 
        });
        setChats(sortedChats);
      } else {
        console.error("Invalid chat data structure received from API. Expected response.data.chats to be an array. Received:", response);
        setChats([]);
        if (!isSilent) setError('Dữ liệu danh sách chat không hợp lệ hoặc không đúng định dạng. Vui lòng thử lại.');
      }
    } catch (err: any) {
      console.error("Failed to fetch chats:", err);
      if (!isSilent) setError('Không thể tải danh sách chat. Vui lòng thử lại.');
      if (!isSilent) setChats([]);
    } finally {
      if (!isSilent) setLoading(false);
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
      // TODO: Implement real-time updates listener here if available (e.g., Socket.IO)
      // Example: socket.on('new_chat_message', handleNewMessageEvent);
      //          socket.on('chat_updated', handleChatUpdatedEvent);
      return () => {
        // TODO: Clean up real-time updates listener here
        // Example: socket.off('new_chat_message', handleNewMessageEvent);
        //          socket.off('chat_updated', handleChatUpdatedEvent);
      };
    }, [fetchData])
  );

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchData();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const filteredChats = chats.filter(chat => {
    const otherParticipant = getOtherParticipant(chat, currentUser?._id);
    // Giả sử UserSnippet có name hoặc username, fallback về 'Chat' nếu không có
    const chatName = otherParticipant?.name || otherParticipant?.username || (chat.participant.length > 1 ? 'Chat' : 'Cuộc trò chuyện');
    return chatName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleChatPress = (chat: ChatData) => {
    const otherParticipant = getOtherParticipant(chat, currentUser?._id);
    navigation.navigate(ROUTES.MAIN.CHAT, { 
      chatId: chat._id,
      chatName: otherParticipant?.name || otherParticipant?.username || (chat.participant.length > 1 ? 'Chat' : 'Cuộc trò chuyện'),
      chatAvatar: otherParticipant?.avatarUrl,
    });
  };

  const renderChatItem = ({ item }: { item: ChatData }) => {
    if (!currentUser) return null; // Cần currentUser để xác định otherParticipant

    const otherParticipant = getOtherParticipant(item, currentUser._id);
    let chatName = 'Chat';
    let avatarUrl: string | undefined;

    if (otherParticipant) {
      chatName = otherParticipant.name || otherParticipant.username || 'Người dùng';
      avatarUrl = otherParticipant.avatarUrl;
    } else if (item.participant.length > 1) {
      // Xử lý tên cho group chat (hiện tại chưa có logic cụ thể cho tên group chat từ backend)
      // Tạm thời lấy tên của participant đầu tiên không phải currentUser, hoặc mặc định
      const firstOther = item.participant.find(p => (p as UserSnippet)._id !== currentUser._id) as UserSnippet | undefined;
      chatName = firstOther?.name || firstOther?.username || `Nhóm ${item.participant.length} người`;
      avatarUrl = firstOther?.avatarUrl; // Hoặc một avatar mặc định cho nhóm
    } else {
      // Trường hợp chỉ có 1 participant và đó là currentUser (chat với chính mình) hoặc dữ liệu lỗi
      const singleParticipant = item.participant[0] as UserSnippet;
      chatName = singleParticipant?.name || singleParticipant?.username || 'Cuộc trò chuyện';
      avatarUrl = singleParticipant?.avatarUrl;
    }
    
    const lastMessageText = item.lastMessage?.text || 'Chưa có tin nhắn.';
    const lastMessageSenderIsCurrentUser = item.lastMessage?.senderId && typeof item.lastMessage.senderId === 'object' && item.lastMessage.senderId._id === currentUser._id;
    const lastMessagePrefix = lastMessageSenderIsCurrentUser ? "Bạn: " : "";
    const unreadCount = 0; // TODO: Lấy unreadCount từ item.unreadCount khi backend hỗ trợ

    return (
      <TouchableOpacity style={styles.chatItem} onPress={() => handleChatPress(item)}>
        <View style={styles.avatarContainer}>
          <Image 
            source={avatarUrl ? { uri: avatarUrl } : require('../../assets/images/default-avatar.jpg')} 
            style={styles.avatar} 
          />
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.userName} numberOfLines={1}>{chatName}</Text>
            {item.lastMessage?.timestamp && (
              <Text style={styles.timestamp}>{formatChatTimestamp(item.lastMessage.timestamp)}</Text>
            )}
          </View>
          <View style={styles.messageRow}>
            <Text 
              style={[
                styles.messageText, 
                { fontWeight: unreadCount > 0 && !lastMessageSenderIsCurrentUser ? FONT_WEIGHT.bold : FONT_WEIGHT.regular,
                  color: unreadCount > 0 && !lastMessageSenderIsCurrentUser ? theme.colors.text : theme.colors.onSurfaceVariant
                }
              ]} 
              numberOfLines={1}
            >
              {lastMessagePrefix}{lastMessageText}
            </Text>
            {unreadCount > 0 && !lastMessageSenderIsCurrentUser && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !isRefreshing) {
    return (
      <View style={styles.centeredMessageContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Icon name="magnify" size={20} color={theme.colors.placeholder} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm cuộc trò chuyện..."
            placeholderTextColor={theme.colors.placeholder}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="close-circle" size={20} color={theme.colors.placeholder} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {error && !loading && (
          <View style={styles.centeredMessageContainer}>
            <Icon name="alert-circle-outline" size={48} color={theme.colors.error} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
                <Text style={styles.retryButtonText}>Thử lại</Text>
            </TouchableOpacity>
          </View>
      )}

      {!error && !loading && filteredChats.length === 0 && (
        <View style={styles.centeredMessageContainer}>
          <Icon name="message-text-outline" size={60} color={theme.colors.placeholder} />
          <Text style={styles.emptyText}>
            {searchQuery ? `Không tìm thấy kết quả cho "${searchQuery}".` : "Bạn chưa có cuộc trò chuyện nào."}
          </Text>
          {!searchQuery && (
            <TouchableOpacity 
              style={[styles.retryButton, {marginTop: SPACING.lg, flexDirection: 'row', alignItems: 'center'}]}
              onPress={() => navigation.navigate(ROUTES.MAIN.CREATE_CHAT_USER_SELECTION)}
            >
                <Icon name="plus-circle-outline" size={20} color={theme.colors.onPrimary} style={{marginRight: SPACING.xs}}/>
                <Text style={styles.retryButtonText}>Bắt đầu trò chuyện</Text>
            </TouchableOpacity>  
          )}
        </View>
      )}

      {!error && (filteredChats.length > 0 || (loading && isRefreshing)) &&
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: SPACING.md }}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={[theme.colors.primary]} tintColor={theme.colors.primary}/>
          }
        />
      }

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => navigation.navigate(ROUTES.MAIN.CREATE_CHAT_USER_SELECTION)}
      >
        <Icon name="message-plus-outline" size={24} color={theme.colors.onPrimary} />
      </TouchableOpacity>
    </View>
  );
};

export default ChatListScreen;