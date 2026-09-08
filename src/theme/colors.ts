// Paleta "vibrante & amigável" do PetCare360.
// Em vez do roxo-índigo genérico de SaaS, usamos um par quente/fresco que remete
// a coleira, brinquedo e parque: coral energético + turquesa de água + amarelo sol.
export const palette = {
  primary: '#FF6B4A',        // Coral — energia, calor, "hora do play"
  primaryLight: '#FFB199',
  primaryDark: '#E1502F',
  primaryGlow: 'rgba(255, 107, 74, 0.16)',

  secondary: '#14B8A6',      // Turquesa — frescor, água, saúde
  secondaryLight: '#5EEAD4',
  secondaryDark: '#0F8F81',
  secondaryGlow: 'rgba(20, 184, 166, 0.16)',

  accent: '#FFC145',         // Amarelo sol — destaques, medalhas, conquistas
  accentLight: '#FFE1A0',
  accentDark: '#E8A526',

  gray50: '#FBF8F5',
  gray100: '#F5EFE8',
  gray200: '#E9E0D6',
  gray300: '#D8CBBD',
  gray400: '#AFA192',
  gray500: '#8B7E74',
  gray600: '#6B5F57',
  gray700: '#4A413B',
  gray800: '#332C27',
  gray900: '#211C18',
  gray950: '#120F0D',

  darkBg: '#101922',
  darkSurface: '#182430',
  darkCard: '#1C2A37',
  darkBorder: '#2B3D4C',

  success: '#22C55E',
  warning: '#FFC145',
  danger: '#F0483E',
  info: '#14B8A6',

  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const light = {
  ...palette,
  background: '#FFF8F0',     // creme quente — acolhedor, não clínico
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#2B2118',
  textSecondary: '#8B7E74',
  primary: palette.primary,
  primaryLight: palette.primaryLight,
  primaryGlow: palette.primaryGlow,
  secondary: palette.secondary,
  secondaryGlow: palette.secondaryGlow,
  accent: palette.accent,
  border: '#F0E4D8',
  success: palette.success,
  warning: palette.warning,
  danger: palette.danger,
  info: palette.info,
  white: palette.white,
  divider: '#FBF1E6',
};

export const dark = {
  ...palette,
  background: palette.darkBg,
  surface: palette.darkSurface,
  card: palette.darkCard,
  text: '#FDF6EE',
  textSecondary: '#9FB0BD',
  primary: '#FF8266',
  primaryLight: '#FF6B4A',
  primaryGlow: 'rgba(255, 130, 102, 0.2)',
  secondary: '#2DD4BF',
  secondaryGlow: 'rgba(45, 212, 191, 0.2)',
  accent: '#FFCE68',
  border: palette.darkBorder,
  success: '#34D399',
  warning: '#FBBF24',
  danger: '#FB7368',
  info: '#2DD4BF',
  white: palette.white,
  divider: '#20303D',
};
