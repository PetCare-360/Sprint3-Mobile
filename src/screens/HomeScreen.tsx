import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl, StatusBar, Dimensions} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../components/Card';
import { Header } from '../components/Header';
import { InfoCard } from '../components/InfoCard';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
import { useHomeData } from '../hooks/useHomeData';

const { width } = Dimensions.get('window');

export const HomeScreen = () => {
  const { user } = useAuth();
  const { colors, spacing, typography, radius, shadows, isDark } = useTheme();
  const { status, location, localPet, activitySummary, loading, loadData, petName, petImage } = useHomeData();

  if (loading && !status) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

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
            Olá, {user?.name || 'Tutor'}
          </Text>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: typography.sizes.md }]}>
              {petName} está <Text style={{ color: colors.success, fontWeight: 'bold' }}>{status?.status || 'sem dados'}</Text> hoje!
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
            value={status ? status.temperature.toFixed(1) : '-'} 
            unit="°C"
            icon="thermometer"
            iconColor={colors.danger} 
          />
          <InfoCard 
            label="Batimentos" 
            value={status?.heartRate || '-'} 
            unit="bpm"
            icon="heart-pulse"
            iconColor={colors.secondary} 
          />
          <InfoCard 
            label="Atividade" 
            value={status?.activity || '-'} 
            icon="run"
            iconColor={colors.success} 
          />
          <InfoCard 
            label="Bateria" 
            value={status?.battery || '-'} 
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
              <Text style={[styles.locationTitle, { color: colors.text, fontSize: typography.sizes.md }]}>
                {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Sem localização'}
              </Text>
              <Text style={[styles.locationSubtitle, { color: colors.textSecondary, fontSize: typography.sizes.sm }]}>
                {location ? `Atualizado em ${new Date(location.timestamp).toLocaleString()}` : 'Nenhuma leitura disponível'}
              </Text>
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
              <Text style={[styles.summaryValue, { color: colors.text }]}>{activitySummary?.averageActivityLevel ?? '-'}</Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Atividade média</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.divider }]} />
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="sleep" size={24} color={colors.primary} />
              <Text style={[styles.summaryValue, { color: colors.text }]}>{activitySummary?.averageHeartRate ?? '-'}</Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>BPM médio</Text>
            </View>
            <View style={[styles.summaryDivider, { backgroundColor: colors.divider }]} />
            <View style={styles.summaryItem}>
              <MaterialCommunityIcons name="fire" size={24} color={colors.primary} />
              <Text style={[styles.summaryValue, { color: colors.text }]}>{activitySummary?.readings ?? '-'}</Text>
              <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Leituras</Text>
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
