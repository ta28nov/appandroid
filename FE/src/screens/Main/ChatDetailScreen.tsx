import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { ChatStackParamList } from '../../navigation/types';
import { apiGetChatMessages, apiSendChatMessage } from '../../services/api';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { apiSearchUsers, apiCreateOrGetChat } from '../../services/api';
import { getSocket, disconnectSocket } from '../../services/socket';
import EmojiPicker from '../../components/common/EmojiPicker';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import FileAttachmentBar from '../../components/common/FileAttachmentBar';
import { apiUploadDocument } from '../../services/api';

interface Message {
  _id: string;
  text: string;
  timestamp: string;
  senderId: { _id: string; name: string; avatarUrl?: string };
  readBy?: string[];
  status?: 'sending' | 'sent' | 'read';
  file?: { url: string; name: string; type: string };
  reactions?: { [emoji: string]: string[] };
}

interface User {
  id: string;
  name: string;
  avatar?: string;
}

const ChatDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<ChatStackParamList, 'Chat'>>();
  const { chatId, chatName } = route.params || {};
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectingUser, setSelectingUser] = useState(!chatId);
  const [search, setSearch] = useState('');
  const [userResults, setUserResults] = useState<User[]>([]);
  const [error, setError] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [oldestMsgId, setOldestMsgId] = useState<string | null>(null);
  const [file, setFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [sending, setSending] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (chatId) fetchMessages();
  }, [chatId]);

  useEffect(() => {
    if (selectingUser && search.length > 1) {
      apiSearchUsers(search)
        .then(res => setUserResults(Array.isArray(res.data) ? res.data : []))
        .catch(() => setUserResults([]));
    } else {
      setUserResults([]);
    }
  }, [search, selectingUser]);

  // Lắng nghe socket nhận message realtime, cập nhật trạng thái đã đọc
  useEffect(() => {
    let socket: any;
    let joined = false;
    const setupSocket = async () => {
      socket = await getSocket();
      if (chatId) {
        socket.emit('joinChat', chatId);
        joined = true;
      }
      socket.on('chatMessage', (msg: any) => {
        setMessages(prev => {
          if (prev.some(m => m._id === msg._id)) return prev;
          return [...prev, {
            _id: msg._id,
            text: msg.text,
            timestamp: msg.timestamp,
            senderId: {
              _id: msg.senderId?._id || '',
              name: msg.senderId?.name || '',
              avatarUrl: msg.senderId?.avatarUrl || '',
            },
            readBy: msg.readBy || [],
            file: msg.file,
            status: msg.readBy && msg.readBy.length > 1 ? 'read' : 'sent',
            reactions: msg.reactions,
          }];
        });
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
      });
      // Lắng nghe cập nhật trạng thái đã đọc (nếu có socket event riêng)
      socket.on('messageRead', (msgId: string, readBy: string[]) => {
        setMessages(prev => prev.map(m => m._id === msgId ? { ...m, readBy, status: readBy.length > 1 ? 'read' : 'sent' } : m));
      });
    };
    setupSocket();
    return () => {
      if (socket && joined && chatId) socket.emit('leaveChat', chatId);
      disconnectSocket();
    };
  }, [chatId]);

  const fetchMessages = async (id = chatId as string) => {
    setLoading(true);
    try {
      const res = await apiGetChatMessages(id);
      const msgs: Message[] = Array.isArray(res.data)
        ? res.data.map((m: any) => ({
            _id: m._id,
            text: m.text,
            timestamp: m.timestamp,
            senderId: {
              _id: m.senderId?._id || '',
              name: m.senderId?.name || '',
              avatarUrl: m.senderId?.avatarUrl || '',
            },
          }))
        : [];
      setMessages(msgs);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: false }), 100);
    } catch (e) {
      setMessages([]);
    }
    setLoading(false);
  };

  const loadMore = async () => {
    if (!chatId || loadingMore || !hasMore || messages.length === 0) return;
    setLoadingMore(true);
    try {
      const res = await apiGetChatMessages(chatId as string, { before: messages[0]._id });
      const more: Message[] = Array.isArray(res.data)
        ? res.data.map((m: any) => ({
            _id: m._id,
            text: m.text,
            timestamp: m.timestamp,
            senderId: {
              _id: m.senderId?._id || '',
              name: m.senderId?.name || '',
              avatarUrl: m.senderId?.avatarUrl || '',
            },
          }))
        : [];
      if (more.length === 0) setHasMore(false);
      else setMessages(prev => [...more, ...prev]);
    } catch {}
    setLoadingMore(false);
  };

  const handleSend = async () => {
    if (!input.trim() || !chatId || !user) return;
    // Tạo message local với status 'sending'
    const tempId = `local-${Date.now()}`;
    const localMsg: Message = {
      _id: tempId,
      text: input.trim(),
      timestamp: new Date().toISOString(),
      senderId: { _id: user.id, name: user.name, avatarUrl: user.avatar },
      status: 'sending',
      readBy: [user.id],
    };
    setMessages(prev => [...prev, localMsg]);
    setInput('');
    try {
      const socket = await getSocket();
      socket.emit('sendMessage', { chatId, text: localMsg.text }, (serverMsg: any) => {
        // Khi server phản hồi, cập nhật message local thành message thật
        setMessages(prev => prev.map(m =>
          m._id === tempId ? {
            ...serverMsg,
            status: serverMsg.readBy && serverMsg.readBy.length > 1 ? 'read' : 'sent',
            senderId: {
              _id: serverMsg.senderId?._id || '',
              name: serverMsg.senderId?.name || '',
              avatarUrl: serverMsg.senderId?.avatarUrl || '',
            },
          } : m
        ));
      });
    } catch (e) {}
  };

  const handleSelectUser = async (u: User) => {
    setLoading(true);
    setError('');
    try {
      const res = await apiCreateOrGetChat(u.id);
      setSelectingUser(false);
      fetchMessages(res.data.id);
    } catch (e) {
      setError('Không thể tạo cuộc trò chuyện');
    }
    setLoading(false);
  };

  const handleEmoji = (emoji: string) => {
    setInput(input + emoji);
    setShowEmoji(false);
  };

  // Chọn file từ thiết bị
  const pickFile = async () => {
    const res = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true });
    if ('assets' in res && res.assets && res.assets.length > 0) {
      const fileAsset = res.assets[0];
      setFile({
        uri: fileAsset.uri,
        name: fileAsset.name || 'file',
        type: fileAsset.mimeType || 'application/octet-stream',
      });
    }
  };
  // Chọn ảnh từ thư viện
  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      const img = res.assets[0];
      setFile({ uri: img.uri, name: img.fileName || 'image.jpg', type: img.type || 'image/jpeg' });
    }
  };

  // Gửi file (upload lên server, gửi link qua chat)
  const handleSendFile = async () => {
    if (!file || !chatId) return;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append('file', { uri: file.uri, name: file.name, type: file.type } as any);
      const res = await apiUploadDocument(formData);
      // Sau khi upload thành công, gửi link file qua chat
      const url = res.data?.url || res.data?.downloadUrl || res.data?.fileUrl || '';
      if (url) {
        const socket = await getSocket();
        socket.emit('sendMessage', { chatId, text: `[file]${url}[/file]`, file: { name: file.name, url, type: file.type } });
      }
      setFile(null);
    } catch {}
    setSending(false);
  };

  // Preview ảnh động gif
  const isGif = (uri: string) => uri?.toLowerCase().endsWith('.gif');

  const renderMessage = ({ item }: { item: Message }) => {
    const isMe = user && item.senderId._id === user.id;
    // Xử lý preview file/ảnh
    let filePreview = null;
    if (item.file && item.file.url) {
      if (item.file.type.startsWith('image/')) {
        filePreview = (
          <TouchableOpacity onPress={() => {/* TODO: mở ảnh full screen */}}>
            {isGif(item.file.url) ? (
              <Image
                source={{ uri: item.file.url }}
                style={styles.filePreviewImage}
                resizeMode="contain"
              />
            ) : (
              <Image
                source={{ uri: item.file.url }}
                style={styles.filePreviewImage}
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>
        );
      } else {
        filePreview = (
          <TouchableOpacity onPress={() => {/* TODO: mở file */}} style={styles.filePreviewRow}>
            <Icon name="file" size={20} color={theme.colors.primary} />
            <Text style={styles.filePreviewText}>{item.file.name}</Text>
          </TouchableOpacity>
        );
      }
    }
    // Xử lý text nếu là file dạng [file]url[/file]
    let messageText = item.text;
    const fileTagMatch = item.text.match(/\[file](.+)\[\/file]/);
    if (fileTagMatch && fileTagMatch[1]) {
      messageText = '';
      if (!filePreview) {
        // Nếu backend chưa trả về file object, vẫn render link
        filePreview = (
          <TouchableOpacity onPress={() => {/* TODO: mở file */}} style={styles.filePreviewRow}>
            <Icon name="file" size={20} color={theme.colors.primary} />
            <Text style={styles.filePreviewText}>Tệp đính kèm</Text>
          </TouchableOpacity>
        );
      }
    }
    return (
      <View style={[styles.messageRow, { flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end' }]}> 
        <Image
          source={item.senderId.avatarUrl ? { uri: item.senderId.avatarUrl } : require('../../assets/images/default-avatar.jpg')}
          style={styles.avatar}
        />
        <View style={[styles.bubble, { backgroundColor: isMe ? theme.colors.primary : theme.colors.surface }]}> 
          {filePreview}
          {messageText ? <Text style={{ color: isMe ? '#fff' : theme.colors.text }}>{messageText}</Text> : null}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <Text style={styles.time}>{formatTime(item.timestamp)}</Text>
            {/* Trạng thái gửi/đã đọc */}
            {isMe && (
              <>
                {item.status === 'sending' && <Icon name="clock-outline" size={16} color="#aaa" style={{ marginLeft: 6 }} />}
                {item.status === 'sent' && <Icon name="check" size={16} color="#aaa" style={{ marginLeft: 6 }} />}
                {item.status === 'read' && <Icon name="check-all" size={16} color={theme.colors.primary} style={{ marginLeft: 6 }} />}
              </>
            )}
          </View>
          {/* TODO: Hiển thị reactions, mention nếu có */}
        </View>
      </View>
    );
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (selectingUser) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'flex-start' }]}> 
        <View style={styles.header}><Text style={styles.title}>Chọn người để bắt đầu chat</Text></View>
        <TextInput
          style={[styles.input, { margin: 16, color: theme.colors.text }]}
          placeholder="Tìm kiếm tên người dùng..."
          placeholderTextColor={isDarkMode ? '#AEAEB2' : '#8E8E93'}
          value={search}
          onChangeText={setSearch}
        />
        {userResults.length === 0 && search.length > 1 && <Text style={{ textAlign: 'center', color: '#888' }}>Không tìm thấy người dùng</Text>}
        <FlatList
          data={userResults}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: 12 }} onPress={() => handleSelectUser(item)}>
              <Image source={item.avatar ? { uri: item.avatar } : require('../../assets/images/default-avatar.jpg')} style={styles.avatar} />
              <Text style={{ marginLeft: 12, color: theme.colors.text }}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
        {error ? <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text> : null}
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}> 
        <View style={styles.header}>
          <Text style={styles.title}>{chatName || 'Người dùng'}</Text>
        </View>
        {loading ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>Đang tải tin nhắn...</Text>
        ) : messages.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#888' }}>Chưa có tin nhắn nào</Text>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.messageList}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            onEndReached={loadMore}
            onEndReachedThreshold={0.05}
            ListHeaderComponent={loadingMore ? <Text style={{ textAlign: 'center', color: '#888' }}>Đang tải...</Text> : null}
            inverted={false}
          />
        )}
        <View style={[styles.inputRow, { backgroundColor: theme.colors.surface }]}> 
          <TouchableOpacity onPress={() => setShowEmoji(true)} style={{ padding: 4 }}>
            <Icon name="emoticon-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage} style={{ padding: 4 }}>
            <Icon name="image-outline" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={pickFile} style={{ padding: 4 }}>
            <Icon name="paperclip" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <TextInput
            style={[styles.input, { color: theme.colors.text }]}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor={isDarkMode ? '#AEAEB2' : '#8E8E93'}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            editable={!sending}
          />
          <TouchableOpacity onPress={handleSend} style={styles.sendBtn} disabled={sending}>
            <Icon name="send" size={24} color={sending ? '#ccc' : theme.colors.primary} />
          </TouchableOpacity>
        </View>
        <FileAttachmentBar file={file} onRemove={() => setFile(null)} />
        {file && (
          <TouchableOpacity style={{ alignSelf: 'flex-end', margin: 8 }} onPress={handleSendFile} disabled={sending}>
            <Text style={{ color: theme.colors.primary, fontWeight: 'bold' }}>{sending ? 'Đang gửi...' : 'Gửi file'}</Text>
          </TouchableOpacity>
        )}
        <EmojiPicker visible={showEmoji} onSelect={handleEmoji} onClose={() => setShowEmoji(false)} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    shadowColor: '#2979FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  title: { fontSize: 19, fontWeight: '700', color: '#2979FF', fontFamily: 'Poppins' },
  messageList: { padding: 12, flexGrow: 1 },
  messageRow: { marginBottom: 16, alignItems: 'flex-end' },
  bubble: {
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginLeft: 8,
    maxWidth: '78%',
    backgroundColor: '#F5F7FB',
    shadowColor: '#2979FF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 1,
  },
  time: { fontSize: 12, color: '#888', marginTop: 4, fontFamily: 'Inter' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#eee', marginHorizontal: 2 },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FAFAFA',
    shadowColor: '#2979FF',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    padding: 10,
    backgroundColor: '#F5F7FB',
    borderRadius: 12,
    marginHorizontal: 8,
    fontFamily: 'Inter',
  },
  sendBtn: {
    padding: 10,
    backgroundColor: '#2979FF',
    borderRadius: 24,
    marginLeft: 4,
    shadowColor: '#2979FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  filePreviewImage: {
    width: 180,
    height: 120,
    borderRadius: 10,
    marginBottom: 6,
    backgroundColor: '#E0E0E0',
  },
  filePreviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  filePreviewText: {
    marginLeft: 8,
    color: '#2979FF',
    fontWeight: '600',
    fontSize: 15,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter', // Đảm bảo fontFamily đúng, đã load bằng expo-font
    color: '#222',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    fontFamily: 'Inter', // Đảm bảo fontFamily đúng
  },
  senderName: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins', // Đảm bảo fontFamily đúng
  },
  emptyText: {
    marginTop: 32,
    textAlign: 'center',
    color: '#888',
    fontFamily: 'Inter', // Đảm bảo fontFamily đúng
  },
});

export default ChatDetailScreen;
