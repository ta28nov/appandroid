import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image, Animated, Easing } from 'react-native';
import { useTheme } from '../../hooks/useTheme';
import { FONT_SIZE, FONT_WEIGHT } from '../../styles/globalStyles';

const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedText = Animated.createAnimatedComponent(Text);

const SplashScreen: React.FC = () => {
  const { theme } = useTheme();
  
  // Animation values
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Fade in and scale up animation
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true
    }).start();
    
    Animated.timing(scale, {
      toValue: 1,
      duration: 800,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
      useNativeDriver: true
    }).start();
    
    // Subtle rotation animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(rotate, {
          toValue: -0.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(rotate, {
          toValue: 0.05,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);
  
  // Logo animation style
  const logoAnimatedStyle = {
    opacity,
    transform: [
      { scale },
      { rotate: rotate.interpolate({
        inputRange: [-0.05, 0.05],
        outputRange: ['-0.05rad', '0.05rad']
      }) },
    ],
  };
  
  // Unsplash logo image
  const logoPlaceholder = { uri: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80' };
  
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <AnimatedImage
        source={logoPlaceholder}
        style={[styles.logo, logoAnimatedStyle]}
        resizeMode="contain"
      />
      
      <AnimatedText
        style={[
          styles.title,
          { color: theme.colors.text },
          { opacity },
        ]}
      >
        Digital Workspace Pro
      </AnimatedText>
      
      <ActivityIndicator
        size="large"
        color={theme.colors.primary}
        style={styles.loader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: FONT_SIZE.h1,
    fontWeight: FONT_WEIGHT.bold,
    marginBottom: 16,
    textAlign: 'center',
  },
  loader: {
    marginTop: 32,
  },
});

export default SplashScreen;