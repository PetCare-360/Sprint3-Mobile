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
  const [petName, setPetName] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [ownerName] = useState(user?.name || '');
  const updateMutation = useMutation({
    mutationFn: ({ id, request }: { id: string; request: ReturnType<typeof PatientService.buildRequest> }) =>
      PatientService.updatePatient(id, request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pets'] }),
  });

  useEffect(() => {
    if (pet) {
      setPetName(pet.name);
      setBreed(pet.breed);
      setAge(String(pet.age ?? ''));
      setWeight(String(pet.weight ?? ''));
    }
  }, [pet]);

  const handleSave = () => {
    if (!pet) {
      Alert.alert('Erro', 'Nenhum pet cadastrado para atualizar.');
      return;
    }
    const parsedAge = Number(age);
    const parsedWeight = Number(weight);
    if (!petName.trim() || !breed.trim() || !Number.isFinite(parsedAge) || !Number.isFinite(parsedWeight)) {
      Alert.alert('Erro', 'Preencha nome, raça, idade e peso corretamente.');
      return;
    }
    updateMutation.mutate({
      id: pet.id,
      request: PatientService.buildRequest({
        name: petName,
        age: parsedAge,
        weight: parsedWeight,
        breed,
        species: pet.species || 'Cão',
        deviceId: pet.collarId || '',
        temperature: pet.temperature || 38.5,
        heartRate: pet.heartRate || 80,
        activity: pet.activity,
        battery: pet.battery || 100,
      }),
    });
    Alert.alert('Sucesso', 'Informações atualizadas na API.');
  };

  return {
    petName,
    breed,
    age,
    weight,
    ownerName,
    isLoading: isLoading || updateMutation.isPending,
    setPetName,
    setBreed,
    setAge,
    setWeight,
    handleSave,
    handleLogout: () => Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: signOut },
    ]),
  };
}
