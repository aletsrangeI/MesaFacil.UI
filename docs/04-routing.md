# Routing

MesaFácil uses React Router v7 for client-side routing. All routes are centrally managed in `src/app/routes/AppRouter.tsx`.

## Core Concepts

1.  **Centralization:** Every route must be defined in `AppRouter.tsx`.
2.  **Protection:** Private routes are wrapped in a `<PrivateRoute>` component that verifies authentication.
3.  **Permission Guards:** Fine-grained access control is implemented using the `<RequireAccess>` component. It checks the Redux store (`selectCanAccess`) to ensure the user has the specific permission for that path.
4.  **Navigation Sync:** The sidebar navigation is defined in `src/config/nav.config.tsx`. The `path` defined there **must perfectly match** the path in `AppRouter.tsx`. The sidebar automatically filters out links the user doesn't have access to.

## Adding a New Route

1.  Create your page component in `src/pages/your-feature/index.tsx`.
2.  Add the route to `src/app/routes/AppRouter.tsx`:
    ```tsx
    <Route
      path="/your-feature"
      element={
        <RequireAccess path="/your-feature">
          <YourFeaturePage />
        </RequireAccess>
      }
    />
    ```
3.  Add the navigation entry in `src/config/nav.config.tsx` with the exact same path.
