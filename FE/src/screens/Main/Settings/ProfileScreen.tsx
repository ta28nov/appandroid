import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  TouchableOpacity,
} from 'react-native';
import { UserProfile } from '../../../types/user'; // Corrected path
import { AuthContext } from '../../../contexts/AuthContext'; // Corrected path
import { ThemeContext } from '../../../contexts/ThemeContext'; // Corrected path
import Input from '../../../components/common/Input'; // Corrected path
import Button from '../../../components/common/Button'; // Corrected path
import Avatar from '../../../components/common/Avatar'; // Corrected path
import { apiGetMe, apiUpdateProfile } from '../../../services/api'; // Added API imports
// Import ImagePicker or similar for avatar upload later

const ProfileScreen: React.FC = () => {
  const authContext = useContext(AuthContext);
  const themeContext = useContext(ThemeContext);

  if (!authContext || !themeContext) {
    // Handle case where context is not available, though this shouldn't happen in a protected screen
    return <Text>Lỗi: Không thể tải context.</Text>;
  }

  const { user } = authContext;
  const { theme } = themeContext;
  const styles = getStyles(theme);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Form state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [showActivityStatus, setShowActivityStatus] = useState(true);

  useEffect(() => {
    if (user?.id) {
      setIsLoading(true); // Set loading true before API call
      console.log('[ProfileScreen] Current user ID from AuthContext:', user.id); // Log user ID
      apiGetMe()
        .then(response => {
          console.log('[ProfileScreen] apiGetMe response:', JSON.stringify(response, null, 2)); // Log full response
          // Assuming response.data contains the user profile object
          // Adjust access to data based on your actual API response structure e.g. response.data.data
          const data = response.data?.data || response.data;
          console.log('[ProfileScreen] Extracted data for profile:', JSON.stringify(data, null, 2)); // Log extracted data
          if (data && typeof data === 'object' && data._id) { // Thêm kiểm tra data._id để chắc chắn là object user
            setProfile(data as UserProfile);
            // Initialize form state
            setName(data.name || ''); // Add fallback for potentially missing fields
            setBio(data.bio || '');
            // Ensure privacySettings exists and has properties before accessing them
            setShowEmail(data.privacySettings?.showEmail || false);
            setShowActivityStatus(data.privacySettings?.showActivityStatus || true);
          } else {
            throw new Error('User profile data not found in response');
          }
        })
        .catch(error => {
          console.error('[ProfileScreen] Failed to fetch profile:', JSON.stringify(error, null, 2)); // Log error object
          Alert.alert('Lỗi', 'Không thể tải hồ sơ người dùng.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      console.warn('[ProfileScreen] User ID not found in AuthContext.'); // Log warning if user ID is missing
      // Handle case where user ID is not available (should not happen in protected route)
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
    }
  }, [user?.id]);

  const handleSelectAvatar = () => {
    // TODO: Implement image picker logic
    Alert.alert('Thông báo', 'Chức năng chọn avatar sẽ được thêm sau.');
  };

  const handleSave = async () => {
    if (!profile || !authContext) return;
    setIsSaving(true);
    const updatedProfile: UserProfile = {
      ...profile,
      name,
      bio,
      // avatarUrl should be updated after implementing image picker
      // For now, it will send the existing profile.avatarUrl
      privacySettings: {
        showEmail,
        showActivityStatus,
      },
    };

    try {
      const response = await apiUpdateProfile(updatedProfile);
      // Assuming response.data contains the updated user profile object
      // Adjust access to data based on your actual API response structure e.g. response.data.data
      const updatedUserData = response.data?.data || response.data;

      if (updatedUserData) {
        // Update AuthContext with the new user data
        // Ensure the structure of updatedUserData is compatible with what authContext.setUser expects
        authContext.setUser(updatedUserData as any); // Use 'as any' if types are not perfectly aligned, or map fields
        setProfile(updatedUserData as UserProfile); // Update local profile state
        Alert.alert('Thành công', 'Hồ sơ đã được cập nhật.');
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật hồ sơ. Dữ liệu trả về không hợp lệ.');
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Không thể cập nhật hồ sơ.';
      Alert.alert('Lỗi', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Đang tải hồ sơ...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Không thể tải hồ sơ người dùng.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        <TouchableOpacity onPress={handleSelectAvatar}>
          <Avatar size={'xlarge'} source={{ uri: profile.avatarUrl }} />
          <Text style={styles.avatarEditText}>Chỉnh sửa</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Tên hiển thị</Text>
      <Input
        placeholder="Nhập tên của bạn"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Text style={styles.label}>Email</Text>
      <Input
        placeholder="Email"
        value={profile.email} // Email is usually not editable directly
        editable={false}
        style={[styles.input, styles.disabledInput]}
      />

      <Text style={styles.label}>Tiểu sử</Text>
      <Input
        placeholder="Giới thiệu về bản thân"
        value={bio}
        onChangeText={setBio}
        multiline
        numberOfLines={4}
        style={[styles.input, styles.textArea]}
      />

      <Text style={styles.sectionTitle}>Cài đặt quyền riêng tư</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Hiển thị email công khai</Text>
        <Switch
          trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }}
          thumbColor={theme.colors.background}
          ios_backgroundColor={theme.colors.disabled}
          onValueChange={setShowEmail}
          value={showEmail}
        />
      </View>
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Hiển thị trạng thái hoạt động</Text>
        <Switch
          trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }}
          thumbColor={theme.colors.background}
          ios_backgroundColor={theme.colors.disabled}
          onValueChange={setShowActivityStatus}
          value={showActivityStatus}
        />
      </View>

      <Button
        title={isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
        onPress={handleSave}
        disabled={isSaving}
        style={styles.saveButton}
      />
    </ScrollView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: theme.colors.text,
  },
  errorText: {
      textAlign: 'center',
      marginTop: 50,
      fontSize: 18,
      color: theme.colors.error,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarEditText: {
    textAlign: 'center',
    color: theme.colors.primary,
    marginTop: 5,
  },
  label: {
    fontSize: 16,
    color: theme.colors.text,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 15,
    // Assuming Input component uses theme internally or accepts style prop
  },
  disabledInput: {
      backgroundColor: theme.colors.disabledBackground || '#f0f0f0', // Provide a fallback
      color: theme.colors.disabledText || '#a0a0a0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top', // For Android multiline input
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 20,
    marginBottom: 15,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  switchLabel: {
    fontSize: 16,
    color: theme.colors.text,
  },
  saveButton: {
    marginTop: 30,
  },
});

export default ProfileScreen; 