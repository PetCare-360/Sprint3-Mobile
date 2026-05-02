export const palette = {
  primary: '#6C63FF',
  secondary: '#FF6584',
  success: '#34C759', // iOS Success
  warning: '#FFCC00', // iOS Warning
  danger: '#FF3B30',  // iOS Danger
  white: '#FFFFFF',
  black: '#000000',
};

export const lightTheme = {
  dark: false,
  colors: {
    primary: palette.primary,
    secondary: palette.secondary,
    background: '#F2F2F7', // iOS System Background
    card: '#FFFFFF',
    text: '#000000',
    textSecondary: '#8E8E93', // iOS Gray
    border: '#C6C6C8',
    success: palette.success,
    warning: palette.warning,
    danger: palette.danger,
    white: palette.white,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 20, // Apple-style rounded corners
    round: 50,
  },
};

export const darkTheme = {
  dark: true,
  colors: {
    primary: palette.primary,
    secondary: palette.secondary,
    background: '#000000', // iOS System Background Dark
    card: '#1C1C1E',      // iOS Secondary System Background Dark
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    border: '#38383A',
    success: palette.success,
    warning: palette.warning,
    danger: palette.danger,
    white: palette.white,
  },
  spacing: lightTheme.spacing,
  borderRadius: lightTheme.borderRadius,
};

export type AppTheme = typeof lightTheme;
export const theme = lightTheme; // Default theme for backward compatibility during transition
