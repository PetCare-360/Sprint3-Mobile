import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export function useSettingsScreen() {
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair do sistema?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: async () => await signOut() },
      ]
    );
  };

  return { handleSignOut };
}
