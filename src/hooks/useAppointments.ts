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
  const [editingId, setEditingId] = useState<number | null>(null);
  const { data: appointments = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['appointments'],
    queryFn: appointmentService.list,
  });
  const resetForm = () => {
    setPetId('');
    setVeterinarianId('');
    setScheduledAt('');
    setReason('');
    setEditingId(null);
  };
  const mutation = useMutation({
    mutationFn: appointmentService.create,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
      resetForm();
      Alert.alert('Sucesso', 'Consulta solicitada.');
    },
    onError: error => Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível solicitar a consulta.'),
  });
  const updateMutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: Parameters<typeof appointmentService.update>[1] }) =>
      appointmentService.update(id, request),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
      resetForm();
      Alert.alert('Sucesso', 'Consulta atualizada.');
    },
    onError: error => Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível atualizar a consulta.'),
  });
  const finishMutation = useMutation({
    mutationFn: appointmentService.finish,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
    onError: error => Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível finalizar a consulta.'),
  });
  const removeMutation = useMutation({
    mutationFn: appointmentService.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['appointments'] }),
    onError: error => Alert.alert('Erro', error instanceof Error ? error.message : 'Não foi possível excluir a consulta.'),
  });

  const create = () => {
    const parsedPetId = Number(petId);
    const parsedVeterinarianId = Number(veterinarianId);
    const parsedDate = new Date(scheduledAt);
    if (!parsedPetId || !parsedVeterinarianId || !scheduledAt || Number.isNaN(parsedDate.getTime()) || !reason.trim()) {
      Alert.alert('Erro', 'Preencha pet, veterinário, data e motivo.');
      return;
    }
    const request = {
      petId: parsedPetId,
      veterinarianId: parsedVeterinarianId,
      scheduledAt: parsedDate.toISOString(),
      reason: reason.trim(),
    };
    if (editingId !== null) {
      updateMutation.mutate({ id: editingId, request });
    } else {
      mutation.mutate(request);
    }
  };

  const startEdit = (appointment: { id: number; scheduledAt: string; reason: string }) => {
    setEditingId(appointment.id);
    setPetId('');
    setVeterinarianId('');
    setScheduledAt(appointment.scheduledAt);
    setReason(appointment.reason);
  };

  const cancelEdit = () => resetForm();

  return {
    appointments,
    petId,
    veterinarianId,
    scheduledAt,
    reason,
    editingId,
    setPetId,
    setVeterinarianId,
    setScheduledAt,
    setReason,
    create,
    startEdit,
    cancelEdit,
    finish: (id: number) => finishMutation.mutate(id),
    remove: (id: number, description: string) => {
      Alert.alert('Excluir consulta', `Deseja excluir a consulta de ${description}?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: () => removeMutation.mutate(id) },
      ]);
    },
    isError,
    refetch,
    isLoading: isLoading || mutation.isPending || updateMutation.isPending || finishMutation.isPending || removeMutation.isPending,
  };
}
