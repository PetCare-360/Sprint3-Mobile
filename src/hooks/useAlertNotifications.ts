import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertService } from '../services/alertService';
import { notificationService } from '../services/notificationService';

/**
 * Notificação local para alertas de saúde reais dos pets do tutor.
 *
 * O evento gerador é o mesmo polling que já existe em `useAlerts`
 * (GET /pets/quick-alerts, calculado pelo backend a partir dos dados do
 * sensor) — não é um disparo manual. A diferença é que este hook deve ser
 * montado uma única vez, no topo da navegação do tutor, para funcionar
 * mesmo quando o usuário está em outra aba (Home, Mapa, etc.), não só
 * quando a tela de Alertas está aberta.
 */
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
      // Chave estável por pet + motivo: se o mesmo alerta persistir entre
      // polls, não notifica de novo; se o motivo mudar (ex.: piorou de
      // "atividade baixa" para "febre alta"), é tratado como um alerta novo.
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
