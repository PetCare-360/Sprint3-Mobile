import { useEffect, useState } from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { salvar } from '../services/imageApi';
import { StorageService, PetData } from '../storage';
import { useAuth } from '../context/AuthContext';

export function useProfileForm() {
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

    if (!permissionResult.granted) {
      Alert.alert('Permissão Necessária', 'É necessário permissão para acessar a galeria');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.2,
      base64: true,
    });

    if (!result.assets || result.assets.length === 0) return;

    const selectedImage = result.assets[0];
    if (selectedImage.base64 == null) return;

    try {
      await salvar(selectedImage.base64);
      setImagem(selectedImage.base64);
      await StorageService.savePetData({
        name: petName,
        breed,
        age,
        weight,
        ownerName,
        image: selectedImage.base64,
      });
      if (Platform.OS === 'android') {
        ToastAndroid.show('Imagem salva com sucesso!', ToastAndroid.SHORT);
      } else {
        Alert.alert('Sucesso', 'Imagem salva com sucesso!');
      }
    } catch {
      Alert.alert('Erro', 'Não foi possível salvar a imagem remotamente.');
    }
  };

  const handleSave = async () => {
    const data: PetData = { name: petName, breed, age, weight, ownerName, image: imagem };
    await StorageService.savePetData(data);
    Alert.alert('Sucesso', 'Informações salvas!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Sair', style: 'destructive', onPress: () => signOut() },
      ]
    );
  };

  return {
    petName,
    breed,
    age,
    weight,
    ownerName,
    imagem,
    isLoading,
    setPetName,
    setBreed,
    setAge,
    setWeight,
    setOwnerName,
    pickImage,
    handleSave,
    handleLogout,
  };
}
