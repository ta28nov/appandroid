import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../../styles/globalStyles';

// Interface định nghĩa dữ liệu file/thư mục
interface CloudFile {
  id: string;
  name: string;
  type: 'file' | 'folder';
  mimeType?: string;
  size?: string;
  modifiedTime?: string;
  children?: CloudFile[];
}

interface FileListItemProps {
  file: CloudFile;
  onPress: () => void;
  selected?: boolean;
  selectable?: boolean;
}

/**
 * Component hiển thị thông tin file/thư mục trong danh sách duyệt
 */
const FileListItem: React.FC<FileListItemProps> = ({
  file,
  onPress,
  selected = false,
  selectable = false,
}) => {
  const { theme, isDarkMode } = useTheme();
  
  // Xác định icon và màu sắc dựa trên loại file
  const getFileIconInfo = (): { name: string; color: string } => {
    if (file.type === 'folder') {
      return { name: 'folder', color: '#FFC107' };
    }
    
    // Xác định icon dựa trên định dạng file
    const mimeType = file.mimeType || '';
    
    if (mimeType.includes('pdf')) {
      return { name: 'file-pdf-box', color: '#F44336' };
    } else if (mimeType.includes('word') || mimeType.includes('docx')) {
      return { name: 'file-word', color: '#2196F3' };
    } else if (mimeType.includes('excel') || mimeType.includes('xlsx')) {
      return { name: 'file-excel', color: '#4CAF50' };
    } else if (mimeType.includes('powerpoint') || mimeType.includes('pptx')) {
      return { name: 'file-powerpoint', color: '#FF9800' };
    } else if (mimeType.includes('image')) {
      return { name: 'file-image', color: '#9C27B0' };
    } else if (mimeType.includes('video')) {
      return { name: 'file-video', color: '#E91E63' };
    } else if (mimeType.includes('audio')) {
      return { name: 'file-music', color: '#673AB7' };
    } else if (mimeType.includes('zip') || mimeType.includes('compress')) {
      return { name: 'zip-box', color: '#795548' };
    } else {
      return { name: 'file-outline', color: '#607D8B' };
    }
  };
  
  const { name, color } = getFileIconInfo();
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: selected
            ? `${theme.colors.primary}15`
            : 'transparent',
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Icon name={name} size={32} color={color} />
      </View>
      
      <View style={styles.contentContainer}>
        <Text
          style={[styles.fileName, { color: theme.colors.text }]}
          numberOfLines={1}
        >
          {file.name}
        </Text>
        
        {file.type === 'file' && (
          <View style={styles.fileInfo}>
            {file.size && (
              <Text
                style={[
                  styles.fileInfoText,
                  { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' },
                ]}
              >
                {file.size}
              </Text>
            )}
            
            {file.modifiedTime && (
              <>
                <Text
                  style={[
                    styles.fileInfoText,
                    { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' },
                  ]}
                >
                  •
                </Text>
                <Text
                  style={[
                    styles.fileInfoText,
                    { color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)' },
                  ]}
                >
                  {file.modifiedTime}
                </Text>
              </>
            )}
          </View>
        )}
      </View>
      
      {file.type === 'folder' ? (
        <Icon name="chevron-right" size={24} color={theme.colors.text} />
      ) : selectable ? (
        <View
          style={[
            styles.checkboxContainer,
            {
              backgroundColor: selected
                ? theme.colors.primary
                : 'transparent',
              borderColor: selected
                ? theme.colors.primary
                : isDarkMode
                ? 'rgba(255, 255, 255, 0.5)'
                : 'rgba(0, 0, 0, 0.5)',
            },
          ]}
        >
          {selected && <Icon name="check" size={16} color="#FFFFFF" />}
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.xs,
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  fileName: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: 2,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileInfoText: {
    fontSize: FONT_SIZE.caption,
    marginRight: SPACING.xs,
  },
  checkboxContainer: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
  },
});

export default FileListItem; 