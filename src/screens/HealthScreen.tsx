import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { theme } from '../theme';
import { Card } from '../components/Card';
import { InfoCard } from '../components/InfoCard';

export const HealthScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerTitle}>Saúde do Pet</Text>
        
        <Card>
          <Text style={styles.sectionTitle}>Ritmo Cardíaco</Text>
          <View style={styles.row}>
            <InfoCard label="Atual" value="110" unit="bpm" iconColor={theme.colors.secondary} />
            <InfoCard label="Média (24h)" value="105" unit="bpm" iconColor={theme.colors.textSecondary} />
          </View>
          <Text style={styles.statusText}>O ritmo cardíaco está estável e dentro da normalidade para um pet desta raça.</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Temperatura Corporal</Text>
          <View style={styles.row}>
            <InfoCard label="Atual" value="38.5" unit="°C" iconColor={theme.colors.success} />
            <InfoCard label="Mín/Máx" value="38.1 - 39.0" unit="°C" iconColor={theme.colors.textSecondary} />
          </View>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: '65%', backgroundColor: theme.colors.success }]} />
          </View>
          <Text style={styles.statusText}>Temperatura ideal. Nenhuma alteração febril detectada.</Text>
        </Card>

        <Card>
          <Text style={styles.sectionTitle}>Nível de Atividade</Text>
          <View style={styles.row}>
            <InfoCard label="Passos" value="4.250" iconColor={theme.colors.primary} />
            <InfoCard label="Calorias" value="180" unit="kcal" iconColor={theme.colors.warning} />
          </View>
          <Text style={styles.statusText}>Seu pet está 15% mais ativo do que ontem!</Text>
        </Card>

        <Card style={styles.tipsCard}>
          <Text style={[styles.sectionTitle, { color: theme.colors.white }]}>Dica de Saúde</Text>
          <Text style={styles.tipsText}>
            Lembre-se de manter a água sempre fresca, especialmente após períodos de alta atividade.
          </Text>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
  },
  sectionTitle: {
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
  statusText: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    lineHeight: 18,
    marginTop: theme.spacing.sm,
  },
  progressContainer: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    marginTop: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  tipsCard: {
    backgroundColor: theme.colors.primary,
    marginTop: theme.spacing.md,
  },
  tipsText: {
    color: theme.colors.white,
    opacity: 0.9,
    fontSize: 14,
    lineHeight: 20,
  },
});
