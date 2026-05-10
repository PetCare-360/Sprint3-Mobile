import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'outlined' | 'flat' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export const Card = ({ 
  children, 
  style, 
  variant = 'elevated',
  padding = 'md' 
}: CardProps) => {
  const { colors, radius, shadows, spacing, isDark } = useTheme();

  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          ...shadows.md,
          borderWidth: isDark ? 1 : 0,
          borderColor: isDark ? colors.border : 'transparent',
        };
      case 'outlined':
        return { 
          borderWidth: 1.5, 
          borderColor: colors.border,
          backgroundColor: 'transparent'
        };
      case 'flat':
        return { 
          backgroundColor: isDark ? colors.surface : colors.divider,
        };
      case 'glass':
        return {
          backgroundColor: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderWidth: 1,
          borderColor: isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.05)',
          ...shadows.md,
        };
      default:
        return {};
    }
  };

  return (
    <View style={[
      styles.card, 
      { 
        backgroundColor: colors.card,
        borderRadius: radius.xxl,
        padding: spacing[padding],
      }, 
      getVariantStyle(),
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    ...Platform.select({
      web: {
        transition: 'all 0.3s ease',
      }
    })
  },
});

