import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { AlertService, Alert as VitalAlert } from '../services/alertService';
import { PatientService } from '../services/patientService';
import { Pet, RiskLevel, VitalSigns } from '../types/pet';

export interface PatientDetail extends Pet {
  phone: string;
  age: string;
  weight: string;
}

export interface HistoryEvent {
  id: string;
  date: string;
  type: 'consulta' | 'vacina' | 'exame' | 'cirurgia';
  description: string;
  vet: string;
}

const mockExtraInfo = {
  phone: '(11) 98765-4321',
  age: '4 anos',
  weight: '32kg',
};

const initialHistory: HistoryEvent[] = [
  { id: '1', date: '10/04/2026', type: 'vacina', description: 'Aplicação de reforço da V10 e Raiva.', vet: 'Dra. Marina Silva' },
  { id: '2', date: '22/03/2026', type: 'exame', description: 'Hemograma completo. Leve anemia detectada.', vet: 'Dr. Ricardo Lima' },
  { id: '3', date: '15/01/2026', type: 'consulta', description: 'Check-up de rotina. Peso estável.', vet: 'Dra. Marina Silva' },
];

export function usePetDetails(petId: string) {
  const [pet, setPet] = useState<PatientDetail | null>(null);
  const [alerts, setAlerts] = useState<VitalAlert[]>([]);
  const [status, setStatus] = useState<RiskLevel>('stable');
  const [history, setHistory] = useState<HistoryEvent[]>(initialHistory);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState<HistoryEvent['type']>('consulta');

  useEffect(() => {
    async function loadPet() {
      const patients = await PatientService.getPatients();
      const found = patients.find(p => p.id === petId);
      if (found) {
        setPet({ ...found, ...mockExtraInfo });
        const vitals: VitalSigns = {
          temperature: found.temperature,
          heartRate: found.heartRate,
          activity: found.activity,
        };
        setAlerts(AlertService.getVitalsAlerts(vitals));
        setStatus(AlertService.calculateRiskLevel(vitals));
      }
    }
    loadPet();
  }, [petId]);

  const handleAddEvolution = () => {
    if (!newNote.trim()) {
      Alert.alert('Erro', 'Por favor, descreva a evolução clínica.');
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
    Alert.alert('Sucesso', 'Evolução clínica registrada com sucesso.');
  };

  const getHistoryIcon = (type: string) => {
    switch (type) {
      case 'vacina': return 'needle';
      case 'exame': return 'test-tube';
      case 'cirurgia': return 'hospital-building';
      default: return 'stethoscope';
    }
  };

  return {
    pet,
    alerts,
    status,
    history,
    isModalVisible,
    setIsModalVisible,
    newNote,
    setNewNote,
    noteType,
    setNoteType,
    handleAddEvolution,
    getHistoryIcon,
  };
}
