# Documentación Técnica — Generación automática de APIs RTK Query con OpenAPI

## Introducción
Esta guía documenta **cómo generar, integrar y mantener** automáticamente los endpoints de **RTK Query** en el proyecto **MesaFácil.UI**, utilizando la especificación **OpenAPI del backend .NET** y **Vite** con un **proxy local (Opción A)**.

Está pensada para:
- Nuevos desarrolladores que se integren al equipo.
- Mantenimiento futuro (tú o cualquier integrante).
- Replicación rápida para nuevas entidades o servicios (ej. `Test`).

---

## Requisitos previos

- Backend .NET corriendo localmente y sirviendo OpenAPI en:
  ```bash
  http://localhost:5286/openapi/v1.json
  ```
- Proyecto **React + TypeScript (Vite)** ya configurado.
- Node.js v20 o superior.

---

## 1. Instalación de dependencias

```bash
npm install @reduxjs/toolkit react-redux
npm install -D @rtk-query/codegen-openapi
```

Verifica que el ejecutable exista:
```bash
ls -l node_modules/.bin | grep rtk-query
# Debe aparecer: rtk-query-codegen-openapi -> ../@rtk-query/codegen-openapi/lib/bin/cli.mjs
```

---

## 2. Configurar el proxy de Vite (Opción A)

El proxy permite redirigir las peticiones desde `http://localhost:5173/api/...` hacia `http://localhost:5286/api/...`.

**vite.config.ts:**
```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5286',
    },
  },
});
```

> Esto evita errores como `http://localhost:5173/api/api/...`.

---

## 3. Crear la API base (src/services/baseApi.ts)

Esta API será extendida por los módulos generados.

```ts
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: '', // proxy Vite se encargará de redirigir
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth?.accessToken;
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  },
});

export const emptySplitApi = createApi({
  reducerPath: 'mesafacilApi',
  baseQuery: rawBaseQuery,
  endpoints: () => ({}),
});
```

---

## 4. Configurar el generador OpenAPI → RTK Query

Usamos un archivo `.cjs` para evitar problemas de módulos ES.

**openapi-config.cjs:**
```js
/** @type {import('@rtk-query/codegen-openapi').ConfigFile} */
module.exports = {
  schemaFile: 'http://localhost:5286/openapi/v1.json',
  apiFile: './src/services/baseApi.ts',
  apiImport: 'emptySplitApi',
  outputFiles: {
    './src/services/generated/auth.ts': { filterEndpoints: [/^Auth[_]?/i] },
    './src/services/generated/area.ts': { filterEndpoints: [/^Area[_]?/i] },
    './src/services/generated/catalogo.ts': { filterEndpoints: [/^Catalogo[_]?/i] },
    './src/services/generated/cuenta.ts': { filterEndpoints: [/^Cuenta[_]?/i] },
    // ... (resto de entidades)
  },
  hooks: { queries: true, lazyQueries: true, mutations: true },
  tag: true,
};
```

> El patrón `/^Entidad[_]?/i` permite cubrir casos con o sin guion bajo (ej. `AuthLogin` o `Auth_Login`).

---

## 5. Scripts en package.json

Agrega los siguientes scripts para generar los endpoints:

```json
{
  "scripts": {
    "api:pre": "node -e \"require('fs').mkdirSync('src/services/generated',{recursive:true})\"",
    "api:gen": "npm run api:pre && rtk-query-codegen-openapi openapi-config.cjs"
  }
}
```

Generar endpoints:
```bash
npm run api:gen
```

Esto creará archivos en `src/services/generated/` (uno por dominio).

---

## 6. Registrar los servicios generados

**src/services/generated/index.ts:**
```ts
import './auth';
import './area';
import './catalogo';
import './cuenta';
// ... resto
```

**src/app/store.ts:**
```ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { emptySplitApi } from '../services/baseApi';
import authReducer from '../state/authSlice';
import '../services/generated'; // ← importante

export const store = configureStore({
  reducer: {
    [emptySplitApi.reducerPath]: emptySplitApi.reducer,
    auth: authReducer,
  },
  middleware: (gDM) => gDM().concat(emptySplitApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
```

---

## 7. Uso de hooks generados

Cada archivo genera automáticamente sus hooks, por ejemplo:

```ts
import { useAuthLoginMutation } from '@/services/generated/auth';

const [authLogin, { isLoading }] = useAuthLoginMutation();

const res = await authLogin({ loginRequest: { userOrEmail, password } }).unwrap();
```

---

## 8. Cómo agregar una nueva API (ej. `Test`)

Supongamos que el backend ahora tiene endpoints con `operationId` que empiezan con `Test` (o `Test_`).

1. **Agregar el filtro al config:**
   ```js
   './src/services/generated/test.ts': { filterEndpoints: [/^Test[_]?/i] },
   ```

2. **Regenerar los archivos:**
   ```bash
   npm run api:gen
   ```

3. **Registrar el nuevo servicio:**
   ```ts
   import './test'; // en src/services/generated/index.ts
   ```

4. **Usar los hooks:**
   ```ts
   import { useTestGetQuery, useTestCreateMutation } from '@/services/generated/test';
   ```

> Si el archivo se genera vacío, revisa que el `operationId` en el OpenAPI realmente comience con `Test`.

---

## 9. Errores comunes y soluciones

| Error | Causa | Solución |
|-------|--------|----------|
| `rtk-query-codegen: orden no encontrada` | No se instaló el CLI correcto | Usa `rtk-query-codegen-openapi` |
| `TypeScript configfile...` | Config `.ts` en vez de `.cjs` | Usa `openapi-config.cjs` |
| `ERR_REQUIRE_ESM` | Módulos ESM | Mantén `.cjs` y no uses `type: module` |
| `ENOENT` | Falta carpeta `generated` | Ejecuta `npm run api:pre` |
| Peticiones a `/api/api/...` | Doble prefijo `/api` | Proxy Vite + `baseUrl: ''` |
| Endpoints vacíos | Regex no coincide | Ajusta el `filterEndpoints` |

---

## 10. Checklist rápido

1. Backend sirviendo OpenAPI ✅  
2. Proxy en Vite ✅  
3. baseApi configurado con `baseUrl: ''` ✅  
4. `openapi-config.cjs` completo ✅  
5. Scripts `api:gen` ✅  
6. Carpeta `src/services/generated` creada ✅  
7. `store.ts` importa `../services/generated` ✅  
8. Hooks disponibles (`useAuthLoginMutation`, etc.) ✅

---

## 11. Futuras mejoras

- Ajustar `toAuthSlicePayload` según la respuesta final del backend.
- Añadir tipos más estrictos al OpenAPI para generar tipos completos.
- Configurar CI/CD para regenerar automáticamente en cada release del backend.

---

**Fin del documento**

