# PetCare 360

Aplicativo mobile do **PetCare 360**, desenvolvido com React Native + Expo para conectar tutores e veterinários e permitir acompanhamento de pets, saúde, localização, alertas e consultas.

## 🎯 Problema e solução

O projeto busca centralizar informações relevantes do pet em um único aplicativo. O tutor acompanha dados de saúde, localização e alertas, enquanto o veterinário possui recursos para gestão de pacientes, prontuário/monitoramento e consultas.

A aplicação mobile consome a API real do projeto e não depende de dados fixos para as funcionalidades principais.

## ✨ Funcionalidades

### Tutor
- Login e cadastro.
- Persistência e validação de sessão.
- Dashboard do pet.
- Indicadores de saúde retornados pela API.
- Localização do pet em mapa.
- Alertas e atualização periódica.
- Perfil e configurações.

### Veterinário
- Dashboard clínico.
- Listagem, cadastro, edição e remoção de pacientes.
- Visualização detalhada do pet.
- Monitoramento de saúde e atividade.
- Gestão de consultas: criar, listar, editar, finalizar e excluir.
- Seleção de pets e veterinários pelos dados retornados pela API.

## 🧱 Arquitetura

A aplicação segue separação entre interface, regras de consumo de dados e integração HTTP:

```text
src/
├── components/     # Componentes visuais reutilizáveis
├── context/        # Estado global de autenticação
├── hooks/          # Regras de tela e hooks do TanStack Query
├── navigation/     # React Navigation e proteção dos fluxos
├── screens/        # Telas da aplicação
├── services/       # Comunicação HTTP com a API via Axios
├── storage/        # Persistência local da sessão
├── theme/          # Design system e tokens visuais
└── types/          # Tipos TypeScript
```

### Fluxo de dados

```text
Screen
  ↓
Custom Hook
  ↓
Service
  ↓
Axios / API
  ↓
TanStack Query
  ↓
Screen atualizada
```

As telas não utilizam `fetch`. As operações HTTP são realizadas pelos services com Axios e as queries/mutations ficam encapsuladas nos hooks.

## 🛠️ Tecnologias

- React Native 0.86.3
- Expo 57
- TypeScript
- React Navigation
- Axios
- TanStack Query v5
- AsyncStorage
- React Native Maps

## 🚀 Como executar

### Pré-requisitos

- Node.js
- npm
- Expo Go no dispositivo ou emulador Android/iOS configurado

### Instalação

```bash
npm install
```

### Variável de ambiente

Configure a URL da API no arquivo `.env`:

```env
EXPO_PUBLIC_API_BASE_URL=https://sprint3-java-sempaginahtml.onrender.com/
```

Não versione credenciais ou informações sensíveis no repositório.

### Execução

```bash
npm start
```

Outras opções:

```bash
npm run android
npm run ios
npm run web
```

Com o Expo iniciado, abra o projeto pelo QR Code no Expo Go ou pelo emulador configurado.

## 🔐 Autenticação

O aplicativo utiliza autenticação real fornecida pela API.

- Cadastro: cria o usuário na API.
- Login: autentica e mantém a sessão localmente.
- Inicialização: valida a sessão com `GET /auth/me`.
- Logout: invalida a sessão com `POST /auth/logout` e limpa o estado local.
- Navegação protegida: usuários não autenticados permanecem no fluxo de autenticação; o perfil retornado pela API determina o fluxo de tutor ou veterinário.

## 🔌 Integração com API

As principais funcionalidades dependentes da API incluem:

- **Pacientes/Pets:** GET, POST, PUT e DELETE.
- **Consultas:** GET, POST, PUT, PUT de finalização e DELETE.
- **Autenticação:** login, cadastro, validação da sessão e logout.
- **Saúde/monitoramento:** consultas de dados do pet.
- **Alertas:** consulta periódica de alertas.
- **Localização:** consulta dos dados de localização.

Após mutations, os hooks invalidam as queries correspondentes para atualizar a interface automaticamente.

## 🧭 Navegação

A aplicação utiliza **React Navigation**, sem Expo Router.

### Autenticação
- SignIn
- SignUp

### Tutor
- Home
- Health
- Map
- Alerts
- Profile

### Veterinário
- VetDashboard
- Patients
- PetDetails
- Appointments
- Settings

## 🎨 Design System

O projeto possui tema centralizado e componentes reutilizáveis para manter consistência visual:

- `Button`
- `Card`
- `Header`
- `InfoCard`
- `Input`
- `NotificationItem`
- tokens de cores, espaçamento, tipografia, radius e sombras

Também existe suporte a Light/Dark Mode.

## 🧪 Validação

Antes de executar o projeto, recomenda-se instalar as dependências:

```bash
npm install
```

Depois:

```bash
npx tsc --noEmit
npm start
```

No Expo Go, validar pelo menos:

1. Cadastro e login.
2. Fechar/reabrir o app e validar a sessão.
3. Logout.
4. CRUD de pacientes.
5. CRUD de consultas.
6. Atualização de saúde/alertas/localização.
7. Fluxos de tutor e veterinário.

## 📚 Documentação adicional

A documentação técnica está em [`docs/`](./docs):

- [`ARCHITECTURE.md`](./docs/ARCHITECTURE.md) — organização e responsabilidades das camadas.
- [`SPRINT-3-CHECKLIST.md`](./docs/SPRINT-3-CHECKLIST.md) — checklist de atendimento aos requisitos do Sprint 3.

## 👥 Autores

Artur Correia — [GitHub](https://github.com/artcorreia)  
Gabriel H — [GitHub](https://github.com/gabrielhensg)  
José Ricardo — [GitHub](https://github.com/jr-iannuzzi)  
Rafael de Freitas — [GitHub](https://github.com/devfreitas)  
Rafael Pascotte — [GitHub](https://github.com/pascotterafaaa)

## 📄 Licença

Projeto desenvolvido pela organização PetCare 360.
