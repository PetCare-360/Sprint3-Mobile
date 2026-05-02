import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, KeyboardAvoidingView, Platform, Alert as RNAlert } from 'react-native';
import { theme } from '../../theme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from '../../components/Card';
import { AlertService, RiskLevel, Alert } from '../../services/alertService';

interface PatientDetail extends Patient {
  owner: string;
  age: string;
  weight: string;
  lastVisit: string;
}

interface Patient {
  id: string;
  name: string;
  breed: string;
  heartRate: number;
  temperature: number;
  activity: 'Baixa' | 'Média' | 'Alta';
}

const mockPatients: PatientDetail[] = [
  { id: '1', name: 'Max', breed: 'Golden Retriever', owner: 'Carlos Silva', heartRate: 140, temperature: 39.5, activity: 'Alta', age: '4 anos', weight: '32kg', lastVisit: '10/04/2026' },
  { id: '2', name: 'Luna', breed: 'Siamês', owner: 'Ana Oliveira', heartRate: 80, temperature: 38.5, activity: 'Baixa', age: '2 anos', weight: '4kg', lastVisit: '25/03/2026' },
  { id: '3', name: 'Thor', breed: 'Bulldog', owner: 'João Souza', heartRate: 110, temperature: 38.8, activity: 'Média', age: '3 anos', weight: '12kg', lastVisit: '15/02/2026' },
  { id: '4', name: 'Bella', breed: 'Poodle', owner: 'Maria Luz', heartRate: 135, temperature: 38.2, activity: 'Média', age: '5 anos', weight: '6kg', lastVisit: '05/04/2026' },
  { id: '5', name: 'Mike', breed: 'Beagle', owner: 'Pedro Rocha', heartRate: 90, temperature: 39.2, activity: 'Baixa', age: '1 ano', weight: '10kg', lastVisit: '20/03/2026' },
];

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
  const [history, setHistory] = useState<HistoryEvent[]>([
    { id: '1', date: '10/04/2026', type: 'vacina', description: 'Aplicação de reforço da V10 e Raiva.', vet: 'Dra. Marina Silva' },
    { id: '2', date: '22/03/2026', type: 'exame', description: 'Hemograma completo. Leve anemia detectada.', vet: 'Dr. Ricardo Lima' },
    { id: '3', date: '15/01/2026', type: 'consulta', description: 'Check-up de rotina. Peso estável.', vet: 'Dra. Marina Silva' },
  ]);

  // Estados para o Modal
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<'consulta' | 'vacina' | 'exame' | 'cirurgia'>('consulta');

  useEffect(() => {
    const foundPet = mockPatients.find(p => p.id === petId);
    if (foundPet) {
      setPet(foundPet);
      const vitals = { 
        temperature: foundPet.temperature, 
        heartRate: foundPet.heartRate, 
        activity: foundPet.activity 
      };
      setAlerts(AlertService.getVitalsAlerts(vitals));
      setStatus(AlertService.calculateRiskLevel(vitals));
    }
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
        <Text style={styles.vitalValue}>{value}</Text>
        <Text style={styles.vitalLabel}>{label}</Text>
      </Card>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={32} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Ficha Clínica</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Card style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View style={[styles.statusIndicator, { backgroundColor: AlertService.getStatusColor(status) }]} />
            <View style={styles.profileInfo}>
              <Text style={styles.petName}>{pet.name}</Text>
              <Text style={styles.petBreed}>{pet.breed}</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{status.toUpperCase()}</Text>
            </View>
          </View>
          
          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Tutor</Text>
              <Text style={styles.detailValue}>{pet.owner}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Idade</Text>
              <Text style={styles.detailValue}>{pet.age}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Peso</Text>
              <Text style={styles.detailValue}>{pet.weight}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Última Visita</Text>
              <Text style={styles.detailValue}>{pet.lastVisit}</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>Sinais Vitais</Text>
        <View style={styles.vitalsGrid}>
          {renderVitalCard('Temperatura', `${pet.temperature}°C`, 'thermometer', theme.colors.danger)}
          {renderVitalCard('Batimentos', `${pet.heartRate} bpm`, 'heart-pulse', theme.colors.primary)}
          {renderVitalCard('Atividade', pet.activity, 'run', theme.colors.success)}
        </View>

        {alerts.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Alertas Detectados</Text>
            {alerts.map((alert) => (
              <Card key={alert.id} style={[styles.alertCard, { borderLeftColor: AlertService.getStatusColor(alert.severity), borderLeftWidth: 4 }]}>
                <View style={styles.alertContent}>
                  <MaterialCommunityIcons name={alert.icon as any} size={24} color={AlertService.getStatusColor(alert.severity)} />
                  <Text style={styles.alertMessage}>{alert.message}</Text>
                </View>
              </Card>
            ))}
          </>
        )}

        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Linha do Tempo</Text>
          {history.map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={[styles.timelineIcon, { backgroundColor: theme.colors.primary + '15' }]}>
                  <MaterialCommunityIcons name={getHistoryIcon(item.type) as any} size={20} color={theme.colors.primary} />
                </View>
                {index !== history.length - 1 && <View style={styles.timelineLine} />}
              </View>
              <View style={styles.timelineContent}>
                <View style={styles.timelineHeader}>
                  <Text style={styles.timelineDate}>{item.date}</Text>
                  <Text style={styles.timelineType}>{item.type.toUpperCase()}</Text>
                </View>
                <Text style={styles.timelineDesc}>{item.description}</Text>
                <Text style={styles.timelineVet}>{item.vet}</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setIsModalVisible(true)}
        >
          <MaterialCommunityIcons name="pencil-outline" size={20} color={theme.colors.white} />
          <Text style={styles.actionButtonText}>Nova Evolução Clínica</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para Nova Evolução */}
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
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nova Evolução Clínica</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <MaterialCommunityIcons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Tipo de Atendimento</Text>
            <View style={styles.typeSelector}>
              {(['consulta', 'vacina', 'exame', 'cirurgia'] as const).map((type) => (
                <TouchableOpacity 
                  key={type}
                  style={[
                    styles.typeChip, 
                    noteType === type && { backgroundColor: theme.colors.primary }
                  ]}
                  onPress={() => setNoteType(type)}
                >
                  <Text style={[
                    styles.typeChipText,
                    noteType === type && { color: theme.colors.white }
                  ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Observações Clínicas</Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              placeholder="Descreva aqui o estado do pet, procedimentos realizados ou orientações..."
              value={newNote}
              onChangeText={setNewNote}
              placeholderTextColor={theme.colors.textSecondary}
            />

            <TouchableOpacity 
              style={styles.saveButton}
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
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  profileCard: {
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  petName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  petBreed: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  badge: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.colors.textSecondary,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: theme.spacing.md,
  },
  detailItem: {
    width: '50%',
    marginBottom: theme.spacing.sm,
  },
  detailLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  vitalsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  vitalCardWrapper: {
    width: '31%',
  },
  vitalCard: {
    alignItems: 'center',
    padding: theme.spacing.md,
    marginBottom: 0,
  },
  vitalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: 8,
  },
  vitalLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
  },
  alertCard: {
    marginBottom: theme.spacing.sm,
    padding: theme.spacing.md,
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertMessage: {
    fontSize: 14,
    color: theme.colors.text,
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  historySection: {
    marginTop: theme.spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.md,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: theme.spacing.md,
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
    backgroundColor: theme.colors.border,
    marginTop: -2,
  },
  timelineContent: {
    flex: 1,
    paddingBottom: theme.spacing.md,
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
    color: theme.colors.text,
  },
  timelineType: {
    fontSize: 10,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  timelineDesc: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 2,
  },
  timelineVet: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginTop: theme.spacing.lg,
  },
  actionButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: theme.spacing.sm,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: theme.colors.card,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    paddingBottom: Platform.OS === 'ios' ? 40 : theme.spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.lg,
  },
  typeChip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  typeChipText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  textInput: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    color: theme.colors.text,
    fontSize: 14,
    textAlignVertical: 'top',
    height: 120,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
