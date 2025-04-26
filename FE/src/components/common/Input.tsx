import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  TextInputProps,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  helperStyle?: TextStyle;
  disabled?: boolean;
}

/**
 * Input component với nhiều tùy chọn tùy chỉnh
 * @param label - Label cho input
 * @param error - Thông báo lỗi
 * @param helper - Thông báo hỗ trợ
 * @param leftIcon - Icon bên trái
 * @param rightIcon - Icon bên phải
 * @param onRightIconPress - Hàm xử lý khi nhấn vào icon bên phải
 * @param containerStyle - Style cho container
 * @param labelStyle - Style cho label
 * @param inputStyle - Style cho input
 * @param errorStyle - Style cho thông báo lỗi
 * @param helperStyle - Style cho thông báo hỗ trợ
 * @param disabled - Vô hiệu hóa input
 */
const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  helperStyle,
  disabled = false,
  ...rest
}) => {
  const { theme } = useTheme();
  const [focused, setFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return theme.colors.error;
    if (focused) return theme.colors.primary;
    return theme.dark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)';
  };

  const getBackgroundColor = () => {
    if (disabled) return theme.dark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
    return theme.dark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)';
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            { color: theme.dark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)' },
            labelStyle,
          ]}
        >
          {label}
        </Text>
      )}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: getBackgroundColor(),
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            {
              color: theme.colors.text,
              marginLeft: leftIcon ? 0 : 12,
              marginRight: rightIcon ? 0 : 12,
            },
            inputStyle,
          ]}
          placeholderTextColor={
            theme.dark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.4)'
          }
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={!disabled}
          {...rest}
        />

        {rightIcon && (
          <TouchableOpacity
            style={styles.rightIconContainer}
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {(error || helper) && (
        <Text
          style={[
            styles.bottomText,
            {
              color: error
                ? theme.colors.error
                : theme.dark
                ? 'rgba(255, 255, 255, 0.6)'
                : 'rgba(0, 0, 0, 0.6)',
            },
            error ? errorStyle : helperStyle,
          ]}
        >
          {error || helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    paddingVertical: 8,
  },
  leftIconContainer: {
    paddingLeft: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightIconContainer: {
    paddingRight: 12,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input; 