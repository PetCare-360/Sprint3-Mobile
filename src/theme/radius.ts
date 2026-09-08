// Escala de raio ampliada para reforçar a identidade "amigável": cantos bem
// arredondados em todo o app, do botão ao card, como um brinquedo de pet.
export const radius = {
  none: 0,
  xs: 8,
  sm: 12,
  md: 18,
  lg: 22,
  xl: 28,
  xxl: 34,
  hg: 48,
  round: 9999,
};

export type Radius = keyof typeof radius;
