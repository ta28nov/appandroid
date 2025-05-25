import React, { useEffect, useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image, ActivityIndicator, Alert } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChatStackParamList } from '../../navigation/types';
import { apiGetChatMessages, apiSendChatMessage, ChatMessageData, UserSnippet } from '../../services/api';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useTempAuth } from '../../contexts/TempAuthContext';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '../../styles/globalStyles';

const formatMessageTimestamp = (isoDateString?: string) => {
  if (!isoDateString) return '';
  const date = new Date(isoDateString);
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const ChatDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<ChatStackParamList, 'Chat'>>();
  const navigation = useNavigation<StackNavigationProp<ChatStackParamList>>();
  const { theme, isDarkMode } = useTheme();
  const { user: currentUser } = useTempAuth();
  
  const { chatId, chatName, chatAvatar } = route.params;

  const [messages, setMessages] = useState<ChatMessageData[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    navigation.setOptions({
      title: chatName || 'Chat',
    });
  }, [navigation, chatName, chatAvatar, theme.colors.text]);

  const fetchMessages = useCallback(async () => {
    if (!chatId) return;
    setLoadingMessages(true);
    setError(null);
    try {
      const response = await apiGetChatMessages(chatId, { limit: 50 });
      const sortedMessages = response.data.sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      setMessages(sortedMessages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      setError('Không thể tải tin nhắn. Vui lòng thử lại.');
    } finally {
      setLoadingMessages(false);
    }
  }, [chatId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages, chatId]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || !currentUser || !chatId || sendingMessage) return;
    
    const tempMessageId = `temp-${Date.now()}`;
    const newMessage: ChatMessageData = {
      _id: tempMessageId,
      chatId: chatId,
      senderId: {
        _id: currentUser._id,
        name: currentUser.name || currentUser.username || 'Bạn',
        avatarUrl: currentUser.avatarUrl,
      },
      text: inputText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prevMessages => [...prevMessages, newMessage]);
    setInputText('');
    flatListRef.current?.scrollToEnd({ animated: true });
    setSendingMessage(true);

    try {
      const response = await apiSendChatMessage(chatId, { text: newMessage.text });
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg._id === tempMessageId ? { ...response.data, senderId: newMessage.senderId } : msg
        )
      );
    } catch (err) {
      console.error("Error sending message:", err);
      Alert.alert('Lỗi', 'Không thể gửi tin nhắn. Vui lòng thử lại.');
      setMessages(prevMessages => prevMessages.filter(msg => msg._id !== tempMessageId));
    } finally {
      setSendingMessage(false); 
    }
  };

  const renderMessageItem = ({ item }: { item: ChatMessageData }) => {
    if (!currentUser) return null;
    const isCurrentUserSender = (typeof item.senderId === 'object' ? item.senderId._id : item.senderId) === currentUser._id;
    
    const senderInfo = typeof item.senderId === 'object' ? item.senderId : null;

    return (
      <View 
        style={[
          styles.messageRow,
          { justifyContent: isCurrentUserSender ? 'flex-end' : 'flex-start' },
        ]}
      >
        {!isCurrentUserSender && senderInfo?.avatarUrl && (
          <Image source={{ uri: senderInfo.avatarUrl }} style={styles.avatar} />
        )}
        {!isCurrentUserSender && !senderInfo?.avatarUrl && (
            <View style={[styles.avatar, {backgroundColor: theme.colors.placeholder}]} >
                <Text style={styles.avatarText}>
                    {senderInfo?.name?.charAt(0) || senderInfo?.username?.charAt(0) || 'U'}
                </Text>
            </View>
        )}
        <View 
          style={[
            styles.messageBubble,
            isCurrentUserSender ? styles.currentUserBubble : styles.otherUserBubble,
            { backgroundColor: isCurrentUserSender 
                ? '#007AFF'
                : '#E5E5EA'
            }
          ]}
        >
          {!isCurrentUserSender && senderInfo && (
            <Text style={[styles.senderName]}>
              {senderInfo.name || senderInfo.username}
            </Text>
          )}
          <Text style={[styles.messageText, {color: isCurrentUserSender ? '#FFFFFF' : '#000000'}]}>{item.text}</Text>
          <Text style={[styles.timestamp, {color: isCurrentUserSender ? '#FFFFFF' : '#666666', opacity: isCurrentUserSender ? 0.8 : 1}]}>
            {formatMessageTimestamp(item.timestamp)}
          </Text>
        </View>
        {isCurrentUserSender && currentUser.avatarUrl && (
          <Image source={{ uri: currentUser.avatarUrl }} style={styles.avatar} />
        )}
         {isCurrentUserSender && !currentUser.avatarUrl && (
            <View style={[styles.avatar, {backgroundColor: theme.colors.primary}]} >
                 <Text style={styles.avatarText}>{(currentUser.name || currentUser.username || 'M').charAt(0)}</Text>
            </View>
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.colors.background },
    messageListContainer: { flex: 1 },
    messageRow: {
      flexDirection: 'row',
      marginVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      alignItems: 'flex-end',
    },
    messageBubble: {
      paddingVertical: SPACING.sm + 2,
      paddingHorizontal: SPACING.md,
      borderRadius: 18,
      maxWidth: '78%',
      elevation: 1, 
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1.5,
    },
    currentUserBubble: {
      marginLeft: SPACING.xs,
      backgroundColor: '#007AFF',
    },
    otherUserBubble: {
      marginRight: SPACING.xs,
      backgroundColor: '#E5E5EA',
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginHorizontal: SPACING.xs,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
        color: theme.colors.onPrimary,
        fontSize: FONT_SIZE.subtitle,
        fontWeight: FONT_WEIGHT.medium,
    },
    senderName: {
      fontSize: FONT_SIZE.small,
      fontWeight: FONT_WEIGHT.medium,
      marginBottom: SPACING.xs / 2,
      color: '#333333',
    },
    messageText: {
      fontSize: FONT_SIZE.body,
      lineHeight: FONT_SIZE.body * 1.4,
    },
    timestamp: {
      fontSize: FONT_SIZE.small - 2,
      marginTop: SPACING.xs / 2,
      alignSelf: 'flex-end',
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.xs,
      borderTopWidth: 1,
      borderTopColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      backgroundColor: theme.colors.surface,
    },
    inputActionsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: SPACING.sm / 1.5,
    },
    actionButton: {
      padding: SPACING.sm,
    },
    textInput: {
      flex: 1,
      minHeight: 44,
      maxHeight: 120,
      backgroundColor: '#F2F2F7',
      borderRadius: 22,
      paddingHorizontal: SPACING.md,
      paddingTop: Platform.OS === 'ios' ? SPACING.sm + 2 : SPACING.sm,
      paddingBottom: SPACING.sm,
      fontSize: FONT_SIZE.body,
      color: '#000000',
      marginLeft: SPACING.xs,
      marginRight: SPACING.xs,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: SPACING.xs,
      marginBottom: Platform.OS === 'android' ? (SPACING.xs /2) : 0,
    },
    centeredMessageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.lg,
    },
    emptyMessageText: {
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
  });

  if (loadingMessages && messages.length === 0) {
    return (
      <View style={styles.centeredMessageContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredMessageContainer}>
        <Icon name="alert-circle-outline" size={48} color={theme.colors.error} />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchMessages} style={{padding: SPACING.sm, backgroundColor: theme.colors.primary, borderRadius: 8}}>
            <Text style={{color: theme.colors.onPrimary}}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <View style={styles.messageListContainer}>
        {messages.length === 0 && !loadingMessages && (
            <View style={styles.centeredMessageContainer}>
                 <Icon name="message-text-outline" size={60} color={theme.colors.placeholder} />
                <Text style={styles.emptyMessageText}>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!</Text>
            </View>
        )}
        {messages.length > 0 && 
            <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item._id.toString()}
            contentContainerStyle={{ paddingVertical: SPACING.md }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
            />
        }
      </View>
      
      <View style={styles.inputContainer}>
        <View style={styles.inputActionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert("Thông báo", "Chức năng đính kèm file/ảnh sẽ sớm được cập nhật.")}>
            <Icon name="paperclip" size={24} color={theme.colors.placeholder} />
          </TouchableOpacity>
          {/* Bạn có thể thêm một nút camera ở đây nếu muốn */}
          {/* <TouchableOpacity style={styles.actionButton} onPress={() => Alert.alert("Thông báo", "Chức năng chụp ảnh sẽ sớm được cập nhật.")}>
            <Icon name="camera-outline" size={24} color={theme.colors.placeholder} />
          </TouchableOpacity> */}
        </View>
        <TextInput
          style={styles.textInput}
          placeholder="Nhập tin nhắn..."
          placeholderTextColor={ 'rgba(60, 60, 67, 0.6)' }
          value={inputText}
          onChangeText={setInputText}
          multiline
          editable={!sendingMessage}
        />
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => Alert.alert("Thông báo", "Chức năng chọn Emoji sẽ sớm được cập nhật.")}
        >
          <Icon name="emoticon-happy-outline" size={24} color={theme.colors.placeholder} />
        </TouchableOpacity>
        <TouchableOpacity
            style={[
                styles.sendButton,
                (sendingMessage || !inputText.trim()) && { backgroundColor: theme.colors.disabled }
            ]}
            onPress={handleSendMessage}
            disabled={sendingMessage || !inputText.trim()}
        >
          {sendingMessage ? (
            <ActivityIndicator size="small" color={theme.colors.onPrimary} />
          ) : (
            <Icon name="send" size={22} color={theme.colors.onPrimary} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatDetailScreen;
