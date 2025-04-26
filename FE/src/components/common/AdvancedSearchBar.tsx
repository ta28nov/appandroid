import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Platform,
  Keyboard,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../hooks/useTheme';
import { COLORS } from '../../styles/theme';
import { SPACING, FONT_SIZE } from '../../styles/globalStyles';
import CustomModal from './CustomModal';

export interface FilterOption {
  id: string;
  label: string;
  value: string | number | boolean;
  type: 'text' | 'date' | 'select' | 'boolean';
  options?: { label: string; value: string | number }[];
}

export interface AdvancedSearchBarProps {
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: (searchText: string, filters: Record<string, any>) => void;
  onFilterChange?: (filters: Record<string, any>) => void;
  filterOptions?: FilterOption[];
  style?: ViewStyle;
  inputStyle?: TextStyle;
  autoFocus?: boolean;
  showFilterButton?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const AdvancedSearchBar: React.FC<AdvancedSearchBarProps> = ({
  placeholder = 'Search...',
  value,
  onChangeText,
  onSearch,
  onFilterChange,
  filterOptions = [],
  style,
  inputStyle,
  autoFocus = false,
  showFilterButton = true,
}) => {
  const { theme, isDarkMode } = useTheme();
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<Record<string, any>>({});
  const inputRef = useRef<TextInput>(null);
  
  // Animation values
  const clearButtonOpacity = useRef(new Animated.Value(value ? 1 : 0)).current;
  const filtersAppliedScale = useRef(new Animated.Value(Object.keys(appliedFilters).length > 0 ? 1 : 0)).current;
  
  // Handle text change
  const handleChangeText = (text: string) => {
    onChangeText(text);
    Animated.timing(clearButtonOpacity, {
      toValue: text ? 1 : 0,
      duration: 150,
      useNativeDriver: true
    }).start();
  };
  
  // Handle clear button press
  const handleClear = () => {
    onChangeText('');
    Animated.timing(clearButtonOpacity, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true
    }).start();
    inputRef.current?.focus();
  };
  
  // Handle search submit
  const handleSearchSubmit = () => {
    Keyboard.dismiss();
    if (onSearch) {
      onSearch(value, appliedFilters);
    }
  };
  
  // Handle filter button press
  const handleFiltersPress = () => {
    setIsFiltersVisible(true);
  };
  
  // Handle filter apply
  const handleApplyFilters = (filters: Record<string, any>) => {
    setAppliedFilters(filters);
    setIsFiltersVisible(false);
    
    Animated.timing(filtersAppliedScale, {
      toValue: Object.keys(filters).length > 0 ? 1 : 0,
      duration: 200,
      useNativeDriver: true
    }).start();
    
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };
  
  // Clear button animation style
  const clearButtonAnimatedStyle = {
    opacity: clearButtonOpacity,
    transform: [
      {
        scale: clearButtonOpacity.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
  };
  
  // Filter indicator animation
  const filterIndicatorStyle = {
    opacity: filtersAppliedScale,
    transform: [
      {
        scale: filtersAppliedScale,
      },
    ],
  };
  
  return (
    <View style={[styles.container, style]}>
      <View
        style={[
          styles.searchBar,
          { backgroundColor: isDarkMode ? colors.surface : '#F0F0F5' },
        ]}
      >
        <Icon
          name="magnify"
          size={22}
          color={isDarkMode ? colors.text.secondary : '#8E8E93'}
          style={styles.searchIcon}
        />
        
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            { color: colors.text.primary },
            inputStyle,
          ]}
          placeholder={placeholder}
          placeholderTextColor={isDarkMode ? '#AEAEB2' : '#8E8E93'}
          value={value}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={autoFocus}
        />
        
        {value !== '' && (
          <AnimatedTouchable
            onPress={handleClear}
            style={[styles.clearButton, clearButtonAnimatedStyle]}
          >
            <Icon
              name="close-circle"
              size={18}
              color={isDarkMode ? '#AEAEB2' : '#8E8E93'}
            />
          </AnimatedTouchable>
        )}
        
        {showFilterButton && filterOptions.length > 0 && (
          <TouchableOpacity
            onPress={handleFiltersPress}
            style={styles.filterButton}
          >
            <Icon
              name="filter-variant"
              size={22}
              color={
                Object.keys(appliedFilters).length > 0
                  ? colors.primary
                  : isDarkMode
                  ? colors.text.secondary
                  : '#8E8E93'
              }
            />
            
            {Object.keys(appliedFilters).length > 0 && (
              <Animated.View
                style={[
                  styles.filterIndicator,
                  { backgroundColor: colors.primary },
                  filterIndicatorStyle,
                ]}
              />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {/* Custom Filter Modal - Show when filter button is pressed */}
      <CustomModal
        visible={isFiltersVisible}
        onClose={() => setIsFiltersVisible(false)}
        animation="slide"
        type="bottom"
      >
        {/* 
          In a real implementation, this section would contain filter controls
          to handle the filter options provided, with components like date pickers,
          dropdowns, checkboxes, etc. based on the filter types.
          
          For now we'll just close the modal when "apply" is simulated.
        */}
        <View style={styles.filterModalContent}>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => handleApplyFilters({ status: 'active' })}
          >
            <Icon name="check" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingHorizontal: SPACING.sm,
    height: 44,
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
    fontSize: FONT_SIZE.body,
    paddingVertical: SPACING.sm,
    paddingHorizontal: 0,
  },
  clearButton: {
    padding: SPACING.xs,
  },
  filterButton: {
    marginLeft: SPACING.xs,
    padding: SPACING.xs,
    position: 'relative',
  },
  filterIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  filterModalContent: {
    padding: SPACING.md,
    // More filter UI would go here
  },
  applyButton: {
    backgroundColor: COLORS.light.primary,
    padding: SPACING.sm,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AdvancedSearchBar; 