import { httpClient } from './httpClient';
import { AuthResponse, RegisterRequest, UserResponse } from '../types/auth';
import { ApiException } from '../types/apiException';
import axios from 'axios';

function extractErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message;
  }
  return fallback;
}

function isAuthResponse(value: unknown): value is AuthResponse {
  if (!value || typeof value !== 'object' || !('user' in value)) return false;
  const user = value.user;
  return Boolean(
    user &&
    typeof user === 'object' &&
    'id' in user &&
    'name' in user &&
    'email' in user &&
    'role' in user,
  );
}

export const authService = {
  async signIn(email: string, password: string): Promise<UserResponse> {
    try {
      const { data } = await httpClient.post<unknown>('/auth/login', {
        email,
        password,
      });
      if (!isAuthResponse(data)) {
        throw new ApiException(
          'A API retornou uma resposta inválida. O deploy pode estar redirecionando o login para a página web.',
        );
      }
      return data.user;
    } catch (error) {
      if (error instanceof ApiException) throw error;
      throw new ApiException(extractErrorMessage(error, 'Não foi possível entrar. Verifique suas credenciais.'));
    }
  },

  async signUp(request: RegisterRequest): Promise<UserResponse> {
    try {
      const { data } = await httpClient.post<AuthResponse>('/auth/register', request);
      return data.user;
    } catch (error) {
      throw new ApiException(extractErrorMessage(error, 'Não foi possível concluir o cadastro.'));
    }
  },

  /**
   * A API ainda não expõe /auth/logout. Como a sessão vive num cookie
   * HttpOnly, o "logout" do lado do app é local: limpamos o usuário
   * armazenado. Se um endpoint de logout for adicionado, chamar aqui.
   */
  async signOut(): Promise<void> {
    return Promise.resolve();
  },

  /**
   * Não existe /auth/me na API ainda. Para saber se o cookie de sessão
   * salvo ainda é válido quando o app reabre, batemos numa rota protegida
   * leve e tratamos 401/403 como sessão expirada.
   * - Trocar por GET /auth/me assim que existir.
   */
  async validateSession(): Promise<boolean> {
    try {
      await httpClient.get('/pets/all');
      return true;
    } catch (error) {
      if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
        return false;
      }
      throw error;
    }
  },
};