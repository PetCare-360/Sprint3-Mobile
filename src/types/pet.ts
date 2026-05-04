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
  breed: string;
  owner: string;
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
