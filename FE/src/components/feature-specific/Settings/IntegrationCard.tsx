import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../../styles/globalStyles';
import Card from '../../common/Card';

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: string;
  iconColor?: string;
  connected: boolean;
  onPress: () => void;
}

/**
 * Card hiển thị thông tin dịch vụ tích hợp với trạng thái kết nối
 */
const IntegrationCard: React.FC<IntegrationCardProps> = ({
  title,
  description,
  icon,
  iconColor,
  connected,
  onPress,
}) => {
  const { theme, isDarkMode } = useTheme();
  
  return (
    <Card
      variant="outlined"
      style={styles.card}
      onPress={onPress}
    >
      <View style={styles.container}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}>
          <Icon name={icon} size={24} color={iconColor || theme.colors.primary} />
        </View>
        
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {title}
          </Text>
          
          <Text style={[styles.description, { color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)' }]}>
            {description}
          </Text>
        </View>
        
        <View style={styles.statusContainer}>
          <View 
            style={[
              styles.statusIndicator, 
              { 
                backgroundColor: connected 
                  ? theme.colors.success 
                  : isDarkMode 
                    ? 'rgba(255, 255, 255, 0.12)' 
                    : 'rgba(0, 0, 0, 0.08)' 
              }
            ]} 
          />
          <Text 
            style={[
              styles.statusText, 
              { 
                color: connected 
                  ? theme.colors.success 
                  : isDarkMode 
                    ? 'rgba(255, 255, 255, 0.5)' 
                    : 'rgba(0, 0, 0, 0.5)' 
              }
            ]}
          >
            {connected ? 'Đã kết nối' : 'Chưa kết nối'}
          </Text>
          
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: connected
                  ? isDarkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'
                  : theme.colors.primary,
              },
            ]}
            onPress={onPress}
          >
            <Text
              style={[
                styles.actionButtonText,
                {
                  color: connected
                    ? theme.colors.text
                    : '#FFFFFF',
                },
              ]}
            >
              {connected ? 'Quản lý' : 'Kết nối'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: 2,
  },
  description: {
    fontSize: FONT_SIZE.caption,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: FONT_SIZE.small,
    marginBottom: SPACING.xs,
  },
  actionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
  },
  actionButtonText: {
    fontSize: FONT_SIZE.small,
    fontWeight: FONT_WEIGHT.medium,
  },
});

export default IntegrationCard; 