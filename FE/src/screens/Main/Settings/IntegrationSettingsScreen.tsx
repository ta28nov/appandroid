import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../hooks/useTheme';
import { SPACING } from '../../../styles/globalStyles';
import IntegrationCard from '../../../components/feature-specific/Settings/IntegrationCard';
import Button from '../../../components/common/Button';

const IntegrationSettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  
  // Trạng thái kết nối cho các dịch vụ
  const [connections, setConnections] = useState({
    googleCalendar: false,
    outlookCalendar: false,
    googleDrive: false,
    dropbox: false,
    oneDrive: false,
  });

  // Xử lý kết nối/ngắt kết nối dịch vụ
  const toggleConnection = (service: keyof typeof connections) => {
    if (connections[service]) {
      // Xác nhận ngắt kết nối
      Alert.alert(
        'Ngắt kết nối',
        `Bạn có chắc chắn muốn ngắt kết nối với ${getServiceName(service)}?`,
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Ngắt kết nối',
            style: 'destructive',
            onPress: () => {
              setConnections(prev => ({
                ...prev,
                [service]: false,
              }));
            },
          },
        ]
      );
    } else {
      // Giả lập quá trình kết nối
      // Trong ứng dụng thực, đây sẽ mở OAuth flow
      setTimeout(() => {
        setConnections(prev => ({
          ...prev,
          [service]: true,
        }));
        
        // Hiển thị thông báo thành công
        Alert.alert(
          'Kết nối thành công',
          `Đã kết nối thành công với ${getServiceName(service)}.`,
          [{ text: 'OK' }]
        );
      }, 1000);
    }
  };
  
  // Lấy tên hiển thị cho dịch vụ
  const getServiceName = (service: keyof typeof connections): string => {
    switch (service) {
      case 'googleCalendar':
        return 'Google Calendar';
      case 'outlookCalendar':
        return 'Outlook Calendar';
      case 'googleDrive':
        return 'Google Drive';
      case 'dropbox':
        return 'Dropbox';
      case 'oneDrive':
        return 'OneDrive';
      default:
        return service;
    }
  };
  
  // Lấy icon cho dịch vụ
  const getServiceIcon = (service: keyof typeof connections): string => {
    switch (service) {
      case 'googleCalendar':
        return 'google-classroom';
      case 'outlookCalendar':
        return 'microsoft-outlook';
      case 'googleDrive':
        return 'google-drive';
      case 'dropbox':
        return 'dropbox';
      case 'oneDrive':
        return 'microsoft-onedrive';
      default:
        return 'application';
    }
  };
  
  // Lấy màu sắc cho dịch vụ
  const getServiceColor = (service: keyof typeof connections): string => {
    switch (service) {
      case 'googleCalendar':
        return '#4285F4';
      case 'outlookCalendar':
        return '#0078D4';
      case 'googleDrive':
        return '#0F9D58';
      case 'dropbox':
        return '#0061FF';
      case 'oneDrive':
        return '#28A8EA';
      default:
        return theme.colors.primary;
    }
  };
  
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Tiêu đề nhóm: Lịch */}
      <View style={styles.sectionHeader}>
        <Icon name="calendar" size={22} color={theme.colors.primary} />
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionLine} />
          <Button 
            title="Lịch" 
            variant="text" 
            onPress={() => {}} 
            disabled={true}
            style={styles.sectionTitle}
          />
          <View style={styles.sectionLine} />
        </View>
      </View>
      
      {/* Google Calendar */}
      <IntegrationCard
        title="Google Calendar"
        description="Đồng bộ các sự kiện và nhiệm vụ với Google Calendar"
        icon="google-classroom"
        iconColor="#4285F4"
        connected={connections.googleCalendar}
        onPress={() => toggleConnection('googleCalendar')}
      />
      
      {/* Outlook Calendar */}
      <IntegrationCard
        title="Outlook Calendar"
        description="Đồng bộ các sự kiện và nhiệm vụ với Outlook Calendar"
        icon="microsoft-outlook"
        iconColor="#0078D4"
        connected={connections.outlookCalendar}
        onPress={() => toggleConnection('outlookCalendar')}
      />
      
      {/* Tiêu đề nhóm: Lưu trữ đám mây */}
      <View style={[styles.sectionHeader, { marginTop: SPACING.xl }]}>
        <Icon name="cloud" size={22} color={theme.colors.primary} />
        <View style={styles.sectionTitleContainer}>
          <View style={styles.sectionLine} />
          <Button 
            title="Lưu trữ đám mây" 
            variant="text" 
            onPress={() => {}} 
            disabled={true}
            style={styles.sectionTitle}
          />
          <View style={styles.sectionLine} />
        </View>
      </View>
      
      {/* Google Drive */}
      <IntegrationCard
        title="Google Drive"
        description="Truy cập và chia sẻ tài liệu từ Google Drive"
        icon="google-drive"
        iconColor="#0F9D58"
        connected={connections.googleDrive}
        onPress={() => toggleConnection('googleDrive')}
      />
      
      {/* Dropbox */}
      <IntegrationCard
        title="Dropbox"
        description="Truy cập và chia sẻ tài liệu từ Dropbox"
        icon="dropbox"
        iconColor="#0061FF"
        connected={connections.dropbox}
        onPress={() => toggleConnection('dropbox')}
      />
      
      {/* OneDrive */}
      <IntegrationCard
        title="OneDrive"
        description="Truy cập và chia sẻ tài liệu từ OneDrive"
        icon="microsoft-onedrive"
        iconColor="#28A8EA"
        connected={connections.oneDrive}
        onPress={() => toggleConnection('oneDrive')}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SPACING.sm,
  },
  sectionTitle: {
    marginHorizontal: SPACING.sm,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default IntegrationSettingsScreen; 