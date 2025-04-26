import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../styles/globalStyles';

type NetworkStatus = 'online' | 'offline' | 'connecting' | 'syncing';

interface NetworkStatusIndicatorProps {
  status: NetworkStatus;
  pendingSyncCount?: number;
  onPress?: () => void;
}

/**
 * Component hiển thị trạng thái kết nối mạng và đồng bộ dữ liệu
 */
const NetworkStatusIndicator: React.FC<NetworkStatusIndicatorProps> = ({
  status,
  pendingSyncCount = 0,
  onPress,
}) => {
  const { theme } = useTheme();
  const spinValue = new Animated.Value(0);
  
  // Animation xoay cho icon khi đang kết nối hoặc đồng bộ
  useEffect(() => {
    if (status === 'connecting' || status === 'syncing') {
      Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    } else {
      spinValue.setValue(0);
    }
  }, [status, spinValue]);
  
  // Tạo giá trị xoay
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  // Lấy thông tin hiển thị dựa trên trạng thái
  const getStatusInfo = (): { icon: string; color: string; message: string } => {
    switch (status) {
      case 'online':
        return {
          icon: 'cloud-check',
          color: theme.colors.success,
          message: 'Đã kết nối',
        };
      case 'offline':
        return {
          icon: 'cloud-off-outline',
          color: theme.colors.error,
          message: 'Ngoại tuyến',
        };
      case 'connecting':
        return {
          icon: 'cloud-sync',
          color: theme.colors.warning,
          message: 'Đang kết nối...',
        };
      case 'syncing':
        return {
          icon: 'sync',
          color: theme.colors.info || theme.colors.primary,
          message: `Đang đồng bộ${
            pendingSyncCount > 0 ? ` (${pendingSyncCount})` : ''
          }...`,
        };
      default:
        return {
          icon: 'cloud-check',
          color: theme.colors.success,
          message: 'Đã kết nối',
        };
    }
  };
  
  const { icon, color, message } = getStatusInfo();
  
  // Xác định có sử dụng animation hay không
  const shouldAnimate = status === 'connecting' || status === 'syncing';
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            status === 'offline'
              ? `${theme.colors.error}20`
              : status === 'connecting' || status === 'syncing'
              ? `${theme.colors.warning}20`
              : `${theme.colors.success}15`,
        },
      ]}
    >
      {shouldAnimate ? (
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Icon name={icon} size={16} color={color} />
        </Animated.View>
      ) : (
        <Icon name={icon} size={16} color={color} />
      )}
      
      <Text style={[styles.text, { color: theme.colors.text }]}>
        {message}
      </Text>
      
      {pendingSyncCount > 0 && status === 'offline' && (
        <View
          style={[styles.badge, { backgroundColor: theme.colors.error }]}
        >
          <Text style={styles.badgeText}>{pendingSyncCount}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xs,
    borderRadius: 4,
    margin: SPACING.xs,
  },
  text: {
    fontSize: FONT_SIZE.small,
    fontWeight: FONT_WEIGHT.medium,
    marginLeft: SPACING.xs,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: FONT_WEIGHT.bold,
    color: '#FFFFFF',
  },
});

export default NetworkStatusIndicator; 