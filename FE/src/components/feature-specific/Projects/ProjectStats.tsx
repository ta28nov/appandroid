import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { FONT_SIZE, SPACING } from '../../../styles/globalStyles';
import ChartComponent from '../Reports/ChartComponent';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export interface ProjectStatsProps {
  projectId: string;
  onTasksPress?: () => void;
  onResourcesPress?: () => void;
  onBudgetPress?: () => void;
}

const ProjectStats: React.FC<ProjectStatsProps> = ({
  projectId,
  onTasksPress,
  onResourcesPress,
  onBudgetPress,
}) => {
  const { theme } = useTheme();
  
  // Mock dữ liệu cho các biểu đồ và thống kê
  const taskCompletionData = {
    labels: ['Hoàn thành', 'Quá hạn', 'Đang thực hiện', 'Chưa bắt đầu'],
    datasets: [
      {
        data: [60, 10, 20, 10],
        colors: [theme.colors.success, theme.colors.error, theme.colors.primary, theme.colors.disabled],
      }
    ]
  };
  
  const resourceAllocationData = {
    labels: ['Dev', 'Design', 'QA', 'PM', 'Other'],
    datasets: [
      {
        data: [40, 20, 15, 10, 15],
        colors: [
          '#6C5DD3', '#7A5AF8', '#8833FF', '#3E7BFA', '#4A6FF3'
        ],
      }
    ]
  };
  
  const budgetData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        data: [75, 60, 40, 25],
        label: 'Chi tiêu',
        color: theme.colors.primary,
      }
    ]
  };
  
  // Component hiển thị một card thống kê
  const StatCard = ({ 
    title, 
    value, 
    icon, 
    chartType,
    chartData,
    onPress,
    chartHeight = 150,
    chartWidth = 300,
  }: {
    title: string;
    value: string;
    icon: string;
    chartType?: 'pie' | 'bar' | 'line';
    chartData?: any;
    onPress?: () => void;
    chartHeight?: number;
    chartWidth?: number;
  }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { color: theme.colors.text }]}>{title}</Text>
        <Icon name={icon} size={20} color={theme.colors.primary} />
      </View>
      
      <Text style={[styles.cardValue, { color: theme.colors.text }]}>{value}</Text>
      
      {chartData && chartType && (
        <View style={styles.chartContainer}>
          <ChartComponent 
            type={chartType === 'pie' ? 'donut' : chartType === 'bar' ? 'horizontalBar' : 'line'}
            data={chartData}
            height={chartHeight}
            width={chartWidth}
            showLegend={false}
            showXAxis={chartType !== 'pie'}
          />
        </View>
      )}
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
        Tổng quan dự án
      </Text>
      
      <View style={styles.statsGrid}>
        <StatCard 
          title="Tiến độ công việc"
          value="65% hoàn thành"
          icon="checkbox-marked-circle-outline"
          chartType="pie"
          chartData={taskCompletionData}
          onPress={onTasksPress}
        />
        
        <StatCard 
          title="Phân bổ nguồn lực"
          value="25 thành viên"
          icon="account-group"
          chartType="pie"
          chartData={resourceAllocationData}
          onPress={onResourcesPress}
        />
        
        <StatCard 
          title="Ngân sách dự án"
          value="75% đã sử dụng"
          icon="chart-line"
          chartType="line"
          chartData={budgetData}
          onPress={onBudgetPress}
        />
      </View>
      
      <View style={styles.quickStats}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>
            Deadline
          </Text>
          <Text style={[styles.statValue, { color: theme.colors.text }]}>
            20/12/2023
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>
            Số task quá hạn
          </Text>
          <Text style={[styles.statValue, { color: theme.colors.error }]}>
            5 tasks
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: theme.colors.secondary }]}>
            Vấn đề cần xử lý
          </Text>
          <Text style={[styles.statValue, { color: theme.colors.warning }]}>
            3 issues
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'column',
    gap: SPACING.md,
    marginBottom: SPACING.lg,
  },
  card: {
    borderRadius: 12,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  cardTitle: {
    fontSize: FONT_SIZE.medium,
    fontWeight: '600',
  },
  cardValue: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
  },
  chartContainer: {
    alignItems: 'center',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statItem: {
    minWidth: '30%',
    marginBottom: SPACING.md,
  },
  statLabel: {
    fontSize: FONT_SIZE.small,
    marginBottom: 2,
  },
  statValue: {
    fontSize: FONT_SIZE.medium,
    fontWeight: '600',
  },
});

export default ProjectStats; 