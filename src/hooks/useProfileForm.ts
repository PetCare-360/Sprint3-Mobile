import { useEffect, useState } from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';
import { PatientService } from '../services/patientService';
import { useAuth } from '../context/AuthContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export function useProfileForm() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const { data: pets = [], isLoading } = useQuery({
    queryKey: ['pets'],
    queryFn: PatientService.getPets,
  });
  const pet = pets[0];
  const {
    data: veterinarians = [],
    isError: veterinariansError,
    refetch: refetchVeterinarians,
  } = useQuery({
    queryKey: ['veterinarians'],
    queryFn: PatientService.listVeterinarians,
  });
  const [petName, setPetName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [collarId, setCollarId] = useState('');
  const [ownerName] = useState(user?.name || '');
  const saveMutation = useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id?: string;
      request: ReturnType<typeof PatientService.buildRequest>;
    }) => (id ? PatientService.updatePatient(id, request) : PatientService.addPatient(request)),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['pets'] });
      Alert.alert('Sucesso', variables.id ? 'Informações atualizadas na API.' : 'Pet cadastrado com sucesso.');
    },
    onError: error => {
      Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível salvar as informações do pet.');
    },
  });
  const linkMutation = useMutation({
    mutationFn: (veterinarianId: number) => PatientService.linkVeterinarian(Number(pet?.id), veterinarianId),
    onSuccess: () => Alert.alert('Sucesso', 'Veterinário vinculado ao pet.'),
    onError: error => Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível vincular o veterinário.'),
  });

  useEffect(() => {
    if (pet) {
      setPetName(pet.name);
      setBreed(pet.breed);
      setAge(String(pet.age ?? ''));
      setWeight(String(pet.weight ?? ''));
      setCollarId(pet.collarId || '');
    }
  }, [pet]);

  const handleSave = () => {
    const parsedAge = Number(age);
    const parsedWeight = Number(weight);
    if (
      !petName.trim() ||
      !breed.trim() ||
      !collarId.trim() ||
      !Number.isInteger(parsedAge) ||
      parsedAge < 0 ||
      !Number.isFinite(parsedWeight) ||
      parsedWeight <= 0
    ) {
      Alert.alert('Erro', 'Preencha nome, raça, identificador da coleira, idade e peso corretamente.');
      return;
    }
    saveMutation.mutate({
      id: pet?.id,
      request: PatientService.buildRequest({
        name: petName,
        age: parsedAge,
        weight: parsedWeight,
        breed,
        species: pet?.species || 'Cão',
        deviceId: collarId,
        temperature: pet?.temperature ?? 38.5,
        heartRate: pet?.heartRate ?? 80,
        activity: pet?.activity,
        battery: pet?.battery ?? 100,
      }),
    });
  };

  return {
    petName,
    breed,
    age,
    weight,
    collarId,
    ownerName,
    isLoading: isLoading || saveMutation.isPending,
    hasPet: Boolean(pet),
    setPetName,
    setBreed,
    setAge,
    setWeight,
    setCollarId,
    handleSave,
    veterinarians,
    veterinariansError,
    refetchVeterinarians,
    linkVeterinarian: (veterinarianId: number) => {
      if (!pet) {
        Alert.alert('Erro', 'Cadastre um pet antes de vincular um veterinário.');
        return;
      }
      linkMutation.mutate(veterinarianId);
    },
    handleLogout: () => Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: signOut },
    ]),
  };
}
