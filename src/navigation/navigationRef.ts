import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

/**
 * Leva o usuário direto para a aba de Alertas do tutor. Usado ao tocar numa
 * notificação de alerta de saúde. Só age se a navegação já estiver pronta
 * (app montado) e se o usuário estiver de fato no fluxo do tutor.
 */
export function navigateToAlerts() {
  if (!navigationRef.isReady()) return;
  (navigationRef.navigate as (...args: any[]) => void)('Tutor', {
    screen: 'TutorTabs',
    params: { screen: 'Alerts' },
  });
}
