import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from './Card';
import { useTheme } from '../hooks/useTheme';

interface InfoCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: string;
  iconColor?: string;
}

export const InfoCard = ({ label, value, unit, icon, iconColor }: InfoCardProps) => {
  const { colors, typography, spacing } = useTheme();

  const color = iconColor || colors.primary;

  return (
    <Card style={styles.card} padding="sm">
      <View style={styles.container}>
        <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
          {icon && <MaterialCommunityIcons name={icon as any} size={20} color={color} />}
        </View>
        <View style={styles.content}>
          <Text 
            numberOfLines={1} 
            style={[styles.label, { color: colors.textSecondary, fontSize: typography.sizes.xs }]}
          >
            {label}
          </Text>
          <View style={styles.valueRow}>
            <Text 
              numberOfLines={1}
              style={[styles.value, { color: colors.text, fontSize: typography.sizes.md }]}
            >
              {value}
            </Text>
            {unit && (
              <Text style={[styles.unit, { color: colors.textSecondary, fontSize: typography.sizes.xs }]}>
                {unit}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    marginBottom: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  content: {
    flex: 1,
  },
  label: {
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontWeight: '700',
  },
  unit: {
    marginLeft: 2,
    fontWeight: '500',
  },
});