# Enrutamiento

## Objetivo
Definir cómo funciona el sistema de rutas y navegación.

## Alcance
Configuración de router, guards y layouts.

## Cuándo consultar este documento
Al agregar nuevas páginas o modificar el árbol de navegación.

## Información
- **Librería**: `react-router-dom` v7.
- **Estructura**: Las rutas principales se definen en un sistema de enrutamiento (ej. `App.tsx` o `AppBoot.tsx`).
- **Layouts**: Uso de rutas anidadas con un layout base para la aplicación autenticada y uno para el acceso público (login).
- **Protección**: Guards para validar autenticación y redirección al login (`/`) si no hay sesión activa.


## Estado
> Documentado.
