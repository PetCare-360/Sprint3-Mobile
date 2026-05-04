import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from './Card';
import { useTheme } from '../hooks/useTheme';

interface NotificationProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  time: string;
}

export const NotificationItem = ({ type, title, message, time }: NotificationProps) => {
  const { colors, typography, spacing } = useTheme();

  const getIcon = () => {
    switch (type) {
      case 'success':
        return { name: 'check-circle-outline', color: colors.success };
      case 'warning':
        return { name: 'alert-outline', color: colors.warning };
      case 'error':
        return { name: 'alert-octagon-outline', color: colors.danger };
      default:
        return { name: 'information-outline', color: colors.primary };
    }
  };

  const icon = getIcon();

  return (
    <Card style={styles.container}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: icon.color + '15' }]}>
          <MaterialCommunityIcons name={icon.name as any} size={24} color={icon.color} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text, fontSize: typography.sizes.md }]}>{title}</Text>
            <Text style={[styles.time, { color: colors.textSecondary, fontSize: typography.sizes.xs }]}>{time}</Text>
          </View>
          <Text style={[styles.message, { color: colors.textSecondary, fontSize: typography.sizes.sm }]} numberOfLines={2}>
            {message}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontWeight: 'bold',
  },
  time: {},
  message: {
    lineHeight: 20,
  },
});