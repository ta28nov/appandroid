import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ForumStackParamList } from '../../navigation/types';
import { ROUTES } from '../../utils/constants';
import { useTheme } from '../../hooks/useTheme';
import { apiGetForumPostById, apiCreateForumPost, apiUpdateForumPost, apiGetForumTags, CreateForumPostPayload, ForumTag } from '../../services/api';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '../../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type CreateForumPostScreenRouteProp = RouteProp<ForumStackParamList, typeof ROUTES.MAIN.CREATE_FORUM_POST>;
type CreateForumPostNavigationProp = StackNavigationProp<ForumStackParamList, typeof ROUTES.MAIN.CREATE_FORUM_POST>;

const CreateForumPostScreen: React.FC = () => {
  const { theme, isDarkMode } = useTheme();
  const route = useRoute<CreateForumPostScreenRouteProp>();
  const navigation = useNavigation<CreateForumPostNavigationProp>();
  const postId = route.params?.postId;
  const isEditing = !!postId;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState(''); // Chuỗi người dùng nhập, vd: "react, native"
  const [selectedTags, setSelectedTags] = useState<string[]>([]); // Mảng các tag đã chọn/nhập
  const [allAvailableTags, setAllAvailableTags] = useState<ForumTag[]>([]); // Danh sách tag gợi ý

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Bọc handleSavePost bằng useCallback
  const handleSavePost = useCallback(async () => {
    if (!title.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập tiêu đề bài đăng.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập nội dung bài đăng.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const payload: CreateForumPostPayload = {
      title: title.trim(),
      content: content.trim(),
      // Đảm bảo tags là duy nhất và không rỗng
      tags: Array.from(new Set(selectedTags.map(tag => tag.trim()).filter(tag => tag !== ''))),
    };

    try {
      let response;
      if (isEditing && postId) {
        response = await apiUpdateForumPost(postId, payload);
      } else {
        response = await apiCreateForumPost(payload);
      }

      if (response.data) {
        Alert.alert('Thành công', isEditing ? 'Bài đăng đã được cập nhật.' : 'Bài đăng đã được tạo thành công.');
        
        // navigation.goBack() sẽ kích hoạt useFocusEffect ở ForumScreen để refresh
        navigation.goBack();
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Đã có lỗi xảy ra khi lưu bài đăng. Vui lòng thử lại.';
      setError(errorMessage);
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  }, [isEditing, postId, title, content, selectedTags, navigation]); // Dependencies cho useCallback

  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Chỉnh sửa Bài đăng' : 'Tạo Bài đăng mới',
      headerRight: () => (
        <TouchableOpacity 
          onPress={handleSavePost} 
          disabled={isSubmitting || !title.trim() || !content.trim()} // Vô hiệu hóa nếu đang gửi hoặc tiêu đề/nội dung trống
          style={{ marginRight: SPACING.md, paddingVertical: SPACING.xs }} // Thêm padding cho dễ nhấn
        >
          {isSubmitting 
            ? <ActivityIndicator size="small" color={theme.colors.primary} /> 
            : <Text style={{ 
                color: (!title.trim() || !content.trim()) ? theme.colors.disabled : theme.colors.primary, // Màu chữ thay đổi khi bị vô hiệu hóa
                fontSize: FONT_SIZE.body, 
                fontWeight: FONT_WEIGHT.medium 
              }}>{isEditing ? 'Lưu' : 'Đăng'}</Text>
          }
        </TouchableOpacity>
      ),
    });
  }, [navigation, isEditing, isSubmitting, title, content, handleSavePost, theme.colors.primary, theme.colors.disabled]); // Cập nhật dependencies

  useEffect(() => {
    const fetchPostDetails = async () => {
      if (isEditing && postId) {
        setIsLoading(true);
        setError(null);
        try {
          const response = await apiGetForumPostById(postId);
          if (response.data) {
            setTitle(response.data.title);
            setContent(response.data.content);
            setSelectedTags(response.data.tags || []);
            setTagsInput((response.data.tags || []).join(', ')); 
          }
        } catch (err) {
          setError('Không thể tải dữ liệu bài đăng.');
        } finally {
          setIsLoading(false);
        }
      }
    };

    const fetchTags = async () => {
        try {
            const response = await apiGetForumTags();
            if(response.data && response.data.tags){
                setAllAvailableTags(response.data.tags);
            }
        } catch (error) {
            console.warn("Không thể tải danh sách tags", error)
        }
    }

    fetchPostDetails();
    fetchTags();
  }, [postId, isEditing]);

  const handleTagsInputChange = (text: string) => {
    setTagsInput(text);
    // Tách chuỗi thành mảng các tag, loại bỏ khoảng trắng thừa, các tag rỗng và đảm bảo duy nhất
    const currentTags = Array.from(new Set(text.split(',').map(tag => tag.trim()).filter(tag => tag !== '')));
    setSelectedTags(currentTags);
  };

  const toggleTagSelection = (tagName: string) => {
    const trimmedTagName = tagName.trim();
    if (!trimmedTagName) return;

    setSelectedTags(prevTags => {
        const newTagsSet = new Set(prevTags);
        if (newTagsSet.has(trimmedTagName)) {
            newTagsSet.delete(trimmedTagName);
        } else {
            newTagsSet.add(trimmedTagName);
        }
        const newTagsArray = Array.from(newTagsSet);
        setTagsInput(newTagsArray.join(', '));
        return newTagsArray;
    });
  }

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={{ color: theme.colors.text, marginTop: SPACING.sm }}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0} // Adjust as needed
    >
      <ScrollView 
        style={[styles.container, { backgroundColor: theme.colors.background }]}
        contentContainerStyle={styles.scrollContentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {error && <Text style={[styles.errorText, { color: theme.colors.error }]}>{error}</Text>}

        <Text style={[styles.label, { color: theme.colors.text }]}>Tiêu đề</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: isDarkMode ? '#4A4A4A' : theme.colors.placeholder }]}
          placeholder="Nhập tiêu đề bài viết của bạn..."
          placeholderTextColor={theme.colors.placeholder}
          value={title}
          onChangeText={setTitle}
          maxLength={150}
        />

        <Text style={[styles.label, { color: theme.colors.text }]}>Nội dung</Text>
        <TextInput
          style={[
            styles.input,
            styles.textArea,
            { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: isDarkMode ? '#4A4A4A' : theme.colors.placeholder }
          ]}
          placeholder="Chia sẻ suy nghĩ của bạn..."
          placeholderTextColor={theme.colors.placeholder}
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={8}
          textAlignVertical="top"
        />

        <Text style={[styles.label, { color: theme.colors.text }]}>Tags (cách nhau bởi dấu phẩy)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.surface, color: theme.colors.text, borderColor: isDarkMode ? '#4A4A4A' : theme.colors.placeholder }]}
          placeholder="Ví dụ: react, phát triển ứng dụng, javascript"
          placeholderTextColor={theme.colors.placeholder}
          value={tagsInput}
          onChangeText={handleTagsInputChange}
        />
        <View style={styles.tagsContainer}>
          {selectedTags.map((tag, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.tagChip, { backgroundColor: theme.colors.primary }]} 
              onPress={() => toggleTagSelection(tag)}
            >
              <Text style={[styles.tagChipText, { color: theme.colors.onPrimary }]}>{tag}</Text>
              <Icon name="close-circle" size={16} color={theme.colors.onPrimary} style={{marginLeft: SPACING.xs}}/>
            </TouchableOpacity>
          ))}
        </View>

        {allAvailableTags.length > 0 && (
            <View style={{marginTop: SPACING.md}}>
                <Text style={[styles.label, { color: theme.colors.text, marginBottom: SPACING.sm }]}>Hoặc chọn từ các tag phổ biến:</Text>
                <View style={styles.tagsContainer}>
                {allAvailableTags.map((tag, index) => (
                    <TouchableOpacity 
                    key={tag._id} 
                    style={[
                        styles.tagChip,
                        selectedTags.includes(tag.name) 
                            ? { backgroundColor: theme.colors.primary } 
                            : { backgroundColor: theme.colors.surface, borderWidth:1, borderColor: isDarkMode ? '#555555' : theme.colors.placeholder }
                    ]} 
                    onPress={() => toggleTagSelection(tag.name)}
                    >
                    <Text style={[
                        styles.tagChipText, 
                        selectedTags.includes(tag.name) ? { color: theme.colors.onPrimary } : { color: theme.colors.text }
                    ]}>{tag.name}</Text>
                    </TouchableOpacity>
                ))}
                </View>
            </View>
        )}
        
        {/* Nút submit đã chuyển lên headerRight */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl, // Để có thêm không gian ở dưới
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    fontSize: FONT_SIZE.body,
    marginBottom: SPACING.sm,
  },
  textArea: {
    minHeight: 150, 
    textAlignVertical: 'top',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.xs,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs + 2,
    borderRadius: 16,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  tagChipText: {
    fontSize: FONT_SIZE.small,
    fontWeight: FONT_WEIGHT.medium,
  },
  errorText: {
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontSize: FONT_SIZE.body,
  },
});

export default CreateForumPostScreen; 