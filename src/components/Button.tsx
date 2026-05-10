import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps, ViewStyle, TextStyle, View, Animated, Platform} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'white';
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button = ({ 
  title, 
  variant = 'primary', 
  loading = false, 
  style, 
  textStyle,
  disabled,
  icon,
  ...rest 
}: ButtonProps) => {
  const { colors, spacing, radius, typography, shadows } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 10,
    }).start();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: { 
            backgroundColor: colors.primary,
            ...shadows.primary,
          },
          text: { color: colors.white },
        };
      case 'secondary':
        return {
          container: { 
            backgroundColor: colors.surface, 
            borderWidth: 1, 
            borderColor: colors.border,
            ...shadows.sm,
          },
          text: { color: colors.text },
        };
      case 'outline':
        return {
          container: { 
            backgroundColor: 'transparent', 
            borderWidth: 1.5, 
            borderColor: colors.primary 
          },
          text: { color: colors.primary },
        };
      case 'ghost':
        return {
          container: { backgroundColor: 'transparent' },
          text: { color: colors.primary },
        };
      case 'danger':
        return {
          container: { backgroundColor: colors.danger + '15' },
          text: { color: colors.danger },
        };
      case 'white':
        return {
          container: { 
            backgroundColor: colors.white,
            ...shadows.sm,
          },
          text: { color: colors.primary },
        };
      default:
        return {
          container: { backgroundColor: colors.primary },
          text: { color: colors.white },
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        style={[
          styles.container, 
          { 
            borderRadius: radius.xl,
            paddingVertical: spacing.md,
            paddingHorizontal: spacing.lg,
          },
          variantStyles.container,
          disabled && { opacity: 0.5, backgroundColor: colors.border, shadowOpacity: 0, elevation: 0 },
          style
        ]}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
        {...rest}
      >
        {loading ? (
          <ActivityIndicator color={variantStyles.text.color} size="small" />
        ) : (
          <View style={styles.content}>
            {icon && <View style={{ marginRight: spacing.sm }}>{icon}</View>}
            <Text style={[
              styles.text, 
              { 
                fontSize: typography.sizes.md,
                fontWeight: typography.weights.bold,
                letterSpacing: 0.3,
              },
              variantStyles.text,
              textStyle
            ]}>
              {title}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    ...Platform.select({
      web: {
        transition: 'all 0.2s ease-in-out',
      }
    })
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    textAlign: 'center',
  },
});