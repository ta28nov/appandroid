import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../../hooks/useTheme';
import { FONT_SIZE, SPACING } from '../../../styles/globalStyles';

// Interfaces cho props
interface ChartDataset {
  data: number[];
  color?: string;
  colors?: string[];
  label?: string;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

interface ChartComponentProps {
  type: 'bar' | 'horizontalBar' | 'line' | 'pie' | 'donut' | 'stackedBar';
  data: ChartData;
  height: number;
  width: number;
  showValue?: boolean;
  valueUnit?: string;
  showLegend?: boolean;
  showXAxis?: boolean;
  showYAxis?: boolean;
  yAxisWidth?: number;
}

/**
 * Component hiển thị biểu đồ - đây là mock component cho hiển thị UI
 * Trong ứng dụng thực tế, bạn sẽ sử dụng thư viện như react-native-chart-kit,
 * victory-native, hoặc react-native-svg-charts
 */
const ChartComponent: React.FC<ChartComponentProps> = ({
  type,
  data,
  height,
  width,
  showValue = false,
  valueUnit = '',
  showLegend = false,
  showXAxis = false,
  showYAxis = false,
  yAxisWidth = 50,
}) => {
  const { theme, isDarkMode } = useTheme();
  
  // Tạo UI mô phỏng một biểu đồ
  const renderChartMock = () => {
    // Tùy theo loại biểu đồ
    switch (type) {
      case 'pie':
      case 'donut':
        return (
          <View style={[styles.pieChart, { height, width: width * 0.6 }]}>
            <View style={styles.pieSlices}>
              {data.datasets[0].data.map((value, index) => (
                <View
                  key={index}
                  style={[
                    styles.pieSlice,
                    {
                      backgroundColor: data.datasets[0].colors?.[index] || data.datasets[0].color || theme.colors.primary,
                      flex: value,
                      transform: [{ scale: index === 0 ? 1.05 : 1 }],
                    },
                  ]}
                />
              ))}
            </View>
            {type === 'donut' && (
              <View style={[styles.donutHole, { backgroundColor: theme.colors.background }]} />
            )}
          </View>
        );
        
      case 'bar':
      case 'horizontalBar':
        return (
          <View style={{ flexDirection: type === 'horizontalBar' ? 'column' : 'row', height: height * 0.8 }}>
            {data.datasets[0].data.map((value, index) => {
              const maxValue = Math.max(...data.datasets[0].data);
              const percentage = Math.round((value / maxValue) * 100);
              
              return (
                <View key={index} style={[styles.barContainer, { 
                  flexDirection: type === 'horizontalBar' ? 'row' : 'column',
                  width: type === 'horizontalBar' ? '100%' : `${100 / data.datasets[0].data.length - 5}%`,
                  marginBottom: type === 'horizontalBar' ? SPACING.xs : 0
                }]}>
                  {showYAxis && type === 'horizontalBar' && (
                    <View style={[styles.axisLabel, { width: yAxisWidth }]}>
                      <Text style={{ color: theme.colors.text, fontSize: FONT_SIZE.small }}>
                        {data.labels[index]}
                      </Text>
                    </View>
                  )}
                  
                  <View style={[
                    styles.bar, 
                    {
                      backgroundColor: data.datasets[0].colors?.[index] || data.datasets[0].color || theme.colors.primary,
                      [type === 'horizontalBar' ? 'width' : 'height']: `${percentage}%`,
                      [type === 'horizontalBar' ? 'height' : 'width']: type === 'horizontalBar' ? 24 : undefined
                    }
                  ]}>
                    {showValue && (
                      <Text style={[
                        styles.barValue, 
                        { 
                          color: isDarkMode ? '#FFF' : '#000',
                          [type === 'horizontalBar' ? 'right' : 'top']: type === 'horizontalBar' ? 5 : -20
                        }
                      ]}>
                        {value}{valueUnit}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        );
        
      case 'line':
        return (
          <View style={[styles.lineChart, { height: height * 0.7 }]}>
            <View style={styles.chartGrid}>
              {[0, 1, 2, 3, 4].map((line) => (
                <View key={line} style={[styles.gridLine, { borderColor: theme.colors.border }]} />
              ))}
            </View>
            
            {data.datasets.map((dataset, datasetIndex) => (
              <View key={datasetIndex} style={[styles.lineContainer, { bottom: `${Math.random() * 20 + 20}%` }]}>
                <View style={[styles.line, { backgroundColor: dataset.color || theme.colors.primary }]} />
                {dataset.data.map((_, pointIndex) => (
                  <View 
                    key={pointIndex} 
                    style={[
                      styles.dataPoint, 
                      { 
                        backgroundColor: dataset.color || theme.colors.primary,
                        left: `${(100 / (dataset.data.length - 1)) * pointIndex}%`,
                        bottom: `${Math.random() * 40}%`
                      }
                    ]} 
                  />
                ))}
              </View>
            ))}
          </View>
        );
        
      case 'stackedBar':
        return (
          <View style={[styles.stackedBarChart, { height: height * 0.7 }]}>
            {data.labels.map((_, barIndex) => (
              <View key={barIndex} style={styles.stackedBarContainer}>
                {data.datasets.map((dataset, datasetIndex) => (
                  <View 
                    key={datasetIndex} 
                    style={[
                      styles.stackedBarSegment, 
                      { 
                        height: dataset.data[barIndex] ? `${dataset.data[barIndex]}%` : '0%',
                        backgroundColor: dataset.color || theme.colors.primary 
                      }
                    ]}
                  />
                ))}
              </View>
            ))}
          </View>
        );
        
      default:
        return (
          <View style={[styles.fallbackChart, { height }]}>
            <Text style={{ color: theme.colors.text }}>
              Loại biểu đồ không được hỗ trợ
            </Text>
          </View>
        );
    }
  };
  
  // Render phần chú thích
  const renderLegend = () => {
    if (!showLegend) return null;
    
    const legendItems = type === 'pie' || type === 'donut' 
      ? data.labels.map((label, index) => ({
          label,
          color: data.datasets[0].colors?.[index] || theme.colors.primary,
        }))
      : data.datasets.map((dataset) => ({
          label: dataset.label || '',
          color: dataset.color || theme.colors.primary,
        }));
    
    return (
      <View style={styles.legendContainer}>
        {legendItems.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: item.color }]} />
            <Text style={[styles.legendText, { color: theme.colors.text }]}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    );
  };
  
  // Render trục X
  const renderXAxis = () => {
    if (!showXAxis || type === 'pie' || type === 'donut') return null;
    
    return (
      <View style={styles.xAxisContainer}>
        {data.labels.map((label, index) => (
          <Text
            key={index}
            style={[
              styles.axisLabel,
              {
                width: `${100 / data.labels.length}%`,
                color: theme.colors.text,
              },
            ]}
          >
            {label}
          </Text>
        ))}
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { width }]}>
      {renderChartMock()}
      {renderXAxis()}
      {renderLegend()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  fallbackChart: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 8,
  },
  
  // Các style cho biểu đồ thanh
  barContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  bar: {
    minWidth: 20,
    minHeight: 5,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  barValue: {
    fontSize: FONT_SIZE.small,
    position: 'absolute',
  },
  
  // Các style cho biểu đồ tròn
  pieChart: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  pieSlices: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    borderRadius: 100,
    overflow: 'hidden',
  },
  pieSlice: {
    height: '100%',
  },
  donutHole: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    borderRadius: 100,
  },
  
  // Các style cho biểu đồ đường
  lineChart: {
    width: '100%',
    position: 'relative',
    marginTop: 20,
  },
  chartGrid: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
  },
  lineContainer: {
    position: 'absolute',
    width: '100%',
    height: 2,
  },
  line: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: -4,
    marginBottom: -4,
  },
  
  // Các style cho biểu đồ cột chồng
  stackedBarChart: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  stackedBarContainer: {
    width: 30,
    height: '100%',
    flexDirection: 'column-reverse',
  },
  stackedBarSegment: {
    width: '100%',
  },
  
  // Các style cho trục và chú thích
  xAxisContainer: {
    flexDirection: 'row',
    marginTop: SPACING.xs,
    width: '100%',
  },
  axisLabel: {
    textAlign: 'center',
    fontSize: FONT_SIZE.small,
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
    marginBottom: SPACING.xs,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: SPACING.xs,
  },
  legendText: {
    fontSize: FONT_SIZE.small,
  },
});

export default ChartComponent; 