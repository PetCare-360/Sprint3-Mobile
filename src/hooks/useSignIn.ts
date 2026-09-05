import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export function useSignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signIn(email.trim().toLowerCase(), password);
      if (!result.success) {
        Alert.alert('Erro', result.error || 'Usuário ou senha inválidos.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    email,
    password,
    isSubmitting,
    setEmail,
    setPassword,
    handleSignIn,
  };
}
