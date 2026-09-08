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
   * Chama o endpoint real de logout, que invalida a sessão/cookie no
   * servidor. Se a chamada falhar (ex.: sessão já expirada, sem internet),
   * o logout local segue em frente mesmo assim — o usuário não pode ficar
   * preso numa tela protegida por causa de uma falha de rede.
   */
  async signOut(): Promise<void> {
    try {
      await httpClient.post('/auth/logout');
    } catch (error) {
      console.warn('[authService] Falha ao encerrar sessão no servidor.', error);
    }
  },

  /**
   * Usa o endpoint dedicado de sessão (não depende mais de uma rota de
   * negócio como proxy). Devolve o usuário atualizado quando a sessão
   * salva ainda é válida, ou null quando expirou/foi revogada — assim o
   * app pode ressincronizar nome/e-mail/role com o que está no servidor.
   */
  async validateSession(): Promise<UserResponse | null> {
    try {
      const { data } = await httpClient.get<UserResponse>('/auth/me');
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
        return null;
      }
      throw error;
    }
  },
};