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
  const { colors, typography, spacing, radius, isDark } = useTheme();

  const color = iconColor || colors.primary;

  return (
    <Card style={styles.card} padding="md" variant="elevated">
      <View style={styles.container}>
        <View style={[
          styles.iconContainer, 
          { 
            backgroundColor: isDark ? color + '20' : color + '10',
            borderRadius: radius.lg
          }
        ]}>
          {icon && <MaterialCommunityIcons name={icon as any} size={22} color={color} />}
        </View>
        <View style={styles.content}>
          <Text 
            numberOfLines={1} 
            style={[
              styles.label, 
              { 
                color: colors.textSecondary, 
                fontSize: 11,
                fontWeight: typography.weights.bold,
              }
            ]}
          >
            {label}
          </Text>
          <View style={styles.valueRow}>
            <Text 
              numberOfLines={1}
              style={[
                styles.value, 
                { 
                  color: colors.text, 
                  fontSize: typography.sizes.lg,
                  fontWeight: typography.weights.bold,
                  letterSpacing: -0.5,
                }
              ]}
            >
              {value}
            </Text>
            {unit && (
              <Text style={[
                styles.unit, 
                { 
                  color: colors.textSecondary, 
                  fontSize: typography.sizes.xs,
                  fontWeight: typography.weights.medium,
                }
              ]}>
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
    marginBottom: 16,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  content: {
    width: '100%',
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {},
  unit: {
    marginLeft: 2,
  },
});