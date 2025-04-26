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
  [ROUTES.MAIN.DOCUMENTS]: undefined;
  [ROUTES.MAIN.TASKS]: undefined;
  [ROUTES.MAIN.FORUM]: undefined;
  [ROUTES.MAIN.CHAT_LIST]: undefined;
  [ROUTES.MAIN.SETTINGS_NAVIGATOR]: NavigatorScreenParams<SettingsStackParamList>;
};

// Document Stack Param List
export type DocumentStackParamList = {
  [ROUTES.MAIN.DOCUMENTS]: undefined;
  [ROUTES.MAIN.DOCUMENT_DETAIL]: { documentId: string };
};

// Forum Stack Param List
export type ForumStackParamList = {
  [ROUTES.MAIN.FORUM]: undefined;
  [ROUTES.MAIN.FORUM_TOPIC]: { topicId: string; topicName: string };
  [ROUTES.MAIN.FORUM_POST_DETAIL]: { postId: string };
};

// Chat Stack Param List
export type ChatStackParamList = {
  [ROUTES.MAIN.CHAT_LIST]: undefined;
  [ROUTES.MAIN.CHAT]: { chatId: string; chatName: string; isGroupChat?: boolean };
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