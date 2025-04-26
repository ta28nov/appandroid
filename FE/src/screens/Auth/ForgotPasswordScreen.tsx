import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../hooks/useTheme';
import { ROUTES } from '../../utils/constants';
import { AuthStackParamList } from '../../navigation/types';
import { isValidEmail } from '../../utils/helpers';
import { COLORS } from '../../styles/theme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../styles/globalStyles';
import AnimatedButton from '../../components/common/AnimatedButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  typeof ROUTES.AUTH.FORGOT_PASSWORD
>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { theme, isDarkMode } = useTheme();
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);
  
  // Animation values
  const successOpacity = useRef(new Animated.Value(0)).current;
  const successScale = useRef(new Animated.Value(0.5)).current;
  
  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Email validation
    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    return isValid;
  };
  
  // Handle send reset link
  const handleSendResetLink = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Show success animations
      setIsResetSent(true);
      
      // Sequence animation for opacity
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(successOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true
        }),
        Animated.delay(3000),
        Animated.timing(successOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true
        })
      ]).start();

      // Sequence animation for scale
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(successScale, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true
        }),
        Animated.timing(successScale, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true
        })
      ]).start();
      
      // Reset form after delay
      setTimeout(() => {
        setEmail('');
        setIsResetSent(false);
      }, 4000);
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to send password reset link. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigate back to login screen
  const handleBackToLogin = () => {
    navigation.navigate(ROUTES.AUTH.LOGIN);
  };
  
  // Success animation styles
  const successIconStyle = {
    opacity: successOpacity,
    transform: [{ scale: successScale }],
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={handleBackToLogin}
            style={styles.backButton}
          >
            <Icon
              name="arrow-left"
              size={24}
              color={theme.colors.text}
            />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: theme.colors.text }]}>
            Reset Password
          </Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.formContainer}>
          <Text style={[styles.subtitleText, { color: colors.text.secondary }]}>
            Enter your email address and we'll send you a link to reset your password
          </Text>
          
          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: isDarkMode ? colors.surface : '#F0F0F5' },
                emailError ? styles.inputError : null,
              ]}
            >
              <Icon
                name="email-outline"
                size={20}
                color={isDarkMode ? colors.text.secondary : '#8E8E93'}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Email"
                placeholderTextColor={isDarkMode ? '#AEAEB2' : '#8E8E93'}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                editable={!isLoading && !isResetSent}
              />
              
              {isResetSent && (
                <Animated.View style={[styles.successIcon, successIconStyle]}>
                  <Icon
                    name="check-circle"
                    size={24}
                    color={colors.success}
                  />
                </Animated.View>
              )}
            </View>
            {emailError ? (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {emailError}
              </Text>
            ) : null}
          </View>
          
          {/* Send Reset Link Button */}
          <AnimatedButton
            title={isResetSent ? "Link Sent!" : "Send Reset Link"}
            onPress={handleSendResetLink}
            variant={isResetSent ? "outline" : "primary"}
            animationType="scale"
            loading={isLoading}
            disabled={isResetSent}
            fullWidth
            style={styles.sendButton}
          />
          
          {/* Back to Login Link */}
          <View style={styles.backToLoginContainer}>
            <Text style={[styles.backToLoginText, { color: colors.text.secondary }]}>
              Remember your password?
            </Text>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={[styles.backToLoginLinkText, { color: colors.primary }]}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.xl,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerText: {
    fontSize: FONT_SIZE.h1,
    fontWeight: FONT_WEIGHT.bold,
  },
  headerRight: {
    width: 24, // To balance the header
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  subtitleText: {
    fontSize: FONT_SIZE.body,
    marginBottom: SPACING.xl,
    textAlign: 'center',
    lineHeight: 22,
  },
  inputWrapper: {
    marginBottom: SPACING.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: SPACING.md,
    height: 50,
  },
  inputError: {
    borderWidth: 1,
    borderColor: COLORS.light.error,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.body,
    paddingVertical: SPACING.md,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  successIcon: {
    marginLeft: SPACING.xs,
  },
  errorText: {
    fontSize: FONT_SIZE.caption,
    marginTop: 4,
    marginLeft: 4,
  },
  sendButton: {
    marginBottom: SPACING.xl,
  },
  backToLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToLoginText: {
    fontSize: FONT_SIZE.body,
    marginRight: SPACING.xs,
  },
  backToLoginLinkText: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
  },
});

export default ForgotPasswordScreen; 