import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  PET_DATA: '@pet_monitoring:pet_data',
  ALERTS: '@pet_monitoring:alerts',
};

export interface PetData {
  name: string;
  breed: string;
  age: string;
  weight: string;
  ownerName?: string;
  image?: string | null;
}

export const StorageService = {
  async savePetData(data: PetData): Promise<void> {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(KEYS.PET_DATA, jsonValue);
    } catch {}},

  async getPetData(): Promise<PetData | null> {
    try {
      const jsonValue = await AsyncStorage.getItem(KEYS.PET_DATA);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch {
      return null;
    }
  },

  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch {}}
};