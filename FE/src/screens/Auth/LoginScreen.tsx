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
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../utils/constants';
import { AuthStackParamList } from '../../navigation/types';
import { isValidEmail } from '../../utils/helpers';
import { FONT_SIZE, FONT_WEIGHT, SPACING, SHADOW } from '../../styles/globalStyles';
import AnimatedButton from '../../components/common/AnimatedButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, typeof ROUTES.AUTH.LOGIN>;

const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useAuth();
  const { theme, isDarkMode } = useTheme();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
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
    } catch (error: any) {
      console.error("Login error caught in component:", error.message);
      const errorMessage = error.message || 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.';
      Alert.alert('Lỗi Đăng nhập', errorMessage);
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
  const logoPlaceholder = { uri: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80' };
  
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue to your workspace</Text>
        </View>
        
        <View style={styles.form}>
          <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.disabled }]}>
            <Icon name="email-outline" size={20} color={theme.colors.primary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.colors.text }, emailError ? styles.inputError : {}]}
              placeholder="Email"
              placeholderTextColor={theme.colors.disabled}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={(text) => { setEmail(text); setEmailError(''); }}
              textContentType="emailAddress"
            />
          </View>
          {emailError ? <Text style={[styles.errorText, { color: theme.colors.error }]}>{emailError}</Text> : null}

          <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface, borderColor: theme.colors.disabled }]}>
            <Icon name="lock-outline" size={20} color={theme.colors.primary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.colors.text }, passwordError ? styles.inputError : {}]}
              placeholder="Password"
              placeholderTextColor={theme.colors.disabled}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => { setPassword(text); setPasswordError(''); }}
              textContentType="password"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={[styles.errorText, { color: theme.colors.error }]}>{passwordError}</Text> : null}

          <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotPasswordButton}>
            <Text style={[styles.forgotPasswordText, { color: theme.colors.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary }, isLoading ? styles.buttonDisabled : {}]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={theme.colors.onPrimary} />
            ) : (
              <Text style={[styles.buttonText, { color: theme.colors.onPrimary }]}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.colors.text }]}>Don't have an account?</Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={[styles.footerLink, { color: theme.colors.primary }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontSize: FONT_SIZE.h1,
    fontWeight: FONT_WEIGHT.bold,
    color: '#424242',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZE.body,
    color: '#424242',
    textAlign: 'center',
  },
  form: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#424242',
    fontSize: FONT_SIZE.body,
  },
  inputIcon: {
    marginRight: SPACING.sm,
  },
  eyeIcon: {
    padding: SPACING.xs,
  },
  inputError: {
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    fontSize: FONT_SIZE.small,
    marginLeft: SPACING.md,
    marginBottom: SPACING.md,
    marginTop: -SPACING.sm,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
  },
  forgotPasswordText: {
    color: '#2979FF',
    fontSize: FONT_SIZE.body,
  },
  button: {
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    ...SHADOW.medium,
  },
  buttonDisabled: {
    backgroundColor: '#A0C4FF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.medium,
    fontWeight: FONT_WEIGHT.semiBold,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  footerText: {
    color: '#424242',
    fontSize: FONT_SIZE.body,
  },
  footerLink: {
    color: '#2979FF',
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.semiBold,
    marginLeft: SPACING.xs,
  },
});

export default LoginScreen;