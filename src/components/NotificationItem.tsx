import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { Card } from './Card';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface NotificationItemProps {
  title: string;
  message: string;
  time: string;
  type: 'success' | 'warning' | 'danger' | 'info';
}

type IconName = keyof typeof MaterialCommunityIcons.glyphMap;

export const NotificationItem = ({ title, message, time, type }: NotificationItemProps) => {
  const { theme } = useAppTheme();

  const getIconConfig = (): { name: IconName; color: string } => {
    switch (type) {
      case 'success':
        return { name: 'check-circle-outline', color: theme.colors.success };
      case 'warning':
        return { name: 'alert-outline', color: theme.colors.warning };
      case 'danger':
        return { name: 'alert-octagon-outline', color: theme.colors.danger };
      default:
        return { name: 'information-outline', color: theme.colors.primary };
    }
  };

  const iconConfig = getIconConfig();

  return (
    <Card style={styles.card}>
      <View style={styles.container}>
        <View style={[styles.iconContainer, { backgroundColor: iconConfig.color + '20' }]}>
          <MaterialCommunityIcons name={iconConfig.name} size={24} color={iconConfig.color} />
        </View>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>{title}</Text>
            <Text style={[styles.time, { color: theme.colors.textSecondary }]}>{time}</Text>
          </View>
          <Text style={[styles.message, { color: theme.colors.textSecondary }]} numberOfLines={2}>
            {message}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  time: {
    fontSize: 12,
  },
  message: {
    fontSize: 14,
    lineHeight: 18,
  },
});
