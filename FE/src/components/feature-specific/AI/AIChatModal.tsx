import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../hooks/useTheme'; // Corrected path
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '../../../styles/globalStyles'; // Import named constants

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

interface AIChatModalProps {
  visible: boolean;
  onClose: () => void;
}

const AIChatModal: React.FC<AIChatModalProps> = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Bạn cần tôi giúp gì?',
      sender: 'ai',
    },
  ]);
  const [inputText, setInputText] = useState('');

  // Mock function to simulate sending message and getting AI response
  const handleSendMessage = () => {
    if (inputText.trim().length === 0) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      text: inputText.trim(),
      sender: 'user',
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputText('');

    // Simulate AI thinking and responding
    setTimeout(() => {
      const aiResponse: Message = {
        id: Math.random().toString(),
        text: `AI đang xử lý: "${userMessage.text}". Phản hồi mẫu sẽ được thêm sau.`, // Placeholder response
        sender: 'ai',
      };
      setMessages(prevMessages => [...prevMessages, aiResponse]);
    }, 1000);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View
      style={[
        styles.messageBubble,
        item.sender === 'user' ? styles.userMessage : styles.aiMessage,
      ]}
    >
      <Text
        style={item.sender === 'user' ? styles.userMessageText : styles.aiMessageText}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} // Adjust as needed
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>AI Chatbot</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Message List */}
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item.id}
            style={styles.messageList}
            contentContainerStyle={styles.messageListContent}
            inverted // Show latest messages at the bottom
          />

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Nhập câu hỏi của bạn..."
              placeholderTextColor={theme.colors.secondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Icon name="send" size={24} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  headerTitle: {
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
    color: theme.colors.text,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  messageList: {
    flex: 1,
    paddingHorizontal: SPACING.md,
  },
  messageListContent: {
    paddingVertical: SPACING.md,
    // Since list is inverted, padding bottom works like padding top
    paddingBottom: SPACING.md, 
  },
  messageBubble: {
    maxWidth: '80%',
    padding: SPACING.sm,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  userMessage: {
    backgroundColor: theme.colors.primary,
    alignSelf: 'flex-end',
    borderBottomRightRadius: 0,
  },
  aiMessage: {
    backgroundColor: theme.colors.surface,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderBottomLeftRadius: 0,
  },
  userMessageText: {
    color: theme.colors.buttonText || '#FFFFFF',
    fontSize: FONT_SIZE.body,
  },
  aiMessageText: {
    color: theme.colors.text,
    fontSize: FONT_SIZE.body,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120, // Limit input height
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZE.body,
    color: theme.colors.text,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  sendButton: {
    padding: SPACING.sm,
  },
});

export default AIChatModal; 