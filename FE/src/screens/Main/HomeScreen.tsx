import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from '../../navigation/types';
import { ROUTES } from '../../utils/constants';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';
import { COLORS } from '../../styles/theme';
import { FONT_SIZE, FONT_WEIGHT, SPACING, SHADOW } from '../../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProgressBar from '../../components/common/ProgressBar';
import UserProfileCard from '../../components/common/UserProfileCard';
import { FAB } from 'react-native-paper';
import AIChatModal from '../../components/feature-specific/AI/AIChatModal';

// Uncomment Victory imports
import {
  VictoryPie,
  VictoryLine,
  VictoryChart,
  VictoryTheme,
  VictoryAxis,
  VictoryBar,
  VictoryLabel
} from 'victory-native';

// Mock Data - Sẽ được thay thế bằng dữ liệu từ API thực tế
// Import mock data - using require to avoid TypeScript errors temporarily
const { 
  mockTasks, 
  mockDocuments, 
  mockWeather, 
  mockTeamActivity, 
  mockNotifications, 
  mockStatistics
} = require('../../utils/mockData');

// Types cho các dữ liệu task và document
interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  priority: string;
  completed: boolean;
  dueDate: string;
  overdue: boolean;
}

interface Document {
  id: string;
  title: string;
  description: string;
  type: string;
  size: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  shared: boolean;
  tags: string[];
}

// Use BottomTabNavigationProp with MainTabParamList
type HomeScreenNavigationProp = BottomTabNavigationProp<
  MainTabParamList,
  typeof ROUTES.MAIN.HOME
>;

// Interface cho ProgressBar
interface ProgressBarProps {
  progress: number;
  height?: number;
  backgroundColor?: string;
  progressColor?: string;
  animated?: boolean;
}

// Add a type for Notification similar to NotificationScreen
interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string; // Add createdAt
}

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { theme, isDarkMode } = useTheme();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const colors = isDarkMode ? COLORS.dark : COLORS.light;
  
  // State
  const [refreshing, setRefreshing] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [statistics, setStatistics] = useState(mockStatistics);
  const [tasks, setTasks] = useState<Task[]>(mockTasks as Task[]);
  const [documents, setDocuments] = useState<Document[]>(mockDocuments as Document[]);
  const [teamActivity, setTeamActivity] = useState(mockTeamActivity);
  const [notifications, setNotifications] = useState<Notification[]>([]); // Initialize as empty array
  const [weather, setWeather] = useState(mockWeather);
  const [isChatModalVisible, setIsChatModalVisible] = useState(false);
  
  // Gán lời chào dựa trên thời gian trong ngày
  useEffect(() => {
    // Adapt mockNotifications
    const adaptedNotifications = mockNotifications.map((notif: any) => ({
      ...notif,
      createdAt: notif.time, // Rename 'time' to 'createdAt'
    }));
    setNotifications(adaptedNotifications);

    const hours = new Date().getHours();
    let newGreeting = '';
    
    if (hours < 12) {
      newGreeting = 'Chào buổi sáng';
    } else if (hours < 18) {
      newGreeting = 'Chào buổi chiều';
    } else {
      newGreeting = 'Chào buổi tối';
    }
    
    setGreeting(newGreeting);
  }, []);
  
  // Xử lý refresh trang
  const handleRefresh = async () => {
    setRefreshing(true);
    
    // Giả lập việc tải dữ liệu từ API
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };
  
  // Điều hướng đến màn hình thông báo
  const handleNotificationPress = () => {
    navigation.navigate(ROUTES.MAIN.NOTIFICATIONS);
  };
  
  // Điều hướng đến màn hình hồ sơ người dùng
  const handleProfilePress = () => {
    // Navigate to the navigator containing the screen, and specify the screen
    navigation.navigate(ROUTES.MAIN.SETTINGS_NAVIGATOR, { screen: ROUTES.MAIN.PROFILE });
  };
  
  // Điều hướng đến màn hình cài đặt
  const handleSettingsPress = () => {
    // Navigate to the navigator containing the screen, and specify the screen
    navigation.navigate(ROUTES.MAIN.SETTINGS_NAVIGATOR, { screen: ROUTES.MAIN.SETTINGS });
  };
  
  // Điều hướng đến màn hình công việc
  const handleTasksPress = () => {
    navigation.navigate(ROUTES.MAIN.TASKS);
  };
  
  // Điều hướng đến màn hình tài liệu
  const handleDocumentsPress = () => {
    navigation.navigate(ROUTES.MAIN.DOCUMENTS);
  };
  
  // Điều hướng đến màn hình diễn đàn
  const handleForumPress = () => {
    navigation.navigate(ROUTES.MAIN.FORUM);
  };
  
  // Điều hướng đến màn hình trò chuyện
  const handleChatPress = () => {
    navigation.navigate(ROUTES.MAIN.CHAT_LIST);
  };
  
  // Dữ liệu cho biểu đồ đường
  const lineChartData = [
    { x: "T2", y: statistics.weeklyActivity[0] },
    { x: "T3", y: statistics.weeklyActivity[1] },
    { x: "T4", y: statistics.weeklyActivity[2] },
    { x: "T5", y: statistics.weeklyActivity[3] },
    { x: "T6", y: statistics.weeklyActivity[4] },
    { x: "T7", y: statistics.weeklyActivity[5] },
    { x: "CN", y: statistics.weeklyActivity[6] }
  ];
  
  // Dữ liệu cho biểu đồ tròn
  const pieChartData = [
    { x: "Đã hoàn thành", y: statistics.taskCompletion.completed, color: colors.success },
    { x: "Đang thực hiện", y: statistics.taskCompletion.inProgress, color: colors.secondary },
    { x: "Quá hạn", y: statistics.taskCompletion.overdue, color: colors.error }
  ];
  
  // Dữ liệu cho biểu đồ cột
  const barChartData = [
    { x: "Tài liệu", y: statistics.documentCount },
    { x: "Công việc", y: statistics.taskCount },
    { x: "Thảo luận", y: statistics.forumPosts },
    { x: "Tin nhắn", y: statistics.messageCount }
  ];
  
  const openChatModal = () => setIsChatModalVisible(true);
  const closeChatModal = () => setIsChatModalVisible(false);

  return (
    <View style={styles.containerWrapper}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContentContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        {/* Header với lời chào và nút thông báo */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.colors.text }]}>
              {greeting}
            </Text>
            <Text style={[styles.username, { color: theme.colors.text }]}>
              {user?.name || 'Người dùng'}
            </Text>
          </View>
          
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={[
                styles.iconButton,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={handleNotificationPress}
            >
              <Icon
                name="bell-outline"
                size={22}
                color={theme.colors.text}
              />
              {notifications.length > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationCount}>
                    {notifications.length > 99 ? '99+' : notifications.length}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.iconButton,
                { backgroundColor: theme.colors.surface },
              ]}
              onPress={handleSettingsPress}
            >
              <Icon
                name="cog-outline"
                size={22}
                color={theme.colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Thông tin thời tiết */}
        <View style={[styles.weatherCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.weatherHeader}>
            <Icon
              name={
                weather.condition === 'Sunny' ? 'weather-sunny' :
                weather.condition === 'Cloudy' ? 'weather-cloudy' :
                weather.condition === 'Rainy' ? 'weather-rainy' :
                'weather-partly-cloudy'
              }
              size={40}
              color={theme.colors.primary}
            />
            <View style={styles.weatherInfo}>
              <Text style={[styles.weatherTemp, { color: theme.colors.text }]}>
                {weather.temperature}°C
              </Text>
              <Text style={{ color: isDarkMode ? '#AEAEB2' : '#8E8E93' }}>
                {weather.city}
              </Text>
            </View>
          </View>
          <Text style={{ color: isDarkMode ? '#AEAEB2' : '#8E8E93', marginTop: SPACING.xs }}>
            {weather.description}
          </Text>
        </View>
        
        {/* Thẻ thống kê tóm tắt */}
        <View style={styles.statsRow}>
          {/* Công việc Card */}
          <TouchableOpacity onPress={handleTasksPress} style={styles.touchableCardFlex}>
            <View style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.statsHeader}>
                <Text style={[styles.statsTitle, { color: theme.colors.text }]}>
                  Công việc
                </Text>
                <Icon name="checkbox-marked-outline" size={20} color={theme.colors.primary} />
              </View>
              <Text style={[styles.statsValue, { color: theme.colors.text }]}>
                {statistics.taskCount}
              </Text>
              <ProgressBar 
                progress={(statistics.taskCompletion.completed / 
                  (statistics.taskCompletion.completed + 
                   statistics.taskCompletion.inProgress + 
                   statistics.taskCompletion.overdue)) * 100}
                height={8}
              />
              <Text style={{ color: isDarkMode ? '#AEAEB2' : '#8E8E93', fontSize: FONT_SIZE.small }}>
                {Math.round(statistics.taskCompletion.completed / 
                  (statistics.taskCompletion.completed + 
                   statistics.taskCompletion.inProgress + 
                   statistics.taskCompletion.overdue) * 100)}% hoàn thành
              </Text>
            </View>
          </TouchableOpacity>
          
          {/* Tài liệu Card */}
          <TouchableOpacity onPress={handleDocumentsPress} style={styles.touchableCardFlex}>
            <View style={[styles.statsCard, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.statsHeader}>
                <Text style={[styles.statsTitle, { color: theme.colors.text }]}>
                  Tài liệu
                </Text>
                <Icon name="file-document-outline" size={20} color={theme.colors.primary} />
              </View>
              <Text style={[styles.statsValue, { color: theme.colors.text }]}>
                {statistics.documentCount}
              </Text>
              <Text style={{ color: isDarkMode ? '#AEAEB2' : '#8E8E93', fontSize: FONT_SIZE.small }}>
                {statistics.documentNew} tài liệu mới
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Biểu đồ hoạt động hàng tuần */}
        <TouchableOpacity onPress={handleTasksPress}>
          <View style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
              Hoạt động hàng tuần
            </Text>
            <View style={styles.chartContainer}>
              <VictoryChart
                width={width - (SPACING.md * 4)}
                height={200}
                theme={VictoryTheme.material}
                domainPadding={{ x: 20 }}
                padding={{ left: 50, right: 30, top: 20, bottom: 40 }}
              >
                <VictoryAxis
                  style={{
                    axis: { stroke: isDarkMode ? '#AEAEB2' : '#8E8E93' },
                    tickLabels: { fill: isDarkMode ? '#AEAEB2' : '#8E8E93' }
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  style={{
                    axis: { stroke: isDarkMode ? '#AEAEB2' : '#8E8E93' },
                    tickLabels: { fill: isDarkMode ? '#AEAEB2' : '#8E8E93' }
                  }}
                />
                <VictoryLine
                  data={lineChartData}
                  style={{
                    data: { stroke: theme.colors.primary, strokeWidth: 3 },
                  }}
                  animate={{
                    duration: 1000,
                    onLoad: { duration: 500 }
                  }}
                />
              </VictoryChart>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Biểu đồ tròn thống kê tác vụ */}
        <TouchableOpacity onPress={handleTasksPress}>
          <View style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
              Thống kê công việc
            </Text>
            <View style={styles.chartContainer}>
              <VictoryPie
                data={pieChartData}
                width={width - (SPACING.md * 4)}
                height={220}
                colorScale={pieChartData.map(d => d.color)}
                innerRadius={70}
                labelRadius={(props: any) => {
                  const { innerRadius = 0 } = props;
                  return innerRadius + 30;
                }}
                style={{
                  labels: { fill: theme.colors.text, fontSize: 12 }
                }}
                animate={{
                  duration: 1000,
                  onLoad: { duration: 500 }
                }}
              />
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Biểu đồ cột thống kê tổng quát */}
        <TouchableOpacity onPress={handleTasksPress}>
          <View style={[styles.chartCard, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
              Tổng quan dữ liệu
            </Text>
            <View style={styles.chartContainer}>
              <VictoryChart
                width={width - (SPACING.md * 4)}
                height={200}
                domainPadding={{ x: 25 }}
                padding={{ left: 50, right: 50, top: 20, bottom: 40 }}
              >
                <VictoryAxis
                  style={{
                    axis: { stroke: isDarkMode ? '#AEAEB2' : '#8E8E93' },
                    tickLabels: { fill: isDarkMode ? '#AEAEB2' : '#8E8E93', angle: -45, fontSize: 10, textAnchor: 'end' }
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  style={{
                    axis: { stroke: isDarkMode ? '#AEAEB2' : '#8E8E93' },
                    tickLabels: { fill: isDarkMode ? '#AEAEB2' : '#8E8E93' }
                  }}
                />
                <VictoryBar
                  data={barChartData}
                  style={{
                    data: { fill: theme.colors.primary, width: 20 }
                  }}
                  animate={{
                    duration: 1000,
                    onLoad: { duration: 500 }
                  }}
                />
              </VictoryChart>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Công việc gần đây */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Công việc gần đây
            </Text>
            <TouchableOpacity onPress={handleTasksPress}>
              <Text style={{ color: theme.colors.primary }}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          {tasks.slice(0, 3).map((task, idx) => (
            <View 
              key={task.id} 
              style={[
                styles.taskItem,
                idx < tasks.slice(0, 3).length - 1 && styles.taskItemBorder,
                { borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
              ]}
            >
              <View style={styles.taskItemLeft}>
                <Icon
                  name={task.completed ? 'checkbox-marked-circle-outline' : 'clock-outline'}
                  size={22}
                  color={task.completed ? colors.success : task.overdue ? colors.error : colors.secondary}
                />
                <View style={styles.taskDetails}>
                  <Text style={[styles.taskTitle, { color: theme.colors.text }]}>
                    {task.title}
                  </Text>
                  <Text style={{ color: isDarkMode ? '#AEAEB2' : '#8E8E93', fontSize: FONT_SIZE.small }}>
                    Hạn: {new Date(task.dueDate).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
              </View>
              <Icon
                name="chevron-right"
                size={20}
                color={isDarkMode ? '#AEAEB2' : '#8E8E93'}
              />
            </View>
          ))}
        </View>
        
        {/* Tài liệu gần đây */}
        <View style={[styles.sectionCard, { backgroundColor: theme.colors.surface }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
              Tài liệu gần đây
            </Text>
            <TouchableOpacity onPress={handleDocumentsPress}>
              <Text style={{ color: theme.colors.primary }}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          
          {documents.slice(0, 3).map((doc, idx) => (
            <View 
              key={doc.id} 
              style={[
                styles.docItem,
                idx < documents.slice(0, 3).length - 1 && styles.docItemBorder,
                { borderBottomColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }
              ]}
            >
              <View style={styles.docItemLeft}>
                <Icon
                  name={
                    doc.type === 'pdf' ? 'file-pdf-box' :
                    doc.type === 'doc' ? 'file-word' :
                    doc.type === 'xls' ? 'file-excel' :
                    doc.type === 'ppt' ? 'file-powerpoint' :
                    'file-document-outline'
                  }
                  size={24}
                  color={
                    doc.type === 'pdf' ? '#F44336' :
                    doc.type === 'doc' ? '#2196F3' :
                    doc.type === 'xls' ? '#4CAF50' :
                    doc.type === 'ppt' ? '#FF9800' :
                    theme.colors.primary
                  }
                />
                <View style={styles.docDetails}>
                  <Text style={[styles.docTitle, { color: theme.colors.text }]}>
                    {doc.title}
                  </Text>
                  <Text style={{ color: isDarkMode ? '#AEAEB2' : '#8E8E93', fontSize: FONT_SIZE.small }}>
                    {doc.size} • {new Date(doc.updatedAt).toLocaleDateString('vi-VN')}
                  </Text>
                </View>
              </View>
              <Icon
                name="chevron-right"
                size={20}
                color={isDarkMode ? '#AEAEB2' : '#8E8E93'}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* AI Chat FAB */}
      <FAB
        style={styles.fab}
        icon="robot-outline"
        onPress={openChatModal}
        theme={{ colors: { accent: theme.colors.primary } }} // Ensure FAB color matches primary theme color
      />

      {/* AI Chat Modal */}
      <AIChatModal visible={isChatModalVisible} onClose={closeChatModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  containerWrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingBottom: 80,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.sm,
    ...SHADOW.small,
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: FONT_SIZE.body,
  },
  username: {
    fontSize: FONT_SIZE.h2,
    fontWeight: FONT_WEIGHT.bold,
    marginTop: 4,
  },
  weatherCard: {
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
    ...SHADOW.small,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weatherInfo: {
    marginLeft: SPACING.md,
  },
  weatherTemp: {
    fontSize: FONT_SIZE.h3,
    fontWeight: FONT_WEIGHT.bold,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: SPACING.md,
  },
  touchableCardFlex: {
    flex: 1,
    marginRight: SPACING.md,
  },
  statsCard: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 12,
    marginRight: 0,
    width: '100%',
    ...SHADOW.small,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  statsTitle: {
    fontSize: FONT_SIZE.body,
  },
  statsValue: {
    fontSize: FONT_SIZE.h2,
    fontWeight: FONT_WEIGHT.bold,
    marginVertical: SPACING.xs,
  },
  statsProgress: {
    marginVertical: SPACING.sm,
  },
  chartCard: {
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
    ...SHADOW.small,
  },
  chartTitle: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: FONT_WEIGHT.semiBold,
    marginBottom: SPACING.md,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCard: {
    margin: SPACING.md,
    padding: SPACING.md,
    borderRadius: 12,
    ...SHADOW.small,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: FONT_WEIGHT.semiBold,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  taskItemBorder: {
    borderBottomWidth: 1,
    marginBottom: SPACING.sm,
  },
  taskItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  taskDetails: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  taskTitle: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: 2,
  },
  docItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  docItemBorder: {
    borderBottomWidth: 1,
    marginBottom: SPACING.sm,
  },
  docItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  docDetails: {
    marginLeft: SPACING.sm,
    flex: 1,
  },
  docTitle: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
    marginBottom: 2,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default HomeScreen; 