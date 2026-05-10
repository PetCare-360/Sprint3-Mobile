import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert as RNAlert, Image, StatusBar } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { InfoCard } from '../../components/InfoCard';
import { AlertService } from '../../services/alertService';
import { PatientService } from '../../services/patientService';
import { useTheme } from '../../hooks/useTheme';
import { Pet, RiskLevel, VitalSigns } from '../../types/pet';
import { Alert } from '../../services/alertService';

interface PatientDetail extends Pet {
  phone: string;
  age: string;
  weight: string;
}

const mockExtraInfo = {
  phone: '(11) 98765-4321',
  age: '4 anos',
  weight: '32kg',
};

interface HistoryEvent {
  id: string;
  date: string;
  type: 'consulta' | 'vacina' | 'exame' | 'cirurgia';
  description: string;
  vet: string;
}

export const PetDetails = ({ route, navigation }: any) => {
  const { petId } = route.params;
  const [pet, setPet] = useState<PatientDetail | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [status, setStatus] = useState<RiskLevel>('stable');
  const { colors, radius, shadows, isDark, spacing } = useTheme();
  
  const [history, setHistory] = useState<HistoryEvent[]>([
    { id: '1', date: '10/04/2026', type: 'vacina', description: 'Aplicação de reforço da V10 e Raiva.', vet: 'Dra. Marina Silva' },
    { id: '2', date: '22/03/2026', type: 'exame', description: 'Hemograma completo. Leve anemia detectada.', vet: 'Dr. Ricardo Lima' },
    { id: '3', date: '15/01/2026', type: 'consulta', description: 'Check-up de rotina. Peso estável.', vet: 'Dra. Marina Silva' },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'consulta' | 'vacina' | 'exame' | 'cirurgia'>('consulta');

  useEffect(() => {
    async function loadPet() {
      const patients = await PatientService.getPatients();
      const found = patients.find(p => p.id === petId);
      if (found) {
        setPet({ ...found, ...mockExtraInfo });
        const vitals: VitalSigns = { 
          temperature: found.temperature, 
          heartRate: found.heartRate, 
          activity: found.activity 
        };
        setAlerts(AlertService.getVitalsAlerts(vitals));
        setStatus(AlertService.calculateRiskLevel(vitals));
      }
    }
    loadPet();
  }, [petId]);

  if (!pet) return null;

  const handleAddEvolution = () => {
    if (!newNote.trim()) {
      RNAlert.alert('Erro', 'Por favor, descreva a evolução clínica.');
      return;
    }

    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    const newEvent: HistoryEvent = {
      id: Math.random().toString(),
      date: formattedDate,
      type: noteType,
      description: newNote,
      vet: 'Dr. Veterinário (Você)',
    };

    setHistory([newEvent, ...history]);
    setIsModalVisible(false);
    setNewNote('');
    RNAlert.alert('Sucesso', 'Evolução clínica registrada com sucesso.');
  };

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'vacina': return 'needle';
      case 'exame': return 'test-tube';
      case 'cirurgia': return 'hospital-building';
      default: return 'stethoscope';
    }
  };

  const statusColor = AlertService.getStatusColor(status);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Ficha do Paciente" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard} variant="elevated" padding="lg">
          <View style={styles.profileHeader}>
            <View style={styles.imageContainer}>
              <Image source={pet.image} style={[styles.petImage, { borderRadius: radius.xl }]} />
              <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.petName, { color: colors.text }]}>{pet.name}</Text>
              <Text style={[styles.petBreed, { color: colors.textSecondary }]}>{pet.breed}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>{status.toUpperCase()}</Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.detailsGrid, { borderTopColor: colors.divider }]}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>TUTOR</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{pet.owner}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>CONTATO</Text>
              <Text style={[styles.detailValue, { color: colors.primary }]}>{pet.phone}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>IDADE</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{pet.age}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>PESO</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{pet.weight}</Text>
            </View>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Sinais Vitais</Text>
          <Text style={[styles.lastUpdate, { color: colors.textSecondary }]}>Atualizado agora</Text>
        </View>
        <View style={styles.vitalsGrid}>
          <InfoCard 
            label="Temperatura" 
            value={pet.temperature.toFixed(1)} 
            unit="°C" 
            icon="thermometer" 
            iconColor={colors.danger} 
          />
          <InfoCard 
            label="Batimentos" 
            value={pet.heartRate} 
            unit="bpm" 
            icon="heart-pulse" 
            iconColor={colors.primary} 
          />
        </View>

        {alerts.length > 0 && (
          <View style={styles.alertsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>Alertas de Saúde</Text>
            {alerts.map((alert) => (
              <Card 
                key={alert.id} 
                variant="flat" 
                padding="md" 
                style={[styles.alertCard, { borderLeftColor: AlertService.getStatusColor(alert.severity), borderLeftWidth: 4 }]}
              >
                <View style={styles.alertContent}>
                  <View style={[styles.alertIcon, { backgroundColor: AlertService.getStatusColor(alert.severity) + '15' }]}>
                    <MaterialCommunityIcons name={alert.icon as any} size={20} color={AlertService.getStatusColor(alert.severity)} />
                  </View>
                  <Text style={[styles.alertMessage, { color: colors.text }]}>{alert.message}</Text>
                </View>
              </Card>
            ))}
          </View>
        )}

        <View style={styles.historySection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Prontuário</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
              <MaterialCommunityIcons name="plus-circle" size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.timeline}>
            {history.map((item, index) => (
              <View key={item.id} style={styles.timelineItem}>
                <View style={styles.timelineLeft}>
                  <View style={[styles.timelineIcon, { backgroundColor: isDark ? colors.surface : colors.gray50, borderColor: colors.divider }]}>
                    <MaterialCommunityIcons name={getHistoryIcon(item.type) as any} size={18} color={colors.primary} />
                  </View>
                  {index !== history.length - 1 && <View style={[styles.timelineLine, { backgroundColor: colors.divider }]} />}
                </View>
                <Card style={styles.timelineContent} variant="flat" padding="md">
                  <View style={styles.timelineHeader}>
                    <Text style={[styles.timelineDate, { color: colors.textSecondary }]}>{item.date}</Text>
                    <View style={[styles.typeBadge, { backgroundColor: colors.primary + '10' }]}>
                      <Text style={[styles.typeText, { color: colors.primary }]}>{item.type.toUpperCase()}</Text>
                    </View>
                  </View>
                  <Text style={[styles.timelineDesc, { color: colors.text }]}>{item.description}</Text>
                  <View style={styles.timelineFooter}>
                    <MaterialCommunityIcons name="account-tie" size={14} color={colors.textSecondary} />
                    <Text style={[styles.timelineVet, { color: colors.textSecondary }]}>{item.vet}</Text>
                  </View>
                </Card>
              </View>
            ))}
          </View>
        </View>

        <Button 
          title="Adicionar Evolução" 
          icon={<MaterialCommunityIcons name="pencil" size={20} color="white" />}
          onPress={() => setIsModalVisible(true)}
          style={{ marginTop: 20 }}
        />
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Nova Evolução</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)} style={styles.closeBtn}>
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>TIPO DE ATENDIMENTO</Text>
            <View style={styles.typeSelector}>
              {(['consulta', 'vacina', 'exame', 'cirurgia'] as const).map((type) => (
                <TouchableOpacity 
                  key={type}
                  style={[
                    styles.typeChip, 
                    { backgroundColor: isDark ? colors.surface : colors.gray50, borderColor: colors.divider },
                    noteType === type && { backgroundColor: colors.primary, borderColor: colors.primary }
                  ]}
                  onPress={() => setNoteType(type)}
                >
                  <Text style={[
                    styles.typeChipText,
                    { color: colors.textSecondary },
                    noteType === type && { color: colors.white }
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>OBSERVAÇÕES CLÍNICAS</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: isDark ? colors.background : colors.gray50, color: colors.text, borderColor: colors.divider }]}
              multiline
              numberOfLines={4}
              placeholder="Descreva aqui o estado do pet..."
              value={newNote}
              onChangeText={setNewNote}
              placeholderTextColor={colors.textSecondary}
            />

            <Button 
              title="Salvar Prontuário" 
              onPress={handleAddEvolution}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
  },
  petImage: {
    width: 80,
    height: 80,
    marginRight: 20,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 20,
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  petBreed: {
    fontSize: 14,
    marginBottom: 6,
    opacity: 0.7,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    paddingTop: 20,
  },
  detailItem: {
    width: '50%',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: -0.3,
  },
  lastUpdate: {
    fontSize: 12,
    fontWeight: '500',
  },
  vitalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  alertsSection: {
    marginBottom: 24,
  },
  alertCard: {
    marginBottom: 12,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  alertMessage: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    lineHeight: 20,
  },
  historySection: {
    marginBottom: 16,
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 12,
    width: 36,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    zIndex: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: -2,
    zIndex: 1,
  },
  timelineContent: {
    flex: 1,
    marginBottom: 16,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  timelineDate: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  timelineDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  timelineFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineVet: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  closeBtn: {
    padding: 4,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 8,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  typeChipText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  textInput: {
    borderRadius: 16,
    padding: 16,
    fontSize: 15,
    textAlignVertical: 'top',
    height: 120,
    marginBottom: 24,
    borderWidth: 1,
  },
});

