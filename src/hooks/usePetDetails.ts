import { useQuery } from '@tanstack/react-query';
import { PatientService } from '../services/patientService';
import { Pet, RiskLevel, SensorData } from '../types/pet';

export interface HistoryEvent {
  id: string;
  date: string;
  type: 'monitoramento';
  description: string;
  vet: string;
}

export function usePetDetails(petId: string) {
  const { data: pet, isLoading: isPetLoading } = useQuery({
    queryKey: ['pet', petId],
    queryFn: () => PatientService.getPet(petId),
  });
  const { data: health, isLoading: isHealthLoading } = useQuery({
    queryKey: ['pet-health', petId],
    queryFn: () => PatientService.getHealthStatus(petId),
  });
  const { data: monitoring, isLoading: isMonitoringLoading } = useQuery({
    queryKey: ['pet-monitoring', petId],
    queryFn: () => PatientService.getMonitoring(petId),
  });
  const { data: apiAlerts, isLoading: isAlertsLoading } = useQuery({
    queryKey: ['pet-alerts', petId],
    queryFn: () => PatientService.getAlerts(petId),
  });

  const mergedPet: Pet | null = pet && health ? { ...pet, ...health } : pet ?? null;
  const status: RiskLevel = mergedPet?.status ?? 'stable';
  const alerts = (apiAlerts?.content ?? []).map(alert => ({
    id: String(alert.id),
    type: 'temperature' as const,
    severity: alert.level.toLowerCase().includes('critical') ? 'critical' as const : 'warning' as const,
    message: alert.message,
    icon: 'alert-circle-outline',
  }));
  const history: HistoryEvent[] = (monitoring?.content ?? []).map((reading: SensorData) => ({
    id: String(reading.id),
    date: new Date(reading.timestamp).toLocaleString(),
    type: 'monitoramento',
    description: `${reading.temperature.toFixed(1)}°C, ${reading.heartRate} bpm, atividade ${reading.activityLevel}% e bateria ${reading.battery}%.`,
    vet: `Status: ${reading.status}`,
  }));

  return {
    pet: mergedPet,
    alerts,
    status,
    history,
    isLoading: isPetLoading || isHealthLoading || isMonitoringLoading || isAlertsLoading,
    getHistoryIcon: (_type: string) => 'chart-line',
  };
}
