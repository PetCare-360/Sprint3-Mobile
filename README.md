# PetCare 360
![Expo](https://img.shields.io/badge/Expo-5D5FEF?style=for-the-badge&logo=expo&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-5D5FEF?style=for-the-badge&logo=nodedotjs&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-5D5FEF?style=for-the-badge&logo=react&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5D5FEF?style=for-the-badge&logo=axios&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5D5FEF?style=for-the-badge&logo=typescript&logoColor=white)

O **PetCare 360** é uma solução mobile robusta projetada para o monitoramento inteligente de saúde e atividade de animais de estimação. A plataforma estabelece uma ponte direta entre tutores e médicos veterinários, permitindo o acompanhamento de sinais vitais em tempo real e facilitando a tomada de decisão clínica baseada em dados consolidados.

## Funcionalidades Principais

### Módulo do Tutor
- **Dashboard de Saúde:** Visualização em tempo real de temperatura, nível de atividade e batimentos cardíacos.
    - *Visualização em tempo real de temperatura* - Por hora não implementado, parâmetro fictícios no projeto
- **Alertas Inteligentes:** Notificações instantâneas sobre anomalias nos dados vitais do pet.
- **Perfil do Pet:** Centralização de informações cadastrais e histórico básico.
- **Localização:** Integração com mapas para visualização de serviços próximos.

### Módulo do Veterinário
- **Triagem Digital:** Dashboard com sistema de priorização de pacientes baseado em risco clínico.
- **Gestão de Pacientes:** Lista completa de animais sob acompanhamento.
    - **Vincular nova coleira:** Coleta o ID da coleira e adiciona o pet no dashboard.
- **Prontuário Detalhado:** Acesso ao histórico completo de dados vitais e métricas de comportamento.
    - **Evolução Clínica:** Linha do tempo da evolução clínica.
- **Monitoramento Remoto:** Sistema de alertas para pacientes críticos.


## Arquitetura e Tecnologias

O projeto utiliza tecnologias de ponta para garantir performance, escalabilidade e uma excelente experiência de usuário.

- **Core:** React Native com Expo.
- **Linguagem:** TypeScript.
- **Navegação:** React Navigation (Stack e Bottom Tabs).
- **Estado e Consumo:** Axios para integração com APIs REST e Context API para gerenciamento de estado global.
- **Persistência:** AsyncStorage para armazenamento local de preferências e dados de sessão.
- **Geolocalização:** React Native Maps.


## Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado.
- Gerenciador de pacotes (npm ou yarn).
- Aplicativo **Expo Go** instalado no dispositivo móvel ou emulador configurado.

### Configuração (Variáveis de Ambiente)
O projeto utiliza o Firebase para armazenamento de imagens. Crie um arquivo `.env` na raiz do projeto e configure as seguintes variáveis:
```env
EXPO_PUBLIC_FIREBASE_BASE_URL=https://seu-projeto.firebaseio.com
EXPO_PUBLIC_FIREBASE_API_TOKEN=seu-api-token
```

### Instalação
1. Clone o repositório:
   ```bash
    git clone https://github.com/PetCare-360/Sprint1-Mobile
    cd Sprint1-Mobile
    ```
2. Instale as dependências:
   ```bash
   npm install
   ```

### Execução
Inicie o servidor do Expo utilizando um dos comandos abaixo:
- `npm start`: Inicia o Expo Go (QR Code).
- `npm run android`: Inicia no emulador Android.
- `npm run web`: Inicia a versão web.

### Credenciais de Teste
Para explorar os diferentes fluxos da aplicação, utilize os seguintes acessos:
- **Veterinário:** Login: `admin` | Senha: `admin`
- **Tutor:** Login: `pet` | Senha: `pet`


## Principais Dependências

O projeto depende das seguintes bibliotecas principais:

- **expo (~54.0.33):** Plataforma para desenvolvimento React Native.
- **@react-navigation/native & stack/bottom-tabs:** Sistema de navegação completo.
- **axios:** Cliente para chamadas de API (utilizado em `imageApi.ts`).
- **react-native-maps:** Componente de mapa para localização de serviços.
- **expo-image-picker:** Permite a seleção de imagens para o perfil.
- **@react-native-async-storage/async-storage:** Armazenamento persistente de dados.
- **@expo/vector-icons:** Biblioteca de ícones (MaterialCommunityIcons).
- **react-native-safe-area-context & screens:** Dependências fundamentais para navegação segura e performática.

## Design System

O aplicativo conta com uma identidade visual própria e escalável, focada em usabilidade e acessibilidade.

- **Theming:** Suporte nativo a Light e Dark Mode.
- **Tokens:** Definições rigorosas de cores, espaçamentos (`spacing`), arredondamentos (`radius`) e sombras.
- **Componentes Reutilizáveis:**
  - `Card`: Container padronizado para exibição de dados.
  - `Button`: Ações com feedback visual.
  - `Input`: Campos de formulário com validação.
  - `Header`: Navegação contextualizada.

## Estrutura do Projeto

```bash
/src
  ├── components/ # Componentes reutilizáveis de UI
  ├── screens/    # Telas da aplicação (Auth, Tutor, Vet)
  ├── navigation/ # Configurações de fluxo e roteamento
  ├── services/   # Integrações com APIs externas
  ├── storage/    # Lógica de persistência local (AsyncStorage)
  ├── theme/      # Design System (tokens e provedores)
  ├── hooks/      # Hooks customizados (useTheme, etc)
  ├── context/    # Provedores de estado global
  └── types/      # Definições de tipos TypeScript
```


## Fluxo de Navegação

A aplicação gerencia múltiplos fluxos de acesso garantindo segurança e segmentação de dados:
- **Fluxo de Autenticação:** Login de usuários.
- **Fluxo do Tutor:** Interface focada no acompanhamento individualizado.
- **Fluxo do Veterinário:** Dashboard clínico com visão multi-paciente.

## Diferenciais

- **Separação de Perfis:** Experiência totalmente personalizada para tutores e veterinários no mesmo app.
- **Interface Orientada à Decisão:** Veterinários recebem priorização de pacientes que realmente precisam de atenção imediata.
- **Offline First (Básico):** Uso de cache local para garantir que dados essenciais estejam disponíveis mesmo sem conexão.

## Link Demonstração
Link da demonstração no Youtube ->
https://youtu.be/OnSErOko6Vw

## Autores
Artur Correia - [GitHub](https://github.com/artcorreia)<br>
Gabriel H - [GitHub](https://github.com/gabrielhensg)<br>
José Ricardo - [GitHub](https://github.com/jr-iannuzzi)<br> 
Rafael de Freitas - [GitHub](https://github.com/devfreitas)<br> 
Rafael Pascotte - [GitHub](https://github.com/pascotterafaaa)

## Licença
Este projeto está sob a licença da organização [PetCare 360](https://github.com/PetCare-360)
