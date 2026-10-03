export type ApiRole = 'ROLE_ADMIN' | 'ROLE_CLIENTE' | 'ROLE_VETERINARIO';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: ApiRole;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  role: ApiRole;
}

export interface AuthResponse {
  message: string;
  user: UserResponse;
  // Só vêm preenchidos na resposta de /auth/login — /auth/register não
  // emite token (o backend exige um login separado depois de cadastrar).
  token?: string;
  tokenType?: string;
  expiresIn?: number;
}
