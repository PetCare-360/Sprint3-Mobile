import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { AppNavigator } from './src/navigation';
import { navigationRef, navigateToAlerts } from './src/navigation/navigationRef';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, useAppTheme } from './src/theme/themeProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { notificationService } from './src/services/notificationService';

const queryClient = new QueryClient();

const AppContent = () => {
  const { theme, isDark } = useAppTheme();

  useEffect(() => {
    const subscription = notificationService.addResponseListener(data => {
      if (data.type === 'pet-alert') {
        navigateToAlerts();
      }
    });
    return () => subscription.remove();
  }, []);

  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      primary: theme.primary,
      background: theme.background,
      card: theme.card,
      text: theme.text,
      border: theme.border,
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
