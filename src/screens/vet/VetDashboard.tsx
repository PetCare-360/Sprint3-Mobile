import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, StatusBar} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { AlertService } from '../../services/alertService';
import { PatientService } from '../../services/patientService';
import { useTheme } from '../../hooks/useTheme';
import { Pet, RiskLevel } from '../../types/pet';

export const VetDashboard = ({ navigation }: any) => {
  const { colors, spacing, typography, radius, shadows, isDark } = useTheme();
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

  const renderPatientCard = ({ item }: { item: typeof processedPatients[0] }) => {
    const statusColor = AlertService.getStatusColor(item.status!);
    
    return (
      <TouchableOpacity onPress={() => navigation.navigate('PetDetails', { petId: item.id })} activeOpacity={0.8}>
        <Card 
          style={[styles.patientCard, { borderLeftColor: statusColor, borderLeftWidth: 5 }]}
          variant="elevated"
          padding="md"
        >
          <View style={styles.patientMain}>
            <View style={[styles.patientIcon, { backgroundColor: statusColor + '10' }]}>
              <MaterialCommunityIcons name="dog" size={24} color={statusColor} />
            </View>
            <View style={styles.patientInfo}>
              <Text style={[styles.patientName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.patientBreed, { color: colors.textSecondary }]}>{item.breed}</Text>
            </View>
          </View>
          <View style={styles.patientStatus}>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>
                {item.status === 'stable' ? 'ESTÁVEL' : item.status!.toUpperCase()}
              </Text>
            </View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={colors.gray400} />
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

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
            <MaterialCommunityIcons name="cog-outline" size={24} color={colors.text} />
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
              <Text style={[styles.welcomeText, { color: colors.text }]}>Olá, Dr. Silva</Text>
              <Text style={[styles.welcomeSub, { color: colors.textSecondary }]}>Você tem {criticalCount} pacientes em estado crítico.</Text>
              
              <View style={styles.summaryGrid}>
                <Card style={styles.summaryCard} variant="elevated" padding="md">
                  <View style={styles.summaryContent}>
                    <View style={[styles.summaryIcon, { backgroundColor: colors.danger + '10' }]}>
                      <MaterialCommunityIcons name="alert-decagram" size={20} color={colors.danger} />
                    </View>
                    <Text style={[styles.summaryValue, { color: colors.text }]}>{criticalCount}</Text>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Críticos</Text>
                  </View>
                </Card>
                <Card style={styles.summaryCard} variant="elevated" padding="md">
                  <View style={styles.summaryContent}>
                    <View style={[styles.summaryIcon, { backgroundColor: colors.warning + '10' }]}>
                      <MaterialCommunityIcons name="alert-outline" size={20} color={colors.warning} />
                    </View>
                    <Text style={[styles.summaryValue, { color: colors.text }]}>{warningCount}</Text>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Alertas</Text>
                  </View>
                </Card>
                <Card style={styles.summaryCard} variant="elevated" padding="md">
                  <View style={styles.summaryContent}>
                    <View style={[styles.summaryIcon, { backgroundColor: colors.success + '10' }]}>
                      <MaterialCommunityIcons name="check-decagram" size={20} color={colors.success} />
                    </View>
                    <Text style={[styles.summaryValue, { color: colors.text }]}>{processedPatients.length - criticalCount - warningCount}</Text>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Estáveis</Text>
                  </View>
                </Card>
              </View>
            </View>

            <View style={[styles.sectionHeaderRow, { paddingHorizontal: spacing.lg, marginVertical: spacing.md }]}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Triagem de Risco</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Patients')}>
                <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 13 }}>VER TODOS</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <View style={[styles.emptyIconCircle, { backgroundColor: colors.divider + '20' }]}>
              <MaterialCommunityIcons name="dog-variant" size={48} color={colors.divider} />
            </View>
            <Text style={[styles.emptyText, { color: colors.text, fontWeight: 'bold', marginTop: 16 }]}>Nenhum paciente</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary, textAlign: 'center', marginTop: 4 }]}>Vincule pacientes para começar o monitoramento.</Text>
            <Button 
              title="Vincular Paciente" 
              onPress={() => navigation.navigate('Patients')}
              style={{ marginTop: 24, paddingHorizontal: 32 }}
            />
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
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  welcomeSub: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
  },
  summaryContainer: {
    marginBottom: 8,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    marginBottom: 0,
  },
  summaryContent: {
    alignItems: 'center',
  },
  summaryIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: -0.3,
  },
  listContent: {
    paddingBottom: 32,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  patientMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  patientIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  patientInfo: {
    flex: 1,
  },
  patientName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  patientBreed: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
  },
  patientStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  statusText: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
  },
  emptySub: {
    fontSize: 14,
  },
});

