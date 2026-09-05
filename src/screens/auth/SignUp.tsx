import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, StatusBar, SafeAreaView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useSignUp } from '../../hooks/useSignUp';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';

export const SignUp = ({ navigation }: any) => {
  const { colors, spacing, isDark } = useTheme();
  const {
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
  } = useSignUp(() => navigation.navigate('SignIn'));

  const inputIconColor = colors.primary;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SafeAreaView />

        <View style={[styles.header, { paddingHorizontal: spacing.xl }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>

          <Text style={[styles.title, { color: colors.text }]}>Criar Conta</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Cadastre-se para acompanhar a saúde do seu pet
          </Text>

          <View style={styles.form}>
            <Input
              label="Nome"
              placeholder="Digite seu nome completo"
              value={name}
              onChangeText={setName}
              icon={<MaterialCommunityIcons name="account" size={20} color={inputIconColor} />}
            />

            <Input
              label="E-mail"
              placeholder="Digite seu e-mail"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              icon={<MaterialCommunityIcons name="email" size={20} color={inputIconColor} />}
            />

            <Input
              label="Senha"
              placeholder="Mínimo de 6 caracteres"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon={<MaterialCommunityIcons name="lock" size={20} color={inputIconColor} />}
            />

            <Input
              label="Confirmar Senha"
              placeholder="Repita sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              icon={<MaterialCommunityIcons name="lock-check" size={20} color={inputIconColor} />}
            />

            <Text style={[styles.roleLabel, { color: colors.textSecondary }]}>TIPO DE CONTA</Text>
            <View style={styles.roleOptions}>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  { borderColor: role === 'ROLE_CLIENTE' ? colors.primary : colors.border },
                  role === 'ROLE_CLIENTE' && { backgroundColor: colors.primary + '12' },
                ]}
                onPress={() => setRole('ROLE_CLIENTE')}
              >
                <MaterialCommunityIcons name="account-heart-outline" size={22} color={role === 'ROLE_CLIENTE' ? colors.primary : colors.textSecondary} />
                <Text style={{ color: role === 'ROLE_CLIENTE' ? colors.primary : colors.text }}>Tutor</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.roleOption,
                  { borderColor: role === 'ROLE_VETERINARIO' ? colors.primary : colors.border },
                  role === 'ROLE_VETERINARIO' && { backgroundColor: colors.primary + '12' },
                ]}
                onPress={() => setRole('ROLE_VETERINARIO')}
              >
                <MaterialCommunityIcons name="stethoscope" size={22} color={role === 'ROLE_VETERINARIO' ? colors.primary : colors.textSecondary} />
                <Text style={{ color: role === 'ROLE_VETERINARIO' ? colors.primary : colors.text }}>Veterinário</Text>
              </TouchableOpacity>
            </View>

            <Button
              title="Cadastrar"
              onPress={handleSignUp}
              loading={isSubmitting}
              style={styles.button}
            />

            <TouchableOpacity style={styles.signInLink} onPress={() => navigation.navigate('SignIn')}>
              <Text style={[styles.signInLinkText, { color: colors.textSecondary }]}>
                Já tem conta? <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Entrar</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flex: 1,
    marginTop: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  roleLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  roleOptions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  roleOption: {
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1.5,
    flex: 1,
    gap: 6,
    paddingVertical: 14,
  },
  button: {
    width: '100%',
    marginTop: 8,
  },
  signInLink: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  signInLinkText: {
    fontSize: 14,
  },
});
