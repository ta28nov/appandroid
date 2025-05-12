import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/apiConfig';

// !! Thay đổi base URL này thành địa chỉ backend của bạn !!
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

// Thêm hàm tìm kiếm user
export const apiSearchUsers = (query: string) => apiClient.get('/users/search', { params: { q: query } });

// Thêm hàm lấy profile user khác bằng ID
export const apiGetUserProfile = (userId: string) => apiClient.get(`/users/${userId}`);

// --- Task API Calls ---

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: string;
  completed: boolean;
  dueDate: string;
  overdue: boolean;
  // Thêm các trường khác nếu API trả về
}

interface GetTasksParams {
  limit?: number;
  sortBy?: string; // ví dụ: 'dueDate:asc'
  status?: string; // ví dụ: 'pending', 'overdue'
  // Thêm các params khác nếu API hỗ trợ
}

/**
 * Lấy danh sách tasks.
 * @param params - Các tham số query (filter, pagination, sort)
 */
export const apiGetTasks = (params?: GetTasksParams) => apiClient.get<Task[]>('/tasks', { params });

// Thêm hàm tạo task mới
export const apiCreateTask = (taskData: Partial<Task>) => apiClient.post('/tasks', taskData);

// Thêm hàm lấy chi tiết task
export const apiGetTaskById = (id: string) => apiClient.get<Task>(`/tasks/${id}`);

// Thêm hàm cập nhật task
export const apiUpdateTask = (id: string, taskData: Partial<Task>) => apiClient.put(`/tasks/${id}`, taskData);

// Thêm hàm xóa task
export const apiDeleteTask = (id: string) => apiClient.delete(`/tasks/${id}`);

// --- Project API Calls ---

// TODO: Định nghĩa interface Project chi tiết hơn khi rõ cấu trúc
// Export interface
export interface Project { id: string; name: string; [key: string]: any; }

export const apiGetProjects = () => apiClient.get<Project[]>('/projects');
export const apiCreateProject = (projectData: any) => apiClient.post('/projects', projectData);
export const apiGetProjectById = (id: string) => apiClient.get<Project>(`/projects/${id}`);
export const apiUpdateProject = (id: string, projectData: any) => apiClient.put(`/projects/${id}`, projectData);
export const apiDeleteProject = (id: string) => apiClient.delete(`/projects/${id}`);
export const apiAddProjectMember = (id: string, memberData: { userId: string; role?: string }) => apiClient.post(`/projects/${id}/members`, memberData);
export const apiRemoveProjectMember = (id: string, userId: string) => apiClient.delete(`/projects/${id}/members/${userId}`);
export const apiGetProjectTasks = (id: string, params?: GetTasksParams) => apiClient.get<Task[]>(`/projects/${id}/tasks`, { params });

// --- Chat API Calls ---

// TODO: Định nghĩa interface Chat, Message chi tiết hơn
// Export interfaces
export interface Chat { id: string; [key: string]: any; }
export interface Message { id: string; [key: string]: any; }

export const apiGetChats = () => apiClient.get<Chat[]>('/chats');
export const apiCreateOrGetChat = (userId: string) => apiClient.post<Chat>('/chats', { userId });
export const apiGetChatMessages = (chatId: string, params?: { limit?: number; before?: string }) => apiClient.get<Message[]>(`/chats/${chatId}/messages`, { params });
export const apiSendChatMessage = (chatId: string, messageData: { text: string }) => apiClient.post<Message>(`/chats/${chatId}/messages`, messageData);

// --- Forum API Calls ---

// TODO: Định nghĩa interface ForumPost, ForumComment chi tiết hơn
// Export interfaces
export interface ForumPost { 
  id: string; 
  liked?: boolean; // Thêm trường liked để ForumScreen có thể dùng
  author?: { // Cho phép author là optional hoặc null
      id: string;
      name: string;
      avatar?: string;
  };
  [key: string]: any; // Giữ lại để linh hoạt
}
export interface ForumComment { id: string; [key: string]: any; }
export interface ForumTag { id: string; name: string; }

export const apiGetForumPosts = (params?: { tag?: string; sortBy?: string; limit?: number; page?: number }) => apiClient.get<ForumPost[]>('/forum/posts', { params });
export const apiCreateForumPost = (postData: any) => apiClient.post<ForumPost>('/forum/posts', postData);
export const apiGetForumPostById = (postId: string) => apiClient.get<ForumPost>(`/forum/posts/${postId}`);
export const apiUpdateForumPost = (postId: string, postData: any) => apiClient.put<ForumPost>(`/forum/posts/${postId}`, postData);
export const apiDeleteForumPost = (postId: string) => apiClient.delete(`/forum/posts/${postId}`);
export const apiToggleForumPostLike = (postId: string) => apiClient.post(`/forum/posts/${postId}/like`);
export const apiGetForumPostComments = (postId: string) => apiClient.get<ForumComment[]>(`/forum/posts/${postId}/comments`);
export const apiCreateForumComment = (postId: string, commentData: { content: string }) => apiClient.post<ForumComment>(`/forum/posts/${postId}/comments`, commentData);
export const apiDeleteForumComment = (commentId: string) => apiClient.delete(`/forum/comments/${commentId}`);
export const apiGetForumTags = () => apiClient.get<ForumTag[]>('/forum/tags');

// --- Document API Calls ---

/**
 * Lấy danh sách tài liệu user có quyền truy cập.
 */
export const apiGetDocuments = (params?: { limit?: number; sortBy?: string }) => apiClient.get('/documents', { params });

/**
 * Upload tài liệu mới.
 * @param formData - FormData chứa file và metadata
 */
export const apiUploadDocument = (formData: FormData) =>
  apiClient.post('/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

/**
 * Lấy metadata tài liệu.
 * @param id - ID tài liệu
 */
export const apiGetDocumentById = (id: string) => apiClient.get(`/documents/${id}`);

/**
 * Lấy URL download tài liệu.
 * @param id - ID tài liệu
 */
export const apiGetDocumentDownloadUrl = (id: string) => apiClient.get(`/documents/${id}/download`);

/**
 * Cập nhật metadata tài liệu.
 * @param id - ID tài liệu
 * @param data - Dữ liệu cập nhật
 */
export const apiUpdateDocument = (id: string, data: any) => apiClient.put(`/documents/${id}`, data);

/**
 * Xóa tài liệu.
 * @param id - ID tài liệu
 */
export const apiDeleteDocument = (id: string) => apiClient.delete(`/documents/${id}`);

/**
 * Chia sẻ tài liệu.
 * @param id - ID tài liệu
 * @param data - Dữ liệu chia sẻ (ví dụ: email người nhận)
 */
export const apiShareDocument = (id: string, data: any) => apiClient.post(`/documents/${id}/share`, data);

/**
 * Yêu thích/bỏ yêu thích tài liệu.
 * @param id - ID tài liệu
 */
export const apiToggleFavoriteDocument = (id: string) => apiClient.post(`/documents/${id}/favorite`);

// --- Notification API Calls ---

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

interface GetNotificationsParams {
  limit?: number;
  read?: boolean;
}

/**
 * Lấy danh sách thông báo
 */
export const apiGetNotifications = (params?: GetNotificationsParams) => apiClient.get<Notification[]>('/notifications', { params });

/**
 * Đánh dấu các thông báo đã đọc
 * @param ids - Mảng ID thông báo
 */
export const apiMarkNotificationsRead = (ids: string[]) => apiClient.post('/notifications/read', { ids });

/**
 * Đánh dấu tất cả đã đọc
 */
export const apiMarkAllNotificationsRead = () => apiClient.post('/notifications/read-all');

/**
 * Xóa tất cả thông báo
 */
export const apiDeleteAllNotifications = () => apiClient.delete('/notifications');

/**
 * Xóa một thông báo cụ thể
 * @param id - ID thông báo
 */
export const apiDeleteNotification = (id: string) => apiClient.delete(`/notifications/${id}`); 