// Espelha br.com.fiap.petcare360_java.dto.

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
}
