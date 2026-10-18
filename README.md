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
    - *Visualização em tempo real de temperatura* - Dados da última leitura retornada pela API
- **Alertas Inteligentes:** Notificações instantâneas sobre anomalias nos dados vitais do pet.
    - **Notificação local (push do dispositivo):** sempre que a API detecta um novo alerta de saúde (`GET /pets/quick-alerts`, verificado a cada 10s), o app dispara uma notificação local via `expo-notifications`. Tocar na notificação leva direto para a aba de Alertas.
- **Lembrete de Consulta:** ao criar ou editar uma consulta, o app agenda automaticamente uma notificação local para 30 minutos antes do horário marcado (cancelada se a consulta for editada para outra data, finalizada ou excluída). Segundo cenário de notificação, independente do sensor IoT — disparado por uma ação real do usuário (agendar consulta).
- **Perfil do Pet:** Centralização de informações cadastrais e histórico básico.
- **Localização:** Integração com mapas para visualização da última localização do pet.

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
- **Estado e Consumo:** Axios para HTTP e TanStack Query para cache, loading, mutations e invalidação de dados.
- **Persistência:** AsyncStorage para preferências e dados de exibição do usuário; `expo-secure-store` (Keychain/Keystore) para o token JWT.
- **Autenticação:** JWT (`Authorization: Bearer <token>`), emitido por `POST /auth/login` e anexado automaticamente a toda requisição via interceptor do Axios (`httpClient.ts`). A API é stateless — não há cookie de sessão.
- **Geolocalização:** React Native Maps.
- **Notificações:** `expo-notifications` (notificações locais, sem dependência de servidor de push).
- **Versão publicada:** a tela "Sobre o App" (Perfil → Sobre / Configurações → Sobre) exibe a versão e o hash do commit da build, injetados automaticamente em tempo de build via `app.config.js`.


## Como Rodar o Projeto

### Pré-requisitos
- Node.js instalado.
- Gerenciador de pacotes (npm ou yarn).
- Aplicativo **Expo Go** instalado no dispositivo móvel ou emulador configurado.

### Configuração (Variáveis de Ambiente)
O aplicativo consome a API Spring Boot da Sprint 3 hospedada no Render. Crie um arquivo `.env` na raiz do projeto com as seguintes chaves:
```env
EXPO_PUBLIC_API_BASE_URL=https://sprint3-java-sempaginahtml.onrender.com/
EXPO_PUBLIC_FIREBASE_BASE_URL=https://s1mobile-f18a8-default-rtdb.firebaseio.com/
EXPO_PUBLIC_FIREBASE_API_TOKEN=4it2ulgS70Q32BZycWCbZmrcC6rFERjJCGUiLH1K
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyDNTSIWqWpxkHQ_Vno43rMGyF_tWSxbfL4
```

### Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/PetCare-360/Sprint3-Mobile
   cd Sprint3-Mobile
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

### Autenticação e Avaliação dos CRUDs
- **Cadastro e Login:** Crie um usuário na tela de cadastro (`SignUp`) informando nome, e-mail, senha e escolhendo o tipo de conta. A autenticação é real com JWT emitido pelo backend Spring Boot e a sessão é salva no dispositivo.
- **Importante para a Avaliação da Sprint 3 (Dois CRUDs completos):**
  - **CRUD 1 - Pacientes / Pets:** Acessível no perfil Veterinário (`ROLE_VETERINARIO`) em *Triagem de Risco → "VER TODOS"* (tela `Patients`), com Create (modal "Novo paciente"), Read (listagem e busca em tempo real), Update (ícone de lápis) e Delete (ícone de lixeira com confirmação).
  - **CRUD 2 - Consultas / Appointments:** Acessível tanto pelo Tutor quanto pelo Veterinário de forma integrada com a API:
    - **No perfil Tutor (`ROLE_CLIENTE`):** Acessível em *Perfil → "Minhas Consultas"*, permitindo Create (solicitar consulta com vinculação automática ao veterinário), Read (listar agendamentos) e Update (editar data, horário e motivo).
    - **No perfil Veterinário (`ROLE_VETERINARIO`):** Acessível em *Triagem de Risco → "CONSULTAS"*, permitindo Read (visualizar agenda clínica dos pacientes), Update (botão "Finalizar atendimento" via `/appointments/{id}/finish`) e Delete (botão "Excluir" com confirmação via `DELETE /appointments/{id}`).
    - *Nota de negócio da API:* A regra de negócio do backend Java (`AppointmentService`) determina que a solicitação inicial de consulta é prerrogativa do tutor do pet, cabendo ao veterinário acompanhar, atender/finalizar e gerenciar o agendamento.

### Funcionalidades integradas
- Pets: listagem, cadastro de coleira, edição e remoção via `/pets`.
- Consultas: solicitação, listagem, finalização, edição e remoção via `/appointments`.
- Dashboard e monitoramento: dados de saúde consultados em `/pets/{id}/health-status`.
- Alertas e notificações: verificação periódica em `/pets/quick-alerts`.


## Principais Dependências

O projeto depende das seguintes bibliotecas principais:

- **expo (~57.0.26):** Plataforma para desenvolvimento React Native.
- **@react-navigation/native & stack/bottom-tabs:** Sistema de navegação completo.
- **axios:** Cliente para chamadas HTTP da API Java.
- **@tanstack/react-query:** Gerenciamento das consultas e mutações da API.
- **react-native-maps:** Componente de mapa para localização de serviços.
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
  ├── storage/    # Persistência local: token JWT (SecureStore) e dados do usuário (AsyncStorage)
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
[Demonstração](https://youtu.be/W3OSDGeC_es)

## Autores
LeonardoZerbinatti - [GitHub](https://github.com/LeonardoZerbinattiDeSales)<br>
Luis Guilherme - [GitHub](https://github.com/LuisGdev13)<br> 
Rafael de Freitas - [GitHub](https://github.com/devfreitas)<br> 
Rafael Pascotte - [GitHub](https://github.com/pascotterafaaa)

## Licença
Este projeto está sob a licença da organização [PetCare 360](https://github.com/PetCare-360)
