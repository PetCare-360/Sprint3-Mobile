import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { NotificationItem } from '../components/NotificationItem';
import { Header } from '../components/Header';
import { useTheme } from '../hooks/useTheme';

export const AlertsScreen = () => {
  const { colors, spacing, typography } = useTheme();

  const alerts = [
    { 
      type: 'warning', 
      title: 'Temperatura Alta', 
      message: 'A temperatura de Max subiu para 39.5°C.', 
      time: '10 min atrás' 
    },
    { 
      type: 'error', 
      title: 'Bateria Fraca', 
      message: 'A coleira de Thor está com 15% de bateria.', 
      time: '1 hora atrás' 
    },
    { 
      type: 'success', 
      title: 'Refeição Concluída', 
      message: 'Luna consumiu sua porção matinal.', 
      time: '2 horas atrás' 
    },
    { 
      type: 'info', 
      title: 'Lembrete de Vacina', 
      message: 'Max tem vacina agendada para amanhã.', 
      time: '5 horas atrás' 
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Alertas" />
      <ScrollView contentContainerStyle={[styles.content, { padding: spacing.lg }]}>
        <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: typography.sizes.md }]}>
          Acompanhe as notificações importantes dos seus pets.
        </Text>

        {alerts.map((alert, index) => (
          <NotificationItem key={index} {...alert as any} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {},
  subtitle: {
    marginBottom: 24,
    lineHeight: 22,
  },
});
