import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import OnboardingStepScreen from '../screens/Onboarding/OnboardingStepScreen';
import { useTheme } from '../hooks/useTheme';

// Định nghĩa dữ liệu cho các bước onboarding
const onboardingSteps = [
  {
    title: 'Chào mừng đến với Workspace Pro',
    description: 'Nền tảng quản lý công việc tối ưu cho doanh nghiệp của bạn, giúp tăng năng suất và hiệu quả làm việc nhóm.',
    image: require('../assets/images/onboarding1.png'),
  },
  {
    title: 'Quản lý công việc dễ dàng',
    description: 'Theo dõi và cập nhật tiến độ công việc mọi lúc mọi nơi, không bỏ sót bất kỳ chi tiết quan trọng nào.',
    image: require('../assets/images/onboarding2.png'),
  },
  {
    title: 'Trao đổi nhanh chóng',
    description: 'Giao tiếp với đồng nghiệp, chia sẻ tài liệu và thảo luận về dự án ngay trong một nền tảng duy nhất.',
    image: require('../assets/images/onboarding3.png'),
  },
  {
    title: 'Làm việc ngay cả khi offline',
    description: 'Truy cập và làm việc với dữ liệu ngay cả khi không có kết nối mạng, mọi thay đổi sẽ được đồng bộ khi kết nối lại.',
    image: require('../assets/images/onboarding4.png'),
  },
];

interface OnboardingNavigatorProps {
  onFinish: () => void;
}

/**
 * Navigator điều hướng qua các bước onboarding
 */
const OnboardingNavigator: React.FC<OnboardingNavigatorProps> = ({ onFinish }) => {
  const { theme } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  
  // Xử lý khi nhấn nút "Tiếp theo"
  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  // Xử lý khi nhấn nút "Bỏ qua"
  const handleSkip = () => {
    onFinish();
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <OnboardingStepScreen
        title={onboardingSteps[currentStep].title}
        description={onboardingSteps[currentStep].description}
        image={onboardingSteps[currentStep].image}
        stepIndex={currentStep}
        totalSteps={onboardingSteps.length}
        onNext={handleNext}
        onSkip={handleSkip}
        onFinish={onFinish}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OnboardingNavigator; 