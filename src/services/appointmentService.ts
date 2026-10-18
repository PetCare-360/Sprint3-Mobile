import axios from 'axios';
import { httpClient } from './httpClient';
import { Appointment, AppointmentRequest } from '../types/appointment';
import { PatientService } from './patientService';

function getErrorMessage(error: unknown, fallback: string): string {
  if (
    axios.isAxiosError(error) &&
    error.response?.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export const appointmentService = {
  async list(): Promise<Appointment[]> {
    try {
      const { data } = await httpClient.get<Appointment[]>('/appointments');
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Não foi possível carregar as consultas.'));
    }
  },

  async create(request: AppointmentRequest): Promise<Appointment> {
    // Garante que o veterinário esteja vinculado ao pet antes de criar o agendamento
    // (a API Spring Boot exige vínculo ativo e rejeita com 400 se não existir).
    try {
      await PatientService.linkVeterinarian(request.petId, request.veterinarianId);
    } catch {
      // Ignora se o vínculo já existir (409 Conflict) ou se o endpoint rejeitar
    }

    try {
      const { data } = await httpClient.post<Appointment>('/appointments', request);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Não foi possível solicitar a consulta.'));
    }
  },

  async finish(id: number): Promise<Appointment> {
    try {
      const { data } = await httpClient.put<Appointment>(`/appointments/${id}/finish`);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Não foi possível finalizar a consulta.'));
    }
  },

  async update(id: number, request: AppointmentRequest): Promise<Appointment> {
    try {
      await PatientService.linkVeterinarian(request.petId, request.veterinarianId);
    } catch {
      // Ignora se o vínculo já existir
    }

    try {
      const { data } = await httpClient.put<Appointment>(`/appointments/${id}`, request);
      return data;
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Não foi possível atualizar a consulta.'));
    }
  },

  async remove(id: number): Promise<void> {
    try {
      await httpClient.delete(`/appointments/${id}`);
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Não foi possível excluir a consulta.'));
    }
  },
};
