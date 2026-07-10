# Technical Debt & Pending Items

## Placeholders in Router
Currently, `AppRouter.tsx` contains numerous `<Placeholder>` components for routes that have been defined but not yet implemented.

*   Dashboard (`/`)
*   Pedidos (`/pedidos`)
*   Mesas (`/mesas`, `/gestion/mesas`)
*   Delivery (`/delivery`)
*   Cocina KDS (`/cocina`)
*   Caja (Rápida, Turnos, Movimientos, Cortes)
*   Cobro (Cuentas, Pagos, Descuentos)
*   Menu (Menús, Categorías, Productos, Variantes, Precios, Modificadores)
*   Reportes
*   Admin / Gestión (Organización, Precios, Inventario, etc.)

**Action:** These placeholders need to be replaced with actual page components following the architecture guidelines (placed in `src/pages/`).

## API Interceptor Edge Cases
The `baseQueryWithReauth` in `src/services/baseApi.ts` currently handles basic 401 refresh logic, but queueing concurrent failed requests during a refresh is not yet implemented. This might cause multiple refresh attempts if several endpoints fail simultaneously.
