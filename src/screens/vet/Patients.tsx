import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { theme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { AlertService, RiskLevel } from '../../services/alertService';

interface Patient {
  id: string;
  name: string;
  breed: string;
  owner: string;
  heartRate: number;
  temperature: number;
  activity: 'Baixa' | 'Média' | 'Alta';
}

const mockPatients: Patient[] = [
  { id: '1', name: 'Max', breed: 'Golden Retriever', owner: 'Carlos Silva', heartRate: 140, temperature: 39.5, activity: 'Alta' },
  { id: '2', name: 'Luna', breed: 'Siamês', owner: 'Ana Oliveira', heartRate: 80, temperature: 38.5, activity: 'Baixa' },
  { id: '3', name: 'Thor', breed: 'Bulldog', owner: 'João Souza', heartRate: 110, temperature: 38.8, activity: 'Média' },
  { id: '4', name: 'Bella', breed: 'Poodle', owner: 'Maria Luz', heartRate: 135, temperature: 38.2, activity: 'Média' },
  { id: '5', name: 'Mike', breed: 'Beagle', owner: 'Pedro Rocha', heartRate: 90, temperature: 39.2, activity: 'Baixa' },
  { id: '6', name: 'Nina', breed: 'Persa', owner: 'Julia Costa', heartRate: 95, temperature: 38.4, activity: 'Alta' },
];

export const Patients = ({ navigation }: any) => {
  const [search, setSearch] = useState('');

  const filteredPatients = mockPatients.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.breed.toLowerCase().includes(search.toLowerCase())
  ).map(p => ({
    ...p,
    status: AlertService.calculateRiskLevel({
      temperature: p.temperature,
      heartRate: p.heartRate,
      activity: p.activity
    })
  })).sort((a, b) => {
    const priority = { critical: 0, warning: 1, stable: 2 };
    return priority[a.status as RiskLevel] - priority[b.status as RiskLevel];
  });

  const renderPatient = ({ item }: { item: any }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PetDetails', { petId: item.id })}>
      <Card style={styles.patientCard}>
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.patientName}>{item.name}</Text>
            <Text style={styles.patientBreed}>{item.breed} • {item.owner}</Text>
          </View>
          <View style={[styles.statusIndicator, { backgroundColor: AlertService.getStatusColor(item.status) }]} />
        </View>

        <View style={styles.vitalsRow}>
          <View style={styles.vitalBlock}>
            <MaterialCommunityIcons name="thermometer" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.vitalText}>{item.temperature}°C</Text>
          </View>
          <View style={styles.vitalBlock}>
            <MaterialCommunityIcons name="heart-pulse" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.vitalText}>{item.heartRate} bpm</Text>
          </View>
          <View style={styles.vitalBlock}>
            <MaterialCommunityIcons name="run" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.vitalText}>{item.activity}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={32} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Meus Pacientes</Text>
      </View>

      <View style={styles.searchContainer}>
        <MaterialCommunityIcons name="magnify" size={20} color={theme.colors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por nome ou raça..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor={theme.colors.textSecondary}
        />
      </View>

      <FlatList
        data={filteredPatients}
        keyExtractor={(item) => item.id}
        renderItem={renderPatient}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum paciente encontrado.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  backButton: {
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    marginHorizontal: theme.spacing.lg,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    height: 45,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: theme.spacing.sm,
    color: theme.colors.text,
    fontSize: 16,
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  patientCard: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.md,
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  patientBreed: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  vitalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.sm,
  },
  vitalBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vitalText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: theme.colors.textSecondary,
  },
});
