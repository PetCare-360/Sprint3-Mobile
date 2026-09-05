import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertService } from '../services/alertService';
import { PatientService } from '../services/patientService';
import { Pet, RiskLevel } from '../types/pet';

export function usePatients() {
  const queryClient = useQueryClient();
  const { data: patients = [], isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: PatientService.getPatients,
  });
  const [search, setSearch] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [collarId, setCollarId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [editingPatient, setEditingPatient] = useState<Pet | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const removeMutation = useMutation({
    mutationFn: PatientService.removePatient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
  });

  const handleAddPatient = async () => {
    if (!collarId.trim()) {
      Alert.alert('Erro', 'Por favor, digite o ID da coleira.');
      return;
    }

    try {
      setIsSaving(true);
      const request = PatientService.buildRequest({
        name: patientName || `Pet ${collarId}`,
        age: 0,
        weight: 1,
        breed: 'Não informado',
        species: 'Cão',
        deviceId: collarId,
      });
      if (editingPatient) {
        await PatientService.updatePatient(editingPatient.id, request);
      } else {
        await PatientService.addPatient(request);
      }
      await queryClient.invalidateQueries({ queryKey: ['patients'] });
      setIsModalVisible(false);
      setCollarId('');
      setPatientName('');
      setEditingPatient(null);
      Alert.alert('Sucesso', 'Paciente vinculado com sucesso.');
    } catch (error) {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível vincular o paciente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditPatient = (patient: Pet) => {
    setEditingPatient(patient);
    setPatientName(patient.name);
    setCollarId(patient.collarId || '');
    setIsModalVisible(true);
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
            removeMutation.mutate(id);
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
    patientName,
    setPatientName,
    editingPatient,
    isLoading: isLoading || isSaving || removeMutation.isPending,
    filteredPatients,
    handleAddPatient,
    handleEditPatient,
    handleDeletePatient,
  };
}
