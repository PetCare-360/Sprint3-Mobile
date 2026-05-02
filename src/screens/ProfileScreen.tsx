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
import { useAppTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export const ProfileScreen = () => {
  const { theme, isDark, themeType, setThemeType } = useAppTheme();
  const { signOut } = useAuth();
  const [petName, setPetName] = useState('Max');
  const [breed, setBreed] = useState('Golden Retriever');
  const [age, setAge] = useState('3');
  const [weight, setWeight] = useState('28.5');
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
      setImagem(data.image);
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
        if (selectedImage.base64 != null && selectedImage.base64 != undefined) {
          try {
            await salvar(selectedImage.base64);
            setImagem(selectedImage.base64);
            await StorageService.savePetData({
              name: petName,
              breed,
              age,
              weight,
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
      <View style={[styles.container, styles.centered, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const Section = ({ title, children }: { title?: string, children: React.ReactNode }) => (
    <View style={styles.section}>
      {title && <Text style={[styles.sectionHeader, { color: theme.colors.textSecondary }]}>{title}</Text>}
      <View style={[styles.sectionBody, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
        {children}
      </View>
    </View>
  );

  const Row = ({ label, children, isLast = false }: { label: string, children: React.ReactNode, isLast?: boolean }) => (
    <View style={[styles.row, !isLast && { borderBottomWidth: 0.5, borderBottomColor: theme.colors.border }]}>
      <Text style={[styles.rowLabel, { color: theme.colors.text }]}>{label}</Text>
      <View style={styles.rowValue}>{children}</View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>Ajustes</Text>
        </View>

        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {imagem ? (
              <Image 
                source={{ uri: `data:image/png;base64,${imagem}` }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={[styles.placeholderImage, { backgroundColor: theme.colors.card }]}>
                <Icon name="camera" size={32} color={theme.colors.textSecondary} />
              </View>
            )}
            <View style={[styles.editBadge, { backgroundColor: theme.colors.primary }]}>
              <Icon name="pencil" size={14} color="#FFF" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.profileName, { color: theme.colors.text }]}>{petName}</Text>
          <Text style={[styles.profileSubtitle, { color: theme.colors.textSecondary }]}>{breed}</Text>
        </View>

        <Section title="INFORMAÇÕES DO PET">
          <Row label="Nome">
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={petName}
              onChangeText={setPetName}
              placeholderTextColor={theme.colors.textSecondary}
              textAlign="right"
            />
          </Row>
          <Row label="Raça">
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={breed}
              onChangeText={setBreed}
              placeholderTextColor={theme.colors.textSecondary}
              textAlign="right"
            />
          </Row>
          <Row label="Idade">
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              textAlign="right"
            />
          </Row>
          <Row label="Peso (kg)" isLast>
            <TextInput
              style={[styles.input, { color: theme.colors.text }]}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              textAlign="right"
            />
          </Row>
        </Section>

        <Section title="PREFERÊNCIAS">
          <Row label="Modo Escuro" isLast>
            <Switch
              value={isDark}
              onValueChange={(val) => setThemeType(val ? 'dark' : 'light')}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : (isDark ? theme.colors.primary : '#f4f3f4')}
            />
          </Row>
        </Section>

        <TouchableOpacity style={[styles.saveButton, { backgroundColor: theme.colors.primary }]} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>

        <Section>
          <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
            <Text style={[styles.logoutText, { color: theme.colors.danger }]}>Sair da Conta</Text>
          </TouchableOpacity>
        </Section>

        <Text style={[styles.versionText, { color: theme.colors.textSecondary }]}>PetCare 360 v1.0.0</Text>
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    letterSpacing: -1,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  placeholderImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
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
    borderColor: '#FFF',
  },
  profileName: {
    fontSize: 22,
    fontWeight: '700',
  },
  profileSubtitle: {
    fontSize: 15,
    marginTop: 2,
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
    borderRadius: 12,
    borderWidth: Platform.OS === 'android' ? 1 : 0,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    minHeight: 44,
  },
  rowLabel: {
    fontSize: 17,
  },
  rowValue: {
    flex: 1,
    alignItems: 'flex-end',
  },
  input: {
    fontSize: 17,
    width: '100%',
    paddingVertical: 8,
  },
  saveButton: {
    marginHorizontal: 20,
    marginTop: 32,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },
  logoutRow: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '400',
  },
  versionText: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 13,
  },
});
