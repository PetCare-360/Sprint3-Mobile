import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert as RNAlert, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { Header } from '../../components/Header';
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
  const { colors, radius } = useTheme();
  
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

  const renderVitalCard = (label: string, value: string, icon: string, color: string) => (
    <View style={styles.vitalCardWrapper}>
      <Card style={styles.vitalCard}>
        <MaterialCommunityIcons name={icon as any} size={24} color={color} />
        <Text style={[styles.vitalValue, { color: colors.text }]}>{value}</Text>
        <Text style={[styles.vitalLabel, { color: colors.textSecondary }]}>{label}</Text>
      </Card>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Ficha Clínica" showBack onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard} variant="elevated">
          <View style={styles.profileHeader}>
            <Image source={pet.image} style={[styles.petImage, { borderRadius: radius.lg }]} />
            <View style={styles.profileInfo}>
              <Text style={[styles.petName, { color: colors.text }]}>{pet.name}</Text>
              <Text style={[styles.petBreed, { color: colors.textSecondary }]}>{pet.breed}</Text>
              <View style={[styles.statusBadge, { backgroundColor: AlertService.getStatusColor(status) + '20' }]}>
                <Text style={[styles.statusText, { color: AlertService.getStatusColor(status) }]}>{status.toUpperCase()}</Text>
              </View>
            </View>
          </View>
          
          <View style={[styles.detailsGrid, { borderTopColor: colors.border }]}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Tutor</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{pet.owner}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Telefone</Text>
              <Text style={[styles.detailValue, { color: colors.primary }]}>{pet.phone}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Idade</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{pet.age}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Peso</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{pet.weight}</Text>
            </View>
          </View>
        </Card>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Sinais Vitais</Text>
        <View style={styles.vitalsGrid}>
          {renderVitalCard('Temperatura', `${pet.temperature.toFixed(1)}°C`, 'thermometer', colors.danger)}
          {renderVitalCard('Batimentos', `${pet.heartRate} bpm`, 'heart-pulse', colors.primary)}
          {renderVitalCard('Atividade', pet.activity, 'run', colors.success)}
        </View>

        {alerts.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Alertas Detectados</Text>
            {alerts.map((alert) => (
              <Card key={alert.id} style={[styles.alertCard, { borderLeftColor: AlertService.getStatusColor(alert.severity), borderLeftWidth: 4 }]}>
                <View style={styles.alertContent}>
                  <MaterialCommunityIcons name={alert.icon as any} size={24} color={AlertService.getStatusColor(alert.severity)} />
                  <Text style={[styles.alertMessage, { color: colors.text }]}>{alert.message}</Text>
                </View>
              </Card>
            ))}
          </>
        )}

        <View style={styles.historySection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Linha do Tempo</Text>
          {history.map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineIcon, { backgroundColor: colors.primary + '15' }]}>
                  <MaterialCommunityIcons name={getHistoryIcon(item.type) as any} size={20} color={colors.primary} />
                </View>
                {index !== history.length - 1 && <View style={[styles.timelineLine, { backgroundColor: colors.border }]} />}
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={[styles.timelineDate, { color: colors.text }]}>{item.date}</Text>
                  <Text style={[styles.timelineType, { color: colors.primary }]}>{item.type.toUpperCase()}</Text>
                </View>
                <Text style={[styles.timelineDesc, { color: colors.text }]}>{item.description}</Text>
                <Text style={[styles.timelineVet, { color: colors.textSecondary }]}>{item.vet}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => setIsModalVisible(true)}
        >
          <MaterialCommunityIcons name="pencil-outline" size={20} color={colors.white} />
          <Text style={styles.actionButtonText}>Nova Evolução Clínica</Text>
        </TouchableOpacity>
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
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Nova Evolução Clínica</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.inputLabel, { color: colors.text }]}>Tipo de Atendimento</Text>
            <View style={styles.typeSelector}>
              {(['consulta', 'vacina', 'exame', 'cirurgia'] as const).map((type) => (
                <TouchableOpacity 
                  key={type}
                  style={[
                    styles.typeChip, 
                    { backgroundColor: colors.background, borderColor: colors.border },
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

            <Text style={[styles.inputLabel, { color: colors.text }]}>Observações Clínicas</Text>
            <TextInput
              style={[styles.textInput, { backgroundColor: colors.background, color: colors.text, borderColor: colors.border }]}
              multiline
              numberOfLines={4}
              placeholder="Descreva aqui o estado do pet, procedimentos realizados ou orientações..."
              value={newNote}
              onChangeText={setNewNote}
              placeholderTextColor={colors.textSecondary}
            />

            <TouchableOpacity 
              style={[styles.saveButton, { backgroundColor: colors.primary }]}
              onPress={handleAddEvolution}
            >
              <Text style={styles.saveButtonText}>Salvar Evolução</Text>
            </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingBottom: 32,
    marginTop: 16,
  },
  profileCard: {
    padding: 16,
    marginBottom: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  petImage: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  petBreed: {
    fontSize: 14,
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '800',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    paddingTop: 16,
  },
  detailItem: {
    width: '50%',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    marginTop: 8,
  },
  vitalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  vitalCardWrapper: {
    width: '31%',
  },
  vitalCard: {
    alignItems: 'center',
    padding: 12,
    marginBottom: 0,
  },
  vitalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 8,
  },
  vitalLabel: {
    fontSize: 10,
  },
  alertCard: {
    marginBottom: 8,
    padding: 16,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertMessage: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
  },
  historySection: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: -2,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 16,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  timelineType: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  timelineDesc: {
    fontSize: 14,
    marginBottom: 2,
  },
  timelineVet: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  typeChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  typeChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  textInput: {
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    textAlignVertical: 'top',
    height: 120,
    marginBottom: 32,
    borderWidth: 1,
  },
  saveButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
