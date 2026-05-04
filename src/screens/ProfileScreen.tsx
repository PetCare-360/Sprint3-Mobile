import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ToastAndroid,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { salvar } from '../services/imageApi';
import { StorageService, PetData } from '../storage';
import { useTheme } from '../hooks/useTheme';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';

const Section = ({ title, children }: { title?: string, children: React.ReactNode }) => {
  const { colors, radius } = useTheme();
  return (
    <View style={styles.section}>
      {title && <Text style={[styles.sectionHeader, { color: colors.textSecondary }]}>{title}</Text>}
      <View style={[styles.sectionBody, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: radius.md }]}>
        {children}
      </View>
    </View>
  );
};

const Row = ({ label, children, isLast = false }: { label: string, children: React.ReactNode, isLast?: boolean }) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, !isLast && { borderBottomWidth: 0.5, borderBottomColor: colors.border }]}>
      <Text style={[styles.rowLabel, { color: colors.textSecondary, fontSize: 12, marginBottom: 4 }]}>{label}</Text>
      <View style={styles.rowValue}>{children}</View>
    </View>
  );
};

export const ProfileScreen = () => {
  const { colors, spacing, radius, typography, isDark, toggleTheme } = useTheme();
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
      <Header title="Perfil do Pet" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {imagem ? (
              <Image 
                source={{ uri: `data:image/png;base64,${imagem}` }} 
                style={[styles.profileImage, { borderRadius: 45 }]} 
              />
            ) : (
              <View style={[styles.placeholderImage, { backgroundColor: colors.card, borderRadius: 45 }]}>
                <Icon name="camera" size={32} color={colors.textSecondary} />
              </View>
            )}
            <View style={[styles.editBadge, { backgroundColor: colors.primary, borderColor: colors.card }]}>
              <Icon name="pencil" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.profileName, { color: colors.text }]}>{petName}</Text>
          
          <View style={[styles.tutorBadge, { backgroundColor: colors.primary + '10' }]}>
            <Text style={[styles.tutorName, { color: colors.primary, fontSize: typography.sizes.xs }]}>
              Tutor: {ownerName}
            </Text>
          </View>
        </View>

        <Section title="INFORMAÇÕES DO TUTOR">
          <Row label="Nome do Tutor" isLast>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={ownerName}
              onChangeText={setOwnerName}
              placeholderTextColor={colors.textSecondary}
            />
          </Row>
        </Section>

        <Section title="INFORMAÇÕES DO PET">
          <Row label="Nome">
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={petName}
              onChangeText={setPetName}
              placeholderTextColor={colors.textSecondary}
            />
          </Row>
          <Row label="Raça">
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={breed}
              onChangeText={setBreed}
              placeholderTextColor={colors.textSecondary}
            />
          </Row>
          <Row label="Idade">
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />
          </Row>
          <Row label="Peso (kg)" isLast>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
            />
          </Row>
        </Section>

        <Section title="PREFERÊNCIAS">
          <Row label="Modo Escuro" isLast>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary + '50' }}
              thumbColor={isDark ? colors.primary : colors.gray500}
            />
          </Row>
        </Section>

        <TouchableOpacity 
          style={[styles.saveButton, { backgroundColor: colors.primary, borderRadius: radius.md }]} 
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>

        <Section>
          <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
            <Text style={[styles.logoutText, { color: colors.danger }]}>Sair da Conta</Text>
          </TouchableOpacity>
        </Section>

        <Text style={[styles.versionText, { color: colors.textSecondary }]}>PetCare 360 v1.0.0</Text>
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
    marginVertical: 24,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 90,
    height: 90,
  },
  placeholderImage: {
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
  },
  tutorBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tutorName: {
    fontWeight: '600',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '400',
    marginBottom: 8,
    marginLeft: 16,
    textTransform: 'uppercase',
  },
  sectionBody: {
    borderWidth: Platform.OS === 'android' ? 1 : 0,
    overflow: 'hidden',
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rowLabel: {
    fontWeight: '600',
  },
  rowValue: {
    width: '100%',
  },
  input: {
    fontSize: 16,
    width: '100%',
    paddingVertical: 4,
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 32,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutRow: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 13,
  },
});
