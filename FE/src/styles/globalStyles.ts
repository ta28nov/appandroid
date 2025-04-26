import { StyleSheet, TextStyle } from 'react-native';
import { COLORS } from './theme';

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const FONT_SIZE = {
  caption: 12,
  small: 13,
  body: 14,
  medium: 15,
  button: 16,
  subtitle: 17,
  title: 18,
  large: 19,
  h3: 20,
  h2: 24,
  h1: 28,
};

// Sử dụng các giá trị fontWeight cụ thể, được React Native chấp nhận
export const FONT_WEIGHT: {[key: string]: TextStyle['fontWeight']} = {
  regular: "400",
  medium: "500", 
  semiBold: "600",
  bold: "700",
  normal: "normal",
};

export const SHADOW = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

export const globalStyles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Spacing
  padding: {
    padding: SPACING.md,
  },
  paddingHorizontal: {
    paddingHorizontal: SPACING.md,
  },
  paddingVertical: {
    paddingVertical: SPACING.md,
  },
  margin: {
    margin: SPACING.md,
  },
  marginBottom: {
    marginBottom: SPACING.md,
  },
  marginTop: {
    marginTop: SPACING.md,
  },
  
  // Typography
  h1: {
    fontSize: FONT_SIZE.h1,
    fontWeight: FONT_WEIGHT.bold,
  },
  h2: {
    fontSize: FONT_SIZE.h2,
    fontWeight: FONT_WEIGHT.bold,
  },
  h3: {
    fontSize: FONT_SIZE.h3,
    fontWeight: FONT_WEIGHT.semiBold,
  },
  title: {
    fontSize: FONT_SIZE.title,
    fontWeight: FONT_WEIGHT.semiBold,
  },
  body: {
    fontSize: FONT_SIZE.body,
    fontWeight: FONT_WEIGHT.regular,
  },
  caption: {
    fontSize: FONT_SIZE.caption,
    fontWeight: FONT_WEIGHT.regular,
  },
  
  // Cards
  card: {
    borderRadius: 8,
    padding: SPACING.md,
    backgroundColor: COLORS.light.surface,
    ...SHADOW.small,
  },
}); 