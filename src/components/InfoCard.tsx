import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface InfoCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  iconColor?: string;
}

export const InfoCard = ({ label, value, unit, icon, iconColor }: InfoCardProps) => {
  const { theme } = useAppTheme();
  const color = iconColor || theme.colors.primary;

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
        <MaterialCommunityIcons 
          name={icon || 'information'} 
          size={22} 
          color={color} 
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>{label}</Text>
        <Text style={[styles.value, { color: theme.colors.text }]}>
          {value}
          {unit && <Text style={styles.unit}> {unit}</Text>}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    marginBottom: 2,
    fontWeight: '500',
  },
  value: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 12,
    fontWeight: 'normal',
  },
});
