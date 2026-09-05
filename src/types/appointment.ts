export type AppointmentStatus = 'REQUESTED' | 'SCHEDULED' | 'FINISHED' | 'CANCELLED';

export interface Appointment {
  id: number;
  petName: string;
  tutorName: string;
  veterinarianName: string;
  scheduledAt: string;
  reason: string;
  status: AppointmentStatus;
}

export interface AppointmentRequest {
  petId: number;
  veterinarianId: number;
  scheduledAt: string;
  reason: string;
}
