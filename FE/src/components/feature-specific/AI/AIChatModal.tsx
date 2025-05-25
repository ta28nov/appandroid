import React, { useState, useEffect } from 'react';

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
  const [isLoadingAiResponse, setIsLoadingAiResponse] = useState(false);

  // IMPORTANT: API Key Management
  // This is NOT secure for a production app. 
  // API keys should be managed via a backend or a secure configuration service.
  const AI_API_KEY = 'AIzaSyBcrSfjwkjZcmk8xk8TCOY1BgCrWMridXc'; // Gemini API Key provided by user
  // const AI_API_ENDPOINT_OLD = 'https://api.openai.com/v1/chat/completions'; // Example: OpenAI
  // Using gemini-1.5-flash-latest as it's a newer and recommended model for fast chat.
  // const AI_API_ENDPOINT_OLD_GEMINI = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${AI_API_KEY}`;
  const AI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${AI_API_KEY}`;

  const handleSendMessage = async () => {
    if (inputText.trim().length === 0) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      text: inputText.trim(),
      sender: 'user',
    };

    setMessages(prevMessages => [userMessage, ...prevMessages]); // Show user message immediately (inverted list)
    setInputText('');
    setIsLoadingAiResponse(true);

    try {
      // Construct the request payload for Gemini API
      const payload = {
        contents: [
          {
            parts: [{ text: userMessage.text }],
          },
        ],
        // Optional: Add generationConfig if needed (e.g., temperature, maxOutputTokens)
        // generationConfig: {
        //   temperature: 0.7,
        //   maxOutputTokens: 256,
        // },
      };

      const response = await fetch(AI_API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // For Gemini, API key is in the URL, no separate Authorization header needed for this basic setup
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: { message: 'Lỗi không xác định từ API Gemini' } }));
        console.error('Gemini API Error:', response.status, errorData);
        // Gemini errors are often in errorData.error.message
        throw new Error(`Lỗi API Gemini: ${response.status} - ${errorData.error?.message || 'Kiểm tra console.'}`);
      }

      const responseData = await response.json();
      
      // Extract the AI's reply from Gemini response
      // Accessing the text from the first part of the first candidate's content
      let aiText = 'Xin lỗi, tôi không thể xử lý yêu cầu này.'; // Default error message
      if (responseData.candidates && responseData.candidates.length > 0 &&
          responseData.candidates[0].content && responseData.candidates[0].content.parts &&
          responseData.candidates[0].content.parts.length > 0 && responseData.candidates[0].content.parts[0].text) {
        aiText = responseData.candidates[0].content.parts[0].text.trim();
      } else {
        // Handle cases where the response might be structured differently or be a safety block
        if (responseData.promptFeedback && responseData.promptFeedback.blockReason) {
          aiText = `Yêu cầu của bạn đã bị chặn vì: ${responseData.promptFeedback.blockReason}`;
          if(responseData.promptFeedback.safetyRatings && responseData.promptFeedback.safetyRatings.length > 0) {
            const blockedCategories = responseData.promptFeedback.safetyRatings
                                        .filter((rating: any) => rating.blocked)
                                        .map((rating: any) => rating.category);
            if (blockedCategories.length > 0) {
              aiText += ` (Danh mục: ${blockedCategories.join(', ')})`;
            }
          }
        } else {
            console.warn('Gemini response structure not as expected or empty:', responseData);
        }
      }

      const aiMessage: Message = {
        id: Math.random().toString(),
        text: aiText,
        sender: 'ai',
      };
      setMessages(prevMessages => [aiMessage, ...prevMessages]);

    } catch (error) {
      console.error('Error sending message to AI:', error);
      const errorMessage: Message = {
        id: Math.random().toString(),
        text: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
        sender: 'ai',
      };
      setMessages(prevMessages => [errorMessage, ...prevMessages]);
    } finally {
      setIsLoadingAiResponse(false);
    }
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
              editable={!isLoadingAiResponse} // Disable input while AI is responding
            />
            <TouchableOpacity 
              style={[styles.sendButton, isLoadingAiResponse && styles.disabledSendButton]} 
              onPress={handleSendMessage} 
              disabled={isLoadingAiResponse}
            >
              {isLoadingAiResponse ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <Icon name="send" size={24} color={theme.colors.primary} />
              )}
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
  disabledSendButton: { // Style for disabled send button
    opacity: 0.5,
  }
});

export default AIChatModal; 