# Consumo de API

## Objetivo
Documentar la integración HTTP entre Frontend y Backend.

## Alcance
Servicios, hooks y clientes HTTP.

## Cuándo consultar este documento
Al conectar la UI con nuevos endpoints del backend.

## Información
- **Tecnología Principal**: **RTK Query** acoplado a Redux.
- **Generación Automática**: Uso de `@rtk-query/codegen-openapi` configurado en `openapi-config.cjs` (comando `npm run api:gen`).
- **Ubicación**: Los endpoints generados se ubican en la carpeta `services/`.
- **Uso**: Consumo a través de los hooks auto-generados por RTK Query (`useGetMesasQuery`, `useCreatePedidoMutation`, etc.).


## Estado
> Documentado.
