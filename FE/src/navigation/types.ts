import { NavigatorScreenParams } from '@react-navigation/native';
import { ROUTES } from '../utils/constants';

// Auth Stack Navigator Param List
export type AuthStackParamList = {
  [ROUTES.AUTH.LOGIN]: undefined;
  [ROUTES.AUTH.REGISTER]: undefined;
  [ROUTES.AUTH.FORGOT_PASSWORD]: undefined;
};

// Define param list for each tab in the Main tab navigator
export type MainTabParamList = {
  [ROUTES.MAIN.HOME]: undefined;
  [ROUTES.MAIN.DOCUMENTS]: NavigatorScreenParams<DocumentStackParamList>;
  [ROUTES.MAIN.TASKS]: NavigatorScreenParams<TaskStackParamList>;
  [ROUTES.MAIN.FORUM]: NavigatorScreenParams<ForumStackParamList>;
  [ROUTES.MAIN.CHAT_LIST]: NavigatorScreenParams<ChatStackParamList>;
  [ROUTES.MAIN.SETTINGS_NAVIGATOR]: NavigatorScreenParams<SettingsStackParamList>;
};

// Document Stack Param List
export type DocumentStackParamList = {
  [ROUTES.MAIN.DOCUMENTS]: undefined;
  [ROUTES.MAIN.DOCUMENT_DETAIL]: { documentId: string; documentTitle?: string };
};

// Forum Stack Param List (MỚI)
export type ForumStackParamList = {
  [ROUTES.MAIN.FORUM]: undefined; // Màn hình danh sách các bài đăng (ForumScreen)
  [ROUTES.MAIN.FORUM_POST_DETAIL]: { postId: string; postTitle?: string }; // Chi tiết bài đăng
  [ROUTES.MAIN.CREATE_FORUM_POST]: { postId?: string }; // postId là optional, dùng khi chỉnh sửa bài đăng
  // [ROUTES.MAIN.FORUM_TOPIC]: { tag?: string }; // Nếu có màn hình riêng cho danh sách bài theo tag
};

// Chat Stack Param List
export type ChatStackParamList = {
  [ROUTES.MAIN.CHAT_LIST]: undefined;
  [ROUTES.MAIN.CHAT]: { 
    chatId: string; 
    chatName: string; 
    isGroupChat?: boolean;
    chatAvatar?: string;
    // participants?: (UserSnippet | string)[]; // Có thể thêm nếu ChatDetailScreen cần
  };
  [ROUTES.MAIN.CREATE_CHAT_USER_SELECTION]: undefined;
};

// Task Stack Param List (MỚI)
export type TaskStackParamList = {
  [ROUTES.MAIN.TASKS_LIST]: undefined; // Màn hình danh sách công việc (TaskManagementScreen)
  [ROUTES.MAIN.TASK_DETAIL]: { taskId: string }; // Màn hình chi tiết công việc
};

// Settings Stack Param List
export type SettingsStackParamList = {
  [ROUTES.MAIN.SETTINGS]: undefined;
  [ROUTES.MAIN.PROFILE]: undefined;
  [ROUTES.MAIN.INTEGRATIONS]: undefined;
  [ROUTES.MAIN.PENDING_SYNC]: undefined;
};

// App Stack Param List (This should be the top-level stack)
export type AppStackParamList = {
  [ROUTES.STACKS.AUTH_STACK]: NavigatorScreenParams<AuthStackParamList>;
  [ROUTES.STACKS.MAIN_TABS]: NavigatorScreenParams<MainTabParamList>;
  [ROUTES.MAIN.NOTIFICATIONS]: undefined;
  [ROUTES.MAIN.GLOBAL_SEARCH_RESULTS]: { query: string };
}; 