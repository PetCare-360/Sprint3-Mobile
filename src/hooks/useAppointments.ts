import { useState } from 'react';
import { Alert } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services/appointmentService';
import { PatientService } from '../services/patientService';
import { Appointment } from '../types/appointment';

const formatForInput = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

const parseScheduledAt = (value: string) => {
  const trimmed = value.trim();
  const match = /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/.exec(trimmed);
  if (match) {
    const [, day, month, year, hour, minute] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
    return Number.isNaN(date.getTime()) ? null : date;
  }
  const date = new Date(trimmed);
  return Number.isNaN(date.getTime()) ? null : date;
};

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

  const { data: patients = [], isLoading: patientsLoading, isError: patientsError } = useQuery({
    queryKey: ['patients'],
    queryFn: PatientService.getPatients,
  });

  const { data: veterinarians = [], isLoading: veterinariansLoading, isError: veterinariansError } = useQuery({
    queryKey: ['veterinarians'],
    queryFn: PatientService.listVeterinarians,
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
    const parsedDate = parseScheduledAt(scheduledAt);

    if (!parsedPetId || !parsedVeterinarianId || !parsedDate || !reason.trim()) {
      Alert.alert('Erro', 'Selecione o pet, o veterinário e informe data, horário e motivo.');
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

  const startEdit = (appointment: Appointment) => {
    const patient = patients.find(item => item.name.trim().toLowerCase() === appointment.petName.trim().toLowerCase());
    const veterinarian = veterinarians.find(item => item.name.trim().toLowerCase() === appointment.veterinarianName.trim().toLowerCase());

    setEditingId(appointment.id);
    setPetId(patient?.id ?? '');
    setVeterinarianId(veterinarian ? String(veterinarian.id) : '');
    setScheduledAt(formatForInput(appointment.scheduledAt));
    setReason(appointment.reason);

    if (!patient || !veterinarian) {
      Alert.alert('Atenção', 'Não foi possível identificar automaticamente o pet ou veterinário desta consulta. Selecione-os novamente.');
    }
  };

  const cancelEdit = () => resetForm();

  return {
    appointments,
    patients,
    veterinarians,
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
    isError: isError || patientsError || veterinariansError,
    refetch,
    isLoading: isLoading || patientsLoading || veterinariansLoading || mutation.isPending || updateMutation.isPending || finishMutation.isPending || removeMutation.isPending,
  };
}
