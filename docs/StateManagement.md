# Gestión de Estado

## Objetivo
Establecer patrones para el manejo de estado global y local.

## Alcance
Contextos, estado de servidor (TanStack Query) y estado local.

## Cuándo consultar este documento
Al necesitar compartir estado entre componentes o manejar caché local.

## Información
- **Estado Global**: Manejado a través de **Redux Toolkit** (`@reduxjs/toolkit` y `react-redux`).
- **Estado de Servidor**: Centralizado y cacheado a través de **RTK Query**. (No se usa TanStack Query).
- **Estado Local**: Preferir el hook nativo `useState` y `useReducer` de React para estados efímeros (UI toggles, inputs no controlados de form).
- **Estructura**: Los slices de Redux viven en el directorio `state/`.


## Estado
> Documentado.
