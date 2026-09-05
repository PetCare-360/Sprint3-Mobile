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
  const [breed, setBreed] = useState('');
  const [species, setSpecies] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [editingPatient, setEditingPatient] = useState<Pet | null>(null);

  const saveMutation = useMutation({
    mutationFn: ({ id, request }: { id?: string; request: ReturnType<typeof PatientService.buildRequest> }) =>
      id ? PatientService.updatePatient(id, request) : PatientService.addPatient(request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['patients'] });
      setIsModalVisible(false);
      setCollarId('');
      setPatientName('');
      setBreed('');
      setSpecies('');
      setAge('');
      setWeight('');
      setEditingPatient(null);
      Alert.alert('Sucesso', 'Paciente salvo com sucesso.');
    },
    onError: error => Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível salvar o paciente.'),
  });

  const removeMutation = useMutation({
    mutationFn: PatientService.removePatient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['patients'] }),
    onError: error => Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível remover o paciente.'),
  });

  const handleAddPatient = () => {
    const parsedAge = Number(age);
    const parsedWeight = Number(weight);
    if (
      !patientName.trim() ||
      !breed.trim() ||
      !species.trim() ||
      !collarId.trim() ||
      !Number.isInteger(parsedAge) ||
      parsedAge < 0 ||
      !Number.isFinite(parsedWeight) ||
      parsedWeight <= 0
    ) {
      Alert.alert('Erro', 'Preencha nome, raça, espécie, coleira, idade e peso corretamente.');
      return;
    }

    saveMutation.mutate({
      id: editingPatient?.id,
      request: PatientService.buildRequest({
        name: patientName,
        age: parsedAge,
        weight: parsedWeight,
        breed,
        species,
        deviceId: collarId,
        temperature: editingPatient?.temperature,
        heartRate: editingPatient?.heartRate,
        activity: editingPatient?.activity,
        battery: editingPatient?.battery,
      }),
    });
  };

  const handleEditPatient = (patient: Pet) => {
    setEditingPatient(patient);
    setPatientName(patient.name);
    setBreed(patient.breed);
    setSpecies(patient.species || '');
    setAge(String(patient.age ?? ''));
    setWeight(String(patient.weight ?? ''));
    setCollarId(patient.collarId || '');
    setIsModalVisible(true);
  };

  const handleNewPatient = () => {
    setEditingPatient(null);
    setPatientName('');
    setBreed('');
    setSpecies('');
    setAge('');
    setWeight('');
    setCollarId('');
    setIsModalVisible(true);
  };

  const handleDeletePatient = (id: string, name: string) => {
    Alert.alert('Remover Paciente', `Deseja realmente remover ${name} da sua lista de pacientes?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => removeMutation.mutate(id) },
    ]);
  };

  const filteredPatients = useMemo(() => patients
    .filter(patient =>
      patient.name.toLowerCase().includes(search.toLowerCase()) ||
      patient.breed.toLowerCase().includes(search.toLowerCase()),
    )
    .map(patient => ({
      ...patient,
      status: patient.status || AlertService.calculateRiskLevel({
        temperature: patient.temperature,
        heartRate: patient.heartRate,
        activity: patient.activity,
      }),
    }))
    .sort((a, b) => {
      const priority: Record<RiskLevel, number> = { critical: 0, warning: 1, stable: 2 };
      return priority[a.status as RiskLevel] - priority[b.status as RiskLevel];
    }), [patients, search]);

  return {
    search,
    setSearch,
    isModalVisible,
    setIsModalVisible,
    collarId,
    setCollarId,
    patientName,
    setPatientName,
    breed,
    setBreed,
    species,
    setSpecies,
    age,
    setAge,
    weight,
    setWeight,
    editingPatient,
    isLoading: isLoading || saveMutation.isPending || removeMutation.isPending,
    filteredPatients,
    handleAddPatient,
    handleEditPatient,
    handleNewPatient,
    handleDeletePatient,
  };
}
