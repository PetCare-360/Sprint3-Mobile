import React, { useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  ActivityIndicator, 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { AlertService } from '../../services/alertService';
import { PatientService } from '../../services/patientService';
import { useTheme } from '../../hooks/useTheme';
import { Pet, RiskLevel } from '../../types/pet';

export const VetDashboard = ({ navigation }: any) => {
  const { colors, spacing, typography, radius } = useTheme();
  const [patients, setPatients] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      const data = await PatientService.getPatients();
      setPatients(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );

  const processedPatients = patients
    .map(p => ({ 
      ...p, 
      status: AlertService.calculateRiskLevel({ 
        temperature: p.temperature, 
        heartRate: p.heartRate, 
        activity: p.activity 
      }) 
    }))
    .sort((a, b) => {
      const priority: Record<RiskLevel, number> = { critical: 0, warning: 1, stable: 2 };
      return priority[a.status!] - priority[b.status!];
    });

  const criticalCount = processedPatients.filter(p => p.status === 'critical').length;
  const warningCount = processedPatients.filter(p => p.status === 'warning').length;

  const renderPatientCard = ({ item }: { item: typeof processedPatients[0] }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PetDetails', { petId: item.id })} activeOpacity={0.7}>
      <Card 
        style={[styles.patientCard, { borderLeftColor: AlertService.getStatusColor(item.status!), borderLeftWidth: 6 }]}
        variant="elevated"
        padding="md"
      >
        <View style={styles.patientInfo}>
          <Text style={[styles.patientName, { color: colors.text, fontSize: typography.sizes.md }]}>{item.name}</Text>
          <Text style={[styles.patientBreed, { color: colors.textSecondary, fontSize: typography.sizes.sm }]}>{item.breed}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: AlertService.getStatusColor(item.status!) + '20' }]}>
          <Text style={[styles.statusText, { color: AlertService.getStatusColor(item.status!) }]}>
            {item.status === 'stable' ? 'OK' : item.status!.toUpperCase()}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header 
        title="Painel Clínico" 
        rightElement={
          <TouchableOpacity 
            onPress={() => navigation.navigate('Settings')} 
            style={styles.settingsButton}
          >
            <MaterialCommunityIcons name="cog-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        }
      />

      <FlatList
        data={processedPatients}
        keyExtractor={(item) => item.id}
        renderItem={renderPatientCard}
        ListHeaderComponent={
          <>
            <View style={[styles.summaryContainer, { paddingHorizontal: spacing.lg, marginTop: spacing.md }]}>
              <Card style={styles.summaryCard} variant="elevated" padding="md">
                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: colors.danger }]}>{criticalCount}</Text>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Críticos</Text>
                  </View>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: colors.warning }]}>{warningCount}</Text>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Alertas</Text>
                  </View>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                  <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: colors.success }]}>{processedPatients.length - criticalCount - warningCount}</Text>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Estáveis</Text>
                  </View>
                </View>
              </Card>
            </View>

            <View style={[styles.sectionHeaderRow, { paddingHorizontal: spacing.lg, marginVertical: spacing.md }]}>
              <Text style={[styles.sectionTitle, { color: colors.text, fontSize: typography.sizes.lg }]}>Triagem de Risco</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Patients')}>
                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Ver Todos</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="dog-variant" size={48} color={colors.border} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Nenhum paciente vinculado.</Text>
            <TouchableOpacity 
              style={[styles.emptyButton, { backgroundColor: colors.primary, marginTop: spacing.md, borderRadius: radius.md }]}
              onPress={() => navigation.navigate('Patients')}
            >
              <Text style={styles.emptyButtonText}>Vincular Paciente</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsButton: {
    padding: 8,
  },
  summaryContainer: {
    marginBottom: 8,
  },
  summaryCard: {
    marginBottom: 0,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: 30,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 32,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontWeight: 'bold',
  },
  patientBreed: {
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
