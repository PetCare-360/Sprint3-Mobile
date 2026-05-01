import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';

interface InfoCardProps {
  label: string;
  value: string | number;
  unit?: string;
  iconColor?: string;
}

export const InfoCard = ({ label, value, unit, iconColor }: InfoCardProps) => (
  <View style={styles.container}>
    <View style={[styles.dot, { backgroundColor: iconColor || theme.colors.primary }]} />
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>
      {value}
      <Text style={styles.unit}>{unit}</Text>
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  unit: {
    fontSize: 12,
    fontWeight: 'normal',
    color: theme.colors.textSecondary,
    marginLeft: 2,
  },
});
