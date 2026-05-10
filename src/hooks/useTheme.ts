import { useAppTheme } from '../theme/themeProvider';

export const useTheme = () => {
  const { theme, themeType, toggleTheme, isDark } = useAppTheme();
  
  return {
    theme,
    themeType,
    toggleTheme,
    isDark,
    colors: theme,
    spacing: theme.spacing,
    radius: theme.radius,
    typography: theme.typography,
    shadows: theme.shadows,
  };
};
