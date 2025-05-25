import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '../../styles/globalStyles';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChatStackParamList } from '../../navigation/types';
import { ROUTES } from '../../utils/constants';
import { apiSearchUsers, UserSnippet, apiCreateOrGetChat, ChatData } from '../../services/api';
import { useTempAuth } from '../../contexts/TempAuthContext'; // Sử dụng context tạm thời

const CreateChatUserSelectionScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const navigation = useNavigation<StackNavigationProp<ChatStackParamList>>();
  const { user: currentUser } = useTempAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<UserSnippet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
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
    searchInput: {
      flex: 1,
      height: 44,
      backgroundColor: '#F2F2F7',
      borderRadius: 22,
      paddingHorizontal: SPACING.md,
      marginRight: SPACING.sm,
      fontSize: FONT_SIZE.body,
      color: '#000000',
    },
    userItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: SPACING.md,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)',
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: SPACING.sm,
      backgroundColor: theme.colors.placeholder,
    },
    userName: {
      fontSize: FONT_SIZE.body,
      color: theme.colors.text,
      fontWeight: FONT_WEIGHT.medium,
    },
    centeredMessage: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.lg,
    },
    messageText: {
      marginTop: SPACING.sm,
      fontSize: FONT_SIZE.body,
      color: theme.colors.placeholder,
      textAlign: 'center',
    },
    loadingIndicator: {
        marginTop: SPACING.lg,
    }
  });

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) { // Chỉ tìm khi query đủ dài
      setUsers([]);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiSearchUsers(query);
      // Lọc ra user hiện tại khỏi kết quả tìm kiếm
      setUsers(response.data.filter((u: UserSnippet) => u._id !== currentUser?._id) || []); 
    } catch (err) {
      console.error("Error searching users:", err);
      setError('Không thể tìm kiếm người dùng.');
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser?._id]);

  const handleSelectUser = async (selectedUser: UserSnippet) => {
    if (isCreatingChat || !currentUser) return;
    setIsCreatingChat(true);
    try {
      const response = await apiCreateOrGetChat(selectedUser._id);
      const chat: ChatData = response.data;
      navigation.replace(ROUTES.MAIN.CHAT, { // Replace để không quay lại màn hình chọn user
        chatId: chat._id,
        chatName: selectedUser.name || selectedUser.username || 'Chat',
        chatAvatar: selectedUser.avatarUrl,
      });
    } catch (err) {
      console.error("Error creating or getting chat:", err);
      Alert.alert('Lỗi', 'Không thể tạo cuộc trò chuyện. Vui lòng thử lại.');
    } finally {
      setIsCreatingChat(false);
    }
  };

  const renderUserItem = ({ item }: { item: UserSnippet }) => (
    <TouchableOpacity style={styles.userItem} onPress={() => handleSelectUser(item)} disabled={isCreatingChat}>
      <Image 
        source={item.avatarUrl ? { uri: item.avatarUrl } : require('../../assets/images/default-avatar.jpg')} 
        style={styles.avatar} 
      />
      <Text style={styles.userName}>{item.name || item.username || 'Người dùng'}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    // Tùy chọn: Tự động focus vào search input khi màn hình mở
    // Hoặc load danh sách gợi ý ban đầu nếu cần
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm người dùng..."
          placeholderTextColor={'rgba(60, 60, 67, 0.6)'}
          value={searchQuery}
          onChangeText={handleSearch}
          autoFocus={true}
        />
        {isLoading && <ActivityIndicator size="small" color={theme.colors.primary} />}
      </View>

      {isCreatingChat && (
          <View style={styles.centeredMessage}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.messageText}>Đang tạo cuộc trò chuyện...</Text>
          </View>
      )}

      {!isCreatingChat && error && (
        <View style={styles.centeredMessage}>
          <Icon name="alert-circle-outline" size={48} color={theme.colors.error} />
          <Text style={styles.messageText}>{error}</Text>
        </View>
      )}

      {!isCreatingChat && !error && searchQuery.trim().length >=2 && users.length === 0 && !isLoading && (
        <View style={styles.centeredMessage}>
          <Icon name="account-search-outline" size={48} color={theme.colors.placeholder} />
          <Text style={styles.messageText}>Không tìm thấy người dùng nào.</Text>
        </View>
      )}
      
      {!isCreatingChat && !error && searchQuery.trim().length < 2 && users.length === 0 && (
         <View style={styles.centeredMessage}>
          <Icon name="account-search-outline" size={48} color={theme.colors.placeholder} />
          <Text style={styles.messageText}>Nhập ít nhất 2 ký tự để tìm kiếm.</Text>
        </View>
      )}

      {!isCreatingChat && (
        <FlatList
          data={users}
          renderItem={renderUserItem}
          keyExtractor={(item) => item._id}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </View>
  );
};

export default CreateChatUserSelectionScreen; 