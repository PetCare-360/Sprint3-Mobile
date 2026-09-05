import { httpClient } from './httpClient';
import { AuthResponse, RegisterRequest, UserResponse } from '../types/auth';
import { ApiException } from '../types/apiException';

function extractErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === 'object' &&
    'response' in error &&
    (error as any).response?.data?.message
  ) {
    return (error as any).response.data.message as string;
  }
  return fallback;
}

export const authService = {
  async signIn(email: string, password: string): Promise<UserResponse> {
    try {
      const { data } = await httpClient.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      return data.user;
    } catch (error) {
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
   * Arruma logo isso Rafuxo....
   */
  async validateSession(): Promise<boolean> {
    try {
      await httpClient.get('/pets/all');
      return true;
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'response' in error &&
        ((error as any).response?.status === 401 || (error as any).response?.status === 403)
      ) {
        return false;
      }
      return true;
    }
  },
};