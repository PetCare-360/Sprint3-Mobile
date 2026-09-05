import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export function useSignUp(onSuccess: () => void) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signUp({ name: name.trim(), email: email.trim().toLowerCase(), password });
      if (result.success) {
        Alert.alert('Sucesso', 'Cadastro realizado! Faça login para continuar.', [
          { text: 'OK', onPress: onSuccess },
        ]);
      } else {
        Alert.alert('Erro', result.error || 'Não foi possível concluir o cadastro.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    name,
    email,
    password,
    confirmPassword,
    isSubmitting,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    handleSignUp,
  };
}
