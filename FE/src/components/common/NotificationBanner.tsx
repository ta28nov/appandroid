import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../styles/globalStyles';

type BannerType = 'info' | 'warning' | 'error' | 'success';
type NetworkStatus = 'online' | 'offline' | 'connecting' | 'syncing';

interface NotificationBannerProps {
  visible: boolean;
  type?: BannerType;
  message: string;
  networkStatus?: NetworkStatus;
  onPress?: () => void;
  autoHide?: boolean;
  autoHideDuration?: number;
  position?: 'top' | 'bottom';
}

/**
 * Banner hiển thị thông báo trạng thái kết nối
 * Sử dụng Animated của React Native thay vì Reanimated
 */
const NotificationBanner: React.FC<NotificationBannerProps> = ({
  visible,
  type = 'info',
  message,
  networkStatus,
  onPress,
  autoHide = false,
  autoHideDuration = 3000,
  position = 'top',
}) => {
  const { theme } = useTheme();
  const translateY = useRef(new Animated.Value(position === 'top' ? -100 : 100)).current;
  
  useEffect(() => {
    if (visible) {
      // Animation hiển thị
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }).start();
      
      // Tự động ẩn sau một khoảng thời gian nếu autoHide = true
      if (autoHide) {
        const timer = setTimeout(() => {
          hideBanner();
        }, autoHideDuration);
        return () => clearTimeout(timer);
      }
    } else {
      // Animation ẩn
      hideBanner();
    }
  }, [visible]);
  
  // Hàm ẩn banner với animation
  const hideBanner = () => {
    Animated.spring(translateY, {
      toValue: position === 'top' ? -100 : 100,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  // Lấy thông tin hiển thị dựa trên loại banner và trạng thái mạng
  const getBannerInfo = (): { color: string; backgroundColor: string; icon: string } => {
    // Nếu có trạng thái mạng, ưu tiên hiển thị theo trạng thái mạng
    if (networkStatus) {
      switch (networkStatus) {
        case 'online':
          return {
            color: theme.colors.success,
            backgroundColor: `${theme.colors.success}15`,
            icon: 'cloud-check',
          };
        case 'offline':
          return {
            color: theme.colors.error,
            backgroundColor: `${theme.colors.error}15`,
            icon: 'cloud-off-outline',
          };
        case 'connecting':
          return {
            color: theme.colors.warning,
            backgroundColor: `${theme.colors.warning}15`,
            icon: 'cloud-sync',
          };
        case 'syncing':
          return {
            color: theme.colors.info,
            backgroundColor: `${theme.colors.info}15`,
            icon: 'sync',
          };
      }
    }
    
    // Nếu không có trạng thái mạng, hiển thị theo loại banner
    switch (type) {
      case 'info':
        return {
          color: theme.colors.info,
          backgroundColor: `${theme.colors.info}15`,
          icon: 'information',
        };
      case 'warning':
        return {
          color: theme.colors.warning,
          backgroundColor: `${theme.colors.warning}15`,
          icon: 'alert',
        };
      case 'error':
        return {
          color: theme.colors.error,
          backgroundColor: `${theme.colors.error}15`,
          icon: 'close-circle',
        };
      case 'success':
        return {
          color: theme.colors.success,
          backgroundColor: `${theme.colors.success}15`,
          icon: 'check-circle',
        };
      default:
        return {
          color: theme.colors.info,
          backgroundColor: `${theme.colors.info}15`,
          icon: 'information',
        };
    }
  };
  
  const { color, backgroundColor, icon } = getBannerInfo();
  
  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          transform: [{ translateY }],
          top: position === 'top' ? 0 : undefined,
          bottom: position === 'bottom' ? 0 : undefined,
        },
      ]}
    >
      <TouchableOpacity
        style={styles.contentContainer}
        onPress={onPress}
        disabled={!onPress}
        activeOpacity={onPress ? 0.7 : 1}
      >
        <Icon name={icon} size={20} color={color} />
        <Text style={[styles.message, { color: theme.colors.text }]}>
          {message}
        </Text>
        {onPress && (
          <Icon name="chevron-right" size={20} color={color} />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    padding: SPACING.sm,
    borderRadius: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    zIndex: 999,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
    marginLeft: SPACING.sm,
    marginRight: SPACING.sm,
  },
});

export default NotificationBanner; 