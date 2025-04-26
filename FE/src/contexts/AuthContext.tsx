import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient, {
  apiLogin,
  apiGetMe,
  apiRegister,
  apiUpdateProfile,
  setToken,
  removeToken,
  getToken
} from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  department?: string;
}

interface AuthContextProps {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

const USER_STORAGE_KEY = '@user_data';
const AUTH_TOKEN_KEY = '@auth_token';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);
      let storedUser: User | null = null;
      let validToken = false;

      try {
        const token = await getToken();

        if (token) {
          try {
            const userResponse = await apiGetMe();
            storedUser = userResponse.data;
            if (storedUser) {
              validToken = true;
              await storeUserData(storedUser);
            } else {
              console.warn('[AuthContext] Token found but failed to get user data from API.');
            }
          } catch (apiError: any) {
            console.warn('[AuthContext] Failed to validate token or get user:', apiError.response?.data || apiError.message);
          }
        }

        if (validToken && storedUser) {
          setUser(storedUser);
        } else {
          setUser(null);
          await removeToken();
          await storeUserData(null);
        }

      } catch (error) {
        console.error('[AuthContext] Failed during auth initialization:', error);
        setUser(null);
        await removeToken();
        await storeUserData(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const storeUserData = async (userData: User | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (error) {
      console.error('[AuthContext] Failed to store user data', error);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const loginResponse = await apiLogin({ email, password });
      const token = loginResponse.data?.token;

      if (!token) {
        throw new Error('Login failed: No token received');
      }
      await setToken(token);

      const userResponse = await apiGetMe();
      const loggedInUser: User = userResponse.data;

      if (!loggedInUser) {
        throw new Error('Login failed: Could not fetch user data');
      }

      setUser(loggedInUser);
      await storeUserData(loggedInUser);

    } catch (error: any) {
      console.error('[AuthContext] Login failed', error.response?.data || error.message);
      await removeToken();
      await storeUserData(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await apiRegister({ name, email, password });
      await login(email, password);
    } catch (error: any) {
      console.error('[AuthContext] Registration failed', error.response?.data || error.message);
      setUser(null);
      await removeToken();
      await storeUserData(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      setUser(null);
      await removeToken();
      await storeUserData(null);
    } catch (error) {
      console.error('[AuthContext] Logout failed', error);
      setUser(null);
      await removeToken();
      await storeUserData(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await apiUpdateProfile(userData);
      const updatedUserFromServer: User = response.data;

      if (!updatedUserFromServer) {
          throw new Error("Profile update failed: No updated user data received from server.");
      }

      const mergedUser = { ...user, ...updatedUserFromServer };
      setUser(mergedUser);
      await storeUserData(mergedUser);

    } catch (error: any) {
      console.error('[AuthContext] Profile update failed', error.response?.data || error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 