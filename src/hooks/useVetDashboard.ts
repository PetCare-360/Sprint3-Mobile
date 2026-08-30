import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { AlertService } from '../services/alertService';
import { PatientService } from '../services/patientService';
import { Pet, RiskLevel } from '../types/pet';

export function useVetDashboard() {
  const [patients, setPatients] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDashboardData = useCallback(async () => {
    try {
      const data = await PatientService.getPatients();
      setPatients(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [loadDashboardData])
  );

  const processedPatients = useMemo(() => {
    return patients
      .map(p => ({
        ...p,
        status: AlertService.calculateRiskLevel({
          temperature: p.temperature,
          heartRate: p.heartRate,
          activity: p.activity,
        }),
      }))
      .sort((a, b) => {
        const priority: Record<RiskLevel, number> = { critical: 0, warning: 1, stable: 2 };
        return priority[a.status!] - priority[b.status!];
      });
  }, [patients]);

  const criticalCount = processedPatients.filter(p => p.status === 'critical').length;
  const warningCount = processedPatients.filter(p => p.status === 'warning').length;
  const stableCount = processedPatients.length - criticalCount - warningCount;

  return { loading, processedPatients, criticalCount, warningCount, stableCount };
}
