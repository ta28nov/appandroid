import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { COLORS } from '../../styles/theme';

interface ProgressBarProps {
  progress: number; // Phần trăm tiến độ từ 0 đến 100
  height?: number; // Chiều cao của thanh tiến độ
  backgroundColor?: string; // Màu nền của thanh tiến độ
  progressColor?: string; // Màu của tiến độ
  animated?: boolean; // Có hiệu ứng chuyển động khi thay đổi không
}

/**
 * Component hiển thị thanh tiến độ
 * @param progress - Giá trị từ 0 đến 100 thể hiện phần trăm tiến độ
 * @param height - Chiều cao của thanh tiến độ, mặc định là 6
 * @param backgroundColor - Màu nền của thanh tiến độ, mặc định dựa theo theme
 * @param progressColor - Màu của tiến độ, mặc định dựa theo theme và mức độ tiến độ
 * @param animated - Có hiệu ứng chuyển động khi thay đổi không, mặc định là true
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 6,
  backgroundColor,
  progressColor,
  animated = true,
}) => {
  const { theme, isDarkMode } = useTheme();
  
  // Giới hạn giá trị tiến độ từ 0 đến 100
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  // Xác định màu dựa trên tiến độ nếu không được cung cấp
  const getProgressColor = () => {
    if (progressColor) return progressColor;
    
    if (clampedProgress < 30) {
      return theme.colors.error; // Đỏ cho tiến độ thấp
    } else if (clampedProgress < 70) {
      return theme.colors.warning; // Cam cho tiến độ trung bình
    } else {
      return theme.colors.success; // Xanh lá cho tiến độ cao
    }
  };
  
  // Xác định màu nền
  const bgColor = backgroundColor || (isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)');
  
  return (
    <View style={[styles.container, { height, backgroundColor: bgColor, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.progress,
          {
            width: `${clampedProgress}%`,
            backgroundColor: getProgressColor(),
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});

export default ProgressBar; 