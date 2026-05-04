import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { light, dark } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';
import { typography } from './typography';
import { shadows } from './shadows';

const THEME_STORAGE_KEY = '@petcare360:theme';

export type ThemeType = 'light' | 'dark';

export type ThemeColors = typeof light;
export interface Theme extends ThemeColors {
  spacing: typeof spacing;
  radius: typeof radius;
  typography: typeof typography;
  shadows: typeof shadows;
}

interface ThemeContextData {
  theme: Theme;
  themeType: ThemeType;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextData>({} as ThemeContextData);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const deviceColorScheme = useColorScheme();
  const [themeType, setThemeType] = useState<ThemeType>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        setThemeType(savedTheme as ThemeType);
      } else {
        setThemeType(deviceColorScheme === 'dark' ? 'dark' : 'light');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = async () => {
    const newTheme = themeType === 'light' ? 'dark' : 'light';
    setThemeType(newTheme);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newTheme);
  };

  const currentColors = themeType === 'light' ? light : dark;

  const themeValue: Theme = {
    ...currentColors,
    spacing,
    radius,
    typography,
    shadows,
  };

  if (isLoading) return null;

  return (
    <ThemeContext.Provider value={{ 
      theme: themeValue, 
      themeType, 
      toggleTheme, 
      isDark: themeType === 'dark' 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};
