import React from 'react';
import { View, Image, StyleSheet, ViewStyle, ImageSourcePropType, Text } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

type AvatarSize = 'small' | 'medium' | 'large' | 'xlarge';

interface AvatarProps {
  source: ImageSourcePropType;
  size?: AvatarSize;
  style?: ViewStyle;
  online?: boolean;
  showStatus?: boolean;
  initials?: string;
  borderColor?: string;
}

/**
 * Component hiển thị avatar người dùng
 * @param source - Nguồn hình ảnh
 * @param size - Kích thước avatar: 'small' (32), 'medium' (48), 'large' (64), 'xlarge' (96)
 * @param style - Style tùy chỉnh thêm
 * @param online - Trạng thái online của người dùng
 * @param showStatus - Có hiển thị trạng thái online/offline không
 * @param initials - Chữ cái đầu hiển thị khi không có ảnh
 * @param borderColor - Màu viền avatar
 */
const Avatar: React.FC<AvatarProps> = ({
  source,
  size = 'medium',
  style,
  online,
  showStatus = false,
  initials,
  borderColor,
}) => {
  const { theme } = useTheme();

  // Xác định kích thước dựa trên prop size
  const getSize = (): number => {
    switch (size) {
      case 'small':
        return 32;
      case 'medium':
        return 48;
      case 'large':
        return 64;
      case 'xlarge':
        return 96;
      default:
        return 48;
    }
  };

  const sizeValue = getSize();
  const statusSize = sizeValue / 4;
  
  // Màu viền mặc định dựa vào theme
  const defaultBorderColor = theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';

  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.avatarContainer,
          {
            width: sizeValue,
            height: sizeValue,
            borderRadius: sizeValue / 2,
            borderColor: borderColor || defaultBorderColor,
          },
        ]}
      >
        {/* Nếu có nguồn ảnh thì hiển thị Image, nếu không hiển thị chữ cái đầu */}
        {source ? (
          <Image
            source={source}
            style={[
              styles.avatar,
              {
                width: sizeValue,
                height: sizeValue,
                borderRadius: sizeValue / 2,
              },
            ]}
            resizeMode="cover"
          />
        ) : initials ? (
          <View
            style={[
              styles.initialsContainer,
              {
                width: sizeValue,
                height: sizeValue,
                borderRadius: sizeValue / 2,
                backgroundColor: theme.colors.primary,
              },
            ]}
          >
            <Text style={[styles.initials, { fontSize: sizeValue / 2.5 }]}>{initials}</Text>
          </View>
        ) : null}
      </View>

      {/* Hiển thị trạng thái online/offline */}
      {showStatus && (
        <View
          style={[
            styles.statusBadge,
            {
              width: statusSize,
              height: statusSize,
              borderRadius: statusSize / 2,
              backgroundColor: online ? theme.colors.success : theme.colors.disabled,
              borderColor: theme.colors.background,
              right: 0,
              bottom: 0,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  avatarContainer: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  avatar: {
    flex: 1,
  },
  statusBadge: {
    position: 'absolute',
    borderWidth: 2,
  },
  initialsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Avatar; 