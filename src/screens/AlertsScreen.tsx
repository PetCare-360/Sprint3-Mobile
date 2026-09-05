import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { Header } from '../components/Header';
import { NotificationItem } from '../components/NotificationItem';
import { AlertService } from '../services/alertService';
import { useTheme } from '../hooks/useTheme';

export const AlertsScreen = () => {
  const { colors, spacing } = useTheme();
  const { data: alerts = [], isLoading } = useQuery({
    queryKey: ['quick-alerts'],
    queryFn: AlertService.getQuickAlerts,
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Alertas" />
      <FlatList
        data={alerts}
        keyExtractor={item => String(item.petId)}
        contentContainerStyle={{ padding: spacing.lg }}
        ListEmptyComponent={isLoading ? <ActivityIndicator color={colors.primary} /> : <Text style={{ color: colors.textSecondary }}>Nenhum alerta ativo.</Text>}
        renderItem={({ item }) => (
          <NotificationItem
            type={item.currentStatus.toLowerCase() === 'critical' ? 'error' : 'warning'}
            title={item.name}
            message={item.reason}
            time="Agora"
            read={false}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
});
