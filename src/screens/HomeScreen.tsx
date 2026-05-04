import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  RefreshControl,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { InfoCard } from '../components/InfoCard';
import { useAuth } from '../context/AuthContext';
import { ApiService } from '../services/api';
import { StorageService, PetData } from '../storage';
import { useTheme } from '../hooks/useTheme';
import { useFocusEffect } from '@react-navigation/native';
import { Pet } from '../types/pet';

export const HomeScreen = () => {
  const { user } = useAuth();
  const { colors, spacing, typography, radius, shadows } = useTheme();
  const [status, setStatus] = useState<Pet | null>(null);
  const [localPet, setLocalPet] = useState<PetData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [apiStatus, storedPet] = await Promise.all([
        ApiService.getPetStatus('1'),
        StorageService.getPetData()
      ]);
      setStatus(apiStatus);
      setLocalPet(storedPet);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  if (loading && !status) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const petName = localPet?.name || status?.name;
  const petImage = localPet?.image 
    ? { uri: `data:image/png;base64,${localPet.image}` }
    : status?.image;

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <Header 
        title="Início" 
        rightElement={
          <TouchableOpacity style={[styles.avatarButton, { ...shadows.sm }]}>
            {petImage ? (
              <Image source={petImage} style={[styles.avatar, { borderRadius: radius.round, borderWidth: 2, borderColor: colors.white }]} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: radius.round }]}>
                <MaterialCommunityIcons name="dog" size={24} color={colors.white} />
              </View>
            )}
          </TouchableOpacity>
        }
      />

      <ScrollView 
        style={styles.container}
        contentContainerStyle={{ padding: spacing.lg }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={loading} 
            onRefresh={loadData} 
            tintColor={colors.primary} 
          />
        }
      >
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeText, { color: colors.text, fontSize: typography.sizes.xxl }]}>
            Olá, {localPet?.ownerName || user?.name || 'Tutor'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: typography.sizes.md }]}>
            {petName} está bem hoje! 🐾
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: typography.sizes.lg, marginBottom: spacing.md }]}>
          Sinais Vitais
        </Text>
        <View style={styles.vitalsGrid}>
          <InfoCard 
            label="Temperatura" 
            value={status?.temperature.toFixed(1) || '0'} 
            unit="°C"
            icon="thermometer"
            iconColor={colors.danger} 
          />
          <InfoCard 
            label="Batimentos" 
            value={status?.heartRate || '0'} 
            unit="bpm"
            icon="heart-pulse"
            iconColor={colors.secondary} 
          />
          <InfoCard 
            label="Atividade" 
            value={status?.activity || 'N/A'} 
            icon="run"
            iconColor={colors.success} 
          />
          <InfoCard 
            label="Bateria" 
            value={status?.battery || '0'} 
            unit="%"
            icon="battery-80"
            iconColor={colors.warning} 
          />
        </View>

        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: typography.sizes.lg, marginBottom: spacing.md }]}>
          Localização
        </Text>
        <Card style={{ marginBottom: spacing.lg }} padding="md">
          <View style={styles.locationRow}>
            <View style={[styles.locationIcon, { backgroundColor: colors.primary + '15', borderRadius: radius.md }]}>
              <MaterialCommunityIcons name="map-marker" size={24} color={colors.primary} />
            </View>
            <View style={styles.locationInfo}>
              <Text style={[styles.locationTitle, { color: colors.text, fontSize: typography.sizes.md }]}>Centro, São Paulo - SP</Text>
              <Text style={[styles.locationSubtitle, { color: colors.textSecondary, fontSize: typography.sizes.sm }]}>Visto pela última vez às 10:30</Text>
            </View>
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.text, fontSize: typography.sizes.lg, marginBottom: spacing.md }]}>
          Resumo Diário
        </Text>
        <Card variant="flat" padding="md">
          <Text style={[styles.summaryText, { color: colors.text, fontSize: typography.sizes.md }]}>
            Seu pet caminhou <Text style={{ fontWeight: 'bold', color: colors.primary }}>2.5km</Text> hoje e dormiu <Text style={{ fontWeight: 'bold', color: colors.primary }}>12 horas</Text>.
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  avatarButton: {
    width: 40,
    height: 40,
  },
  avatar: {
    width: 40,
    height: 40,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontWeight: 'bold',
  },
  subtitle: {
    marginTop: 2,
    fontWeight: '500',
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  locationSubtitle: {},
  summaryText: {
    lineHeight: 22,
  },
});
