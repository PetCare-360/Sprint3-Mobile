import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { VetDashboard } from '../screens/vet/VetDashboard';
import { Patients } from '../screens/vet/Patients';
import { PetDetails } from '../screens/vet/PetDetails';
import { Settings } from '../screens/vet/Settings';
import { useTheme } from '../hooks/useTheme';

const Stack = createNativeStackNavigator();

export const VetStack = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background }
      }}
    >
      <Stack.Screen 
        name="VetDashboard" 
        component={VetDashboard} 
      />
      <Stack.Screen 
        name="Patients" 
        component={Patients} 
      />
      <Stack.Screen 
        name="PetDetails" 
        component={PetDetails} 
      />
      <Stack.Screen 
        name="Settings" 
        component={Settings} 
      />
    </Stack.Navigator>
  );
};
