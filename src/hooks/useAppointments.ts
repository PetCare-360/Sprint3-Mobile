import { useState } from 'react';
import { Alert } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentService } from '../services/appointmentService';
import { PatientService } from '../services/patientService';
import { notificationService } from '../services/notificationService';
import { appointmentReminderStorage } from '../storage/appointmentReminderStorage';
import { Appointment } from '../types/appointment';
import { useAuth } from '../context/AuthContext';

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
  const { user } = useAuth();
  // /pets/patients é exclusivo de veterinário/admin (403 para tutor). O tutor
  // agenda para os próprios pets, que vêm de /pets/all.
  const isClinician = user?.role === 'ROLE_VETERINARIO' || user?.role === 'ROLE_ADMIN';
  const isVeterinarian = user?.role === 'ROLE_VETERINARIO';
  const canRequestAppointment = user?.role === 'ROLE_CLIENTE' || user?.role === 'ROLE_ADMIN';
  const canFinishAppointment = user?.role === 'ROLE_VETERINARIO' || user?.role === 'ROLE_ADMIN';
  const canEditAppointment = user?.role === 'ROLE_CLIENTE' || user?.role === 'ROLE_ADMIN';
  const canDeleteAppointment = user?.role === 'ROLE_VETERINARIO' || user?.role === 'ROLE_ADMIN';

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
    // role/id na chave: evita reaproveitar o cache de outra conta logada antes.
    queryKey: ['appointment-pets', user?.id, user?.role],
    queryFn: isClinician ? PatientService.getPatients : PatientService.getPets,
    enabled: !!user,
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

  const scheduleReminderFor = async (appointment: Appointment) => {
    const identifier = await notificationService.scheduleAppointmentReminder({
      petName: appointment.petName,
      reason: appointment.reason,
      scheduledAt: new Date(appointment.scheduledAt),
    });
    if (identifier) {
      await appointmentReminderStorage.set(appointment.id, identifier);
    }
  };

  const cancelReminderFor = async (appointmentId: number) => {
    const identifier = await appointmentReminderStorage.get(appointmentId);
    if (identifier) {
      await notificationService.cancelAppointmentReminder(identifier);
      await appointmentReminderStorage.remove(appointmentId);
    }
  };

  const mutation = useMutation({
    mutationFn: appointmentService.create,
    onSuccess: async created => {
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
      await scheduleReminderFor(created);
      resetForm();
      Alert.alert('Sucesso', 'Consulta solicitada com sucesso.');
    },
    onError: (error: Error) => Alert.alert('Erro ao agendar consulta', error.message || 'Não foi possível solicitar a consulta.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, request }: { id: number; request: Parameters<typeof appointmentService.update>[1] }) =>
      appointmentService.update(id, request),
    onSuccess: async (updated, variables) => {
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
      await cancelReminderFor(variables.id);
      await scheduleReminderFor(updated);
      resetForm();
      Alert.alert('Sucesso', 'Consulta atualizada.');
    },
    onError: (error: Error) => Alert.alert('Erro ao atualizar consulta', error.message || 'Não foi possível atualizar a consulta.'),
  });

  const finishMutation = useMutation({
    mutationFn: appointmentService.finish,
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
      await cancelReminderFor(id);
      Alert.alert('Sucesso', 'Consulta finalizada com sucesso.');
    },
    onError: (error: Error) => Alert.alert('Erro ao finalizar consulta', error.message || 'Não foi possível finalizar a consulta.'),
  });

  const removeMutation = useMutation({
    mutationFn: appointmentService.remove,
    onSuccess: async (_, id) => {
      await queryClient.invalidateQueries({ queryKey: ['appointments'] });
      await cancelReminderFor(id);
      Alert.alert('Sucesso', 'Consulta excluída.');
    },
    onError: (error: Error) => Alert.alert('Erro ao excluir consulta', error.message || 'Não foi possível excluir a consulta.'),
  });

  const create = () => {
    if (isVeterinarian) {
      Alert.alert(
        'Ação exclusiva do Tutor',
        'Pelas regras da clínica, apenas o tutor do pet pode solicitar novas consultas. Como veterinário, você pode acompanhar, finalizar e desmarcar atendimentos agendados na lista abaixo.'
      );
      return;
    }

    const parsedPetId = Number(petId);
    const parsedVeterinarianId = Number(veterinarianId);
    const parsedDate = parseScheduledAt(scheduledAt);

    if (!parsedPetId || !parsedVeterinarianId || !parsedDate || !reason.trim()) {
      Alert.alert('Campos incompletos', 'Selecione o pet, o veterinário e informe data, horário e motivo da consulta.');
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
    if (isVeterinarian) {
      Alert.alert(
        'Ação exclusiva do Tutor',
        'O horário e motivo da consulta só podem ser alterados pelo tutor do pet ou administrador.'
      );
      return;
    }

    const patient = appointment.petId
      ? patients.find(item => String(item.id) === String(appointment.petId))
      : patients.find(item => item.name.trim().toLowerCase() === appointment.petName.trim().toLowerCase());
    const veterinarian = appointment.veterinarianId
      ? veterinarians.find(item => item.id === appointment.veterinarianId)
      : veterinarians.find(item => item.name.trim().toLowerCase() === appointment.veterinarianName.trim().toLowerCase());

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
    userRole: user?.role,
    isVeterinarian,
    canRequestAppointment,
    canFinishAppointment,
    canEditAppointment,
    canDeleteAppointment,
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
