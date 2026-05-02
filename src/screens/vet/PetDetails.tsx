import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { theme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { InfoCard } from '../../components/InfoCard';
import { Card } from '../../components/Card';
import { ApiService, PetStatus } from '../../services/api';

export const PetDetails = ({ route }: any) => {
  const { petId } = route.params || { petId: '1' };
  const [pet, setPet] = useState<PetStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPetDetails();
  }, []);

  const fetchPetDetails = async () => {
    try {
      const data = await ApiService.getPetStatus(petId);
      setPet(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!pet) return null;

  const history = [
    { date: '10/04/2026', type: 'Vacina', description: 'Antirrábica aplicada.' },
    { date: '25/03/2026', type: 'Consulta', description: 'Check-up anual, tudo normal.' },
    { date: '15/02/2026', type: 'Exame', description: 'Hemograma completo realizado.' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image 
          source={typeof pet.image === 'string' ? { uri: pet.image } : pet.image} 
          style={styles.image} 
        />
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{pet.name}</Text>
          <Text style={styles.breed}>{pet.breed}</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}><Text style={styles.badgeText}>4 anos</Text></View>
            <View style={styles.badge}><Text style={styles.badgeText}>32kg</Text></View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Sinais Vitais (Real-time)</Text>
        <View style={styles.vitalsGrid}>
          <InfoCard 
            label="Temperatura" 
            value={pet.temperature.toFixed(1)} 
            unit="°C"
            iconColor={theme.colors.danger} 
          />
          <InfoCard 
            label="Batimentos" 
            value={pet.heartRate} 
            unit="bpm"
            iconColor={theme.colors.secondary} 
          />
          <InfoCard 
            label="Atividade" 
            value={pet.activity} 
            iconColor={theme.colors.success} 
          />
        </View>

        <Text style={styles.sectionTitle}>Histórico Clínico</Text>
        {history.map((item, index) => (
          <View key={index} style={styles.historyItem}>
            <Card>
              <View style={styles.historyRow}>
                <View style={styles.historyIcon}>
                  <MaterialCommunityIcons 
                    name={item.type === 'Vacina' ? 'needle' : item.type === 'Exame' ? 'test-tube' : 'stethoscope'} 
                    size={24} 
                    color={theme.colors.primary} 
                  />
                </View>
                <View style={styles.historyContent}>
                  <View style={styles.historyHeader}>
                    <Text style={styles.historyType}>{item.type}</Text>
                    <Text style={styles.historyDate}>{item.date}</Text>
                  </View>
                  <Text style={styles.historyDesc}>{item.description}</Text>
                </View>
              </View>
            </Card>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: theme.borderRadius.lg,
  },
  headerInfo: {
    flex: 1,
    marginLeft: theme.spacing.lg,
    justifyContent: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  breed: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
  },
  badge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    marginRight: theme.spacing.sm,
  },
  badgeText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: theme.spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  vitalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xl,
  },
  historyItem: {
    marginBottom: theme.spacing.sm,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  historyContent: {
    flex: 1,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  historyType: {
    fontSize: 14,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  historyDate: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  historyDesc: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
});
