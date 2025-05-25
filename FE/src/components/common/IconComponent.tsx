import React from 'react';
import { Text, TextStyle } from 'react-native';

// Map các icon name từ MaterialCommunityIcons sang emoji Unicode
const iconMap: Record<string, string> = {
  // Navigation icons
  'home': '🏠',
  'file-document-outline': '📄',
  'checkbox-marked-outline': '✅',
  'checkbox-marked-circle-outline': '✅',
  'checkbox-marked': '✓',
  'checkbox-blank-outline': '☐',
  'forum-outline': '💬',
  'message-outline': '💬',
  'chat-outline': '💬',
  'cog-outline': '⚙️',
  'settings-outline': '⚙️',
  'bell': '🔔',
  'bell-outline': '🔔',
  
  // Common actions
  'plus': '+',
  'minus': '−',
  'close': '✕',
  'check': '✓',
  'delete-outline': '🗑️',
  'trash-can-outline': '🗑️',
  'pencil-outline': '✏️',
  'pencil': '✏️',
  'magnify': '🔍',
  'calendar': '📅',
  'calendar-outline': '📅',
  'alert-circle-outline': '⚠️',
  'information-outline': '📝',
  'clipboard-text-outline': '📋',
  'clock-outline': '🕒',
  'chevron-right': '›',
  'comment-alert-outline': '🗣️',
  
  // File types
  'file-pdf-box': '🟥',
  'file-word-box': '🟦',
  'file-excel-box': '🟩',
  'file-powerpoint-box': '🟧',
  
  // Other specific icons
  'robot': '🤖',
  'robot-outline': '🤖',
  
  // Default fallback
  'default': '•',
};

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle;
}

/**
 * Component thay thế cho MaterialCommunityIcons, sử dụng emoji Unicode
 * thay vì font icon để tránh lỗi "fontFamily not loaded"
 */
const IconComponent: React.FC<IconProps> = ({ name, size = 24, color = '#000', style }) => {
  // Lấy emoji tương ứng hoặc fallback nếu không tìm thấy
  const iconContent = iconMap[name] || iconMap['default'];
  
  return (
    <Text 
      style={[
        { 
          fontSize: size, 
          color: color,
          lineHeight: size,
          textAlign: 'center',
        },
        style
      ]}
    >
      {iconContent}
    </Text>
  );
};

export default IconComponent;
