import { Platform } from 'react-native';

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    ...Platform.select({
      ios: {
        shadowColor: '#3A2A1E',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  md: {
    ...Platform.select({
      ios: {
        shadowColor: '#3A2A1E',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.09,
        shadowRadius: 24,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  lg: {
    ...Platform.select({
      ios: {
        shadowColor: '#3A2A1E',
        shadowOffset: { width: 0, height: 16 },
        shadowOpacity: 0.14,
        shadowRadius: 40,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  primary: {
    ...Platform.select({
      ios: {
        shadowColor: '#FF6B4A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.28,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
        shadowColor: '#FF6B4A',
      },
    }),
  },
  secondary: {
    ...Platform.select({
      ios: {
        shadowColor: '#14B8A6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.24,
        shadowRadius: 20,
      },
      android: {
        elevation: 8,
        shadowColor: '#14B8A6',
      },
    }),
  },
};

export type Shadow = keyof typeof shadows;

