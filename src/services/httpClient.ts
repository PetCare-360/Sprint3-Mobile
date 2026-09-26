import axios from 'axios';
import { sessionCookieStorage } from '../storage/sessionCookieStorage';

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();

if (!baseURL) {
  console.warn(
    '[httpClient] EXPO_PUBLIC_API_BASE_URL não está definida no .env — as chamadas à API vão falhar.'
  );
}

export const httpClient = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

function extractSessionCookie(rawSetCookie: string | string[] | undefined): string | null {
  if (!rawSetCookie) return null;
  const values = Array.isArray(rawSetCookie) ? rawSetCookie : [rawSetCookie];
  for (const value of values) {
    const match = value.match(/JSESSIONID=[^;]+/i);
    if (match) return match[0];
  }
  return null;
}

httpClient.interceptors.request.use(async config => {
  const cookie = await sessionCookieStorage.getCookie();
  if (cookie) {
    config.headers = config.headers ?? {};
    config.headers.Cookie = cookie;
    if (__DEV__) {
      console.log(`[httpClient] → ${config.method?.toUpperCase()} ${config.url} | Cookie enviado: ${cookie}`);
    }
  } else if (__DEV__) {
    console.log(`[httpClient] → ${config.method?.toUpperCase()} ${config.url} | Sem cookie de sessão salvo`);
  }
  return config;
});

httpClient.interceptors.response.use(
  response => {
    const sessionCookie = extractSessionCookie(response.headers?.['set-cookie']);
    if (sessionCookie) {
      if (__DEV__) {
        console.log(`[httpClient] ← Set-Cookie capturado: ${sessionCookie}`);
      }
      sessionCookieStorage.saveCookie(sessionCookie);
    } else if (__DEV__ && (response.config.url === '/auth/login' || response.config.url === '/auth/register')) {
      console.warn('[httpClient] ⚠️ Login OK mas nenhum Set-Cookie foi lido da resposta.');
    }
    return response;
  },
  error => {
    if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
      sessionCookieStorage.removeCookie();
    }
    return Promise.reject(error);
  },
);