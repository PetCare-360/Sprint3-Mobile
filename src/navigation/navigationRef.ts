import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function navigateToAlerts() {
  if (!navigationRef.isReady()) return;
  const root = navigationRef.getRootState()?.routes?.[0]?.name;

  if (root === 'Tutor') {
    (navigationRef.navigate as (...args: any[]) => void)('Tutor', {
      screen: 'TutorTabs',
      params: { screen: 'Alerts' },
    });
  } else if (root === 'Vet') {
    (navigationRef.navigate as (...args: any[]) => void)('Vet', {
      screen: 'VetDashboard',
    });
  }
}

export function navigateToAppointments() {
  if (!navigationRef.isReady()) return;
  const root = navigationRef.getRootState()?.routes?.[0]?.name;

  if (root === 'Tutor') {
    (navigationRef.navigate as (...args: any[]) => void)('Tutor', {
      screen: 'Appointments',
    });
  } else {
    (navigationRef.navigate as (...args: any[]) => void)('Vet', {
      screen: 'Appointments',
    });
  }
}
