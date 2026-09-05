import { httpClient } from './httpClient';
import { Appointment, AppointmentRequest } from '../types/appointment';

export const appointmentService = {
  async list(): Promise<Appointment[]> {
    const { data } = await httpClient.get<Appointment[]>('/appointments');
    return data;
  },

  async create(request: AppointmentRequest): Promise<Appointment> {
    const { data } = await httpClient.post<Appointment>('/appointments', request);
    return data;
  },

  async finish(id: number): Promise<Appointment> {
    const { data } = await httpClient.put<Appointment>(`/appointments/${id}/finish`);
    return data;
  },

  async remove(id: number): Promise<void> {
    await httpClient.delete(`/appointments/${id}`);
  },
};
