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
// Import ImagePicker or similar for avatar upload later

// Mock function to simulate fetching user profile
const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  console.log(`Fetching profile for user: ${userId}`);
  // Replace with actual API call later
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
  return {
    id: userId,
    name: 'Người dùng Mẫu',
    email: 'user@example.com',
    avatarUrl: 'https://via.placeholder.com/150',
    bio: 'Đây là tiểu sử mẫu của người dùng.',
    privacySettings: {
      showEmail: false,
      showActivityStatus: true,
    },
  };
};

// Mock function to simulate updating user profile
const updateUserProfile = async (profileData: UserProfile): Promise<boolean> => {
  console.log('Updating profile:', profileData);
  // Replace with actual API call later
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  // Simulate success/failure
  return true;
};

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
      fetchUserProfile(user.id)
        .then(data => {
          setProfile(data);
          // Initialize form state
          setName(data.name);
          setBio(data.bio || '');
          setShowEmail(data.privacySettings?.showEmail || false);
          setShowActivityStatus(data.privacySettings?.showActivityStatus || true);
        })
        .catch(error => {
          console.error('Failed to fetch profile:', error);
          Alert.alert('Lỗi', 'Không thể tải hồ sơ người dùng.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
      // Handle case where user ID is not available (should not happen in protected route)
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
    }
  }, [user?.id]);

  const handleSelectAvatar = () => {
    // TODO: Implement image picker logic
    Alert.alert('Thông báo', 'Chức năng chọn avatar sẽ được thêm sau.');
  };

  const handleSave = async () => {
    if (!profile) return;
    setIsSaving(true);
    const updatedProfile: UserProfile = {
      ...profile,
      name,
      bio,
      // avatarUrl should be updated after implementing image picker
      privacySettings: {
        showEmail,
        showActivityStatus,
      },
    };

    try {
      const success = await updateUserProfile(updatedProfile);
      if (success) {
        setProfile(updatedProfile); // Update local state with saved data
        Alert.alert('Thành công', 'Hồ sơ đã được cập nhật.');
      } else {
        Alert.alert('Lỗi', 'Không thể cập nhật hồ sơ. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi cập nhật hồ sơ.');
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