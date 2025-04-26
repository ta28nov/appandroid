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
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

const SAMPLE_CHATS: ChatPreview[] = [
  {
    id: 'chat1',
    user: {
      id: 'user1',
      name: 'Nguyễn Văn A',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      online: true,
    },
    lastMessage: {
      text: 'Bạn đã xem qua báo cáo mới chưa?',
      timestamp: '2025-04-16T09:30:00Z',
      senderId: 'user1',
      read: false,
    },
    unreadCount: 2,
  },
  {
    id: 'chat2',
    user: {
      id: 'user2',
      name: 'Trần Bình',
      avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      online: false,
    },
    lastMessage: {
      text: 'Mình đã cập nhật thiết kế mới, bạn kiểm tra giúp mình nhé',
      timestamp: '2025-04-15T18:45:00Z',
      senderId: 'user2',
      read: true,
    },
    unreadCount: 0,
  },
  {
    id: 'chat3',
    user: {
      id: 'user3',
      name: 'Lê Minh',
      avatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      online: true,
    },
    lastMessage: {
      text: 'Ok, mình sẽ chuẩn bị cho buổi họp ngày mai',
      timestamp: '2025-04-16T14:20:00Z',
      senderId: 'currentUser',
      read: true,
    },
    unreadCount: 0,
  },
  {
    id: 'chat4',
    user: {
      id: 'user4',
      name: 'Phạm Hà',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      online: false,
    },
    lastMessage: {
      text: 'Mình cần thêm thông tin về dự án mới',
      timestamp: '2025-04-14T10:15:00Z',
      senderId: 'user4',
      read: false,
    },
    unreadCount: 1,
  },
  {
    id: 'chat5',
    user: {
      id: 'user5',
      name: 'Hoàng Minh Tuấn',
      avatar: 'https://randomuser.me/api/portraits/men/78.jpg',
      online: true,
    },
    lastMessage: {
      text: 'Bạn có thể gửi cho mình bản demo không?',
      timestamp: '2025-04-16T08:30:00Z',
      senderId: 'user5',
      read: false,
    },
    unreadCount: 3,
  },
];

const ChatListScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const [chats, setChats] = useState<ChatPreview[]>(SAMPLE_CHATS);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Lọc chat theo từ khóa tìm kiếm
  const filteredChats = searchQuery
    ? chats.filter(chat =>
        chat.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.lastMessage.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : chats;
  
  // Định dạng thời gian
  const formatTime = (timestamp: string) => {
    const messageDate = new Date(timestamp);
    const now = new Date();
    
    const isToday = messageDate.toDateString() === now.toDateString();
    const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === messageDate.toDateString();
    
    if (isToday) {
      return messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (isYesterday) {
      return 'Hôm qua';
    } else {
      return messageDate.toLocaleDateString([], { day: '2-digit', month: '2-digit' });
    }
  };
  
  // Xử lý khi nhấn vào một chat
  const handleChatPress = (chatId: string) => {
    // Trong ứng dụng thực, đây sẽ là nơi điều hướng đến màn hình chi tiết chat
    console.log(`Mở chat id: ${chatId}`);
    
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
  const renderChatItem = ({ item }: { item: ChatPreview }) => (
    <TouchableOpacity
      style={[
        styles.chatItem,
        {
          backgroundColor: theme.colors.surface,
        },
      ]}
      onPress={() => handleChatPress(item.id)}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: item.user.avatar }}
          style={styles.avatar}
          defaultSource={require('../../assets/images/default-avatar.jpg')}
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
              },
            ]}
          >
            {item.user.name}
          </Text>
          <Text
            style={[
              styles.timestamp,
              {
                color: item.unreadCount > 0 
                  ? theme.colors.primary 
                  : isDarkMode ? '#AEAEB2' : '#8E8E93',
              },
            ]}
          >
            {formatTime(item.lastMessage.timestamp)}
          </Text>
        </View>
        
        <View style={styles.messageRow}>
          <Text
            style={[
              styles.messageText,
              {
                color: item.unreadCount > 0 
                  ? theme.colors.text 
                  : isDarkMode ? '#AEAEB2' : '#8E8E93',
                fontWeight: item.unreadCount > 0 ? FONT_WEIGHT.medium : FONT_WEIGHT.regular,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage.senderId === 'currentUser' ? 'Bạn: ' : ''}
            {item.lastMessage.text}
          </Text>
          
          {item.unreadCount > 0 && (
            <View
              style={[
                styles.unreadBadge,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              <Text style={styles.unreadCount}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
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
        
        <TouchableOpacity style={styles.newChatButton}>
          <Icon
            name="pencil"
            size={22}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Icon
              name="chat-outline"
              size={50}
              color={isDarkMode ? '#AEAEB2' : '#8E8E93'}
            />
            <Text
              style={[
                styles.emptyText,
                { color: isDarkMode ? '#AEAEB2' : '#8E8E93' },
              ]}
            >
              {searchQuery
                ? 'Không tìm thấy tin nhắn phù hợp'
                : 'Không có cuộc trò chuyện nào'}
            </Text>
          </View>
        )}
      />
      
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
      >
        <Icon name="message-plus" size={24} color="#FFFFFF" />
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
  },
  unreadBadge: {
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
    paddingHorizontal: 5,
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
  },
});

export default ChatListScreen; 