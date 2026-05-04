import axios, { AxiosResponse } from 'axios';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_FIREBASE_BASE_URL
});

export const salvar = async (img: string) => {
  return await api.post(
    `/imagens.json?auth=${process.env.EXPO_PUBLIC_FIREBASE_API_TOKEN}`,
    { imagem: img }
  );
};

export const carregar = async (): Promise<string> => {
  try {
    const response: AxiosResponse<any, any> = await api.get(
      `/imagens.json?auth=${process.env.EXPO_PUBLIC_FIREBASE_API_TOKEN}`
    );
    return response.data || '';
  } catch {
    return '';
  }
};
