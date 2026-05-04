import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
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
        return isDark 
          ? { borderWidth: 1, borderColor: colors.border } 
          : { ...shadows.md };
      case 'outlined':
        return { borderWidth: 1, borderColor: colors.border };
      case 'flat':
        return { backgroundColor: isDark ? colors.surface : colors.gray100 };
      default:
        return {};
    }
  };

  return (
    <View style={[
      styles.card, 
      { 
        backgroundColor: colors.card,
        borderRadius: radius.xl,
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
    overflow: 'hidden',
  },
});
