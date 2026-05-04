import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps,ViewStyle,TextStyle,View} from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
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
  const { theme, colors, spacing, radius, typography } = useTheme();

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          container: { 
            backgroundColor: colors.primary,
          },
          text: { color: colors.white },
        };
      case 'secondary':
        return {
          container: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
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
      default:
        return {
          container: { backgroundColor: colors.primary },
          text: { color: colors.white },
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          borderRadius: radius.md,
          paddingVertical: spacing.md,
          paddingHorizontal: spacing.lg,
        },
        variantStyles.container,
        disabled && { opacity: 0.5, backgroundColor: colors.border },
        style
      ]}
      disabled={disabled || loading}
      activeOpacity={0.7}
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
              lineHeight: typography.sizes.md * typography.lineHeights.tight
            },
            variantStyles.text,
            textStyle
          ]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
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