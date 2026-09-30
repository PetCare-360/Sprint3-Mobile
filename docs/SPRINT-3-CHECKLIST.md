# Sprint 3 — Checklist de conformidade

## Navegação — 5 pontos

- [x] React Navigation.
- [x] Rotas explícitas.
- [x] Pelo menos 6 telas distintas.
- [x] Fluxo de autenticação separado dos fluxos de tutor/veterinário.

## API HTTP — 35 pontos

- [x] Axios para HTTP.
- [x] Nenhum `fetch` utilizado.
- [x] TanStack Query para queries e mutations.
- [x] Dados funcionais provenientes da API.
- [x] Pacientes com GET/POST/PUT/DELETE acessíveis pela UI.
- [x] Consultas com operações de criação, consulta, edição e remoção acessíveis pela UI.
- [x] Finalização de consulta disponível pela UI.
- [x] Loading e atualização após mutations.
- [x] Alertas, saúde e localização integrados à API.

## Autenticação — 20 pontos

- [x] Login real.
- [x] Cadastro real.
- [x] Persistência local da sessão.
- [x] Validação da sessão com `/auth/me`.
- [x] Logout real com `/auth/logout`.
- [x] Rotas protegidas.
- [x] Fluxo separado por perfil.

## Arquitetura — 20 pontos

- [x] Separação entre screens, hooks e services.
- [x] TanStack Query encapsulado em hooks.
- [x] Services responsáveis pelo HTTP.
- [x] Componentes reutilizáveis.
- [x] Tipos centralizados.
- [x] Persistência isolada em `storage/`.
- [x] Alertas centralizados em `useAlerts`.

## Documentação — 20 pontos

- [x] README atualizado.
- [x] Problema e solução descritos.
- [x] Tecnologias listadas de acordo com o `package.json`.
- [x] Instalação e execução documentadas.
- [x] Variável de ambiente documentada.
- [x] Arquitetura documentada.
- [x] Checklist do Sprint 3 documentado.

## Revisão estrutural final

A estrutura atual evita uma grande refatoração e mantém a organização existente. O foco foi corrigir lacunas reais de integração/arquitetura e documentar as responsabilidades das camadas sem introduzir uma nova arquitetura desnecessária.
