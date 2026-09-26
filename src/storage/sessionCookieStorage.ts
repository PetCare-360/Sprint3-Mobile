import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_COOKIE_KEY = '@PetCare360:sessionCookie';

export const sessionCookieStorage = {
  async saveCookie(cookie: string): Promise<void> {
    try {
      await AsyncStorage.setItem(SESSION_COOKIE_KEY, cookie);
    } catch {
    }
  },

  async getCookie(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(SESSION_COOKIE_KEY);
    } catch {
      return null;
    }
  },

  async removeCookie(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SESSION_COOKIE_KEY);
    } catch {
    }
  },
};