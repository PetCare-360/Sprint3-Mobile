import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList } from 'react-native';
import { theme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { useAuth } from '../../context/AuthContext';
import { AlertService, RiskLevel } from '../../services/alertService';

// 1. Definição da interface para os dados mockados
interface Patient {
  id: string;
  name: string;
  breed: string;
  heartRate: number;
  temperature: number;
  activity: 'Baixa' | 'Média' | 'Alta';
  status?: RiskLevel;
}

// 2. Lista mockada de pets com dados clínicos
const mockPatients: Patient[] = [
  { id: '1', name: 'Max', breed: 'Golden Retriever', heartRate: 140, temperature: 39.5, activity: 'Alta' },
  { id: '2', name: 'Luna', breed: 'Siamês', heartRate: 80, temperature: 38.5, activity: 'Baixa' },
  { id: '3', name: 'Thor', breed: 'Bulldog', heartRate: 110, temperature: 38.8, activity: 'Média' },
  { id: '4', name: 'Bella', breed: 'Poodle', heartRate: 135, temperature: 38.2, activity: 'Média' },
  { id: '5', name: 'Mike', breed: 'Beagle', heartRate: 90, temperature: 39.2, activity: 'Baixa' },
];

export const VetDashboard = ({ navigation }: any) => {
  const { signOut } = useAuth();

  // Processamento dos pets usando o AlertService
  const processedPatients = mockPatients
    .map(p => ({ 
      ...p, 
      status: AlertService.calculateRiskLevel({ 
        temperature: p.temperature, 
        heartRate: p.heartRate, 
        activity: p.activity 
      }) 
    }))
    .sort((a, b) => {
      const priority = { critical: 0, warning: 1, stable: 2 };
      return priority[a.status!] - priority[b.status!];
    });

  const criticalCount = processedPatients.filter(p => p.status === 'critical').length;
  const warningCount = processedPatients.filter(p => p.status === 'warning').length;

  const handleSignOut = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair do sistema?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
          }
        }
      ]
    );
  };

  const renderPatientCard = ({ item }: { item: typeof processedPatients[0] }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PetDetails', { petId: item.id })}>
      <Card style={[styles.patientCard, { borderLeftColor: AlertService.getStatusColor(item.status!), borderLeftWidth: 5 }]}>
        <View style={styles.patientInfo}>
          <View>
            <Text style={styles.patientName}>{item.name}</Text>
            <Text style={styles.patientBreed}>{item.breed}</Text>
          </View>
          <View style={styles.vitalSigns}>
            <View style={styles.vitalItem}>
              <MaterialCommunityIcons name="thermometer" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.vitalValue}>{item.temperature}°C</Text>
            </View>
            <View style={styles.vitalItem}>
              <MaterialCommunityIcons name="heart-pulse" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.vitalValue}>{item.heartRate} bpm</Text>
            </View>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: AlertService.getStatusColor(item.status!) }]}>
          <Text style={styles.statusText}>{item.status === 'stable' ? 'ESTÁVEL' : item.status!.toUpperCase()}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.welcome}>Painel Clínico</Text>
          <Text style={styles.subtitle}>Triagem prioritária de pacientes</Text>
        </View>
        <TouchableOpacity onPress={handleSignOut} style={styles.logoutButton}>
          <MaterialCommunityIcons name="logout" size={24} color={theme.colors.danger} />
        </TouchableOpacity>
      </View>

      <View style={styles.summaryContainer}>
        <View style={[styles.summaryItem, { backgroundColor: theme.colors.danger + '20' }]}>
          <Text style={[styles.summaryValue, { color: theme.colors.danger }]}>{criticalCount}</Text>
          <Text style={styles.summaryLabel}>Críticos</Text>
        </View>
        <View style={[styles.summaryItem, { backgroundColor: theme.colors.warning + '20' }]}>
          <Text style={[styles.summaryValue, { color: theme.colors.warning }]}>{warningCount}</Text>
          <Text style={styles.summaryLabel}>Alertas</Text>
        </View>
        <View style={[styles.summaryItem, { backgroundColor: theme.colors.success + '20' }]}>
          <Text style={[styles.summaryValue, { color: theme.colors.success }]}>{processedPatients.length - criticalCount - warningCount}</Text>
          <Text style={styles.summaryLabel}>Estáveis</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Pacientes por Risco</Text>
      
      <FlatList
        data={processedPatients}
        keyExtractor={(item) => item.id}
        renderItem={renderPatientCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  logoutButton: {
    padding: theme.spacing.sm,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
  },
  summaryItem: {
    flex: 1,
    marginHorizontal: 4,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    paddingHorizontal: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  listContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  patientCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  patientBreed: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  vitalSigns: {
    flexDirection: 'row',
  },
  vitalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  vitalValue: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginLeft: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    color: theme.colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
});

