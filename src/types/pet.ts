export type RiskLevel = 'critical' | 'warning' | 'stable';

export type ActivityLevel = 'Baixa' | 'Média' | 'Alta';

export interface VitalSigns {
  temperature: number;
  heartRate: number;
  activity: ActivityLevel;
}

export interface Pet {
  id: string;
  collarId?: string;
  name: string;
  age?: number;
  weight?: number;
  species?: string;
  breed: string;
  owner?: string;
  heartRate: number;
  temperature: number;
  activity: ActivityLevel;
  battery: number;
  image?: any;
  status?: RiskLevel;
  location?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

export interface PetRequest {
  name: string;
  age: number;
  weight: number;
  breed: string;
  species: string;
  deviceId: string;
  initialSensorData: {
    timestamp: string;
    temperature: number;
    heartRate: number;
    activityLevel: number;
    latitude?: number;
    longitude?: number;
    battery: number;
  };
}

export interface PetApiResponse {
  id: number;
  name: string;
  age: number;
  weight: number;
  breed: string;
  species: string;
  deviceId: string;
  currentStatus: string;
  device?: { deviceId?: string; battery?: number };
}

export interface SensorData {
  id: number;
  timestamp: string;
  temperature: number;
  heartRate: number;
  activityLevel: number;
  battery: number;
  status: string;
}
