# Arquitectura Frontend

## Objetivo
Documentar la estructura general del proyecto UI.

## Alcance
React, Vite, layouts y páginas principales.

## Cuándo consultar este documento
Para entender cómo está organizado el código frontend y su flujo de ejecución.

## Información
- **Arquitectura**: SPA (Single Page Application) usando React 19 y Vite.
- **Estructura**:
  - `components/`: Componentes UI reutilizables (presentacionales).
  - `pages/`: Vistas completas por funcionalidad.
  - `layout/`: Componentes estructurales (Header, Sidebar, Main Layout).
  - `state/`: Manejo de estado global (Redux Toolkit).
  - `services/`: Endpoints generados vía RTK Query y openapi-codegen.
  - `forms/`: Configuración y componentes de formularios (Formik + Yup).
- **Flujo**:
  - Punto de entrada en `main.tsx` cargando `AppBoot.tsx` (proveedores de estado y ruteo).


## Estado
> Documentado.
