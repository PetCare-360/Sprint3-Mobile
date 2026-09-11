import React from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { Header } from '../components/Header';
import { NotificationItem } from '../components/NotificationItem';
import { useAlerts } from '../hooks/useAlerts';
import { useTheme } from '../hooks/useTheme';

export const AlertsScreen = () => {
  const { colors, spacing, typography } = useTheme();
  const { alerts, isLoading, isFetching, isError, refetch } = useAlerts();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Header title="Alertas" />
      <FlatList
        data={alerts}
        keyExtractor={item => String(item.petId)}
        contentContainerStyle={{ padding: spacing.lg, flexGrow: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isLoading}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator color={colors.primary} />
            </View>
          ) : isError ? (
            <View style={styles.centered}>
              <Text style={[styles.message, { color: colors.textSecondary, fontSize: typography.sizes.sm }]}>Não foi possível carregar os alertas.</Text>
              <Text style={[styles.hint, { color: colors.textSecondary, fontSize: typography.sizes.xs }]}>Puxe a tela para baixo para tentar novamente.</Text>
            </View>
          ) : (
            <View style={styles.centered}>
              <Text style={[styles.message, { color: colors.textSecondary, fontSize: typography.sizes.sm }]}>Nenhum alerta ativo.</Text>
            </View>
          )
        }
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
  centered: {
    flex: 1,
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  message: {
    textAlign: 'center',
    fontWeight: '600',
  },
  hint: {
    textAlign: 'center',
    marginTop: 8,
  },
});
