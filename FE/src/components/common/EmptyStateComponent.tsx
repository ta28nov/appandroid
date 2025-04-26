import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, ImageSourcePropType, Image } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../styles/globalStyles';
import AnimatedButton from './AnimatedButton';

interface EmptyStateComponentProps {
  title: string;
  message?: string;
  icon?: React.ReactNode;
  illustration?: ImageSourcePropType;
  buttonTitle?: string;
  onButtonPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
}

const EmptyStateComponent: React.FC<EmptyStateComponentProps> = ({
  title,
  message,
  icon,
  illustration,
  buttonTitle,
  onButtonPress,
  style,
  titleStyle,
  messageStyle,
}) => {
  const { theme, isDarkMode } = useTheme();

  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      {illustration && (
        <Image
          source={illustration}
          style={styles.illustration}
          resizeMode="contain"
        />
      )}
      
      <Text 
        style={[
          styles.title, 
          { color: theme.colors.text }, 
          titleStyle
        ]}
      >
        {title}
      </Text>
      
      {message && (
        <Text
          style={[
            styles.message,
            { color: isDarkMode ? '#AEAEB2' : '#8E8E93' },
            messageStyle,
          ]}
        >
          {message}
        </Text>
      )}
      
      {buttonTitle && onButtonPress && (
        <View style={styles.buttonContainer}>
          <AnimatedButton
            title={buttonTitle}
            onPress={onButtonPress}
            variant="primary"
            animationType="scale"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  iconContainer: {
    marginBottom: SPACING.md,
  },
  illustration: {
    width: 200,
    height: 150,
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZE.h2,
    fontWeight: FONT_WEIGHT.semiBold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  message: {
    fontSize: FONT_SIZE.body,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: SPACING.md,
  },
});

export default EmptyStateComponent; 