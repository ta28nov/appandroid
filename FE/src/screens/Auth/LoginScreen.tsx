import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import { AuthStackParamList } from '../../navigation/types';
import { isValidEmail } from '../../utils/helpers';
import { COLORS } from '../../styles/theme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../styles/globalStyles';
import AnimatedButton from '../../components/common/AnimatedButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, typeof ROUTES.AUTH.LOGIN>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  
  const [email, setEmail] = useState('user@example.com');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
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
    
    // Password validation
    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    return isValid;
  };
  
  // Handle login
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await login(email, password);
      // Navigation is handled by AppNavigator based on auth state
    } catch (error) {
      Alert.alert(
        'Login Failed',
        'Invalid email or password. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigate to register screen
  const handleRegister = () => {
    navigation.navigate(ROUTES.AUTH.REGISTER);
  };
  
  // Navigate to forgot password screen
  const handleForgotPassword = () => {
    navigation.navigate(ROUTES.AUTH.FORGOT_PASSWORD);
  };
  
  // Placeholder logo (you should replace this with your actual logo)
  const logoPlaceholder = { uri: 'https://via.placeholder.com/200x200.png?text=Logo' };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Image
            source={logoPlaceholder}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={[styles.appName, { color: theme.colors.text }]}>
            Digital Workspace Pro
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
            Welcome Back
          </Text>
          <Text style={[styles.subtitleText, { color: colors.text.secondary }]}>
            Sign in to continue to your workspace
          </Text>
          
          {/* Thêm hướng dẫn tài khoản mẫu */}
          <View style={[styles.testAccountBox, { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }]}>
            <Text style={{ color: theme.colors.text, fontWeight: '500' }}>
              Tài khoản test:
            </Text>
            <Text style={{ color: theme.colors.text }}>
              Email: user@example.com
            </Text>
            <Text style={{ color: theme.colors.text }}>
              Mật khẩu: password123
            </Text>
          </View>
          
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
              />
            </View>
            {emailError ? (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {emailError}
              </Text>
            ) : null}
          </View>
          
          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: isDarkMode ? colors.surface : '#F0F0F5' },
                passwordError ? styles.inputError : null,
              ]}
            >
              <Icon
                name="lock-outline"
                size={20}
                color={isDarkMode ? colors.text.secondary : '#8E8E93'}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Password"
                placeholderTextColor={isDarkMode ? '#AEAEB2' : '#8E8E93'}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                <Icon
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={isDarkMode ? colors.text.secondary : '#8E8E93'}
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {passwordError}
              </Text>
            ) : null}
          </View>
          
          {/* Forgot Password */}
          <TouchableOpacity
            onPress={handleForgotPassword}
            style={styles.forgotPasswordContainer}
          >
            <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          
          {/* Login Button */}
          <AnimatedButton
            title="Sign In"
            onPress={handleLogin}
            variant="primary"
            animationType="scale"
            loading={isLoading}
            fullWidth
            style={styles.loginButton}
          />
          
          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={[styles.signUpText, { color: colors.text.secondary }]}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={handleRegister}>
              <Text style={[styles.signUpLinkText, { color: colors.primary }]}>
                Sign Up
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
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: SPACING.md,
  },
  appName: {
    fontSize: FONT_SIZE.h2,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  welcomeText: {
    fontSize: FONT_SIZE.h1,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.xs,
  },
  subtitleText: {
    fontSize: FONT_SIZE.body,
    marginBottom: SPACING.xl,
  },
  inputWrapper: {
    marginBottom: SPACING.md,
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
  passwordToggle: {
    padding: SPACING.sm,
  },
  errorText: {
    fontSize: FONT_SIZE.caption,
    marginTop: 4,
    marginLeft: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.xl,
  },
  forgotPasswordText: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
  },
  loginButton: {
    marginBottom: SPACING.xl,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    fontSize: FONT_SIZE.body,
    marginRight: SPACING.xs,
  },
  signUpLinkText: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
  },
  testAccountBox: {
    padding: SPACING.md,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
});

export default LoginScreen; 