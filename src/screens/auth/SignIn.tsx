import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform,Alert,ScrollView,StatusBar,Image,SafeAreaView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

const logoBranco = require('../../../public/branco.png');
const logoPreto = require('../../../public/preto.png');

export const SignIn = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const { colors, spacing, typography, radius, isDark } = useTheme();

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

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <View style={[styles.topBar, { backgroundColor: colors.primary }]}>
        <SafeAreaView />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={[styles.logoContainer, { backgroundColor: isDark ? colors.black : colors.white, borderRadius: radius.xl }]}>
            <Image source={isDark ? logoPreto : logoBranco} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={[styles.title, { color: colors.text, fontSize: typography.sizes.xhg }]}>
            PetCare <Text style={{ color: colors.primary }}>360</Text>
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary, fontSize: typography.sizes.md }]}>
            Cuidando de quem você ama, em todos os ângulos.
          </Text>
        </View>

        <Card style={styles.formCard} variant="elevated" padding="lg">
          <Input
            label="Usuário"
            placeholder="Digite seu login"
            value={login}
            onChangeText={setLogin}
            autoCapitalize="none"
            icon={<MaterialCommunityIcons name="account-outline" size={20} color={colors.textSecondary} />}
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            icon={<MaterialCommunityIcons name="lock-outline" size={20} color={colors.textSecondary} />}
          />

          <Button 
            title="Entrar"
            onPress={handleSignIn}
            loading={isSubmitting}
            style={styles.button}
          />

          <View style={[styles.footer, { marginTop: spacing.xl }]}>
            <Text style={[styles.infoTitle, { color: colors.primary, fontSize: typography.sizes.xs }]}>
              NOTAS DE ACESSO (DEMO):
            </Text>
            <View style={[styles.badgeContainer, { marginTop: spacing.xs }]}>
              <View style={[styles.badge, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>Vet: admin / admin</Text>
              </View>
              <View style={[styles.badge, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>Tutor: pet / pet</Text>
              </View>
            </View>
          </View>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  logo: {
    width: 100,
    height: 100,
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.8,
  },
  formCard: {
    width: '100%',
  },
  button: {
    marginTop: 10,
  },
  footer: {
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
    paddingTop: 20,
  },
  infoTitle: {
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});