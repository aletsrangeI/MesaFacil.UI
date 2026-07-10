# Component Guidelines

## General Rules

1.  **Functional Components:** All components must be functional components utilizing React Hooks.
2.  **TypeScript:** All components must define their prop types using TypeScript `interface` or `type` declarations.
3.  **Colocation:** Styles, tests, and component-specific hooks should be colocated in the component's directory.
4.  **No Inline Styles:** Use CSS classes and rely on variables from `tokens.css`.
5.  **Single Responsibility:** Keep components small and focused. If a component does too much, break it down.

## Page Components and Custom Hooks
*   **Separation of Concerns:** Para las vistas principales (Pages) como `RolesPage`, `UsuariosPage` o `ProductosPage`, la lógica pesada (llamadas RTK Query, manejo de modales, submit handlers) DEBE ser extraída a un custom hook (ej. `useProductos.ts`).
*   **Render Only:** El componente `index.tsx` de la página debe quedar lo más limpio posible, limitándose a importar el custom hook y encargarse exclusivamente del renderizado (JSX/HTML).

## Forms and SDUI
*   **DO NOT** hardcode standard form inputs if the view is driven by the backend.
*   **ALWAYS** use the `<FormGenerator>` component from `src/forms/FormGenerator.tsx` for dynamic forms.
*   **IMPORTANT:** Al usar `FormGenerator`, debes pasar la propiedad `components={mesaFacilFields}` (importada de `src/components/ui/adapters`) para sobrescribir los inputs genéricos con los de nuestro UI Kit corporativo de alta fidelidad.
*   If a new form field type is needed, implement it in `src/forms/FieldRenderer.tsx` and ensure it maps to a reusable UI component in `src/components/`.

## Tables
*   For any data table, sorting, or pagination, **TanStack Table** (`@tanstack/react-table`) is mandatory. Do not build custom table state management from scratch.

## File Structure Example
```text
src/pages/entidad/
├── index.tsx       # Component logic strictly for layout & JSX
├── useEntidad.ts   # Custom hook containing API calls, state, and event handlers
└── entidad.css     # BEM styles for the page
```
