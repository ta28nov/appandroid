import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { COLORS } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../styles/globalStyles';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type AnimationType = 'scale' | 'bounce' | 'none';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  animationType?: AnimationType;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  animationType = 'scale',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
}) => {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  
  // Animation values
  const scale = useRef(new Animated.Value(1)).current;
  
  // Handle press animation
  const handlePressIn = () => {
    if (disabled || loading) return;
    
    if (animationType === 'scale') {
      Animated.timing(scale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true
      }).start();
    } else if (animationType === 'bounce') {
      Animated.spring(scale, {
        toValue: 0.95,
        friction: 3,
        tension: 40,
        useNativeDriver: true
      }).start();
    }
  };
  
  const handlePressOut = () => {
    if (disabled || loading) return;
    
    if (animationType === 'scale' || animationType === 'bounce') {
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true
      }).start();
    }
  };
  
  // Button animation style
  const animatedStyle = {
    transform: [{ scale }],
  };
  
  // Get button styling based on variant
  const getButtonStyles = (): ViewStyle => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: disabled ? colors.disabled : colors.primary,
          borderColor: 'transparent',
        };
      case 'secondary':
        return {
          backgroundColor: disabled ? colors.disabled : colors.secondary,
          borderColor: 'transparent',
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: disabled ? colors.disabled : colors.primary,
          borderWidth: 2,
        };
      case 'text':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          paddingHorizontal: 0,
          paddingVertical: 0,
        };
      default:
        return {
          backgroundColor: disabled ? colors.disabled : colors.primary,
          borderColor: 'transparent',
        };
    }
  };
  
  // Get text styling based on variant
  const getTextStyles = (): TextStyle => {
    switch (variant) {
      case 'primary':
      case 'secondary':
        return {
          color: '#FFFFFF',
        };
      case 'outline':
        return {
          color: disabled ? colors.disabled : colors.primary,
        };
      case 'text':
        return {
          color: disabled ? colors.disabled : colors.primary,
        };
      default:
        return {
          color: '#FFFFFF',
        };
    }
  };
  
  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={[
        styles.button,
        getButtonStyles(),
        fullWidth && styles.fullWidth,
        animatedStyle,
        style,
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'text' ? colors.primary : '#FFFFFF'}
        />
      ) : (
        <>
          {icon && <>{icon}</>}
          <Text style={[styles.buttonText, getTextStyles(), textStyle]}>{title}</Text>
        </>
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    minHeight: 48,
    backgroundColor: COLORS.light.primary,
  },
  fullWidth: {
    width: '100%',
  },
  buttonText: {
    fontSize: FONT_SIZE.button,
    fontWeight: FONT_WEIGHT.medium,
    textAlign: 'center',
  },
});

export default AnimatedButton; 