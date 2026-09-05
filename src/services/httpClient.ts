import axios from 'axios';

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

httpClient.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      return Promise.reject(new Error('Sessão expirada. Entre novamente para continuar.'));
    }
    return Promise.reject(error);
  },
);
