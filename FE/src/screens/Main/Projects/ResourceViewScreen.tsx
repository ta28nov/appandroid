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
import { apiGetProjectById } from '../../../services/api';

// Ví dụ định nghĩa params
type ResourceViewParams = {
  ResourceView: {
    projectId?: string;
    teamId?: string;
  };
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
  const [allocationData, setAllocationData] = useState<any>(null);
  
  // Lấy dữ liệu
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Giả sử lấy theo projectId, có thể điều chỉnh endpoint phù hợp
        const projectId = route.params?.projectId;
        if (projectId) {
          const res = await apiGetProjectById(projectId);
          setAllocationData(res.data?.allocationData || null);
        } else {
          setAllocationData(null);
        }
      } catch (e) {
        setAllocationData(null);
      }
      setLoading(false);
    };
    fetchData();
  }, [route.params?.projectId, activeTab, timeRange]);
  
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
    if (!allocationData) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>Không có dữ liệu phân bổ nguồn lực.</Text>
        </View>
      );
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
              data={allocationData.teamChart || { labels: [], datasets: [] }}
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
              data={allocationData.typeChart || { labels: [], datasets: [] }}
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
              data={allocationData.timelineChart || { labels: [], datasets: [] }}
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
              data={allocationData.utilizationChart || { labels: [], datasets: [] }}
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