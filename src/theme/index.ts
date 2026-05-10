import { light, dark, palette } from './colors';
import { spacing } from './spacing';
import { radius } from './radius';
import { typography } from './typography';
import { shadows } from './shadows';

export { palette, light, dark, spacing, radius, typography, shadows };

export const theme = {
  ...light,
  spacing,
  radius,
  typography,
  shadows,
};

export type AppTheme = typeof theme;
