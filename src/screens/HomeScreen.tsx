import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { theme } from '../theme';
import { Card } from '../components/Card';
import { InfoCard } from '../components/InfoCard';
import { ApiService, PetStatus } from '../services/api';

export const HomeScreen = () => {
  const [status, setStatus] = useState<PetStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    try {
      const data = await ApiService.getPetStatus();
      setStatus(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStatus();
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
        }
      >
        <Text style={styles.welcomeText}>Olá, Pet Lover! 🐾</Text>
        <Text style={styles.subtitle}>Confira como seu pet está agora.</Text>

        <Card style={styles.mainCard}>
          <Text style={styles.cardTitle}>Status Geral: {status?.heartRate && status.heartRate > 120 ? 'Alerta' : 'Seguro'}</Text>
          <View style={styles.row}>
            <InfoCard 
              label="Temperatura" 
              value={status?.temperature.toFixed(1) || '--'} 
              unit="°C" 
              iconColor={theme.colors.success} 
            />
            <InfoCard 
              label="Batimentos" 
              value={status?.heartRate.toString() || '--'} 
              unit="bpm" 
              iconColor={theme.colors.secondary} 
            />
          </View>
          <View style={styles.row}>
            <InfoCard 
              label="Atividade" 
              value={status?.activity || '--'} 
              iconColor={theme.colors.primary} 
            />
            <InfoCard 
              label="Bateria" 
              value={status?.battery.toString() || '--'} 
              unit="%" 
              iconColor={theme.colors.warning} 
            />
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Última Localização</Text>
          <Text style={styles.locationText}>Centro, São Paulo - SP</Text>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Resumo do Dia</Text>
          <Text style={styles.summaryText}>Seu pet caminhou 2.5km hoje e dormiu 12 horas.</Text>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  container: {
    padding: theme.spacing.md,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  mainCard: {
    paddingVertical: theme.spacing.lg,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  locationText: {
    color: theme.colors.primary,
    fontWeight: '600',
  },
  summaryText: {
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
});
