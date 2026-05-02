import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar } from 'react-native';
import { useAppTheme } from '../context/ThemeContext';
import { Card } from '../components/Card';
import { InfoCard } from '../components/InfoCard';

export const HealthScreen = () => {
  const { theme, isDark } = useAppTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Saúde</Text>
        </View>
        
        <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>RITMO CARDÍACO</Text>
        <Card>
          <View style={styles.row}>
            <InfoCard 
              label="Atual" 
              value="110" 
              unit="bpm" 
              icon="heart-pulse"
              iconColor={theme.colors.secondary} 
            />
            <InfoCard 
              label="Média (24h)" 
              value="105" 
              unit="bpm" 
              icon="chart-bell-curve"
              iconColor={theme.colors.textSecondary} 
            />
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
            O ritmo cardíaco está estável e dentro da normalidade para um pet desta raça.
          </Text>
        </Card>

        <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>TEMPERATURA</Text>
        <Card>
          <View style={styles.row}>
            <InfoCard 
              label="Atual" 
              value="38.5" 
              unit="°C" 
              icon="thermometer"
              iconColor={theme.colors.success} 
            />
            <InfoCard 
              label="Mín/Máx" 
              value="38.1 - 39" 
              unit="°C" 
              icon="arrow-up-down"
              iconColor={theme.colors.textSecondary} 
            />
          </View>
          <View style={[styles.progressContainer, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.progressBar, { width: '65%', backgroundColor: theme.colors.success }]} />
          </View>
          <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
            Temperatura ideal. Nenhuma alteração febril detectada.
          </Text>
        </Card>

        <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>ATIVIDADE</Text>
        <Card>
          <View style={styles.row}>
            <InfoCard 
              label="Passos" 
              value="4.250" 
              icon="walk"
              iconColor={theme.colors.primary} 
            />
            <InfoCard 
              label="Calorias" 
              value="180" 
              unit="kcal" 
              icon="fire"
              iconColor={theme.colors.warning} 
            />
          </View>
          <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
          <Text style={[styles.statusText, { color: theme.colors.textSecondary }]}>
            Seu pet está 15% mais ativo do que ontem!
          </Text>
        </Card>

        <Card style={[styles.tipsCard, { backgroundColor: theme.colors.primary }]}>
          <Text style={[styles.tipsTitle, { color: '#FFF' }]}>Dica de Saúde</Text>
          <Text style={[styles.tipsText, { color: '#FFF' }]}>
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
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 16,
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  statusText: {
    fontSize: 14,
    lineHeight: 20,
  },
  progressContainer: {
    height: 8,
    borderRadius: 4,
    marginTop: 16,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  tipsCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tipsText: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.9,
  },
});
