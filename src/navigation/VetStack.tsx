import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VetDashboard } from '../screens/vet/VetDashboard';
import { Patients } from '../screens/vet/Patients';
import { PetDetails } from '../screens/vet/PetDetails';
import { theme } from '../theme';

const Stack = createNativeStackNavigator();

export const VetStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.primary },
        headerTintColor: theme.colors.white,
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen 
        name="VetDashboard" 
        component={VetDashboard} 
        options={{ title: 'Painel Veterinário' }}
      />
      <Stack.Screen 
        name="Patients" 
        component={Patients} 
        options={{ title: 'Meus Pacientes' }}
      />
      <Stack.Screen 
        name="PetDetails" 
        component={PetDetails} 
        options={{ title: 'Detalhes do Pet' }}
      />
    </Stack.Navigator>
  );
};
