# API Consumption

MesaFácil relies on **RTK Query** for data fetching and caching.

## The Auto-Generated Client

We do not write `fetch` or `axios` calls manually. Instead, we generate the API client from the backend's OpenAPI specification.

1.  **Generation:** The API client is generated using `@rtk-query/codegen-openapi`.
2.  **Script:** Run `npm run api:gen` to update the API client when the backend schema changes.
3.  **Location:** The generated endpoints reside in `src/services/generated/`.

## Base API & Interceptors

The base configuration is located in `src/services/baseApi.ts`.
*   **Authentication:** It automatically attaches the Bearer token to every request by reading from `localStorage`.
*   **Token Refresh:** It includes a custom `baseQueryWithReauth` function that automatically attempts to refresh the token if a `401 Unauthorized` response is received. If the refresh fails, it dispatches a `logout` action.

## Consuming the API

Use the generated hooks in your components:

```tsx
import { useGetUsuariosQuery } from '../../services/generated/api';

export function UsuariosList() {
  const { data, error, isLoading } = useGetUsuariosQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users.</p>;

  return (
    <ul>
      {data?.map(user => <li key={user.id}>{user.nombre}</li>)}
    </ul>
  );
}
```
