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
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import { AuthStackParamList } from '../../navigation/types';
import { isValidEmail } from '../../utils/helpers';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../styles/globalStyles';
import AnimatedButton from '../../components/common/AnimatedButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppTheme } from '../../styles/theme';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, typeof ROUTES.AUTH.REGISTER>;

const getStyles = (theme: AppTheme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerText: {
    fontSize: FONT_SIZE.h2,
    fontWeight: FONT_WEIGHT.bold,
    color: theme.colors.text,
    textAlign: 'center',
    flex: 1,
  },
  headerRight: {
    width: 24 + SPACING.sm * 2,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
  },
  subtitleText: {
    fontSize: FONT_SIZE.medium,
    color: theme.colors.placeholder,
    marginBottom: SPACING.xl,
  },
  inputWrapper: {
    width: '100%',
    marginBottom: SPACING.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: theme.colors.outline,
    height: 50,
  },
  inputError: {
    borderColor: theme.colors.error,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONT_SIZE.medium,
    color: theme.colors.text,
    height: '100%',
  },
  passwordToggle: {
    padding: SPACING.sm,
  },
  errorText: {
    fontSize: FONT_SIZE.small,
    color: theme.colors.error,
    marginTop: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  registerButton: {
    marginTop: SPACING.lg,
    width: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: SPACING.sm,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginTextContainer: {
    marginTop: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: FONT_SIZE.medium,
    color: theme.colors.placeholder,
    fontWeight: FONT_WEIGHT.bold,
    marginLeft: SPACING.xs,
  },
  loginLink: {
    fontSize: FONT_SIZE.medium,
    color: theme.colors.primary,
    fontWeight: FONT_WEIGHT.bold,
    marginLeft: SPACING.xs,
  },
});

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuth();
  const { theme } = useTheme();
  const styles = getStyles(theme);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  
  // Validate form
  const validateForm = (): boolean => {
    let isValid = true;
    
    // Name validation
    if (!name) {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }
    
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
    
    // Confirm password validation
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm your password');
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    return isValid;
  };
  
  // Handle register
  const handleRegister = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await register(name, email, password);
      // Navigation is handled by AppNavigator based on auth state
    } catch (error: any) {
      const errorMsg = error?.message || 'Unable to create account. Please try again.';
      Alert.alert(
        'Registration Failed',
        errorMsg,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigate to login screen
  const handleBackToLogin = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate(ROUTES.AUTH.LOGIN);
    }
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
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
          <Text style={styles.headerText}>
            Create Account
          </Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.formContainer}>
          <Text style={styles.subtitleText}>
            Join Digital Workspace Pro
          </Text>
          
          {/* Name Input */}
          <View style={styles.inputWrapper}>
            <View
              style={[
                styles.inputContainer,
                nameError ? styles.inputError : null,
              ]}
            >
              <Icon
                name="account-outline"
                size={20}
                color={theme.colors.placeholder}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor={theme.colors.placeholder}
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
              />
            </View>
            {nameError ? (
              <Text style={styles.errorText}>
                {nameError}
              </Text>
            ) : null}
          </View>
          
          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <View
              style={[
                styles.inputContainer,
                emailError ? styles.inputError : null,
              ]}
            >
              <Icon
                name="email-outline"
                size={20}
                color={theme.colors.placeholder}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={theme.colors.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />
            </View>
            {emailError ? (
              <Text style={styles.errorText}>
                {emailError}
              </Text>
            ) : null}
          </View>
          
          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <View
              style={[
                styles.inputContainer,
                passwordError ? styles.inputError : null,
              ]}
            >
              <Icon
                name="lock-outline"
                size={20}
                color={theme.colors.placeholder}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={theme.colors.placeholder}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                <Icon
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={theme.colors.placeholder}
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>
                {passwordError}
              </Text>
            ) : null}
          </View>
          
          {/* Confirm Password Input */}
          <View style={styles.inputWrapper}>
            <View
              style={[
                styles.inputContainer,
                confirmPasswordError ? styles.inputError : null,
              ]}
            >
              <Icon
                name="lock-check-outline"
                size={20}
                color={theme.colors.placeholder}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={theme.colors.placeholder}
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
            {confirmPasswordError ? (
              <Text style={styles.errorText}>
                {confirmPasswordError}
              </Text>
            ) : null}
          </View>
          
          {/* Register Button */}
          <AnimatedButton
            style={styles.registerButton}
            title="Register"
            onPress={handleRegister}
            disabled={isLoading}
            loading={isLoading}
            variant="primary"
            fullWidth
          />
          
          <View style={styles.loginTextContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;