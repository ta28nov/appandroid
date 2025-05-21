import React, { useState, useEffect } from 'react';
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
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../styles/globalStyles';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import apiClient from '../../services/api';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChatStackParamList } from '../../navigation/types';
import { ROUTES } from '../../utils/constants';

// Dữ liệu mẫu cho danh sách chat
interface ChatPreview {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    online?: boolean;
  };
  lastMessage: {
    text: string;
    timestamp: string;
    senderId: string;
    read: boolean;
  };
  unreadCount: number;
}

const ChatListScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation<StackNavigationProp<ChatStackParamList>>();
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch chats from API
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/chats');
        // Đảm bảo luôn là array, tránh lỗi spread non-iterable
        const apiChats = Array.isArray(res.data?.chats)
          ? res.data.chats
          : Array.isArray(res.data)
          ? res.data
          : [];
        setChats(
          (apiChats as any[]).map((chat: any) => ({
            id: chat._id || chat.id,
            user: {
              id:
                chat.participant?._id ||
                chat.participant?.id ||
                chat.userId ||
                '',
              name: chat.participant?.name || chat.userName || '',
              avatar: chat.participant?.avatar || chat.avatar || null,
              online: chat.participant?.online || false,
            },
            lastMessage: {
              text: chat.lastMessage?.text || '',
              timestamp:
                chat.lastMessage?.createdAt ||
                chat.lastMessage?.timestamp ||
                '',
              senderId: chat.lastMessage?.senderId || '',
              read: chat.lastMessage?.read || false,
            },
            unreadCount: chat.unreadCount || 0,
          }))
        );
      } catch (e) {
        setChats([]);
      }
      setLoading(false);
    };
    fetchChats();
  }, []);

  // Lọc chat theo từ khóa tìm kiếm
  const filteredChats = searchQuery
    ? chats.filter(
        chat =>
          chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chats;

  // Định dạng thời gian
  const formatTime = (timestamp: string) => {
    if (!timestamp) return '';
    const messageDate = new Date(timestamp);
    if (isNaN(messageDate.getTime())) return '';
    const now = new Date();
    const isToday = messageDate.toDateString() === now.toDateString();
    const isYesterday =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1).toDateString() ===
      messageDate.toDateString();
    if (isToday) {
      return messageDate.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (isYesterday) {
      return 'Hôm qua';
    } else {
      return messageDate.toLocaleDateString([], {
        day: '2-digit',
        month: '2-digit',
      });
    }
  };

  // Xử lý khi nhấn vào một chat
  const handleChatPress = (chatId: string, userName?: string) => {
    navigation.navigate('Chat', { chatId, chatName: userName || '', isGroupChat: false });
    // Đánh dấu tin nhắn đã đọc
    setChats(
      chats.map(chat => {
        if (chat.id === chatId) {
          return {
            ...chat,
            lastMessage: {
              ...chat.lastMessage,
              read: true,
            },
            unreadCount: 0,
          };
        }
        return chat;
      })
    );
  };

  // Render chat item
  const renderChatItem = ({ item }: { item: ChatPreview }) => {
    const avatarSource = item.user.avatar && item.user.avatar.trim() !== ''
      ? { uri: item.user.avatar }
      : require('../../assets/images/default-avatar.jpg');
    return (
      <TouchableOpacity
        style={[
          styles.chatItem,
          {
            backgroundColor: theme.colors.surface,
            shadowColor: '#2979FF',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
          },
        ]}
        activeOpacity={0.85}
        onPress={() => handleChatPress(item.id, item.user.name)}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={avatarSource}
            style={styles.avatar}
          />
          {item.user.online && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text
              style={[
                styles.userName,
                {
                  color: theme.colors.text,
                  fontWeight: item.unreadCount > 0 ? FONT_WEIGHT.bold : FONT_WEIGHT.medium,
                  fontFamily: 'Poppins', // Đảm bảo fontFamily đã load đúng
                  fontSize: 17,
                },
              ]}
              numberOfLines={1}
            >
              {item.user.name}
            </Text>
            <Text
              style={[
                styles.timestamp,
                {
                  color: item.unreadCount > 0 ? theme.colors.primary : isDarkMode ? '#AEAEB2' : '#8E8E93',
                  fontWeight: item.unreadCount > 0 ? FONT_WEIGHT.bold : FONT_WEIGHT.regular,
                  fontSize: 13,
                },
              ]}
            >
              {formatTime(item.lastMessage.timestamp) || ' '}
            </Text>
          </View>
          <View style={styles.messageRow}>
            <Text
              style={[
                styles.messageText,
                {
                  color: item.unreadCount > 0 ? theme.colors.text : isDarkMode ? '#AEAEB2' : '#8E8E93',
                  fontWeight: item.unreadCount > 0 ? FONT_WEIGHT.medium : FONT_WEIGHT.regular,
                  fontSize: 15,
                  fontFamily: 'Inter', // Đảm bảo fontFamily đúng, đã load bằng expo-font
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.lastMessage.senderId === 'currentUser' ? 'Bạn: ' : ''}
              {item.lastMessage.text}
            </Text>
            {item.unreadCount > 0 && (
              <View style={[styles.unreadBadge, { backgroundColor: theme.colors.primary }]}> // Đảm bảo badge có màu nền
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchBar,
            {
              backgroundColor: theme.colors.surface,
              borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
              shadowColor: '#2979FF',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 4,
              elevation: 1,
            },
          ]}
        >
          <Icon
            name="magnify"
            size={20}
            color={isDarkMode ? '#AEAEB2' : '#8E8E93'}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text, fontFamily: 'Inter', fontSize: 15 }]}
            placeholder="Tìm kiếm tin nhắn..."
            placeholderTextColor={isDarkMode ? '#AEAEB2' : '#8E8E93'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon
                name="close-circle"
                size={18}
                color={isDarkMode ? '#AEAEB2' : '#8E8E93'}
              />
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity style={styles.newChatButton} onPress={() => navigation.navigate('Chat', { chatId: '', chatName: '', isGroupChat: false })}>
          <Icon name="pencil" size={22} color={theme.colors.primary} />
        </TouchableOpacity>
      </View>
      {loading ? (
        <View style={styles.emptyContainer}>
          <Icon name="chat-outline" size={50} color={isDarkMode ? '#AEAEB2' : '#8E8E93'} />
          <Text style={[styles.emptyText, { color: isDarkMode ? '#AEAEB2' : '#8E8E93' }]}>Đang tải danh sách chat...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          renderItem={renderChatItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.chatList}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Icon name="chat-outline" size={50} color={isDarkMode ? '#AEAEB2' : '#8E8E93'} />
              <Text style={[styles.emptyText, { color: isDarkMode ? '#AEAEB2' : '#8E8E93' }]}>Không có cuộc trò chuyện nào</Text>
            </View>
          )}
        />
      )}
      <TouchableOpacity
        style={[
          styles.fab,
          {
            backgroundColor: theme.colors.primary,
            shadowColor: '#2979FF',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 8,
            elevation: 6,
          },
        ]}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('Chat', { chatId: '', chatName: '', isGroupChat: false })}
      >
        <Icon name="message-plus" size={28} color="#FFFFFF" />
      </TouchableOpacity>
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
    marginRight: SPACING.sm,
    fontSize: FONT_SIZE.body,
  },
  newChatButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  chatList: {
    padding: SPACING.md,
  },
  chatItem: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: SPACING.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: 'white',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: FONT_SIZE.body,
    fontFamily: 'Poppins', // Đảm bảo fontFamily đúng, đã load bằng expo-font
  },
  timestamp: {
    fontSize: FONT_SIZE.small,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  messageText: {
    flex: 1,
    fontSize: FONT_SIZE.body,
    fontFamily: 'Inter', // Đảm bảo fontFamily đúng, đã load bằng expo-font
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
    paddingHorizontal: 5,
    backgroundColor: '#FF3B30', // Bổ sung màu nền cho badge cảnh báo style
  },
  unreadCount: {
    color: 'white',
    fontSize: FONT_SIZE.small,
    fontWeight: FONT_WEIGHT.bold,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.body,
    textAlign: 'center',
    fontFamily: 'Inter', // Đảm bảo fontFamily đúng, đã load bằng expo-font
  },
});

export default ChatListScreen;