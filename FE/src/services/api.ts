import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/apiConfig';
import { STORAGE_KEYS } from '../utils/constants';

// !! Thay đổi base URL này thành địa chỉ backend của bạn !!

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
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (e) {
    console.error('Failed to get auth token', e);
    return null;
  }
};

export const setToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (e) {
    console.error('Failed to set auth token', e);
  }
};

export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
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
  _id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate?: string;
  projectId?: string;
}

interface GetTasksParams {
  limit?: number;
  sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'title';
  sortOrder?: 'asc' | 'desc';
  status?: string;
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  projectId?: string;
  page?: number;
}

interface TasksApiResponse {
  tasks: Task[];
  page: number;
  pages: number;
  total: number;
}

/**
 * Lấy danh sách tasks.
 * @param params - Các tham số query (filter, pagination, sort)
 */
export const apiGetTasks = (params?: GetTasksParams) => apiClient.get<TasksApiResponse>('/tasks', { params });

// Thêm hàm tạo task mới
export const apiCreateTask = (taskData: Omit<Partial<Task>, '_id'>) => apiClient.post<Task>('/tasks', taskData);

// Thêm hàm lấy chi tiết task
export const apiGetTaskById = (id: string) => apiClient.get<Task>(`/tasks/${id}`);

// Thêm hàm cập nhật task
export const apiUpdateTask = (id: string, taskData: Omit<Partial<Task>, '_id'>) => apiClient.put<Task>(`/tasks/${id}`, taskData);

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

export interface UserSnippet {
  _id: string;
  name: string; 
  username?: string; // Thêm username vì model User có thể có
  avatarUrl?: string;
}

export interface LastMessageData {
  messageId: string; 
  senderId: UserSnippet | string; 
  text: string;
  timestamp: string; 
}

export interface ChatData {
  _id: string; 
  participant: (UserSnippet | string)[];
  lastMessage: LastMessageData | null;
  createdAt: string; 
  updatedAt: string; 
  // unreadCount?: number;
}

// Add PaginatedChatResponse interface
export interface PaginatedChatResponse {
  chats: ChatData[];
  page: number;
  pages: number;
  total: number;
}

export interface ChatMessageData {
  _id: string; 
  chatId: string;
  senderId: UserSnippet | string; 
  text: string;
  timestamp: string; // Representing createdAt from backend model
  readBy?: (UserSnippet | string)[]; 
}

// Giữ lại Chat và Message type cũ cho apiCreateChat nếu response của nó đơn giản
// Nhưng các hàm get nên dùng type chi tiết hơn
// export interface Chat { id: string; [key: string]: any; } // Thay thế bằng ChatData
// export interface Message { id: string; [key: string]: any; } // Thay thế bằng ChatMessageData

export const apiGetChats = () => apiClient.get<PaginatedChatResponse>('/chats');

/**
 * Tạo một cuộc trò chuyện mới.
 * @param chatData - Dữ liệu để tạo chat, ví dụ: { participants: string[] }
 * @returns Promise chứa thông tin chat đã tạo.
 */
export const apiCreateChat = (chatData: { participants: string[] }) =>
  apiClient.post<ChatData>('/chats', chatData); // Sử dụng ChatData cho response type

export const apiCreateOrGetChat = (userId: string) => apiClient.post<ChatData>('/chats', { userId }); // Sử dụng ChatData
export const apiGetChatMessages = (chatId: string, params?: { limit?: number; before?: string }) => apiClient.get<ChatMessageData[]>(`/chats/${chatId}/messages`, { params });
export const apiSendChatMessage = (chatId: string, messageData: { text: string }) => apiClient.post<ChatMessageData>(`/chats/${chatId}/messages`, messageData);

// --- Forum API Calls ---

// Interfaces for Forum
export interface ForumTag {
  _id: string;
  name: string;
  // count?: number; // Có thể có nếu API trả về số lượng bài đăng cho mỗi tag
}

export interface ForumAuthor {
  _id: string;
  username: string; // Hoặc name, email tùy thuộc vào dữ liệu user được populate
  avatarUrl?: string;
}

export interface ForumPost {
  _id: string;
  authorId: ForumAuthor | string; // Sẽ là ForumAuthor nếu được populate, hoặc string nếu chỉ là ID
  title: string;
  content: string;
  tags: string[];
  likesCount: number;
  commentsCount: number;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
  isLikedByUser?: boolean; // Thêm trường này (tùy chọn)
}

export interface ForumComment {
  _id: string;
  postId: string;
  authorId: ForumAuthor | string;
  content: string;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
  isLikedByUser?: boolean; // Thêm trường này cho comment (tùy chọn)
}

export interface CreateForumPostPayload {
  title: string;
  content: string;
  tags?: string[];
}

export interface UpdateForumPostPayload extends Partial<CreateForumPostPayload> {}

export interface CreateForumCommentPayload {
  content: string;
}

// API Response Types for Forum
export interface ForumPostsApiResponse {
  posts: ForumPost[];
  page: number;
  pages: number;
  total: number;
}

export interface ForumPostDetailApiResponse extends ForumPost {}

export interface ForumCommentsApiResponse {
  comments: ForumComment[];
  // pagination nếu có
}

export interface ForumTagsApiResponse {
  tags: ForumTag[];
}

// API Functions for Forum

// Posts
export const apiGetForumPosts = (params?: { page?: number; limit?: number; tag?: string; sortBy?: string }) => 
  apiClient.get<ForumPostsApiResponse>('/forum/posts', { params });

export const apiCreateForumPost = (data: CreateForumPostPayload) => 
  apiClient.post<ForumPostDetailApiResponse>('/forum/posts', data);

export const apiGetForumPostById = (postId: string) => 
  apiClient.get<ForumPostDetailApiResponse>(`/forum/posts/${postId}`);

export const apiUpdateForumPost = (postId: string, data: UpdateForumPostPayload) => 
  apiClient.put<ForumPostDetailApiResponse>(`/forum/posts/${postId}`, data);

export const apiDeleteForumPost = (postId: string) => 
  apiClient.delete(`/forum/posts/${postId}`);

export const apiLikeUnlikeForumPost = (postId: string) => 
  apiClient.post<{ likesCount: number, isLikedByUser: boolean }>(`/forum/posts/${postId}/like`); // Cập nhật response type

// Comments
export const apiGetForumPostComments = (postId: string, params?: { page?: number; limit?: number }) => 
  apiClient.get<ForumCommentsApiResponse>(`/forum/posts/${postId}/comments`, { params });

export const apiCreateForumComment = (postId: string, data: CreateForumCommentPayload) => 
  apiClient.post<ForumComment>(`/forum/posts/${postId}/comments`, data); // Giả sử trả về comment vừa tạo

export const apiDeleteForumComment = (commentId: string) => 
  apiClient.delete(`/forum/comments/${commentId}`);

// Tags
export const apiGetForumTags = () => 
  apiClient.get<ForumTagsApiResponse>('/forum/tags');

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

// Interface for a single Notification
interface Notification { // This interface should align with what each notification object in the array looks like
  _id: string;
  title: string;
  message: string;
  // type: string; // Consider removing if relatedEntity.entityType is the primary source
  read: boolean;
  createdAt: string;
  relatedEntity?: {
    entityType: string;
    entityId: string;
    entityName?: string; 
    chatAvatar?: string;
  };
}

interface GetNotificationsParams {
  limit?: number;
  read?: boolean;
  page?: number;
}

// Interface for the entire response of /notifications endpoint
interface GetNotificationsResponse {
  notifications: Notification[];
  page: number;
  pages: number;
  total: number;
  unreadCount?: number; // As seen in the logs, for total unread badge
}

/**
 * Lấy danh sách thông báo.
 * @param params - Các tham số query (limit, read, page)
 * @returns Promise chứa response từ API với danh sách thông báo và thông tin pagination.
 */
export const apiGetNotifications = (params?: GetNotificationsParams) => 
  apiClient.get<GetNotificationsResponse>('/notifications', { params });

/**
 * Đánh dấu các thông báo là đã đọc.
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