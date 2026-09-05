import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertService } from '../services/alertService';
import { PatientService } from '../services/patientService';
import { RiskLevel } from '../types/pet';

export function useVetDashboard() {
  const { data: patients = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['patients', 'health'],
    queryFn: PatientService.getPatientsWithHealth,
  });

  const processedPatients = useMemo(() => {
    return patients
      .map(patient => ({
        ...patient,
        status: patient.status || AlertService.calculateRiskLevel({
          temperature: patient.temperature,
          heartRate: patient.heartRate,
          activity: patient.activity,
        }),
      }))
      .sort((a, b) => {
        const priority: Record<RiskLevel, number> = { critical: 0, warning: 1, stable: 2 };
        return priority[a.status as RiskLevel] - priority[b.status as RiskLevel];
      });
  }, [patients]);

  const criticalCount = processedPatients.filter(patient => patient.status === 'critical').length;
  const warningCount = processedPatients.filter(patient => patient.status === 'warning').length;
  const stableCount = processedPatients.length - criticalCount - warningCount;

  return {
    loading: isLoading,
    isError,
    refetch,
    processedPatients,
    criticalCount,
    warningCount,
    stableCount,
  };
}
