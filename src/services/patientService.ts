import { httpClient } from './httpClient';
import { ActivitySummary, Pet, PetApiResponse, PetRequest, PetLocation, SensorData } from '../types/pet';

const activityLabel = (value: number): Pet['activity'] => {
  if (value < 34) return 'Baixa';
  if (value < 67) return 'Média';
  return 'Alta';
};

const statusLabel = (value: string): Pet['status'] => {
  const normalized = value.toLowerCase();
  if (normalized.includes('critical')) return 'critical';
  if (normalized.includes('warning')) return 'warning';
  return 'stable';
};

const toPet = (pet: PetApiResponse): Pet => ({
  id: String(pet.id),
  name: pet.name,
  age: pet.age,
  weight: pet.weight,
  species: pet.species,
  breed: pet.breed,
  owner: undefined,
  collarId: pet.deviceId,
  heartRate: 0,
  temperature: 0,
  activity: 'Média',
  battery: pet.device?.battery ?? 0,
  status: statusLabel(pet.currentStatus),
});

export const PatientService = {
  async getPatients(): Promise<Pet[]> {
    const { data } = await httpClient.get<PetApiResponse[]>('/pets/patients');
    return data.map(toPet);
  },

  async getPets(): Promise<Pet[]> {
    const { data } = await httpClient.get<PetApiResponse[]>('/pets/all');
    return data.map(toPet);
  },

  async getPet(id: string): Promise<Pet> {
    const { data } = await httpClient.get<PetApiResponse>(`/pets/${id}`);
    return toPet(data);
  },

  async getHealthStatus(id: string): Promise<Pet> {
    const { data } = await httpClient.get<{
      petId: number;
      name: string;
      currentStatus: string;
      latestData?: {
        temperature: number;
        heartRate: number;
        activityLevel: number;
        battery: number;
      };
    }>(`/pets/${id}/health-status`);
    const latest = data.latestData;
    return {
      id: String(data.petId),
      name: data.name,
      breed: '',
      heartRate: latest?.heartRate ?? 0,
      temperature: latest?.temperature ?? 0,
      activity: activityLabel(latest?.activityLevel ?? 50),
      battery: latest?.battery ?? 0,
      status: statusLabel(data.currentStatus),
    };
  },

  async getMonitoring(id: string): Promise<{ content: SensorData[] }> {
    const { data } = await httpClient.get<{ content: SensorData[] }>(`/pets/${id}/monitoring`);
    return data;
  },

  async getLocation(id: string): Promise<PetLocation> {
    const { data } = await httpClient.get<SensorData>(`/pets/${id}/location`);
    if (data.latitude === undefined || data.longitude === undefined) {
      throw new Error('A API não retornou uma localização válida para este pet.');
    }
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      timestamp: data.timestamp,
    };
  },

  async getActivitySummary(id: string): Promise<ActivitySummary> {
    const { data } = await httpClient.get<ActivitySummary>(`/pets/${id}/activity-summary`);
    return data;
  },

  async getAlerts(id: string): Promise<{ content: Array<{
    id: number;
    createdAt: string;
    level: string;
    message: string;
  }> }> {
    const { data } = await httpClient.get(`/pets/${id}/alerts`);
    return data;
  },

  async addPatient(request: PetRequest): Promise<Pet> {
    const { data } = await httpClient.post<PetApiResponse>('/pets', request);
    return toPet(data);
  },

  async updatePatient(id: string, request: PetRequest): Promise<Pet> {
    const { data } = await httpClient.put<PetApiResponse>(`/pets/${id}`, request);
    return toPet(data);
  },

  async removePatient(id: string): Promise<void> {
    await httpClient.delete(`/pets/${id}`);
  },

  buildRequest(values: {
    name: string;
    age: number;
    weight: number;
    breed: string;
    species: string;
    deviceId: string;
    temperature?: number;
    heartRate?: number;
    activity?: Pet['activity'];
    battery?: number;
  }): PetRequest {
    const activityLevel = values.activity === 'Baixa' ? 20 : values.activity === 'Alta' ? 80 : 50;
    return {
      name: values.name.trim(),
      age: values.age,
      weight: values.weight,
      breed: values.breed.trim(),
      species: values.species.trim(),
      deviceId: values.deviceId.trim(),
      initialSensorData: {
        timestamp: new Date().toISOString(),
        temperature: values.temperature ?? 38.5,
        heartRate: values.heartRate ?? 80,
        activityLevel,
        battery: values.battery ?? 100,
      },
    };
  },
};
