# Arquitetura — PetCare 360 Mobile

## Princípios

O aplicativo mantém uma separação simples entre apresentação, regras de tela/estado e integração HTTP. O objetivo é evitar que telas conheçam detalhes de Axios ou da implementação dos endpoints.

## Camadas

### `screens/`
Responsável pela composição visual e interação do usuário.

As telas devem consumir hooks e componentes, evitando chamadas HTTP diretas.

### `hooks/`
Responsável pela lógica específica das telas e pelo uso do TanStack Query.

Exemplos:
- `useAppointments`
- `usePatients`
- `useAlerts`
- `useHomeData`
- `usePetDetails`

### `services/`
Responsável por conhecer os endpoints da API e executar as operações HTTP através do Axios.

Principais services:
- `authService`
- `patientService`
- `appointmentService`
- `alertService`

### `context/`
Mantém estado global relacionado à autenticação.

### `storage/`
Encapsula a persistência local da sessão com AsyncStorage.

### `navigation/`
Define os fluxos de autenticação, tutor e veterinário utilizando React Navigation.

## Fluxo recomendado

```text
Usuário
  ↓
Screen
  ↓
Hook
  ↓
TanStack Query
  ↓
Service
  ↓
Axios
  ↓
API
```

Após uma mutation, o hook invalida a query relacionada. O TanStack Query busca os dados atualizados e a tela é renderizada novamente sem depender de reload manual.

## Regras de manutenção

1. Não usar `fetch` para chamadas HTTP.
2. Não colocar Axios diretamente nas screens.
3. Requisições devem ficar encapsuladas em services/hooks.
4. Dados funcionais exibidos pela aplicação devem vir da API.
5. Mutations devem invalidar ou atualizar as queries afetadas.
6. Componentes visuais reutilizáveis devem permanecer em `components/`.
7. Alterações de backend não fazem parte deste projeto mobile.
