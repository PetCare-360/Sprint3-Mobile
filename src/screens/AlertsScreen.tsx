import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NotificationItem } from '../components/NotificationItem';
import { Header } from '../components/Header';
import { useTheme } from '../hooks/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const AlertsScreen = () => {
  const { colors, spacing, typography, isDark } = useTheme();

  const alerts = [
    { 
      type: 'warning', 
      title: 'Temperatura Elevada', 
      message: 'A temperatura de Max subiu para 39.5°C. Recomendamos monitorar.', 
      time: '10 min atrás',
      read: false
    },
    { 
      type: 'error', 
      title: 'Bateria Crítica', 
      message: 'A coleira de Max está com 15% de bateria. Recarregue em breve.', 
      time: '1 hora atrás',
      read: false
    },
    { 
      type: 'success', 
      title: 'Meta de Atividade', 
      message: 'Max atingiu a meta de 2.5km caminhados hoje! 🐾', 
      time: '3 horas atrás',
      read: true
    },
    { 
      type: 'info', 
      title: 'Lembrete de Vacina', 
      message: 'Max tem vacina antirrábica agendada para amanhã às 14:00.', 
      time: '5 horas atrás',
      read: true
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Notificações" 
        rightElement={
          <TouchableOpacity style={styles.clearButton}>
            <MaterialCommunityIcons name="check-all" size={20} color={colors.primary} />
          </TouchableOpacity>
        }
      />
      <ScrollView 
        contentContainerStyle={[styles.content, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerInfo}>
          <Text style={[styles.title, { color: colors.text }]}>Recentes</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Você tem 2 notificações não lidas
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>HOJE</Text>
          {alerts.slice(0, 2).map((alert, index) => (
            <NotificationItem key={index} {...alert as any} />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>ANTERIORES</Text>
          {alerts.slice(2).map((alert, index) => (
            <NotificationItem key={index} {...alert as any} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  headerInfo: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1.2,
    marginBottom: 16,
    opacity: 0.6,
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

