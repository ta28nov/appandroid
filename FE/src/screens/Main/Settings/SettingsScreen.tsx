import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ROUTES } from '../../../utils/constants';
import { SettingsStackParamList } from '../../../navigation/types'; // Adjust path as needed
import { ThemeContext } from '../../../contexts/ThemeContext'; // Adjust path as needed
import { AuthContext } from '../../../contexts/AuthContext'; // Adjust path as needed
// import Button from '../../../components/common/Button'; // Temporarily comment out

type SettingsScreenNavigationProp = StackNavigationProp<
  SettingsStackParamList,
  typeof ROUTES.MAIN.SETTINGS
>;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<SettingsScreenNavigationProp>();
  const themeContext = useContext(ThemeContext);
  const authContext = useContext(AuthContext);

  if (!themeContext || !authContext) {
    return <Text>Lỗi: Không thể tải context.</Text>;
  }

  const { theme, isDarkMode, toggleTheme } = themeContext;
  const { logout } = authContext;
  const styles = getStyles(theme);

  const menuItems = [
    {
      title: 'Hồ sơ cá nhân',
      icon: 'account-circle-outline',
      route: ROUTES.MAIN.PROFILE,
    },
    {
      title: 'Cài đặt Tích hợp',
      icon: 'link-variant',
      route: ROUTES.MAIN.INTEGRATIONS,
    },
    {
      title: 'Đồng bộ đang chờ',
      icon: 'sync-alert',
      route: ROUTES.MAIN.PENDING_SYNC,
    },
    // Add more settings items here like Appearance, Notifications, etc.
  ];

  const handleLogout = () => {
    // Add confirmation dialog if needed
    logout();
  };

  return (
    <ScrollView style={styles.container}>
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.menuItem}
          onPress={() => navigation.navigate(item.route)}
        >
          <Icon name={item.icon} size={24} color={theme.colors.primary} style={styles.icon} />
          <Text style={styles.menuText}>{item.title}</Text>
          <Icon name="chevron-right" size={24} color={theme.colors.secondary} />
        </TouchableOpacity>
      ))}

      {/* Theme Toggle */}
      <View style={[styles.menuItem, styles.switchItem]}>
         <Icon name={isDarkMode ? 'weather-night' : 'weather-sunny'} size={24} color={theme.colors.primary} style={styles.icon} />
        <Text style={styles.menuText}>Chế độ tối</Text>
        <Switch
          trackColor={{ false: theme.colors.disabled, true: theme.colors.primary }}
          thumbColor={theme.colors.background}
          ios_backgroundColor={theme.colors.disabled}
          onValueChange={toggleTheme}
          value={isDarkMode}
        />
      </View>

      {/* Logout Button - Temporarily replace with basic TouchableOpacity */}
      <View style={styles.logoutContainer}>
          <TouchableOpacity onPress={handleLogout} style={styles.menuItem}> 
            <Icon name="logout" size={24} color={theme.colors.error} style={styles.icon} />
            <Text style={{color: theme.colors.error, fontSize: 16}}>Đăng xuất</Text>
          </TouchableOpacity>
          {/* <Button
            title="Đăng xuất"
            onPress={handleLogout}
            variant="danger" 
            icon="logout"
          /> */}
      </View>

    </ScrollView>
  );
};

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
  },
  switchItem: {
      justifyContent: 'space-between',
  },
  icon: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
  },
  logoutContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
});

export default SettingsScreen; 