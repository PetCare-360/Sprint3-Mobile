import React from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, StatusBar, Image, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { useSignIn } from '../../hooks/useSignIn';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

const logoBranco = require('../../../public/branco.png');
const logoPreto = require('../../../public/preto.png');

export const SignIn = ({ navigation }: any) => {
  const { email, password, isSubmitting, setEmail, setPassword, handleSignIn } = useSignIn();
  const { colors, spacing, typography, radius, isDark, shadows, toggleTheme } = useTheme();

  const topBgColor = colors.primary;
  const bottomBgColor = colors.background;
  const contentTextColor = colors.text;
  const contentSecondaryTextColor = colors.textSecondary;
  const inputIconColor = colors.primary;
  const logoBlurColor = isDark ? '#000000' : '#FFFFFF';

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: bottomBgColor }]}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <ScrollView 
        contentContainerStyle={[styles.scrollContent]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.heroSection, { backgroundColor: topBgColor }]}>
          <SafeAreaView />

          <View style={styles.themeToggleContainer}>
            <MaterialCommunityIcons 
              name={isDark ? "weather-night" : "weather-sunny"} 
              size={18} 
              color={colors.white} 
              style={{ marginRight: 8 }}
            />
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: 'rgba(255,255,255,0.3)', true: colors.primaryLight }}
              thumbColor={colors.white}
              ios_backgroundColor="rgba(255,255,255,0.3)"
              style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
            />
          </View>

          <View style={styles.heroContent}>
            <View style={[styles.logoContainer, { backgroundColor: logoBlurColor, borderRadius: radius.xxl }]}>
              <Image source={isDark ? logoPreto : logoBranco} style={styles.logo} resizeMode="contain" />
            </View>
            <Text style={[styles.heroTitle, { color: colors.white }]}>PetCare 360</Text>
            <Text style={[styles.heroSubtitle, { color: 'rgba(255,255,255,0.8)' }]}>
              Cuidando de quem você ama.
            </Text>
          </View>
          <View style={[styles.heroCurve, { backgroundColor: bottomBgColor }]} />
        </View>

        <View style={[styles.formSection, { paddingHorizontal: spacing.xl }]}>
          <Text style={[styles.welcomeTitle, { color: contentTextColor }]}>Bem-vindo de volta!</Text>
          <Text style={[styles.welcomeSubtitle, { color: contentSecondaryTextColor }]}>Faça login para continuar</Text>

          <View style={styles.form}>
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
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              icon={<MaterialCommunityIcons name="lock" size={20} color={inputIconColor} />}
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <Button 
              title="Entrar na Conta"
              onPress={handleSignIn}
              loading={isSubmitting}
              style={styles.button}
            />

            <TouchableOpacity
              style={styles.signUpLink}
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={[styles.signUpLinkText, { color: contentSecondaryTextColor }]}>
                Não tem conta? <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Cadastre-se</Text>
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
  themeToggleContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  heroSection: {
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  logoContainer: {
    width: 80,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: 50,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  heroSubtitle: {
    fontSize: 16,
    marginTop: 4,
  },
  heroCurve: {
    position: 'absolute',
    bottom: -1,
    left: 0,
    right: 0,
    height: 40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  formSection: {
    flex: 1,
    marginTop: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 15,
    marginTop: 4,
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: -8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  button: {
    width: '100%',
  },
  demoSection: {
    marginTop: 48,
    alignItems: 'center',
    paddingBottom: 40,
  },
  divider: {
    height: 1,
    width: '100%',
    position: 'absolute',
    top: 10,
  },
  demoLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1,
    paddingHorizontal: 16,
    zIndex: 2,
  },
  demoBadges: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 12,
  },
  demoBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  demoBadgeText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  signUpLink: {
    alignItems: 'center',
    marginTop: 20,
  },
  signUpLinkText: {
    fontSize: 14,
  },
});