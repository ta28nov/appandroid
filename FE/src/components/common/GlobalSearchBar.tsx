import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../hooks/useTheme';
import { SPACING } from '../../styles/globalStyles';
import { ROUTES } from '../../utils/constants';
import { NavigationProp } from '@react-navigation/native';
import { AppStackParamList } from '../../navigation/types';

interface GlobalSearchBarProps {
  placeholder?: string;
  style?: any;
  autoFocus?: boolean;
  onSearch?: (query: string) => void;
}

// Define the correct navigation prop type
type GlobalSearchBarNavigationProp = NavigationProp<AppStackParamList>;

/**
 * Component thanh tìm kiếm toàn cục ở header
 */
const GlobalSearchBar: React.FC<GlobalSearchBarProps> = ({
  placeholder = 'Tìm kiếm...',
  style,
  autoFocus = false,
  onSearch,
}) => {
  const navigation = useNavigation<GlobalSearchBarNavigationProp>();
  const { theme, isDarkMode } = useTheme();
  const [query, setQuery] = useState('');
  
  // Xử lý tìm kiếm
  const handleSearch = () => {
    if (query.trim().length > 0) {
      // Use the constant for navigation
      navigation.navigate(ROUTES.MAIN.GLOBAL_SEARCH_RESULTS, { query: query.trim() });
      onSearch?.(query.trim()); // Notify parent if needed
    } else {
      // Maybe show an alert or do nothing if query is empty
      Alert.alert('Thông báo', 'Vui lòng nhập từ khóa tìm kiếm.');
    }
  };
  
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDarkMode
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.05)',
        },
        style,
      ]}
    >
      <Icon
        name="magnify"
        size={20}
        color={isDarkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.6)'}
        style={styles.searchIcon}
      />
      
      <TextInput
        style={[
          styles.input,
          { color: theme.colors.text },
        ]}
        placeholder={placeholder}
        placeholderTextColor={
          isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'
        }
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        onSubmitEditing={handleSearch}
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
      />
      
      {query.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => setQuery('')}
        >
          <Icon
            name="close-circle"
            size={16}
            color={isDarkMode ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.4)'}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: SPACING.sm,
    height: 40,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  searchIcon: {
    marginRight: SPACING.xs,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
    padding: 0,
  },
  clearButton: {
    padding: SPACING.xs,
  },
});

export default GlobalSearchBar; 