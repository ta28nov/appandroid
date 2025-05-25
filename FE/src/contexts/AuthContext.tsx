import React, { createContext, useState, useEffect, ReactNode, useMemo } from 'react';
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
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateProfile: async () => {},
  setUser: () => {},
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
            console.log('[AuthContext] apiGetMe response during init:', JSON.stringify(userResponse, null, 2));

            let potentialUser = null;
            if (userResponse.data) {
              if (userResponse.data.data && (userResponse.data.data.id || userResponse.data.data._id)) {
                potentialUser = userResponse.data.data;
              } else if (userResponse.data.id || userResponse.data._id) {
                potentialUser = userResponse.data;
              }
            }
            
            if (potentialUser) {
              storedUser = potentialUser;
              validToken = true;
              await storeUserData(storedUser);
            } else {
              console.warn('[AuthContext] Token found but failed to get user data from API or data structure mismatch. API Response Data:', JSON.stringify(userResponse.data, null, 2));
            }
          } catch (apiError: any) {
            console.warn('[AuthContext] Failed to validate token or get user:', apiError.response?.data?.error?.message || apiError.message);
          }
        }

        if (validToken && storedUser) {
          setUser(storedUser);
          console.log('[AuthContext] User set in context from initializeAuth:', JSON.stringify(storedUser, null, 2));
        } else {
          setUser(null);
          console.warn('[AuthContext] Setting user to null in initializeAuth. validToken:', validToken, 'storedUser:', JSON.stringify(storedUser, null, 2));
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
      const token = loginResponse.data?.data?.token || loginResponse.data?.token;

      if (!token) {
        throw new Error('Login failed: No token received');
      }
      await setToken(token);

      const userResponse = await apiGetMe();
      console.log('[AuthContext] apiGetMe response during login:', JSON.stringify(userResponse, null, 2));
      // Patch: handle both { data: user } and { data: { ...user } }
      let loggedInUser = null;
      if (userResponse.data) {
        if (userResponse.data.data && (userResponse.data.data.id || userResponse.data.data._id)) {
          loggedInUser = userResponse.data.data;
        } else if (userResponse.data.id || userResponse.data._id) {
          loggedInUser = userResponse.data;
        }
      }
      if (!loggedInUser) {
        throw new Error('Login failed: Could not fetch user data. API Response Data: ' + JSON.stringify(userResponse.data, null, 2));
      }
      setUser(loggedInUser);
      console.log('[AuthContext] User set in context from login:', JSON.stringify(loggedInUser, null, 2));
      await storeUserData(loggedInUser);

    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      console.error('[AuthContext] Login failed', errorMsg);
      await removeToken();
      await storeUserData(null);
      setUser(null);
      throw new Error(errorMsg);
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
      const errorMsg = error.response?.data?.error?.message || error.message;
      console.error('[AuthContext] Registration failed', errorMsg);
      setUser(null);
      await removeToken();
      await storeUserData(null);
      throw new Error(errorMsg);
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
      let updatedUserFromServer: User | null = null;

      if (response.data) {
        if (response.data.data && (response.data.data.id || response.data.data._id)) {
          updatedUserFromServer = response.data.data;
        } else if (response.data.id || response.data._id) {
          updatedUserFromServer = response.data;
        }
      }
      console.log('[AuthContext] apiUpdateProfile response data:', JSON.stringify(response.data, null, 2));
      console.log('[AuthContext] Extracted updatedUserFromServer:', JSON.stringify(updatedUserFromServer, null, 2));

      if (!updatedUserFromServer) {
          throw new Error("Profile update failed: No updated user data received from server or structure mismatch.");
      }

      const mergedUser = { ...user, ...updatedUserFromServer };
      setUser(mergedUser);
      await storeUserData(mergedUser);

    } catch (error: any) {
      const errorMsg = error.response?.data?.error?.message || error.message;
      console.error('[AuthContext] Profile update failed', errorMsg);
      throw new Error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    setUser,
  }), [user, isLoading]); // Dependencies: user, isLoading. Các hàm kia ổn định.

  return (
    <AuthContext.Provider
      value={contextValue} // Sử dụng contextValue đã memoize
    >
      {children}
    </AuthContext.Provider>
  );
};