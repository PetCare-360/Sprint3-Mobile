import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';

export const VetDashboard = ({ navigation }: any) => {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair do sistema?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
          }
        }
      ]
    );
  };

  const stats = [
    { label: 'Pacientes Ativos', value: '12', icon: 'dog-side', color: theme.colors.primary },
    { label: 'Alertas Críticos', value: '3', icon: 'alert-decagram', color: theme.colors.danger },
    { label: 'Consultas Hoje', value: '5', icon: 'calendar-check', color: theme.colors.success },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.welcome}>Olá, Dr. Veterinário</Text>
      <Text style={styles.subtitle}>Resumo do seu dia</Text>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Card>
              <MaterialCommunityIcons name={stat.icon as any} size={32} color={stat.color} />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </Card>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Ações Rápidas</Text>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={() => navigation.navigate('Patients')}
      >
        <MaterialCommunityIcons name="clipboard-list-outline" size={24} color={theme.colors.white} />
        <Text style={styles.actionText}>Ver Todos os Pacientes</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.actionButton, { backgroundColor: theme.colors.danger }]}
        onPress={handleSignOut}
      >
        <MaterialCommunityIcons name="logout" size={24} color={theme.colors.white} />
        <Text style={styles.actionText}>Sair do Sistema</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  statItem: {
    width: '48%',
    marginBottom: theme.spacing.md,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  actionText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: theme.spacing.md,
  },
});
