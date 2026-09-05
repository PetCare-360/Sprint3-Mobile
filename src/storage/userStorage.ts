import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiRole } from '../types/auth';

const USER_STORAGE_KEY = '@PetCare360:user';

export interface User {
  id: number;
  name: string;
  email: string;
  role: ApiRole;
}

export const userStorage = {
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch {}
  },

  async getUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch {}
  },
};
