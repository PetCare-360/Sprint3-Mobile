import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { InfoCard } from '../components/InfoCard';
import { useTheme } from '../hooks/useTheme';

export const HealthScreen = () => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <Header title="Saúde" />
      <ScrollView style={styles.container} contentContainerStyle={[styles.content, { padding: spacing.lg }]}>
        <Card style={styles.vitalCard} variant="elevated">
          <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>RITMO CARDÍACO</Text>
          <View style={styles.vitalRow}>
            <InfoCard 
              label="Atual" 
              value="84" 
              unit="bpm" 
              icon="heart-pulse" 
              iconColor={colors.secondary} 
            />
            <InfoCard 
              label="Média" 
              value="78" 
              unit="bpm" 
              icon="chart-line" 
              iconColor={colors.textSecondary} 
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            O ritmo cardíaco de Max está dentro da faixa normal para o repouso.
          </Text>
        </Card>

        <Card style={styles.vitalCard} variant="elevated">
          <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>TEMPERATURA</Text>
          <View style={styles.vitalRow}>
            <InfoCard 
              label="Atual" 
              value="38.5" 
              unit="°C" 
              icon="thermometer" 
              iconColor={colors.success} 
            />
            <InfoCard 
              label="Média" 
              value="38.2" 
              unit="°C" 
              icon="history" 
              iconColor={colors.textSecondary} 
            />
          </View>
          <View style={[styles.progressContainer, { backgroundColor: colors.background }]}>
            <View style={[styles.progressBar, { width: '65%', backgroundColor: colors.success }]} />
          </View>
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            Temperatura estável. Nenhuma alteração detectada nas últimas 24h.
          </Text>
        </Card>

        <Card style={styles.vitalCard} variant="elevated">
          <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>ATIVIDADE</Text>
          <View style={styles.vitalRow}>
            <InfoCard 
              label="Passos" 
              value="4.250" 
              icon="walk" 
              iconColor={colors.primary} 
            />
            <InfoCard 
              label="Meta" 
              value="6.000" 
              icon="target" 
              iconColor={colors.warning} 
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>
            Max está mais ativo hoje do que ontem. Continue assim!
          </Text>
        </Card>

        <Card style={[styles.tipsCard, { backgroundColor: colors.primary }]}>
          <MaterialCommunityIcons name="lightbulb-on-outline" size={32} color="white" />
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>Dica de Saúde</Text>
            <Text style={styles.tipsText}>
              Mantenha a hidratação de Max constante em dias quentes para evitar flutuações na temperatura.
            </Text>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {},
  vitalCard: {
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 16,
    letterSpacing: 1,
  },
  vitalRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  statusText: {
    fontSize: 13,
    lineHeight: 18,
  },
  progressContainer: {
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  tipsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    marginTop: 8,
    borderWidth: 0,
  },
  tipsContent: {
    flex: 1,
    marginLeft: 16,
  },
  tipsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tipsText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 20,
  },
});
