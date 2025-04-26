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

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, typeof ROUTES.AUTH.REGISTER>;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  
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
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        'Unable to create account. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  // Navigate to login screen
  const handleBackToLogin = () => {
    navigation.navigate(ROUTES.AUTH.LOGIN);
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
            Create Account
          </Text>
          <View style={styles.headerRight} />
        </View>
        
        <View style={styles.formContainer}>
          <Text style={[styles.subtitleText, { color: colors.text.secondary }]}>
            Join Digital Workspace Pro
          </Text>
          
          {/* Name Input */}
          <View style={styles.inputWrapper}>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: isDarkMode ? colors.surface : '#F0F0F5' },
                nameError ? styles.inputError : null,
              ]}
            >
              <Icon
                name="account-outline"
                size={20}
                color={isDarkMode ? colors.text.secondary : '#8E8E93'}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Full Name"
                placeholderTextColor={isDarkMode ? '#AEAEB2' : '#8E8E93'}
                autoCapitalize="words"
                value={name}
                onChangeText={setName}
              />
            </View>
            {nameError ? (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {nameError}
              </Text>
            ) : null}
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
          
          {/* Confirm Password Input */}
          <View style={styles.inputWrapper}>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: isDarkMode ? colors.surface : '#F0F0F5' },
                confirmPasswordError ? styles.inputError : null,
              ]}
            >
              <Icon
                name="lock-check-outline"
                size={20}
                color={isDarkMode ? colors.text.secondary : '#8E8E93'}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder="Confirm Password"
                placeholderTextColor={isDarkMode ? '#AEAEB2' : '#8E8E93'}
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
            {confirmPasswordError ? (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {confirmPasswordError}
              </Text>
            ) : null}
          </View>
          
          {/* Register Button */}
          <AnimatedButton
            title="Create Account"
            onPress={handleRegister}
            variant="primary"
            animationType="scale"
            loading={isLoading}
            fullWidth
            style={styles.registerButton}
          />
          
          {/* Sign In Link */}
          <View style={styles.signInContainer}>
            <Text style={[styles.signInText, { color: colors.text.secondary }]}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={handleBackToLogin}>
              <Text style={[styles.signInLinkText, { color: colors.primary }]}>
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
  registerButton: {
    marginTop: SPACING.md,
    marginBottom: SPACING.xl,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    fontSize: FONT_SIZE.body,
    marginRight: SPACING.xs,
  },
  signInLinkText: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
  },
});

export default RegisterScreen; 