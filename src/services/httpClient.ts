import axios from 'axios';
import { tokenStorage } from '../storage/tokenStorage';

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

if (!baseURL) {
  console.warn(
    '[httpClient] EXPO_PUBLIC_API_BASE_URL não está definida no .env — as chamadas à API vão falhar.'
  );
}

// A API agora é 100% stateless (JWT via Authorization: Bearer), sem cookie
// de sessão — por isso withCredentials não é mais necessário.
export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Anexa o JWT salvo em toda requisição — nenhum service precisa saber que
// isso existe. Sem esse interceptor, toda rota protegida responderia 401.
httpClient.interceptors.request.use(async config => {
  const token = await tokenStorage.getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
    if (__DEV__) {
      console.log(`[httpClient] → ${config.method?.toUpperCase()} ${config.url} | Authorization: Bearer ${token.slice(0, 12)}...`);
    }
  } else if (__DEV__) {
    console.log(`[httpClient] → ${config.method?.toUpperCase()} ${config.url} | Sem token salvo`);
  }
  return config;
});

// Se a API rejeitar o token (expirado, inválido ou ausente), limpa a
// credencial local — não faz sentido continuar reenviando um JWT que o
// servidor já não aceita mais. O AuthContext percebe isso no próximo
// validateSession() e manda o usuário de volta pro login.
httpClient.interceptors.response.use(
  response => response,
  error => {
    if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
      tokenStorage.removeToken();
    }
    return Promise.reject(error);
  },
);
