import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet, ViewStyle, Animated } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: React.ReactNode;
  textColor?: string;
  labelColor?: string;
}

export const Input = ({ label, error, containerStyle, icon, textColor, labelColor, ...rest }: InputProps) => {
  const { colors, spacing, radius, typography, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const focusAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(focusAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false, 
    }).start();
  }, [isFocused]);

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.border, textColor || colors.primary],
  });

  const backgroundColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      labelColor ? 'rgba(255,255,255,0.1)' : (isDark ? colors.surface : colors.white), 
      labelColor ? 'rgba(255,255,255,0.2)' : (isDark ? colors.card : colors.white)
    ],
  });

  return (
    <View style={[styles.container, { marginBottom: spacing.lg }, containerStyle]}>
      {label && (
        <Text style={[
          styles.label, 
          { 
            color: labelColor ? labelColor : (isFocused ? colors.primary : colors.textSecondary),
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.bold,
            marginBottom: spacing.xs,
            marginLeft: 4,
          }
        ]}>
          {label}
        </Text>
      )}
      
      <Animated.View style={[
        styles.inputWrapper,
        {
          backgroundColor: error ? (isDark ? colors.danger + '10' : colors.danger + '05') : backgroundColor,
          borderColor: error ? colors.danger : (labelColor ? 'rgba(255,255,255,0.2)' : borderColor),
          borderRadius: radius.xl,
          borderWidth: 1.5,
          paddingHorizontal: spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          height: 56,
        }
      ]}>
        {icon && <View style={{ marginRight: spacing.sm }}>{icon}</View>}
        
        <TextInput
          style={[
            styles.input,
            {
              color: textColor || colors.text,
              fontSize: typography.sizes.md,
              flex: 1,
            }
          ]}
          placeholderTextColor={labelColor ? 'rgba(255,255,255,0.5)' : (isDark ? colors.textSecondary : colors.gray400)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
      </Animated.View>
      
      {error && (
        <Text style={[
          styles.error, 
          { 
            color: colors.danger,
            fontSize: typography.sizes.xs,
            marginTop: spacing.xs,
            marginLeft: spacing.sm,
            fontWeight: typography.weights.medium
          }
        ]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  input: {
    height: '100%',
  },
  error: {},
});