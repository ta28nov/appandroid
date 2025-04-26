import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  variant?: 'elevated' | 'outlined' | 'filled';
  borderRadius?: number;
  onPress?: () => void;
  disabled?: boolean;
}

/**
 * Card component với nhiều kiểu dáng khác nhau
 * @param children - Nội dung bên trong card
 * @param style - Style cho card container
 * @param contentStyle - Style cho phần nội dung bên trong
 * @param variant - Kiểu card: elevated (có shadow), outlined (có viền), filled (có màu nền)
 * @param borderRadius - Bo góc cho card
 * @param onPress - Hàm xử lý khi nhấn vào card
 * @param disabled - Vô hiệu hóa tương tác với card
 */
const Card: React.FC<CardProps> = ({
  children,
  style,
  contentStyle,
  variant = 'elevated',
  borderRadius = 8,
  onPress,
  disabled = false,
  ...rest
}) => {
  const { theme } = useTheme();

  const getCardStyle = () => {
    const baseStyle: ViewStyle = {
      borderRadius,
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.card,
          ...styles.elevatedShadow,
        };
      case 'outlined':
        return {
          ...baseStyle,
          backgroundColor: theme.colors.card,
          borderWidth: 1,
          borderColor: theme.dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
        };
      case 'filled':
        return {
          ...baseStyle,
          backgroundColor: theme.dark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.03)',
        };
      default:
        return baseStyle;
    }
  };

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[getCardStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      {...rest}
    >
      <View style={[styles.content, contentStyle]}>{children}</View>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: 16,
  },
  elevatedShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default Card; 