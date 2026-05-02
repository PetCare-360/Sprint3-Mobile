import React from 'react';
import { View, StyleSheet, ViewStyle, Platform, StyleProp } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Card = ({ children, style }: CardProps) => {
  const { theme, isDark } = useAppTheme();

  return (
    <View style={[
      styles.card, 
      { 
        backgroundColor: theme.colors.card,
        borderRadius: theme.borderRadius.lg,
        // No dark mode, shadows are often replaced by subtle borders or slightly lighter backgrounds
        shadowOpacity: isDark ? 0 : 0.08, 
        borderWidth: isDark ? 1 : 0,
        borderColor: theme.colors.border,
      }, 
      style
    ]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 12,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
