import React, { ReactNode, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  ViewStyle,
  Dimensions,
  Animated,
} from 'react-native';
import { COLORS } from '../../styles/theme';
import { useTheme } from '../../hooks/useTheme';
import { SPACING } from '../../styles/globalStyles';

type ModalAnimation = 'fade' | 'slide' | 'bounce';
type ModalType = 'center' | 'bottom' | 'fullscreen';

const { height } = Dimensions.get('window');

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  animation?: ModalAnimation;
  type?: ModalType;
  closeOnBackdropPress?: boolean;
  backdropOpacity?: number;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  children,
  animation = 'fade',
  type = 'center',
  closeOnBackdropPress = true,
  backdropOpacity = 0.5,
  style,
  contentContainerStyle,
}) => {
  const { isDarkMode } = useTheme();
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  
  // Animation values
  const animationProgress = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    if (visible) {
      Animated.timing(animationProgress, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    } else {
      Animated.timing(animationProgress, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start();
    }
  }, [visible, animationProgress]);
  
  // Backdrop animation
  const backdropAnimatedStyle = {
    opacity: animationProgress.interpolate({
      inputRange: [0, 1],
      outputRange: [0, backdropOpacity],
    }),
  };
  
  // Modal content animation
  const contentAnimatedStyle = (() => {
    // Different animations based on type and animation style
    if (type === 'bottom') {
      // Bottom sheet style
      return {
        transform: [
          {
            translateY: animationProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [height, 0],
            }),
          },
        ],
      };
    } else if (type === 'fullscreen') {
      // Fullscreen style
      return {
        opacity: animationProgress,
        transform: [
          {
            scale: animationProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [animation === 'bounce' ? 1.1 : 0.9, 1],
            }),
          },
        ],
      };
    } else {
      // Center modal default
      if (animation === 'fade') {
        return {
          opacity: animationProgress,
        };
      } else if (animation === 'slide') {
        return {
          opacity: animationProgress,
          transform: [
            {
              translateY: animationProgress.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 0],
              }),
            },
          ],
        };
      } else if (animation === 'bounce') {
        // Simple bounce effect with Animated
        const scale = animationProgress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.9, 1.05, 1],
        });
        
        return {
          opacity: animationProgress,
          transform: [{ scale }],
        };
      }
    }
    
    return {};
  })();
  
  // Get container style based on modal type
  const getContainerStyle = (): ViewStyle => {
    switch (type) {
      case 'bottom':
        return styles.bottomContainer;
      case 'fullscreen':
        return styles.fullscreenContainer;
      case 'center':
      default:
        return styles.centerContainer;
    }
  };
  
  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
    >
      <View style={styles.modalContainer}>
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            { backgroundColor: colors.backdrop },
            backdropAnimatedStyle,
          ]}
        >
          {closeOnBackdropPress && (
            <TouchableWithoutFeedback onPress={onClose}>
              <View style={styles.backdropTouchable} />
            </TouchableWithoutFeedback>
          )}
        </Animated.View>
        
        {/* Modal Content */}
        <Animated.View
          style={[
            styles.contentContainer,
            getContainerStyle(),
            {
              backgroundColor: colors.surface,
              shadowColor: isDarkMode ? '#000000' : '#AAAAAA',
            },
            contentAnimatedStyle,
            style,
          ]}
        >
          <View style={[styles.content, contentContainerStyle]}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    flex: 1,
  },
  contentContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  centerContainer: {
    width: '85%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingBottom: SPACING.md,
  },
  fullscreenContainer: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
  },
  content: {
    padding: SPACING.md,
  },
});

export default CustomModal; 