import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT, SPACING } from '../../../styles/globalStyles';
import Card from '../../../components/common/Card';
import ChartComponent from '../../../components/feature-specific/Reports/ChartComponent';

// Ví dụ định nghĩa params
type ResourceViewParams = {
  ResourceView: {
    projectId?: string;
    teamId?: string;
  };
};

// Dữ liệu mẫu cho các biểu đồ
const mockAllocationData = {
  team: [
    { name: 'Nguyễn Văn A', value: 85, color: '#4CAF50' },
    { name: 'Trần Thị B', value: 65, color: '#FFC107' },
    { name: 'Lê Văn C', value: 95, color: '#F44336' },
    { name: 'Phạm Thị D', value: 50, color: '#2196F3' },
    { name: 'Hoàng Văn E', value: 70, color: '#9C27B0' },
  ],
  types: [
    { name: 'Phát triển', value: 40, color: '#4CAF50' },
    { name: 'Thiết kế', value: 15, color: '#2196F3' },
    { name: 'Testing', value: 20, color: '#FFC107' },
    { name: 'Quản lý', value: 10, color: '#9C27B0' },
    { name: 'Khác', value: 15, color: '#607D8B' },
  ],
  timeline: {
    labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
    datasets: [
      {
        name: 'Phát triển',
        data: [30, 35, 45, 40, 50, 55, 60, 65, 60, 50, 45, 40],
        color: '#4CAF50',
      },
      {
        name: 'Thiết kế',
        data: [20, 25, 30, 20, 15, 10, 15, 20, 25, 30, 20, 15],
        color: '#2196F3',
      },
      {
        name: 'Testing',
        data: [10, 15, 20, 25, 30, 25, 20, 15, 10, 15, 20, 25],
        color: '#FFC107',
      },
    ],
  },
  utilization: {
    labels: ['T2', 'T3', 'T4', 'T1', 'T2', 'T3', 'T4'],
    datasets: [
      {
        name: 'Đã sử dụng',
        data: [65, 75, 80, 85, 80, 75, 70],
        color: '#2196F3',
      },
      {
        name: 'Trống',
        data: [35, 25, 20, 15, 20, 25, 30],
        color: '#ECEFF1',
      },
    ],
  },
};

/**
 * Màn hình hiển thị phân bổ nguồn lực trong dự án hoặc nhóm
 */
const ResourceViewScreen: React.FC = () => {
  const route = useRoute<RouteProp<ResourceViewParams, 'ResourceView'>>();
  const { theme, isDarkMode } = useTheme();
  const { width } = Dimensions.get('window');
  
  // State
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'team' | 'project'>('team');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  
  // Lấy dữ liệu
  useEffect(() => {
    // Giả lập việc tải dữ liệu
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);
  
  // Thay đổi khung thời gian
  const handleTimeRangeChange = (range: 'week' | 'month' | 'quarter' | 'year') => {
    setTimeRange(range);
    // Trong ứng dụng thực, sẽ tải dữ liệu mới dựa trên khung thời gian
  };
  
  // Render các tab
  const renderTabs = () => (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'team' && {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          },
        ]}
        onPress={() => setActiveTab('team')}
      >
        <Icon
          name="account-group"
          size={20}
          color={
            activeTab === 'team'
              ? theme.colors.primary
              : isDarkMode
              ? 'rgba(255, 255, 255, 0.6)'
              : 'rgba(0, 0, 0, 0.6)'
          }
        />
        <Text
          style={[
            styles.tabText,
            {
              color:
                activeTab === 'team'
                  ? theme.colors.primary
                  : theme.colors.text,
            },
          ]}
        >
          Theo nhân viên
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === 'project' && {
            backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          },
        ]}
        onPress={() => setActiveTab('project')}
      >
        <Icon
          name="folder-open"
          size={20}
          color={
            activeTab === 'project'
              ? theme.colors.primary
              : isDarkMode
              ? 'rgba(255, 255, 255, 0.6)'
              : 'rgba(0, 0, 0, 0.6)'
          }
        />
        <Text
          style={[
            styles.tabText,
            {
              color:
                activeTab === 'project'
                  ? theme.colors.primary
                  : theme.colors.text,
            },
          ]}
        >
          Theo dự án
        </Text>
      </TouchableOpacity>
    </View>
  );
  
  // Render bộ lọc thời gian
  const renderTimeFilter = () => (
    <View style={styles.timeFilterContainer}>
      <Text style={[styles.timeFilterLabel, { color: theme.colors.text }]}>
        Khung thời gian:
      </Text>
      
      <View style={styles.timeFilterButtons}>
        {['week', 'month', 'quarter', 'year'].map((range) => (
          <TouchableOpacity
            key={range}
            style={[
              styles.timeFilterButton,
              timeRange === range && {
                backgroundColor: isDarkMode
                  ? 'rgba(255, 255, 255, 0.15)'
                  : theme.colors.primary + '20',
                borderColor: theme.colors.primary,
              },
            ]}
            onPress={() => handleTimeRangeChange(range as any)}
          >
            <Text
              style={[
                styles.timeFilterButtonText,
                {
                  color:
                    timeRange === range
                      ? theme.colors.primary
                      : theme.colors.text,
                },
              ]}
            >
              {range === 'week'
                ? 'Tuần'
                : range === 'month'
                ? 'Tháng'
                : range === 'quarter'
                ? 'Quý'
                : 'Năm'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
  
  // Render nội dung màn hình đang tải
  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={[styles.loadingText, { color: theme.colors.text }]}>
        Đang tải dữ liệu...
      </Text>
    </View>
  );
  
  // Render nội dung chính
  const renderContent = () => {
    if (loading) {
      return renderLoadingState();
    }
    
    return (
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Biểu đồ phân bố công suất nhân viên */}
        <Card style={styles.chartCard}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            {activeTab === 'team' ? 'Phân bổ công suất theo nhân viên' : 'Phân bổ công suất theo dự án'}
          </Text>
          
          <View style={styles.horizontalBarChart}>
            <ChartComponent
              type="horizontalBar"
              data={{
                labels: mockAllocationData.team.map(item => item.name),
                datasets: [
                  {
                    data: mockAllocationData.team.map(item => item.value),
                    colors: mockAllocationData.team.map(item => item.color),
                  },
                ],
              }}
              height={250}
              width={width - 64}
              showValue={true}
              valueUnit="%"
              showLegend={false}
              showXAxis={true}
              showYAxis={true}
              yAxisWidth={120}
            />
          </View>
        </Card>
        
        {/* Biểu đồ phân bổ theo loại công việc */}
        <Card style={styles.chartCard}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Phân bổ theo loại công việc
          </Text>
          
          <View style={styles.pieChartContainer}>
            <ChartComponent
              type="pie"
              data={{
                labels: mockAllocationData.types.map(item => item.name),
                datasets: [
                  {
                    data: mockAllocationData.types.map(item => item.value),
                    colors: mockAllocationData.types.map(item => item.color),
                  },
                ],
              }}
              height={220}
              width={width - 64}
              showValue={true}
              valueUnit="%"
              showLegend={true}
            />
          </View>
        </Card>
        
        {/* Biểu đồ sử dụng nguồn lực theo thời gian */}
        <Card style={styles.chartCard}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Sử dụng nguồn lực theo thời gian
          </Text>
          
          <View style={styles.lineChartContainer}>
            <ChartComponent
              type="line"
              data={{
                labels: mockAllocationData.timeline.labels,
                datasets: mockAllocationData.timeline.datasets.map(ds => ({
                  data: ds.data,
                  color: ds.color,
                  label: ds.name,
                })),
              }}
              height={220}
              width={width - 64}
              showValue={false}
              showLegend={true}
              showXAxis={true}
              showYAxis={true}
            />
          </View>
        </Card>
        
        {/* Biểu đồ tỷ lệ sử dụng và còn trống */}
        <Card style={styles.chartCard}>
          <Text style={[styles.chartTitle, { color: theme.colors.text }]}>
            Tỷ lệ sử dụng nguồn lực
          </Text>
          
          <View style={styles.stackedBarChartContainer}>
            <ChartComponent
              type="stackedBar"
              data={{
                labels: mockAllocationData.utilization.labels,
                datasets: mockAllocationData.utilization.datasets.map(ds => ({
                  data: ds.data,
                  color: ds.color,
                  label: ds.name,
                })),
              }}
              height={220}
              width={width - 64}
              showValue={true}
              valueUnit="%"
              showLegend={true}
              showXAxis={true}
              showYAxis={true}
            />
          </View>
        </Card>
      </ScrollView>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Tabs */}
      {renderTabs()}
      
      {/* Bộ lọc thời gian */}
      {renderTimeFilter()}
      
      {/* Nội dung chính */}
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    padding: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    marginRight: SPACING.sm,
  },
  tabText: {
    marginLeft: SPACING.xs,
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.medium,
  },
  timeFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  timeFilterLabel: {
    fontSize: FONT_SIZE.body,
    marginRight: SPACING.sm,
  },
  timeFilterButtons: {
    flexDirection: 'row',
  },
  timeFilterButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    marginRight: SPACING.xs,
  },
  timeFilterButtonText: {
    fontSize: FONT_SIZE.small,
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.md,
  },
  chartCard: {
    marginBottom: SPACING.md,
  },
  chartTitle: {
    fontSize: FONT_SIZE.subtitle,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: SPACING.md,
  },
  horizontalBarChart: {
    marginTop: SPACING.sm,
  },
  pieChartContainer: {
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  lineChartContainer: {
    marginTop: SPACING.sm,
  },
  stackedBarChartContainer: {
    marginTop: SPACING.sm,
  },
});

export default ResourceViewScreen; 