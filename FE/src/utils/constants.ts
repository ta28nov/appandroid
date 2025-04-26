// API Constants
export const API_BASE_URL = 'https://api.digitalworkspace.com';

// Navigation Routes
export const ROUTES = {
  // Auth Routes
  AUTH: {
    LOGIN: 'Login',
    REGISTER: 'Register',
    FORGOT_PASSWORD: 'ForgotPassword',
  },
  // Main App Routes
  MAIN: {
    HOME: 'Home',
    DOCUMENTS: 'Documents',
    DOCUMENT_DETAIL: 'DocumentDetail',
    TASKS: 'Tasks',
    FORUM: 'Forum',
    FORUM_TOPIC: 'ForumTopic',
    FORUM_POST_DETAIL: 'ForumPostDetail',
    CHAT_LIST: 'ChatList',
    CHAT: 'Chat',
    NOTIFICATIONS: 'Notifications',
    SETTINGS_NAVIGATOR: 'SettingsNavigator',
    SETTINGS: 'Settings',
    PROFILE: 'Profile',
    INTEGRATIONS: 'Integrations',
    PENDING_SYNC: 'PendingSync',
    GLOBAL_SEARCH_RESULTS: 'GlobalSearchResults',
  },
  // Navigation Groups
  STACKS: {
    AUTH_STACK: 'AuthStack',
    MAIN_TABS: 'MainTabs',
    SETTINGS_STACK: 'SettingsStack',
  },
};

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