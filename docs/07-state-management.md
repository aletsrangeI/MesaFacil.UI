# State Management

MesaFácil uses Redux Toolkit as its core state management solution, configured in `src/app/store.ts`.

## Store Structure

The store is primarily divided into two parts:
1.  **Auth Slice (`authSlice.ts`):** Manages local client state related to the user's session, tokens, roles, and permissions.
2.  **API Slice (`mesafacilApi`):** Managed entirely by RTK Query. It handles all server state, caching, and background fetching.

## The Auth Slice

Located in `src/state/authSlice.ts`, this slice is responsible for:
*   Storing `accessToken` and `refreshToken`.
*   Storing the user's roles and access rights.
*   Persisting session data to `localStorage`.
*   Providing selectors for guards (e.g., `selectCanAccess(path)`).

## RTK Query (Server State)

For any data coming from the backend:
*   **DO NOT** create a new Redux slice.
*   **DO NOT** use `useEffect` + `fetch`.
*   **DO** use the auto-generated hooks from `src/services/generated/api.ts`. RTK Query handles the loading state, error state, and caching automatically.
