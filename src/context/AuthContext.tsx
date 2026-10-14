import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, userStorage } from '../storage/userStorage';
import { tokenStorage } from '../storage/tokenStorage';
import { authService } from '../services/authService';
import { RegisterRequest } from '../types/auth';
import { ApiException } from '../types/apiException';
import { ApiRole } from '../types/auth';

function isStoredUser(value: unknown): value is User {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<User>;
  return (
    typeof candidate.id === 'number' &&
    typeof candidate.name === 'string' &&
    typeof candidate.email === 'string' &&
    ['ROLE_ADMIN', 'ROLE_CLIENTE', 'ROLE_VETERINARIO'].includes(candidate.role as ApiRole)
  );
}

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
      try {
        const storageUser = await userStorage.getUser();
        if (!isStoredUser(storageUser)) {
          if (storageUser) await userStorage.removeUser();
          await tokenStorage.removeToken();
          return;
        }

        try {
          const apiUser = await authService.validateSession();
          if (apiUser) {
            const freshUser: User = {
              id: apiUser.id,
              name: apiUser.name,
              email: apiUser.email,
              role: apiUser.role,
            };
            await userStorage.saveUser(freshUser);
            setUser(freshUser);
          } else {
            // Token expirado ou rejeitado pela API (401/403)
            await userStorage.removeUser();
            await tokenStorage.removeToken();
            setUser(null);
          }
        } catch (networkError) {
          // Em falha de conexão transitória ou Render acordando (cold start),
          // preserva a sessão salva localmente para não deslogar indevidamente.
          console.warn('[AuthContext] Falha de conexão ao validar sessão. Mantendo sessão salva.', networkError);
          setUser(storageUser);
        }
      } catch (error) {
        console.warn('[AuthContext] Erro ao carregar dados locais do usuário.', error);
        await userStorage.removeUser();
        await tokenStorage.removeToken();
      } finally {
        setLoading(false);
      }
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
    try {
      await authService.signOut();
    } finally {
      await userStorage.removeUser();
      await tokenStorage.removeToken();
      setUser(null);
    }
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
