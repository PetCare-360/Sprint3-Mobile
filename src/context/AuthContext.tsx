import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, userStorage } from '../storage/userStorage';
import { authService } from '../services/authService';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn: (login: string, password: string) => Promise<boolean>;
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
        setUser(storageUser);
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  const signIn = async (login: string, password: string) => {
    const authenticatedUser = await authService.signIn(login, password);
    if (authenticatedUser) {
      setUser(authenticatedUser);
      return true;
    }
    return false;
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
