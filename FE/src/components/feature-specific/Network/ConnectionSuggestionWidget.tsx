import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '../../../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AnimatedButton from '../../common/AnimatedButton'; // Import AnimatedButton
import { getInitials } from '../../../utils/helpers'; // Import getInitials

// Interface định nghĩa dữ liệu cho gợi ý kết nối
export interface ConnectionSuggestion {
  id: string;
  name: string;
  avatar: string;
  title: string;
  mutualConnections: number;
  context: string;
}

interface ConnectionSuggestionWidgetProps {
  title: string;
  data: ConnectionSuggestion[];
  onConnect: (user: ConnectionSuggestion) => void;
  onViewAll?: () => void;
}

/**
 * Widget hiển thị danh sách gợi ý kết nối người dùng
 */
const ConnectionSuggestionWidget: React.FC<ConnectionSuggestionWidgetProps> = ({
  title,
  data,
  onConnect,
  onViewAll,
}) => {
  const { theme, isDarkMode } = useTheme();
  const styles = getLocalStyles(theme, isDarkMode); // Define styles in the main component scope
  
  // Render tiêu đề của widget
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.titleContainer}>
        <Icon name="account-group" size={22} color={theme.colors.primary} />
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </Text>
      </View>
      
      {onViewAll && (
        <Text
          style={[styles.viewAllText, { color: theme.colors.primary }]}
          onPress={onViewAll}
        >
          Xem tất cả
        </Text>
      )}
    </View>
  );
  
  // Render mỗi gợi ý kết nối
  const renderItem = ({ item }: { item: ConnectionSuggestion }) => {
    return (
      <View style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          {item.avatar ? (
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.initialsAvatar, { backgroundColor: theme.colors.primary }]}>
              <Text style={styles.initialsText}>{getInitials(item.name)}</Text>
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
          </View>
        </View>
        <Text style={styles.contextText} numberOfLines={2}>
          {`${item.mutualConnections} kết nối chung · ${item.context}`}
        </Text>
        <AnimatedButton
          title="Kết nối"
          onPress={() => onConnect(item)}
          variant="primary"
          style={styles.connectButton}
        />
      </View>
    );
  };
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          backgroundColor: theme.colors.surface,
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      ]}
    >
      {renderHeader()}
      
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const getLocalStyles = (theme: any, isDarkMode: boolean) => StyleSheet.create({ // Renamed original styles to getLocalStyles
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: SPACING.md,
    paddingVertical: SPACING.md, // Adjusted padding
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md, // Added horizontal padding
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: FONT_WEIGHT.bold,
    marginLeft: SPACING.sm,
    color: theme.colors.text,
  },
  viewAllText: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
    color: theme.colors.primary,
  },
  listContent: {
    paddingLeft: SPACING.md, // Start list padding from left
    paddingRight: SPACING.xs, // Reduced right padding
  },
  // Styles for the manually created card
  cardContainer: {
    width: 160,
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    padding: SPACING.sm,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  },
  cardHeader: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: SPACING.xs,
  },
  initialsAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsText: {
      color: theme.colors.buttonText || '#FFFFFF',
      fontSize: FONT_SIZE.h3,
      fontWeight: FONT_WEIGHT.bold,
  },
  userInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.semiBold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  titleText: {
    fontSize: FONT_SIZE.small,
    color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)',
    textAlign: 'center',
  },
  contextText: {
    fontSize: FONT_SIZE.small,
    color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
    marginBottom: SPACING.sm,
    height: 30, // Fixed height for 2 lines
  },
  connectButton: {
    marginTop: 'auto', // Push button to bottom
  },
});

export default ConnectionSuggestionWidget; 