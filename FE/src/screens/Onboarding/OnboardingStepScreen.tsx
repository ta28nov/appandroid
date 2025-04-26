import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  ImageSourcePropType,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { SPACING, FONT_SIZE, FONT_WEIGHT } from '../../styles/globalStyles';
import Button from '../../components/common/Button';

const { width, height } = Dimensions.get('window');

interface OnboardingStepProps {
  title: string;
  description: string;
  image: ImageSourcePropType;
  stepIndex: number;
  totalSteps: number;
  onNext: () => void;
  onSkip: () => void;
  onFinish: () => void;
}

/**
 * Component hiển thị từng bước trong quá trình onboarding
 */
const OnboardingStepScreen: React.FC<OnboardingStepProps> = ({
  title,
  description,
  image,
  stepIndex,
  totalSteps,
  onNext,
  onSkip,
  onFinish,
}) => {
  const { theme, isDarkMode } = useTheme();
  const isLastStep = stepIndex === totalSteps - 1;
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {/* Phần hình ảnh */}
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} resizeMode="contain" />
      </View>
      
      {/* Phần nội dung */}
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {title}
        </Text>
        
        <Text style={[styles.description, { color: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)' }]}>
          {description}
        </Text>
        
        {/* Chỉ báo bước */}
        <View style={styles.stepIndicatorContainer}>
          {Array.from({ length: totalSteps }).map((_, index) => (
            <View
              key={index}
              style={[
                styles.stepIndicator,
                {
                  backgroundColor:
                    index === stepIndex
                      ? theme.colors.primary
                      : isDarkMode
                      ? 'rgba(255, 255, 255, 0.3)'
                      : 'rgba(0, 0, 0, 0.2)',
                  width: index === stepIndex ? 20 : 8,
                },
              ]}
            />
          ))}
        </View>
      </View>
      
      {/* Các nút điều hướng */}
      <View style={styles.buttonsContainer}>
        <Button
          title="Bỏ qua"
          onPress={onSkip}
          variant="text"
          style={styles.skipButton}
        />
        
        <Button
          title={isLastStep ? 'Bắt đầu' : 'Tiếp theo'}
          onPress={isLastStep ? onFinish : onNext}
          style={styles.nextButton}
          fullWidth={false}
          icon={
            isLastStep ? undefined : (
              <View style={styles.nextIcon}>
                <Text style={styles.nextIconText}>→</Text>
              </View>
            )
          }
          iconPosition="right"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    width: width,
    height: height * 0.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    width: '100%',
  },
  title: {
    fontSize: FONT_SIZE.title * 1.2,
    fontWeight: FONT_WEIGHT.bold,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZE.body,
    textAlign: 'center',
    marginBottom: SPACING.lg,
    lineHeight: 22,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepIndicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
  },
  skipButton: {
    paddingHorizontal: SPACING.lg,
  },
  nextButton: {
    paddingHorizontal: SPACING.lg,
  },
  nextIcon: {
    marginLeft: SPACING.xs,
  },
  nextIconText: {
    color: '#FFFFFF',
    fontSize: FONT_SIZE.body,
  },
});

export default OnboardingStepScreen;