import React, { useState, useEffect } from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, KeyboardAvoidingView, Platform, Alert, ToastAndroid, ActivityIndicator, Switch} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { salvar } from '../services/imageApi';
import { StorageService, PetData } from '../storage';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';

export const ProfileScreen = () => {
  const { colors, spacing, radius, typography, isDark, toggleTheme, shadows } = useTheme();
  const { user, signOut } = useAuth();
  
  const [petName, setPetName] = useState('Max');
  const [breed, setBreed] = useState('Golden Retriever');
  const [age, setAge] = useState('3');
  const [weight, setWeight] = useState('28.5');
  const [ownerName, setOwnerName] = useState('Carlos Silva');
  const [imagem, setImagem] = useState<string | null | undefined>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPetData();
  }, []);

  const loadPetData = async () => {
    const data = await StorageService.getPetData();
    if (data) {
      setPetName(data.name);
      setBreed(data.breed);
      setAge(data.age);
      setWeight(data.weight);
      setOwnerName(data.ownerName || user?.name || 'Carlos Silva');
      setImagem(data.image);
    } else {
      setOwnerName(user?.name || 'Carlos Silva');
    }
    setIsLoading(false);
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: false,
        aspect: [4, 3],
        quality: 0.2,
        base64: true
      });

      if (result.assets != null && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        if (selectedImage.base64 != null) {
          try {
            await salvar(selectedImage.base64);
            setImagem(selectedImage.base64);
            await StorageService.savePetData({
              name: petName,
              breed,
              age,
              weight,
              ownerName,
              image: selectedImage.base64
            });
            if (Platform.OS === 'android') {
              ToastAndroid.show("Imagem salva com sucesso!", ToastAndroid.SHORT);
            } else {
              Alert.alert("Sucesso", "Imagem salva com sucesso!");
            }
          } catch (err) {
            Alert.alert("Erro", "Não foi possível salvar a imagem remotamente.");
          }
        }
      }
    } else {
      Alert.alert("Permissão Necessária", "É necessário permissão para acessar a galeria");
    }
  };

  const handleSave = async () => {
    const data: PetData = {
      name: petName,
      breed,
      age,
      weight,
      ownerName,
      image: imagem
    };
    
    await StorageService.savePetData(data);
    Alert.alert('Sucesso', 'Informações salvas!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => signOut() }
      ]
    );
  };

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
          <TouchableOpacity onPress={pickImage} style={[styles.imageContainer, { ...shadows.md }]}>
            {imagem ? (
              <Image 
                source={{ uri: `data:image/png;base64,${imagem}` }} 
                style={[styles.profileImage, { borderRadius: radius.xxl }]} 
              />
            ) : (
              <View style={[styles.placeholderImage, { backgroundColor: colors.card, borderRadius: radius.xxl }]}>
                <Icon name="camera" size={32} color={colors.primary} />
              </View>
            )}
            <View style={[styles.editBadge, { backgroundColor: colors.primary, borderColor: colors.card }]}>
              <Icon name="pencil" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>
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
          <Input
            label="Nome do Tutor"
            value={ownerName}
            onChangeText={setOwnerName}
            icon={<Icon name="account-outline" size={20} color={colors.primary} />}
          />
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

