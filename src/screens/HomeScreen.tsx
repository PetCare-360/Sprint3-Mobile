import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView, 
  ActivityIndicator, 
  RefreshControl,
  Image,
  StatusBar
} from 'react-native';
import { Card } from '../components/Card';
import { InfoCard } from '../components/InfoCard';
import { ApiService, PetStatus } from '../services/api';
import { StorageService, PetData } from '../storage';
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const HomeScreen = () => {
  const { theme, isDark } = useAppTheme();
  const { user } = useAuth();
  const [status, setStatus] = useState<PetStatus | null>(null);
  const [petData, setPetData] = useState<PetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [statusData, localPetData] = await Promise.all([
        ApiService.getPetStatus('1'),
        StorageService.getPetData()
      ]);
      setStatus(statusData);
      setPetData(localPetData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const isCritical = status?.heartRate && status.heartRate > 120;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView 
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={theme.colors.primary} 
          />
        }
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.welcomeText, { color: theme.colors.text }]}>
              Olá, {user?.name.split(' ')[0] || 'Pet Lover'}! 🐾
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
              {petData?.name || 'Seu pet'} está {isCritical ? 'precisando de atenção' : 'bem agora'}.
            </Text>
          </View>
          {petData?.image ? (
            <Image 
              source={{ uri: `data:image/png;base64,${petData.image}` }} 
              style={styles.avatar} 
            />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.colors.card }]}>
              <Text style={{ fontSize: 24 }}>🐶</Text>
            </View>
          )}
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Sinais Vitais</Text>
        
        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <InfoCard 
              label="Temperatura" 
              value={status?.temperature.toFixed(1) || '--'} 
              unit="°C" 
              icon="thermometer"
              iconColor={theme.colors.danger} 
            />
          </Card>
          <Card style={styles.statCard}>
            <InfoCard 
              label="Batimentos" 
              value={status?.heartRate.toString() || '--'} 
              unit="bpm" 
              icon="heart-pulse"
              iconColor={theme.colors.secondary} 
            />
          </Card>
        </View>

        <View style={styles.statsGrid}>
          <Card style={styles.statCard}>
            <InfoCard 
              label="Atividade" 
              value={status?.activity || '--'} 
              icon="run"
              iconColor={theme.colors.success} 
            />
          </Card>
          <Card style={styles.statCard}>
            <InfoCard 
              label="Bateria" 
              value={status?.battery.toString() || '--'} 
              unit="%" 
              icon="battery-80"
              iconColor={theme.colors.warning} 
            />
          </Card>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Localização</Text>
        <Card style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <View style={[styles.locationIcon, { backgroundColor: theme.colors.primary + '15' }]}>
              <Text style={{ fontSize: 20 }}>📍</Text>
            </View>
            <View>
              <Text style={[styles.locationTitle, { color: theme.colors.text }]}>Centro, São Paulo - SP</Text>
              <Text style={[styles.locationSubtitle, { color: theme.colors.textSecondary }]}>Visto pela última vez às 10:30</Text>
            </View>
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Resumo Diário</Text>
        <Card>
          <Text style={[styles.summaryText, { color: theme.colors.text }]}>
            Seu pet caminhou <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>2.5km</Text> hoje e dormiu <Text style={{ fontWeight: 'bold', color: theme.colors.primary }}>12 horas</Text>.
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 10,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: '500',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#FFF',
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: 12,
  },
  locationCard: {
    padding: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  locationSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
  },
});
