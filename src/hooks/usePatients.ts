import { useCallback, useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AlertService } from '../services/alertService';
import { PatientService } from '../services/patientService';
import { Pet, RiskLevel } from '../types/pet';

export function usePatients() {
  const [patients, setPatients] = useState<Pet[]>([]);
  const [search, setSearch] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [collarId, setCollarId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadPatients = useCallback(async () => {
    const data = await PatientService.getPatients();
    setPatients(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPatients();
    }, [loadPatients])
  );

  const handleAddPatient = async () => {
    if (!collarId.trim()) {
      Alert.alert('Erro', 'Por favor, digite o ID da coleira.');
      return;
    }

    setIsLoading(true);
    try {
      await PatientService.addPatient(collarId);
      await loadPatients();
      setIsModalVisible(false);
      setCollarId('');
      Alert.alert('Sucesso', 'Paciente vinculado com sucesso.');
    } catch {
      Alert.alert('Erro', 'Não foi possível vincular o paciente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePatient = (id: string, name: string) => {
    Alert.alert(
      'Remover Paciente',
      `Deseja realmente remover ${name} da sua lista de pacientes?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: async () => {
            await PatientService.removePatient(id);
            await loadPatients();
          },
        },
      ]
    );
  };

  const filteredPatients = useMemo(() => {
    return patients
      .filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.breed.toLowerCase().includes(search.toLowerCase())
      )
      .map(p => ({
        ...p,
        status: AlertService.calculateRiskLevel({
          temperature: p.temperature,
          heartRate: p.heartRate,
          activity: p.activity,
        }),
      }))
      .sort((a, b) => {
        const priority: Record<RiskLevel, number> = { critical: 0, warning: 1, stable: 2 };
        return priority[a.status as RiskLevel] - priority[b.status as RiskLevel];
      });
  }, [patients, search]);

  return {
    search,
    setSearch,
    isModalVisible,
    setIsModalVisible,
    collarId,
    setCollarId,
    isLoading,
    filteredPatients,
    handleAddPatient,
    handleDeletePatient,
  };
}
