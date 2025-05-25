// API Constants
export const API_BASE_URL = 'https://api.digitalworkspace.com';

// Navigation Routes
export const ROUTES = {
  // Auth Routes
  AUTH: {
    LOGIN: 'Login',
    REGISTER: 'Register',
    FORGOT_PASSWORD: 'ForgotPassword',
  } as const,
  // Main App Routes
  MAIN: {
    HOME: 'Home',
    DOCUMENTS: 'Documents',
    DOCUMENT_DETAIL: 'DocumentDetail',
    TASKS: 'Tasks',
    TASKS_LIST: 'TasksList',
    TASK_DETAIL: 'TaskDetail',
    FORUM: 'Forum',
    FORUM_TOPIC: 'ForumTopic',
    FORUM_POST_DETAIL: 'ForumPostDetail',
    CREATE_FORUM_POST: 'CreateForumPost',
    CHAT_LIST: 'ChatList',
    CHAT: 'Chat',
    CREATE_CHAT_USER_SELECTION: 'CreateChatUserSelection',
    NOTIFICATIONS: 'Notifications',
    SETTINGS_NAVIGATOR: 'SettingsNavigator',
    SETTINGS: 'Settings',
    PROFILE: 'Profile',
    INTEGRATIONS: 'Integrations',
    PENDING_SYNC: 'PendingSync',
    GLOBAL_SEARCH_RESULTS: 'GlobalSearchResults',
  } as const,
  // Navigation Groups
  STACKS: {
    AUTH_STACK: 'AuthStack',
    MAIN_TABS: 'MainTabs',
    SETTINGS_STACK: 'SettingsStack',
    DOCUMENT_STACK: 'DocumentStack',
    TASK_STACK: 'TaskStack',
    FORUM_STACK: 'ForumStack',
  } as const,
} as const;

// Document Types
export const DOCUMENT_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  DOC: 'application/msword',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  XLS: 'application/vnd.ms-excel',
  PPTX: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  PPT: 'application/vnd.ms-powerpoint',
  IMAGE: 'image',
  TEXT: 'text/plain',
};

// Task Status
export const TASK_STATUS = {
  TODO: 'Todo',
  IN_PROGRESS: 'In Progress',
  REVIEW: 'Review',
  DONE: 'Done',
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  URGENT: 'Urgent',
};

// User Presence Status
export const PRESENCE_STATUS = {
  ONLINE: 'Online',
  OFFLINE: 'Offline',
  BUSY: 'Busy',
  AWAY: 'Away',
};

// Storage Keys
export const STORAGE_KEYS = {
  USER_DATA: '@user_data',
  THEME_PREFERENCE: '@theme_preference',
  AUTH_TOKEN: '@auth_token',
};

// Animation Constants
export const ANIMATION = {
  DURATION: {
    SHORT: 200,
    MEDIUM: 300,
    LONG: 500,
  },
}; 