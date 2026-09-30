import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertService } from '../services/alertService';
import { notificationService } from '../services/notificationService';

export function useAlertNotifications() {
  const notifiedRef = useRef<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  const { data: alerts = [] } = useQuery({
    queryKey: ['quick-alerts'],
    queryFn: AlertService.getQuickAlerts,
    refetchInterval: 10000,
  });

  useEffect(() => {
    notificationService.ensureReady().then(setReady);
  }, []);

  useEffect(() => {
    if (!ready || alerts.length === 0) return;

    alerts.forEach(alert => {
      const key = `${alert.petId}:${alert.reason}`;
      if (notifiedRef.current.has(key)) return;

      notifiedRef.current.add(key);
      notificationService.notifyPetAlert({
        petId: alert.petId,
        petName: alert.name,
        reason: alert.reason,
        critical: alert.currentStatus.toLowerCase() === 'critical',
      });
    });
  }, [alerts, ready]);
}
