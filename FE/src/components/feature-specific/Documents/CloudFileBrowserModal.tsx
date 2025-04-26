import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '../../../styles/globalStyles';
import Button from '../../common/Button';
import FileListItem from './FileListItem';

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

// Định nghĩa các dịch vụ cloud được hỗ trợ
type CloudService = 'googleDrive' | 'dropbox' | 'oneDrive';

interface CloudFileBrowserModalProps {
  visible: boolean;
  onClose: () => void;
  onFileSelect: (file: CloudFile) => void;
  service: CloudService;
  multiSelect?: boolean;
}

/**
 * Modal dùng để duyệt và chọn tài liệu từ dịch vụ đám mây
 */
const CloudFileBrowserModal: React.FC<CloudFileBrowserModalProps> = ({
  visible,
  onClose,
  onFileSelect,
  service,
  multiSelect = false,
}) => {
  const { theme, isDarkMode } = useTheme();
  
  // State
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<CloudFile[]>([]);
  const [files, setFiles] = useState<CloudFile[]>([]);
  
  // Mô phỏng dữ liệu từ dịch vụ đám mây
  useEffect(() => {
    if (visible) {
      // Giả lập việc tải dữ liệu
      setLoading(true);
      setTimeout(() => {
        setFiles(getMockFiles(service, currentPath));
        setLoading(false);
      }, 800);
    } else {
      // Reset state khi đóng modal
      setSelectedFiles([]);
    }
  }, [visible, service, currentPath]);
  
  // Mô phỏng dữ liệu file dựa trên dịch vụ và đường dẫn hiện tại
  const getMockFiles = (service: CloudService, path: string[]): CloudFile[] => {
    // Root files cho các dịch vụ
    if (path.length === 0) {
      switch (service) {
        case 'googleDrive':
          return [
            { id: 'folder1', name: 'Tài liệu của tôi', type: 'folder' },
            { id: 'folder2', name: 'Được chia sẻ với tôi', type: 'folder' },
            { id: 'folder3', name: 'Dự án ABC', type: 'folder' },
            { id: 'file1', name: 'Báo cáo tháng 7.docx', type: 'file', mimeType: 'application/docx', size: '2.3 MB', modifiedTime: '22/07/2023' },
            { id: 'file2', name: 'Kế hoạch 2023.pdf', type: 'file', mimeType: 'application/pdf', size: '4.1 MB', modifiedTime: '15/06/2023' },
          ];
        case 'dropbox':
          return [
            { id: 'folder1', name: 'Tài liệu', type: 'folder' },
            { id: 'folder2', name: 'Hình ảnh', type: 'folder' },
            { id: 'folder3', name: 'Dự án', type: 'folder' },
            { id: 'file1', name: 'Hướng dẫn sử dụng.pdf', type: 'file', mimeType: 'application/pdf', size: '3.7 MB', modifiedTime: '10/07/2023' },
          ];
        case 'oneDrive':
          return [
            { id: 'folder1', name: 'Tài liệu', type: 'folder' },
            { id: 'folder2', name: 'Dự án', type: 'folder' },
            { id: 'file1', name: 'Bảng tính doanh thu Q2.xlsx', type: 'file', mimeType: 'application/xlsx', size: '1.8 MB', modifiedTime: '05/07/2023' },
            { id: 'file2', name: 'Bản trình bày sản phẩm mới.pptx', type: 'file', mimeType: 'application/pptx', size: '5.2 MB', modifiedTime: '18/07/2023' },
          ];
        default:
          return [];
      }
    }
    
    // Files trong các thư mục con (mô phỏng)
    if (path[0] === 'folder1') {
      return [
        { id: 'subfolder1', name: 'Dự án X', type: 'folder' },
        { id: 'subfolder2', name: 'Dự án Y', type: 'folder' },
        { id: 'subfile1', name: 'Tài liệu A.docx', type: 'file', mimeType: 'application/docx', size: '1.5 MB', modifiedTime: '20/07/2023' },
        { id: 'subfile2', name: 'Tài liệu B.pdf', type: 'file', mimeType: 'application/pdf', size: '3.2 MB', modifiedTime: '19/07/2023' },
      ];
    } else if (path[0] === 'folder2') {
      return [
        { id: 'subfile3', name: 'Ảnh sản phẩm.jpg', type: 'file', mimeType: 'image/jpeg', size: '2.7 MB', modifiedTime: '15/07/2023' },
        { id: 'subfile4', name: 'Logo công ty.png', type: 'file', mimeType: 'image/png', size: '0.5 MB', modifiedTime: '10/07/2023' },
      ];
    } else if (path[0] === 'folder3') {
      return [
        { id: 'subfolder3', name: 'Tài liệu dự án', type: 'folder' },
        { id: 'subfile5', name: 'Kế hoạch triển khai.docx', type: 'file', mimeType: 'application/docx', size: '1.2 MB', modifiedTime: '12/07/2023' },
        { id: 'subfile6', name: 'Ngân sách.xlsx', type: 'file', mimeType: 'application/xlsx', size: '0.8 MB', modifiedTime: '11/07/2023' },
      ];
    }
    
    // Mô phỏng tầng thư mục thứ 2
    if (path.length > 1) {
      return [
        { id: 'deep-file1', name: 'Tài liệu chi tiết.pdf', type: 'file', mimeType: 'application/pdf', size: '2.1 MB', modifiedTime: '08/07/2023' },
        { id: 'deep-file2', name: 'Báo cáo cuối cùng.docx', type: 'file', mimeType: 'application/docx', size: '1.7 MB', modifiedTime: '05/07/2023' },
      ];
    }
    
    return [];
  };
  
  // Xử lý khi nhấn vào một item
  const handleItemPress = (item: CloudFile) => {
    if (item.type === 'folder') {
      // Nếu là thư mục, di chuyển vào bên trong
      setCurrentPath([...currentPath, item.id]);
    } else {
      // Nếu là file, thêm vào danh sách chọn hoặc chọn trực tiếp
      if (multiSelect) {
        const isSelected = selectedFiles.some(file => file.id === item.id);
        if (isSelected) {
          setSelectedFiles(selectedFiles.filter(file => file.id !== item.id));
        } else {
          setSelectedFiles([...selectedFiles, item]);
        }
      } else {
        onFileSelect(item);
        onClose();
      }
    }
  };
  
  // Quay lại thư mục cha
  const navigateBack = () => {
    if (currentPath.length > 0) {
      setCurrentPath(currentPath.slice(0, -1));
    }
  };
  
  // Lấy tên cho dịch vụ đám mây
  const getServiceName = (service: CloudService): string => {
    switch (service) {
      case 'googleDrive':
        return 'Google Drive';
      case 'dropbox':
        return 'Dropbox';
      case 'oneDrive':
        return 'OneDrive';
      default:
        return '';
    }
  };
  
  // Lấy icon và màu cho dịch vụ
  const getServiceIcon = (service: CloudService): { name: string; color: string } => {
    switch (service) {
      case 'googleDrive':
        return { name: 'google-drive', color: '#0F9D58' };
      case 'dropbox':
        return { name: 'dropbox', color: '#0061FF' };
      case 'oneDrive':
        return { name: 'microsoft-onedrive', color: '#28A8EA' };
      default:
        return { name: 'cloud', color: theme.colors.primary };
    }
  };
  
  // Xử lý khi nhấn nút Chọn (trong chế độ đa chọn)
  const handleSelect = () => {
    if (selectedFiles.length > 0) {
      // Trong ứng dụng thực, có thể cần xử lý riêng cho từng file
      onFileSelect(selectedFiles[0]); // Chỉ xử lý file đầu tiên cho đơn giản
      onClose();
    }
  };
  
  // Hiển thị breadcrumbs
  const renderBreadcrumbs = () => {
    const folders = currentPath.map((path, index) => {
      // Lấy tên thư mục từ ID
      const folderName = files.find(file => file.id === path)?.name || path;
      return (
        <TouchableOpacity
          key={path}
          style={styles.breadcrumbItem}
          onPress={() => setCurrentPath(currentPath.slice(0, index + 1))}
        >
          <Text 
            style={[
              styles.breadcrumbText, 
              { color: theme.colors.primary }
            ]}
            numberOfLines={1}
          >
            {folderName}
          </Text>
          {index < currentPath.length - 1 && (
            <Icon name="chevron-right" size={16} color={theme.colors.primary} />
          )}
        </TouchableOpacity>
      );
    });
    
    return (
      <View style={styles.breadcrumbsContainer}>
        <TouchableOpacity
          style={styles.breadcrumbItem}
          onPress={() => setCurrentPath([])}
        >
          <Icon
            name={getServiceIcon(service).name}
            size={16}
            color={getServiceIcon(service).color}
          />
          <Text
            style={[styles.breadcrumbText, { color: theme.colors.primary }]}
            numberOfLines={1}
          >
            {getServiceName(service)}
          </Text>
          {currentPath.length > 0 && (
            <Icon name="chevron-right" size={16} color={theme.colors.primary} />
          )}
        </TouchableOpacity>
        {folders}
      </View>
    );
  };
  
  // Hiển thị nội dung chính của modal
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            Đang tải...
          </Text>
        </View>
      );
    }
    
    if (files.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Icon name="folder-open-outline" size={48} color={theme.colors.primary} />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            Thư mục trống
          </Text>
        </View>
      );
    }
    
    return (
      <FlatList
        data={files}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <FileListItem
            file={item}
            onPress={() => handleItemPress(item)}
            selected={selectedFiles.some(file => file.id === item.id)}
            selectable={multiSelect && item.type === 'file'}
          />
        )}
      />
    );
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <SafeAreaView 
        style={[
          styles.container, 
          { backgroundColor: theme.colors.background }
        ]}
      >
        {/* Header */}
        <View 
          style={[
            styles.header, 
            { 
              backgroundColor: theme.colors.surface,
              borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          ]}
        >
          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
          >
            <Icon name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.title, { color: theme.colors.text }]}>
            {getServiceName(service)}
          </Text>
          
          {multiSelect && (
            <Button
              title={`Chọn (${selectedFiles.length})`}
              onPress={handleSelect}
              disabled={selectedFiles.length === 0}
              variant="text"
              size="small"
            />
          )}
        </View>
        
        {/* Breadcrumbs */}
        <View 
          style={[
            styles.breadcrumbs,
            {
              backgroundColor: theme.colors.surface,
              borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          ]}
        >
          {currentPath.length > 0 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={navigateBack}
            >
              <Icon name="arrow-left" size={20} color={theme.colors.primary} />
            </TouchableOpacity>
          )}
          
          <View style={styles.breadcrumbsScroll}>
            {renderBreadcrumbs()}
          </View>
        </View>
        
        {/* File list */}
        <View style={styles.content}>
          {renderContent()}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  closeButton: {
    padding: 4,
  },
  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.bold,
  },
  breadcrumbs: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: SPACING.sm,
    padding: 4,
  },
  breadcrumbsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'nowrap',
    flexShrink: 1,
  },
  breadcrumbsScroll: {
    flexDirection: 'row',
    flexShrink: 1,
    overflow: 'scroll',
  },
  breadcrumbItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.xs,
  },
  breadcrumbText: {
    fontSize: FONT_SIZE.body,
    marginHorizontal: 4,
  },
  content: {
    flex: 1,
    padding: SPACING.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.body,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.body,
  },
});

export default CloudFileBrowserModal; 