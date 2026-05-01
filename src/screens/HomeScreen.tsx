import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { theme } from '../theme';
import { Card } from '../components/Card';
import { InfoCard } from '../components/InfoCard';

export const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.welcomeText}>Olá, Pet Lover! 🐾</Text>
        <Text style={styles.subtitle}>Confira como seu pet está agora.</Text>

        <Card style={styles.mainCard}>
          <Text style={styles.cardTitle}>Status Geral: Seguro</Text>
          <View style={styles.row}>
            <InfoCard label="Temperatura" value="38.5" unit="°C" iconColor={theme.colors.success} />
            <InfoCard label="Batimentos" value="110" unit="bpm" iconColor={theme.colors.secondary} />
          </View>
          <View style={styles.row}>
            <InfoCard label="Atividade" value="Moderada" iconColor={theme.colors.primary} />
            <InfoCard label="Bateria" value="85" unit="%" iconColor={theme.colors.warning} />
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Última Localização</Text>
          <Text style={styles.locationText}>Rua das Flores, 123 - Em casa</Text>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Resumo do Dia</Text>
          <Text style={styles.summaryText}>Seu pet caminhou 2km hoje e dormiu 14 horas.</Text>
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
