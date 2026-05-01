Imagens.tsx

import React, { useState } from 'react';
import { Button, Image,  Text, ToastAndroid, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { salvar } from '../repository/remote/imagemApi';

const carregarImagem = async ( 
    setImage = ( texto : string | null | undefined ) : void => {}
) => { 
    const permissionResult = await ImagePicker
                                .requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted) { 
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: false,
            aspect: [4, 3],
            quality: 0.2,
            base64: true
        });

        if (result.assets != null && result.assets.length > 0){ 
            const imagem = result.assets[0];
            if (imagem.base64 != null && imagem.base64 != undefined ){ 
                console.log( "Salvando a imagem" );
                try {
                    await salvar( imagem.base64 );
                } catch ( err ) { 
                    console.log( "Erro : ", err);
                }
                setImage( imagem.base64 );
                console.log( "Imagem Salva");
            }
        }
    } else { 
        ToastAndroid.show("É necessário permissão para acessar a galeria", ToastAndroid.LONG);
    }
}

const Imagens = () => { 
    const [imagem, setImagem] = useState<string | null | undefined>( null );
    return (
        <View style={{justifyContent: "center", flex: 1, 
            alignItems: "stretch"}}>
       
            <Text>Gestão de imagens</Text>

            <Button title="Carregar Imagem" onPress={
                ()=>carregarImagem( setImagem )
            }/>

            <Image source={{ uri: `data:image/png;base64,${imagem}` }}
                   style={{ width: 400, height: 300 }}/>
        </View>
    )
}

export default Imagens;


-----
imagemAPI.ts

import axios, { AxiosResponse } from "axios";
import { Contato } from "../../model/contato";

const api = axios.create(
    {baseURL: "https://s1mobile-f18a8-default-rtdb.firebaseio.com/"}
);

let apiToken = "";

const salvar = async( img : string ) => {
     await api.post(
        `/imagens.json?auth=${apiToken}`,
        { imagem: img } );
    // .then(( response : AxiosResponse<any, any>)=>{})
    // .catch(( error : any )=>{})
}

const carregar = async() : Promise<string> => {
    const response : AxiosResponse<any, any> = await api.get(
        `/imagens.json?auth={apiToken}`
    );
    console.log( "Resposta: ", response.data);
    return "";
}

export { salvar, carregar };