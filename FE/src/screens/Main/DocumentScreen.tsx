import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';
import { useTheme } from '../../hooks/useTheme';
import { COLORS } from '../../styles/theme';
import { FONT_SIZE, FONT_WEIGHT, SPACING, SHADOW } from '../../styles/globalStyles';
import { ROUTES, DOCUMENT_TYPES } from '../../utils/constants';
import { mockDocuments } from '../../utils/mockData';
import AdvancedSearchBar from '../../components/common/AdvancedSearchBar';
import AnimatedButton from '../../components/common/AnimatedButton';
import EmptyStateComponent from '../../components/common/EmptyStateComponent';
import { DocumentStackParamList } from '../../navigation/types';

// Interface định nghĩa cấu trúc dữ liệu tài liệu
// Mô tả chi tiết các thuộc tính cần thiết của một tài liệu
interface Document {
  id: string;           // ID duy nhất của tài liệu
  title: string;        // Tiêu đề tài liệu
  description: string;  // Mô tả chi tiết về tài liệu
  type: string;         // Loại tài liệu (PDF, DOCX, v.v.)
  size: string;         // Kích thước file (hiển thị dạng chuỗi: "1.2 MB")
  createdBy: string;    // Người tạo tài liệu
  createdAt: string;    // Thời gian tạo (định dạng ISO)
  updatedAt: string;    // Thời gian cập nhật gần nhất (định dạng ISO)
  shared: boolean;      // Trạng thái chia sẻ (true/false)
  tags: string[];       // Mảng các thẻ tag gắn với tài liệu
}

// Định nghĩa các danh mục tài liệu để hiển thị trong thanh lọc
const documentCategories = [
  { id: 'all', label: 'Tất cả' },          // Hiển thị tất cả tài liệu
  { id: 'recent', label: 'Gần đây' },      // Chỉ hiển thị tài liệu được cập nhật gần đây
  { id: 'shared', label: 'Đã chia sẻ' },   // Chỉ hiển thị tài liệu đã được chia sẻ
  { id: 'favorites', label: 'Yêu thích' }, // Chỉ hiển thị tài liệu đã được đánh dấu yêu thích
];

// Màn hình quản lý tài liệu
// Component chính để hiển thị và quản lý danh sách tài liệu
const DocumentScreen: React.FC = () => {
  // Sử dụng hook navigation để điều hướng giữa các màn hình
  const navigation = useNavigation<StackNavigationProp<DocumentStackParamList>>();
  
  // Sử dụng hook theme để áp dụng theme hiện tại (sáng/tối)
  const { theme, isDarkMode } = useTheme();
  
  // Lấy kích thước màn hình để tính toán layout động
  const { width } = useWindowDimensions();
  
  // Xác định màu sắc dựa trên mode sáng/tối
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  
  // Các state quản lý dữ liệu và UI
  const [documents, setDocuments] = useState<Document[]>([]); // Danh sách tất cả tài liệu gốc
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]); // Danh sách tài liệu đã được lọc
  const [selectedCategory, setSelectedCategory] = useState('all'); // Danh mục được chọn hiện tại
  const [searchQuery, setSearchQuery] = useState(''); // Từ khóa tìm kiếm
  const [refreshing, setRefreshing] = useState(false); // Trạng thái làm mới danh sách
  const [loading, setLoading] = useState(true); // Trạng thái đang tải dữ liệu
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list'); // Chế độ hiển thị: danh sách hoặc lưới
  const [favorites, setFavorites] = useState<string[]>([]); // Danh sách ID các tài liệu được yêu thích
  
  // Khởi tạo dữ liệu tài liệu khi component được mount
  useEffect(() => {
    // Giả lập việc tải dữ liệu từ API
    const fetchDocuments = async () => {
      setLoading(true); // Bắt đầu hiển thị trạng thái loading
      try {
        // Trong ứng dụng thực tế, đây sẽ là một cuộc gọi API
        // Giả lập độ trễ mạng 1 giây
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Tải dữ liệu mẫu từ mockData
        setDocuments(mockDocuments);
        setFilteredDocuments(mockDocuments);
      } catch (error) {
        console.error('Lỗi khi tải tài liệu:', error);
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };
    
    // Gọi hàm fetch dữ liệu
    fetchDocuments();
  }, []); // Chỉ chạy một lần khi component mount
  
  // Effect theo dõi và lọc tài liệu khi các điều kiện lọc thay đổi
  useEffect(() => {
    filterDocuments();
  }, [selectedCategory, searchQuery, documents, favorites]); // Chạy lại khi bất kỳ dependency nào thay đổi
  
  // Hàm lọc tài liệu dựa trên danh mục đã chọn và từ khóa tìm kiếm
  const filterDocuments = () => {
    let filtered = [...documents]; // Tạo bản sao của mảng gốc để không ảnh hưởng đến dữ liệu gốc
    
    // Lọc theo danh mục đã chọn
    if (selectedCategory === 'shared') {
      // Chỉ hiển thị tài liệu có thuộc tính shared = true
      filtered = filtered.filter(doc => doc.shared);
    } else if (selectedCategory === 'favorites') {
      // Chỉ hiển thị tài liệu có ID nằm trong danh sách yêu thích
      filtered = filtered.filter(doc => favorites.includes(doc.id));
    } else if (selectedCategory === 'recent') {
      // Sắp xếp theo thời gian cập nhật gần nhất và chỉ lấy 5 tài liệu đầu tiên
      filtered = [...filtered].sort((a, b) => {
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      }).slice(0, 5);
    }
    
    // Lọc thêm dựa trên từ khóa tìm kiếm (nếu có)
    if (searchQuery) {
      const query = searchQuery.toLowerCase(); // Chuyển đổi thành chữ thường để tìm kiếm không phân biệt hoa thường
      filtered = filtered.filter(
        doc =>
          doc.title.toLowerCase().includes(query) || // Tìm trong tiêu đề
          doc.description.toLowerCase().includes(query) || // Tìm trong mô tả
          doc.tags.some(tag => tag.toLowerCase().includes(query)) // Tìm trong các thẻ tag
      );
    }
    
    // Cập nhật state với danh sách đã lọc
    setFilteredDocuments(filtered);
  };
  
  // Xử lý làm mới danh sách tài liệu (khi người dùng kéo xuống để refresh)
  const handleRefresh = async () => {
    setRefreshing(true); // Hiển thị animation refresh
    
    // Giả lập việc tải dữ liệu mới từ server (độ trễ 1.5 giây)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Trong ứng dụng thực tế, đây sẽ là một cuộc gọi API để lấy dữ liệu mới nhất
    setDocuments(mockDocuments);
    
    setRefreshing(false); // Kết thúc trạng thái refresh
  };
  
  // Chuyển đến trang chi tiết khi người dùng nhấn vào một tài liệu
  const handleDocumentPress = (document: Document) => {
    // Điều hướng tới màn hình chi tiết và truyền ID tài liệu như tham số
    navigation.navigate(ROUTES.MAIN.DOCUMENT_DETAIL, { documentId: document.id });
  };
  
  // Thêm/xóa tài liệu khỏi danh sách yêu thích
  const toggleFavorite = (documentId: string) => {
    setFavorites(prev => {
      if (prev.includes(documentId)) {
        // Nếu ID đã tồn tại trong danh sách, loại bỏ nó (bỏ yêu thích)
        return prev.filter(id => id !== documentId);
      } else {
        // Nếu ID chưa có trong danh sách, thêm vào (đánh dấu yêu thích)
        return [...prev, documentId];
      }
    });
  };
  
  // Xử lý chia sẻ tài liệu
  const handleShareDocument = (document: Document) => {
    // Trong ứng dụng thực tế, đây sẽ mở hộp thoại chia sẻ với các tùy chọn
    Alert.alert(
      'Chia sẻ tài liệu', // Tiêu đề hộp thoại
      `Bạn muốn chia sẻ "${document.title}" với ai?`, // Nội dung hộp thoại
      [
        { text: 'Hủy', style: 'cancel' }, // Nút hủy
        { text: 'Chia sẻ', onPress: () => console.log('Đã chia sẻ tài liệu', document.id) }, // Nút xác nhận
      ]
    );
  };
  
  // Xử lý xóa tài liệu
  const handleDeleteDocument = (document: Document) => {
    // Hiển thị hộp thoại xác nhận trước khi xóa
    Alert.alert(
      'Xóa tài liệu', // Tiêu đề hộp thoại
      `Bạn có chắc chắn muốn xóa "${document.title}"?`, // Nội dung hộp thoại
      [
        { text: 'Hủy', style: 'cancel' }, // Nút hủy
        {
          text: 'Xóa', 
          style: 'destructive', // Style màu đỏ cảnh báo
          onPress: () => {
            // Cập nhật state, loại bỏ tài liệu khỏi danh sách
            setDocuments(prev => prev.filter(doc => doc.id !== document.id));
            // Trong ứng dụng thực tế, đây sẽ là một cuộc gọi API để xóa tài liệu
          },
        },
      ]
    );
  };
  
  // Xử lý tạo tài liệu mới
  const handleCreateDocument = () => {
    // Trong ứng dụng thực tế, đây sẽ mở form tạo tài liệu mới
    // Hiện tại chỉ hiển thị một hộp thoại với các tùy chọn
    Alert.alert(
      'Tạo tài liệu mới', // Tiêu đề hộp thoại
      'Chọn loại tài liệu bạn muốn tạo:', // Nội dung hộp thoại
      [
        { text: 'Hủy', style: 'cancel' }, // Nút hủy
        { text: 'Tài liệu văn bản', onPress: () => console.log('Tạo tài liệu văn bản') },
        { text: 'Bảng tính', onPress: () => console.log('Tạo bảng tính') },
        { text: 'Bản trình bày', onPress: () => console.log('Tạo bản trình bày') },
      ]
    );
  };
  
  // Lấy biểu tượng và màu sắc cho loại tài liệu
  const getDocumentIcon = (type: string) => {
    // Trả về tên biểu tượng và màu sắc dựa trên loại tài liệu
    switch (type) {
      case DOCUMENT_TYPES.PDF:
        return { name: 'file-pdf-box', color: '#F40F02' }; // Biểu tượng PDF màu đỏ
      case DOCUMENT_TYPES.DOCX:
      case DOCUMENT_TYPES.DOC:
        return { name: 'file-word', color: '#2B579A' }; // Biểu tượng Word màu xanh
      case DOCUMENT_TYPES.XLSX:
      case DOCUMENT_TYPES.XLS:
        return { name: 'file-excel', color: '#217346' }; // Biểu tượng Excel màu xanh lá
      case DOCUMENT_TYPES.PPTX:
      case DOCUMENT_TYPES.PPT:
        return { name: 'file-powerpoint', color: '#D24726' }; // Biểu tượng PowerPoint màu cam
      case DOCUMENT_TYPES.IMAGE:
        return { name: 'file-image', color: '#FFB600' }; // Biểu tượng hình ảnh màu vàng
      case DOCUMENT_TYPES.TEXT:
        return { name: 'file-document-outline', color: '#888888' }; // Biểu tượng văn bản màu xám
      default:
        return { name: 'file-outline', color: colors.text.secondary }; // Biểu tượng mặc định
    }
  };
  
  // Định dạng thời gian thành chuỗi ngày/tháng/năm
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };
  
  // Render item trong chế độ danh sách
  const renderListItem = ({ item }: { item: Document }) => {
    // Lấy thông tin biểu tượng cho loại tài liệu
    const documentIcon = getDocumentIcon(item.type);
    
    return (
      <TouchableOpacity
        style={[
          styles.documentListItem,
          { backgroundColor: theme.colors.surface }, // Màu nền theo theme
        ]}
        onPress={() => handleDocumentPress(item)} // Xử lý khi người dùng nhấn vào item
      >
        {/* Biểu tượng loại tài liệu */}
        <View style={styles.documentIconContainer}>
          <Icon name={documentIcon.name} size={32} color={documentIcon.color} />
        </View>
        
        {/* Thông tin tài liệu */}
        <View style={styles.documentInfo}>
          {/* Tiêu đề tài liệu */}
          <Text
            style={[styles.documentTitle, { color: theme.colors.text }]}
            numberOfLines={1} // Giới hạn 1 dòng, nếu dài hơn sẽ hiển thị "..."
          >
            {item.title}
          </Text>
          
          {/* Mô tả tài liệu */}
          <Text
            style={[styles.documentDescription, { color: colors.text.secondary }]}
            numberOfLines={1} // Giới hạn 1 dòng
          >
            {item.description}
          </Text>
          
          {/* Thông tin thêm: kích thước và ngày cập nhật */}
          <View style={styles.documentMeta}>
            <Text style={[styles.documentMetaText, { color: colors.text.secondary }]}>
              {item.size} • {formatDate(item.updatedAt)}
            </Text>
            
            {/* Hiển thị chỉ báo đã chia sẻ nếu tài liệu được chia sẻ */}
            {item.shared && (
              <View style={styles.sharedIndicator}>
                <Icon name="account-multiple" size={12} color={colors.text.secondary} />
                <Text style={[styles.sharedText, { color: colors.text.secondary }]}>
                  Đã chia sẻ
                </Text>
              </View>
            )}
          </View>
        </View>
        
        {/* Các nút thao tác: yêu thích, chia sẻ, xóa */}
        <View style={styles.documentActions}>
          {/* Nút yêu thích */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => toggleFavorite(item.id)}
          >
            <Icon
              name={favorites.includes(item.id) ? 'star' : 'star-outline'} // Biểu tượng thay đổi theo trạng thái
              size={20}
              color={favorites.includes(item.id) ? '#FFB600' : colors.text.secondary} // Màu vàng khi đã yêu thích
            />
          </TouchableOpacity>
          
          {/* Nút chia sẻ */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleShareDocument(item)}
          >
            <Icon
              name="share-variant"
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
          
          {/* Nút xóa */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDeleteDocument(item)}
          >
            <Icon
              name="delete-outline"
              size={20}
              color={colors.text.secondary}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  
  // Render item trong chế độ lưới
  const renderGridItem = ({ item }: { item: Document }) => {
    // Lấy thông tin biểu tượng cho loại tài liệu
    const documentIcon = getDocumentIcon(item.type);
    
    return (
      <TouchableOpacity
        style={[
          styles.documentGridItem,
          { 
            backgroundColor: theme.colors.surface, 
            width: (width - SPACING.xl * 2 - SPACING.md) / 2 // Tính toán chiều rộng động cho hiển thị dạng lưới 2 cột
          },
        ]}
        onPress={() => handleDocumentPress(item)} // Xử lý khi người dùng nhấn vào item
      >
        {/* Phần header hiển thị biểu tượng và nút yêu thích */}
        <View style={styles.gridItemHeader}>
          {/* Biểu tượng loại tài liệu (PDF, Word, Excel, v.v.) */}
          <Icon name={documentIcon.name} size={32} color={documentIcon.color} />
          
          {/* Nút yêu thích - toggle trạng thái yêu thích khi nhấn */}
          <TouchableOpacity
            style={styles.gridFavoriteButton}
            onPress={() => toggleFavorite(item.id)}
          >
            <Icon
              name={favorites.includes(item.id) ? 'star' : 'star-outline'} // Biểu tượng sao đặc hoặc viền tùy trạng thái
              size={18}
              color={favorites.includes(item.id) ? '#FFB600' : colors.text.secondary} // Màu vàng khi đã yêu thích
            />
          </TouchableOpacity>
        </View>
        
        {/* Tiêu đề tài liệu - giới hạn 2 dòng để giao diện lưới gọn gàng */}
        <Text
          style={[styles.gridItemTitle, { color: theme.colors.text }]}
          numberOfLines={2} // Giới hạn 2 dòng, cho phép nhiều hơn chế độ danh sách
        >
          {item.title}
        </Text>
        
        {/* Footer hiển thị kích thước và biểu tượng chia sẻ nếu có */}
        <View style={styles.gridItemFooter}>
          {/* Kích thước tài liệu (KB, MB) */}
          <Text style={[styles.gridItemSize, { color: colors.text.secondary }]}>
            {item.size}
          </Text>
          
          {/* Biểu tượng chia sẻ chỉ hiển thị nếu tài liệu đã được chia sẻ */}
          {item.shared && (
            <Icon
              name="account-multiple"
              size={14}
              color={colors.text.secondary}
            />
          )}
        </View>
      </TouchableOpacity>
    );
  };
  
  // Render thanh lọc danh mục
  const renderCategoryBar = () => (
    <View style={styles.categoryContainer}>
      {/* ScrollView ngang để hiển thị các nút lọc danh mục */}
      <ScrollView
        horizontal // Cho phép cuộn ngang
        showsHorizontalScrollIndicator={false} // Ẩn thanh cuộn
        contentContainerStyle={styles.categoryScrollContent}
      >
        {/* Lặp qua mảng danh mục để tạo các nút */}
        {documentCategories.map(category => (
          <TouchableOpacity
            key={category.id} // Key duy nhất cho mỗi item
            style={[
              styles.categoryButton,
              {
                // Thay đổi màu nền dựa vào trạng thái được chọn
                backgroundColor:
                  selectedCategory === category.id // Nếu là danh mục đang được chọn
                    ? theme.colors.primary // Sử dụng màu chính của theme
                    : isDarkMode
                    ? 'rgba(255, 255, 255, 0.1)' // Màu nền cho dark mode
                    : 'rgba(0, 0, 0, 0.05)', // Màu nền cho light mode
              },
            ]}
            onPress={() => setSelectedCategory(category.id)} // Cập nhật danh mục được chọn khi nhấn
          >
            <Text
              style={[
                styles.categoryButtonText,
                {
                  // Thay đổi màu chữ dựa vào trạng thái được chọn
                  color:
                    selectedCategory === category.id
                      ? '#FFFFFF' // Màu trắng cho nút đang được chọn
                      : theme.colors.text, // Màu văn bản theo theme cho nút khác
                },
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* Các nút chuyển đổi chế độ xem: danh sách/lưới */}
      <View style={styles.viewModeContainer}>
        {/* Nút chế độ xem danh sách */}
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            {
              // Thay đổi màu nền dựa vào chế độ xem hiện tại
              backgroundColor:
                viewMode === 'list' // Nếu đang ở chế độ danh sách
                  ? theme.colors.primary // Sử dụng màu chính của theme
                  : isDarkMode
                  ? 'rgba(255, 255, 255, 0.1)' // Màu nền cho dark mode
                  : 'rgba(0, 0, 0, 0.05)', // Màu nền cho light mode
            },
          ]}
          onPress={() => setViewMode('list')} // Chuyển sang chế độ danh sách khi nhấn
        >
          <Icon
            name="format-list-bulleted"
            size={18}
            color={viewMode === 'list' ? '#FFFFFF' : theme.colors.text} // Thay đổi màu icon theo trạng thái
          />
        </TouchableOpacity>
        
        {/* Nút chế độ xem lưới */}
        <TouchableOpacity
          style={[
            styles.viewModeButton,
            {
              // Thay đổi màu nền dựa vào chế độ xem hiện tại
              backgroundColor:
                viewMode === 'grid' // Nếu đang ở chế độ lưới
                  ? theme.colors.primary // Sử dụng màu chính của theme
                  : isDarkMode
                  ? 'rgba(255, 255, 255, 0.1)' // Màu nền cho dark mode
                  : 'rgba(0, 0, 0, 0.05)', // Màu nền cho light mode
            },
          ]}
          onPress={() => setViewMode('grid')} // Chuyển sang chế độ lưới khi nhấn
        >
          <Icon
            name="grid"
            size={18}
            color={viewMode === 'grid' ? '#FFFFFF' : theme.colors.text} // Thay đổi màu icon theo trạng thái
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  
  // Render trạng thái rỗng (khi không có dữ liệu hoặc đang tải)
  const renderEmptyState = () => {
    // Nếu đang tải dữ liệu, hiển thị animation loading
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
            Đang tải tài liệu...
          </Text>
        </View>
      );
    }
    
    // Nếu không có dữ liệu, hiển thị component trạng thái rỗng với nội dung phù hợp
    return (
      <EmptyStateComponent
        title="Không có tài liệu nào" // Tiêu đề chính
        message={
          // Thông điệp khác nhau tùy theo trạng thái lọc và tìm kiếm
          selectedCategory !== 'all'
            ? `Bạn không có tài liệu nào trong danh mục ${
                documentCategories.find(c => c.id === selectedCategory)?.label || ''
              }` // Khi lọc theo danh mục mà không có kết quả
            : searchQuery
            ? `Không tìm thấy tài liệu nào khớp với "${searchQuery}"` // Khi tìm kiếm không có kết quả
            : 'Hãy tạo hoặc tải lên tài liệu mới' // Mặc định khi không có tài liệu nào
        }
        icon={
          // Hiển thị biểu tượng tài liệu
          <Icon
            name="file-document-outline"
            size={50}
            color={theme.colors.primary}
          />
        }
        buttonTitle="Tạo tài liệu mới" // Tiêu đề nút hành động
        onButtonPress={handleCreateDocument} // Xử lý khi nhấn nút
      />
    );
  };
  
  // Render nút thêm tài liệu (Floating Action Button - FAB)
  const renderFAB = () => (
    <TouchableOpacity
      style={[styles.fab, { backgroundColor: theme.colors.primary }]} // Sử dụng màu chính của theme
      onPress={handleCreateDocument} // Xử lý khi nhấn nút
    >
      <Icon name="plus" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
  
  // Render giao diện chính của màn hình
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Thanh tìm kiếm - Search bar component for document filtering */}
      <View style={styles.searchBarContainer}>
        <AdvancedSearchBar
          placeholder="Tìm kiếm tài liệu..." // Placeholder text for search input
          value={searchQuery} // Current search query state value
          onChangeText={setSearchQuery} // Updates search query when user types
          showFilterButton={true} // Enables advanced filtering options button
          filterOptions={[
            // Advanced filter options configuration
            { id: 'type', label: 'Loại tài liệu', value: '', type: 'select', options: [
              { label: 'PDF', value: 'pdf' },
              { label: 'Word', value: 'word' },
              { label: 'Excel', value: 'excel' },
              { label: 'PowerPoint', value: 'powerpoint' },
            ]},
            { id: 'date', label: 'Ngày tạo', value: '', type: 'date' },
          ]}
        />
      </View>
      
      {/* Thanh lọc danh mục - Category filter bar for quick document type filtering */}
      {renderCategoryBar()}
      
      {/* Danh sách tài liệu - Main document list with adaptive rendering based on view mode */}
      <FlatList
        data={filteredDocuments} // Documents array after applying search and category filters
        renderItem={viewMode === 'list' ? renderListItem : renderGridItem} // Conditional rendering based on selected view mode
        keyExtractor={item => item.id} // Unique key for optimized list rendering
        contentContainerStyle={[
          styles.listContent,
          viewMode === 'grid' && styles.gridContent, // Apply grid-specific styling when in grid mode
        ]}
        numColumns={viewMode === 'grid' ? 2 : 1} // Adaptive column count based on view mode
        key={viewMode} // Forces FlatList re-creation when view mode changes for proper re-rendering
        showsVerticalScrollIndicator={false} // Hides default scroll indicator for cleaner UI
        refreshControl={
          // Pull-to-refresh functionality for updating document list
          <RefreshControl
            refreshing={refreshing} // Controls refresh spinner visibility
            onRefresh={handleRefresh} // Triggers data reload when pulled
            colors={[theme.colors.primary]} // Theme-consistent loading indicator color
            tintColor={theme.colors.primary} // Match tint color with theme
          />
        }
        ListEmptyComponent={renderEmptyState} // Display user-friendly message when no documents match filters
      />
      
      {/* Nút thêm tài liệu - Floating action button for document creation */}
      {renderFAB()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  categoryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  categoryScrollContent: {
    paddingRight: SPACING.md,
    flexGrow: 1,
  },
  categoryButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 20,
    marginRight: SPACING.sm,
  },
  categoryButtonText: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
  },
  viewModeContainer: {
    flexDirection: 'row',
  },
  viewModeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
  },
  listContent: {
    padding: SPACING.xl,
    paddingTop: SPACING.sm,
    flexGrow: 1,
  },
  gridContent: {
    flexDirection: 'column',
  },
  documentListItem: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    ...SHADOW.small,
  },
  documentGridItem: {
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    marginHorizontal: SPACING.xs,
    ...SHADOW.small,
  },
  documentIconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  documentInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  documentTitle: {
    fontSize: FONT_SIZE.button,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: 2,
  },
  documentDescription: {
    fontSize: FONT_SIZE.caption,
    marginBottom: 4,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentMetaText: {
    fontSize: FONT_SIZE.caption,
  },
  sharedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  sharedText: {
    fontSize: FONT_SIZE.caption,
    marginLeft: 2,
  },
  documentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.sm,
  },
  gridItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  gridFavoriteButton: {
    padding: 2,
  },
  gridItemTitle: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: SPACING.sm,
    height: 40,
  },
  gridItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridItemSize: {
    fontSize: FONT_SIZE.caption,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
  },
  emptyText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZE.body,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.medium,
  },
});

export default DocumentScreen; 