import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// !! Thay đổi base URL này thành địa chỉ backend của bạn !!
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000/api'; 

const AUTH_TOKEN_KEY = '@auth_token';

// Tạo instance Axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 giây
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Quản lý Token ---

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  } catch (e) {
    console.error('Failed to get auth token', e);
    return null;
  }
};

export const setToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  } catch (e) {
    console.error('Failed to set auth token', e);
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (e) {
    console.error('Failed to remove auth token', e);
  }
};

// --- Interceptor để thêm token vào header ---

apiClient.interceptors.request.use(
  async (config) => {
    // Chỉ thêm token cho các request không phải là login hoặc register
    if (
      config.url?.endsWith('/auth/login') ||
      config.url?.endsWith('/auth/register')
    ) {
      return config;
    }

    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Interceptor để xử lý lỗi (ví dụ: 401 Unauthorized) ---
// Bạn có thể mở rộng phần này để tự động logout hoặc refresh token
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response) {
      // Xử lý lỗi cụ thể, ví dụ 401
      if (error.response.status === 401) {
        console.warn('Unauthorized request, potential logout needed...');
        // TODO: Gọi hàm logout từ AuthContext hoặc điều hướng về màn hình Login
        // Ví dụ: await removeToken(); // Xóa token cũ
        //       RootNavigation.navigate(ROUTES.AUTH.LOGIN); // Cần thiết lập RootNavigation
      }
    } else if (error.request) {
      // Request được gửi đi nhưng không nhận được response
      console.error('API request error: No response received', error.request);
    } else {
      // Lỗi xảy ra khi thiết lập request
      console.error('API request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// --- Auth API Calls ---

/**
 * Gọi API đăng nhập.
 * @param credentials - Object chứa email và password.
 * @returns Promise chứa response từ API (thường có token).
 */
export const apiLogin = (credentials: { email: string; password: string }) => {
  return apiClient.post('/auth/login', credentials);
};

/**
 * Gọi API để lấy thông tin người dùng hiện tại (yêu cầu token).
 * @returns Promise chứa response từ API (thường có thông tin user).
 */
export const apiGetMe = () => {
  return apiClient.get('/auth/me');
};

/**
 * Gọi API đăng ký user mới.
 * @param userData - Object chứa name, email, password.
 * @returns Promise chứa response từ API.
 */
export const apiRegister = (userData: { name: string; email: string; password: string }) => {
  return apiClient.post('/auth/register', userData);
};

// --- User API Calls ---

/**
 * Gọi API để cập nhật thông tin người dùng hiện tại (yêu cầu token).
 * @param profileData - Object chứa các trường cần cập nhật (ví dụ: name, avatar).
 * @returns Promise chứa response từ API (thường có thông tin user đã cập nhật).
 */
export const apiUpdateProfile = (profileData: Partial<{ name: string; avatar: string /* Thêm các trường khác nếu cần */ }>) => {
  return apiClient.put('/users/me', profileData);
}; 