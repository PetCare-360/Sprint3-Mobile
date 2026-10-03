import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'petcare360_jwt';

/**
 * Persiste o JWT no Keychain (iOS) / Keystore (Android) via expo-secure-store,
 * em vez de AsyncStorage puro — um Bearer token dá acesso total à conta até
 * expirar, então merece armazenamento criptografado pelo SO, não texto plano.
 */
export const tokenStorage = {
  async saveToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    } catch {
      // Falha ao persistir não deve derrubar o login em andamento.
    }
  },

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      return null;
    }
  },

  async removeToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch {
      // no-op
    }
  },
};
