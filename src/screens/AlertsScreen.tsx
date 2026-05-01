import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { theme } from '../theme';
import { NotificationItem } from '../components/NotificationItem';

const ALERTS_DATA = [
  {
    id: '1',
    title: 'Batimentos Elevados',
    message: 'O coração do seu pet está batendo mais rápido que o normal (125 bpm).',
    time: 'Há 5 min',
    type: 'danger' as const,
  },
  {
    id: '2',
    title: 'Bateria Fraca',
    message: 'A coleira está com 15% de bateria. Carregue em breve.',
    time: 'Há 1 hora',
    type: 'warning' as const,
  },
  {
    id: '3',
    title: 'Meta de Passos',
    message: 'Parabéns! Max atingiu a meta diária de 5.000 passos.',
    time: 'Há 3 horas',
    type: 'success' as const,
  },
  {
    id: '4',
    title: 'Atualização de Firmware',
    message: 'Uma nova versão do software da coleira está disponível.',
    time: 'Ontem',
    type: 'info' as const,
  },
];

export const AlertsScreen = () => (
  <SafeAreaView style={styles.container}>
    <View style={styles.header}>
      <Text style={styles.title}>Alertas e Notificações</Text>
      <Text style={styles.subtitle}>Acompanhe o que está acontecendo com seu pet</Text>
    </View>
    
    <FlatList
      data={ALERTS_DATA}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <NotificationItem
          title={item.title}
          message={item.message}
          time={item.time}
          type={item.type}
        />
      )}
      contentContainerStyle={styles.listContent}
    />
  </SafeAreaView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
});
