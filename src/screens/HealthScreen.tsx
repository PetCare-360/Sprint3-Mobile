import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { InfoCard } from '../components/InfoCard';
import { useTheme } from '../hooks/useTheme';

const { width } = Dimensions.get('window');

export const HealthScreen = () => {
  const { colors, spacing, typography, radius, isDark } = useTheme();

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <Header title="Saúde & Bem-estar" />
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={[styles.content, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerInfo}>
          <Text style={[styles.title, { color: colors.text }]}>Estado Geral</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Max está com todos os sinais vitais estáveis.
          </Text>
        </View>

        <Card style={styles.vitalCard} variant="elevated" padding="lg">
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: colors.secondary + '15' }]}>
              <MaterialCommunityIcons name="heart-pulse" size={20} color={colors.secondary} />
            </View>
            <Text style={[styles.sectionHeader, { color: colors.text }]}>Ritmo Cardíaco</Text>
          </View>
          <View style={styles.vitalRow}>
            <View style={styles.vitalItem}>
              <Text style={[styles.vitalLabel, { color: colors.textSecondary }]}>ATUAL</Text>
              <Text style={[styles.vitalValue, { color: colors.text }]}>84 <Text style={styles.vitalUnit}>bpm</Text></Text>
            </View>
            <View style={[styles.dividerVertical, { backgroundColor: colors.divider }]} />
            <View style={styles.vitalItem}>
              <Text style={[styles.vitalLabel, { color: colors.textSecondary }]}>MÉDIA</Text>
              <Text style={[styles.vitalValue, { color: colors.textSecondary }]}>78 <Text style={styles.vitalUnit}>bpm</Text></Text>
            </View>
          </View>
          <View style={[styles.statusBox, { backgroundColor: colors.divider + '40' }]}>
            <MaterialCommunityIcons name="information-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.statusText, { color: colors.textSecondary }]}>
              Dentro da faixa normal para o repouso.
            </Text>
          </View>
        </Card>

        <Card style={styles.vitalCard} variant="elevated" padding="lg">
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: colors.success + '15' }]}>
              <MaterialCommunityIcons name="thermometer" size={20} color={colors.success} />
            </View>
            <Text style={[styles.sectionHeader, { color: colors.text }]}>Temperatura</Text>
          </View>
          <View style={styles.vitalRow}>
            <View style={styles.vitalItem}>
              <Text style={[styles.vitalLabel, { color: colors.textSecondary }]}>ATUAL</Text>
              <Text style={[styles.vitalValue, { color: colors.text }]}>38.5 <Text style={styles.vitalUnit}>°C</Text></Text>
            </View>
            <View style={[styles.dividerVertical, { backgroundColor: colors.divider }]} />
            <View style={styles.vitalItem}>
              <Text style={[styles.vitalLabel, { color: colors.textSecondary }]}>MÉDIA</Text>
              <Text style={[styles.vitalValue, { color: colors.textSecondary }]}>38.2 <Text style={styles.vitalUnit}>°C</Text></Text>
            </View>
          </View>
          <View style={styles.progressWrapper}>
            <View style={styles.progressLabels}>
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>Estável</Text>
              <Text style={[styles.progressText, { color: colors.textSecondary }]}>100%</Text>
            </View>
            <View style={[styles.progressContainer, { backgroundColor: isDark ? colors.divider : colors.gray100 }]}>
              <View style={[styles.progressBar, { width: '85%', backgroundColor: colors.success }]} />
            </View>
          </View>
        </Card>

        <Card style={styles.vitalCard} variant="elevated" padding="lg">
          <View style={styles.cardHeader}>
            <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
              <MaterialCommunityIcons name="run" size={20} color={colors.primary} />
            </View>
            <Text style={[styles.sectionHeader, { color: colors.text }]}>Atividade Diária</Text>
          </View>
          <View style={styles.vitalRow}>
            <View style={styles.vitalItem}>
              <Text style={[styles.vitalLabel, { color: colors.textSecondary }]}>PASSOS</Text>
              <Text style={[styles.vitalValue, { color: colors.text }]}>4.250</Text>
            </View>
            <View style={[styles.dividerVertical, { backgroundColor: colors.divider }]} />
            <View style={styles.vitalItem}>
              <Text style={[styles.vitalLabel, { color: colors.textSecondary }]}>META</Text>
              <Text style={[styles.vitalValue, { color: colors.warning }]}>6.000</Text>
            </View>
          </View>
          <View style={[styles.progressContainer, { backgroundColor: isDark ? colors.divider : colors.gray100, marginTop: 12 }]}>
            <View style={[styles.progressBar, { width: '70%', backgroundColor: colors.primary }]} />
          </View>
        </Card>

        <Card style={[styles.tipsCard, { backgroundColor: colors.primary }]} variant="glass">
          <View style={styles.tipsIconContainer}>
            <MaterialCommunityIcons name="lightbulb-variant-outline" size={28} color="white" />
          </View>
          <View style={styles.tipsContent}>
            <Text style={styles.tipsTitle}>Dica de Saúde</Text>
            <Text style={styles.tipsText}>
              Mantenha a hidratação de Max constante em dias quentes para evitar flutuações.
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
  vitalCard: {
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: -0.3,
  },
  vitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  vitalItem: {
    flex: 1,
  },
  vitalLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  vitalValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  vitalUnit: {
    fontSize: 12,
    fontWeight: '500',
  },
  dividerVertical: {
    width: 1,
    height: 40,
    marginHorizontal: 16,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    marginLeft: 8,
    fontWeight: '500',
  },
  progressWrapper: {
    marginTop: 8,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 11,
    fontWeight: '600',
  },
  progressContainer: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  tipsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 0,
  },
  tipsIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tipsContent: {
    flex: 1,
    marginLeft: 16,
  },
  tipsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  tipsText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    lineHeight: 18,
  },
});

