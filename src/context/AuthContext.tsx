import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, userStorage } from '../storage/userStorage';
import { authService } from '../services/authService';
import { RegisterRequest } from '../types/auth';
import { ApiException } from '../types/apiException';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const storageUser = await userStorage.getUser();
      if (storageUser) {
        const stillValid = await authService.validateSession();
        if (stillValid) {
          setUser(storageUser);
        } else {
          await userStorage.removeUser();
        }
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const apiUser = await authService.signIn(email, password);
      const localUser: User = {
        id: apiUser.id,
        name: apiUser.name,
        email: apiUser.email,
        role: apiUser.role,
      };
      await userStorage.saveUser(localUser);
      setUser(localUser);
      return { success: true };
    } catch (error) {
      const message = error instanceof ApiException ? error.message : 'Erro inesperado ao entrar.';
      return { success: false, error: message };
    }
  }, []);

  const signUp = useCallback(async (data: RegisterRequest) => {
    try {
      await authService.signUp(data);
      return { success: true };
    } catch (error) {
      const message = error instanceof ApiException ? error.message : 'Erro inesperado ao cadastrar.';
      return { success: false, error: message };
    }
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    await userStorage.removeUser();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
