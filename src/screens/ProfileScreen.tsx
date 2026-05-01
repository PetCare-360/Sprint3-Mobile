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
} from 'react-native';
import { theme } from '../theme';
import { Card } from '../components/Card';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import { salvar } from '../services/imageApi';
import { StorageService, PetData } from '../storage';

export const ProfileScreen = () => {
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
          console.log("Salvando a imagem remotamente...");
          try {
            await salvar(selectedImage.base64);
            setImagem(selectedImage.base64);
            
            // Persistir também no storage local imediatamente
            await StorageService.savePetData({
              name: petName,
              breed,
              age,
              weight,
              image: selectedImage.base64
            });

            console.log("Imagem Salva");
            if (Platform.OS === 'android') {
              ToastAndroid.show("Imagem salva com sucesso!", ToastAndroid.SHORT);
            } else {
              Alert.alert("Sucesso", "Imagem salva com sucesso!");
            }
          } catch (err) {
            console.log("Erro : ", err);
            Alert.alert("Erro", "Não foi possível salvar a imagem remotamente.");
          }
        }
      }
    } else {
      if (Platform.OS === 'android') {
        ToastAndroid.show("É necessário permissão para acessar a galeria", ToastAndroid.LONG);
      } else {
        Alert.alert("Permissão Necessária", "É necessário permissão para acessar a galeria");
      }
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
    Alert.alert('Sucesso', 'As informações do pet foram salvas localmente!');
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Perfil do Pet</Text>
          <Text style={styles.subtitle}>Gerencie as informações do seu melhor amigo</Text>
        </View>

        <View style={styles.imageSection}>
          <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
            {imagem ? (
              <Image 
                source={{ uri: `data:image/png;base64,${imagem}` }} 
                style={styles.profileImage} 
              />
            ) : (
              <View style={styles.placeholderImage}>
                <Icon name="camera" size={40} color={theme.colors.textSecondary} />
              </View>
            )}
            <View style={styles.editBadge}>
              <Icon name="pencil" size={16} color={theme.colors.white} />
            </View>
          </TouchableOpacity>
        </View>

        <Card style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nome do Pet</Text>
            <TextInput
              style={styles.input}
              value={petName}
              onChangeText={setPetName}
              placeholder="Ex: Max"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Raça</Text>
            <TextInput
              style={styles.input}
              value={breed}
              onChangeText={setBreed}
              placeholder="Ex: Golden Retriever"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: theme.spacing.md }]}>
              <Text style={styles.label}>Idade (anos)</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Peso (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="0.0"
              />
            </View>
          </View>
        </Card>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Salvar Alterações</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={() => StorageService.clearAll()}>
          <Icon name="trash-can-outline" size={20} color={theme.colors.danger} />
          <Text style={styles.logoutText}>Limpar Dados Locais</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  imageSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  imageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.white,
  },
  formCard: {
    padding: theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    fontSize: 16,
    color: theme.colors.text,
    backgroundColor: theme.colors.white,
  },
  row: {
    flexDirection: 'row',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  saveButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
  },
  logoutText: {
    color: theme.colors.danger,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
});
