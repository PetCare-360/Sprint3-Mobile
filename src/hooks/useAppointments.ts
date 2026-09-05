import { useState } from 'react';
import { Alert } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services/appointmentService';

export function useAppointments() {
  const queryClient = useQueryClient();
  const [petId, setPetId] = useState('');
  const [veterinarianId, setVeterinarianId] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [reason, setReason] = useState('');
  const { data: appointments = [], isLoading } = useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentService.list,
  });
  const mutation = useMutation({
    mutationFn: appointmentService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
      setPetId('');
      setVeterinarianId('');
      setScheduledAt('');
      setReason('');
      Alert.alert('Sucesso', 'Consulta solicitada.');
    },
    onError: error => Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível solicitar a consulta.'),
  });
  const finishMutation = useMutation({
    mutationFn: appointmentService.finish,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  });
  const removeMutation = useMutation({
    mutationFn: appointmentService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
  });

  const create = () => {
    const parsedPetId = Number(petId);
    const parsedVeterinarianId = Number(veterinarianId);
    if (!parsedPetId || !parsedVeterinarianId || !scheduledAt || !reason.trim()) {
      Alert.alert('Erro', 'Preencha pet, veterinário, data e motivo.');
      return;
    }
    mutation.mutate({
      petId: parsedPetId,
      veterinarianId: parsedVeterinarianId,
      scheduledAt: new Date(scheduledAt).toISOString(),
      reason: reason.trim(),
    });
  };

  return {
    appointments,
    petId,
    veterinarianId,
    scheduledAt,
    reason,
    setPetId,
    setVeterinarianId,
    setScheduledAt,
    setReason,
    create,
    finish: (id: number) => finishMutation.mutate(id),
    remove: (id: number) => removeMutation.mutate(id),
    isLoading: isLoading || mutation.isPending || finishMutation.isPending || removeMutation.isPending,
  };
}
