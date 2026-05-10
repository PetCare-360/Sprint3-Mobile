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
  read?: boolean;
}

export const NotificationItem = ({ type, title, message, time, read = false }: NotificationProps) => {
  const { colors, typography, spacing, radius, isDark } = useTheme();

  const getIconConfig = () => {
    switch (type) {
      case 'success':
        return { name: 'check-circle', color: colors.success };
      case 'warning':
        return { name: 'alert', color: colors.warning };
      case 'error':
        return { name: 'alert-octagon', color: colors.danger };
      default:
        return { name: 'information', color: colors.primary };
    }
  };

  const config = getIconConfig();

  return (
    <Card 
      style={[
        styles.container, 
        !read && { borderLeftWidth: 4, borderLeftColor: config.color }
      ]}
      padding="md"
      variant={read ? 'flat' : 'elevated'}
    >
      <View style={styles.content}>
        <View style={[
          styles.iconContainer, 
          { 
            backgroundColor: isDark ? config.color + '20' : config.color + '10',
            borderRadius: radius.lg
          }
        ]}>
          <MaterialCommunityIcons name={config.name as any} size={24} color={config.color} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.header}>
            <Text 
              style={[
                styles.title, 
                { 
                  color: colors.text, 
                  fontSize: typography.sizes.md,
                  fontWeight: read ? typography.weights.semibold : typography.weights.bold 
                }
              ]}
            >
              {title}
            </Text>
            <Text style={[styles.time, { color: colors.textSecondary, fontSize: 11 }]}>{time}</Text>
          </View>
          <Text 
            style={[
              styles.message, 
              { 
                color: read ? colors.textSecondary : colors.text, 
                fontSize: typography.sizes.sm,
                lineHeight: 20
              }
            ]} 
            numberOfLines={2}
          >
            {message}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
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
    letterSpacing: -0.2,
  },
  time: {
    fontWeight: '500',
  },
  message: {
    opacity: 0.8,
  },
});