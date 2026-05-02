import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_STORAGE_KEY = '@PetCare360:user';

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'pet';
  login: string;
}

export const userStorage = {
  async saveUser(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user:', error);
    }
  },

  async getUser(): Promise<User | null> {
    try {
      const data = await AsyncStorage.getItem(USER_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  async removeUser(): Promise<void> {
    try {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Error removing user:', error);
    }
  },
};
