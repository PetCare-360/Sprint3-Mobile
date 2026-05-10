import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl, StatusBar, Dimensions} from 'react-native';
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

const { width } = Dimensions.get('window');

export const HomeScreen = () => {
  const { user } = useAuth();
  const { colors, spacing, typography, radius, shadows, isDark } = useTheme();
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

  const petName = localPet?.name || status?.name || 'Seu Pet';
  const petImage = localPet?.image 
    ? { uri: `data:image/png;base64,${localPet.image}` }
    : status?.image;

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <Header 
        title="Dashboard" 
        rightElement={
          <TouchableOpacity style={[styles.avatarButton, { ...shadows.sm }]}>
            {petImage ? (
              <Image 
                source={petImage} 
                style={[
                  styles.avatar, 
                  { 
                    borderRadius: radius.md, 
                    borderWidth: 2, 
                    borderColor: isDark ? colors.divider : colors.white 
                  }
                ]} 
              />
            ) : (
              <View style={[
                styles.avatarPlaceholder, 
                { 
                  backgroundColor: isDark ? colors.surface : colors.gray100, 
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: colors.divider
                }
              ]}>
                <MaterialCommunityIcons name="dog" size={20} color={colors.primary} />
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
          <Text style={[styles.welcomeLabel, { color: colors.primary, fontSize: 12 }]}>
            BEM-VINDO DE VOLTA
          </Text>
          <Text style={[styles.welcomeText, { color: colors.text, fontSize: typography.sizes.hg }]}>
            Olá, {localPet?.ownerName || user?.name || 'Tutor'}
          </Text>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: typography.sizes.md }]}>
              {petName} está <Text style={{ color: colors.success, fontWeight: 'bold' }}>saudável</Text> hoje!
            </Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: typography.sizes.lg }]}>
            Sinais Vitais
          </Text>
          <TouchableOpacity>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.vitalsGrid}>
          <InfoCard 
            label="Temperatura" 
            value={status?.temperature.toFixed(1) || '38.5'} 
            unit="°C"
            icon="thermometer"
            iconColor={colors.danger} 
          />
          <InfoCard 
            label="Batimentos" 
            value={status?.heartRate || '92'} 
            unit="bpm"
            icon="heart-pulse"
            iconColor={colors.secondary} 
          />
          <InfoCard 
            label="Atividade" 
            value={status?.activity || 'Alta'} 
            icon="run"
            iconColor={colors.success} 
          />
          <InfoCard 
            label="Bateria" 
            value={status?.battery || '84'} 
            unit="%"
            icon="battery-80"
            iconColor={colors.warning} 
          />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: typography.sizes.lg }]}>
            Última Localização
          </Text>
        </View>
        <Card variant="elevated" padding="md">
          <View style={styles.locationRow}>
            <View style={[
              styles.locationIcon, 
              { 
                backgroundColor: isDark ? colors.primary + '20' : colors.primary + '10', 
                borderRadius: radius.lg 
              }
            ]}>
              <MaterialCommunityIcons name="map-marker" size={24} color={colors.primary} />
            </View>
            <View style={styles.locationInfo}>
              <Text style={[styles.locationTitle, { color: colors.text, fontSize: typography.sizes.md }]}>Centro, São Paulo - SP</Text>
              <Text style={[styles.locationSubtitle, { color: colors.textSecondary, fontSize: typography.sizes.sm }]}>Visto pela última vez há 5 min</Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={24} color={colors.gray400} />
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text, fontSize: typography.sizes.lg }]}>
            Resumo Diário
          </Text>
        </View>
        <Card variant="glass" padding="lg">
          <View style={styles.summaryContent}>
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="walk" size={24} color={colors.primary} />
              <Text style={[styles.summaryValue, { color: colors.text }]}>2.5km</Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Caminhada</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.divider }]} />
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="sleep" size={24} color={colors.primary} />
              <Text style={[styles.summaryValue, { color: colors.text }]}>12h</Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Sono</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.divider }]} />
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="fire" size={24} color={colors.primary} />
              <Text style={[styles.summaryValue, { color: colors.text }]}>450</Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>kcal</Text>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
  },
  avatarButton: {
    width: 44,
    height: 44,
  },
  avatar: {
    width: 44,
    height: 44,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    marginBottom: 32,
    marginTop: 8,
  },
  welcomeLabel: {
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  welcomeText: {
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  subtitle: {
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationIcon: {
    width: 52,
    height: 52,
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
  locationSubtitle: {
    opacity: 0.8,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 8,
  },
});

