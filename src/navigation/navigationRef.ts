import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigateToAlerts() {
  if (!navigationRef.isReady()) return;
  (navigationRef.navigate as (...args: any[]) => void)('Tutor', {
    screen: 'TutorTabs',
    params: { screen: 'Alerts' },
  });
}

export function navigateToAppointments() {
  if (!navigationRef.isReady()) return;
  (navigationRef.navigate as (...args: any[]) => void)('Vet', {
    screen: 'Appointments',
  });
}
