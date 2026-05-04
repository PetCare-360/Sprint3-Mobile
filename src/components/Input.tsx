import React, { useState } from 'react';
import { View, Text, TextInput, TextInputProps, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../hooks/useTheme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  icon?: React.ReactNode;
}

export const Input = ({ label, error, containerStyle, icon, ...rest }: InputProps) => {
  const { colors, spacing, radius, typography, isDark } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, { marginBottom: spacing.md }, containerStyle]}>
      {label && (
        <Text style={[
          styles.label, 
          { 
            color: colors.text,
            fontSize: typography.sizes.sm,
            fontWeight: typography.weights.semibold,
            marginBottom: spacing.xs
          }
        ]}>
          {label}
        </Text>
      )}
      
      <View style={[
        styles.inputWrapper,
        {
          backgroundColor: isDark ? colors.card : colors.white,
          borderColor: error ? colors.danger : (isFocused ? colors.primary : colors.border),
          borderRadius: radius.md,
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
              color: colors.text,
              fontSize: typography.sizes.md,
              flex: 1,
            }
          ]}
          placeholderTextColor={colors.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...rest}
        />
      </View>
      
      {error && (
        <Text style={[
          styles.error, 
          { 
            color: colors.danger,
            fontSize: typography.sizes.xs,
            marginTop: spacing.xs,
            marginLeft: spacing.xs
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
  label: {},
  inputWrapper: {},
  input: {
    height: '100%',
  },
  error: {},
});