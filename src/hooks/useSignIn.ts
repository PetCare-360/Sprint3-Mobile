import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export function useSignIn() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();

  const fillDemoCredentials = (demoLogin: string, demoPassword: string) => {
    setLogin(demoLogin);
    setPassword(demoPassword);
  };

  const handleSignIn = async () => {
    if (!login || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await signIn(login, password);
      if (!success) {
        Alert.alert('Erro', 'Usuário ou senha inválidos.');
      }
    } catch {
      Alert.alert('Erro', 'Ocorreu um problema ao entrar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    login,
    password,
    isSubmitting,
    setLogin,
    setPassword,
    fillDemoCredentials,
    handleSignIn,
  };
}
