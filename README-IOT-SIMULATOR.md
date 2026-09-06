# Integração IoT — Sprint3 Mobile

O Mobile foi preparado para acompanhar a telemetria da coleira em tempo real usando o backend `Sprint3-Java`.

## Fluxo

```text
COLLAR-001
   │
   │ POST /api/iot/data
   ▼
Sprint3-Java
   │
   ├── valida Device
   ├── localiza Pet
   ├── grava SensorData
   ├── atualiza bateria/lastSeen
   ├── calcula status
   └── gera alertas
   │
   │ GET /pets/{id}/health-status
   ▼
Sprint3-Mobile
   │
   └── atualiza a cada 10 segundos
```

## Atualização automática

O hook `src/hooks/useHomeData.ts` usa `refetchInterval: 10000` para saúde, localização e resumo de atividade.

## Cadastro do pet

Antes de iniciar o simulador, cadastre um pet no aplicativo com:

```text
Device ID: COLLAR-001
```

O backend cria a associação `Pet -> Device` durante o cadastro. O simulador não cria devices sozinho.

## API

Por padrão, o Mobile aponta para:

```text
https://sprint3-java-sempaginahtml.onrender.com/
```

Para outro ambiente, altere `EXPO_PUBLIC_API_BASE_URL` no `.env`.
