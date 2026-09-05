import { useState } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { ApiRole } from '../types/auth';

export function useSignUp(onSuccess: () => void) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<ApiRole>('ROLE_CLIENTE');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();

  const handleSignUp = async () => {
    if (!name.trim() || !email.trim() || !password || !role) {
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
      const result = await signUp({ name: name.trim(), email: email.trim().toLowerCase(), password, role });
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
    role,
    isSubmitting,
    setName,
    setEmail,
    setPassword,
    setConfirmPassword,
    setRole,
    handleSignUp,
  };
}
