import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
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
        <View style={[styles.iconContainer, { backgroundColor: iconConfig.color }]}>
          <View style={styles.iconBackgroundOverlay} />
          <MaterialCommunityIcons name={iconConfig.name} size={24} color={iconConfig.color} />
        </View>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.time}>{time}</Text>
          </View>
          <Text style={styles.message} numberOfLines={2}>{message}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: theme.spacing.sm,
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  iconBackgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    opacity: 0.8,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  time: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  message: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
