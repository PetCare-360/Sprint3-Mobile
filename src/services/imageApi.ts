import axios, { AxiosResponse } from "axios";

const api = axios.create({
    baseURL: "https://s1mobile-f18a8-default-rtdb.firebaseio.com/"
});

let apiToken = "";

export const salvar = async (img: string) => {
    return await api.post(
        `/imagens.json?auth=${apiToken}`,
        { imagem: img }
    );
};

export const carregar = async (): Promise<string> => {
    try {
        const response: AxiosResponse<any, any> = await api.get(
            `/imagens.json?auth=${apiToken}`
        );
        console.log("Resposta: ", response.data);
        
        // No Firebase, os dados costumam vir como um objeto de objetos.
        // Como o exemplo retornava string vazia, manterei a assinatura.
        return "";
    } catch (error) {
        console.error("Erro ao carregar imagem:", error);
        return "";
    }
};
