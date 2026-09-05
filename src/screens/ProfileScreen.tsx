import React from 'react';
import {View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator, Switch} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { useProfileForm } from '../hooks/useProfileForm';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';

export const ProfileScreen = () => {
  const { colors, spacing, typography, isDark, toggleTheme } = useTheme();
  const {
    petName,
    breed,
    age,
    weight,
    ownerName,
    isLoading,
    setPetName,
    setBreed,
    setAge,
    setWeight,
    handleSave,
    handleLogout,
  } = useProfileForm();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Header title="Perfil" />
      
      <ScrollView 
        contentContainerStyle={[styles.scrollContent, { padding: spacing.lg }]} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileHeader}>
          <View style={[styles.placeholderImage, { backgroundColor: colors.card }]}>
            <Icon name="account" size={32} color={colors.primary} />
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>{petName}</Text>
          <Text style={[styles.profileBreed, { color: colors.textSecondary }]}>{breed}</Text>
          
          <View style={[styles.tutorBadge, { backgroundColor: colors.primary + '10' }]}>
            <Icon name="account" size={16} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.tutorName, { color: colors.primary, fontSize: typography.sizes.xs }]}>
              Tutor: {ownerName}
            </Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: spacing.md }]}>
            Informações do Tutor
          </Text>
          <Card padding="md" variant="flat">
            <View style={styles.readOnlyRow}>
              <Icon name="account-outline" size={20} color={colors.primary} />
              <Text style={[styles.readOnlyValue, { color: colors.text }]}>{ownerName}</Text>
            </View>
            <Text style={[styles.readOnlyHint, { color: colors.textSecondary }]}>
              O nome do tutor é gerenciado pela conta autenticada.
            </Text>
          </Card>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: spacing.md }]}>
            Informações do Pet
          </Text>
          <Input
            label="Nome do Pet"
            value={petName}
            onChangeText={setPetName}
            icon={<Icon name="dog" size={20} color={colors.primary} />}
          />
          <Input
            label="Raça"
            value={breed}
            onChangeText={setBreed}
            icon={<Icon name="shape-outline" size={20} color={colors.primary} />}
          />
          <View style={styles.rowInputs}>
            <Input
              label="Idade"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              containerStyle={{ flex: 1, marginRight: spacing.md }}
              icon={<Icon name="calendar-outline" size={20} color={colors.primary} />}
            />
            <Input
              label="Peso (kg)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              containerStyle={{ flex: 1 }}
              icon={<Icon name="weight-kilogram" size={20} color={colors.primary} />}
            />
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: spacing.md }]}>
            Preferências
          </Text>
          <Card padding="md" variant="flat">
            <View style={styles.preferenceRow}>
              <View style={styles.preferenceInfo}>
                <Text style={[styles.preferenceLabel, { color: colors.text }]}>Modo Escuro</Text>
                <Text style={[styles.preferenceSub, { color: colors.textSecondary }]}>Alterar aparência do app</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: colors.divider, true: colors.primary + '50' }}
                thumbColor={isDark ? colors.primary : (Platform.OS === 'ios' ? undefined : colors.gray300)}
              />
            </View>
          </Card>
        </View>

        <Button 
          title="Salvar Alterações" 
          onPress={handleSave}
          style={{ marginTop: spacing.lg }}
        />

        <Button 
          title="Sair da Conta" 
          variant="danger"
          onPress={handleLogout}
          style={{ marginTop: spacing.md, backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.danger + '30' }}
          textStyle={{ color: colors.danger }}
        />

        <Text style={[styles.versionText, { color: colors.textSecondary }]}>PetCare 360 v1.2.0 • 2026</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  profileBreed: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 2,
  },
  tutorBadge: {
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tutorName: {
    fontWeight: 'bold',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: -0.2,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  readOnlyRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  readOnlyValue: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },
  readOnlyHint: {
    fontSize: 12,
    marginTop: 8,
  },
  preferenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preferenceInfo: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: 'semibold',
  },
  preferenceSub: {
    fontSize: 12,
    marginTop: 2,
  },
  versionText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.6,
  },
});
