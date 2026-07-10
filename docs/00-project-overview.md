# Project Overview

## MesaFácil UI

MesaFácil UI is the frontend application for the MesaFácil platform, designed for restaurant and point-of-sale management. It is built as a single-page application (SPA) using a modern web stack.

### Key Technologies

*   **Core:** React 19 (using TypeScript)
*   **Build Tool:** Vite
*   **Routing:** React Router v7 (`react-router-dom`)
*   **State Management:** Redux Toolkit
*   **Data Fetching & Caching:** RTK Query (auto-generated from OpenAPI specifications)
*   **Styling:** Vanilla CSS with a design token system (`tokens.css`)
*   **Forms:** Formik with Yup validation (utilizing a Server-Driven UI architecture)
*   **Tables:** TanStack Table v8

### Core Capabilities

1.  **Server-Driven UI (SDUI):** Dynamic form rendering based on backend metadata configuration.
2.  **Role-Based Access Control (RBAC):** Routing and layout components guarded by fine-grained permissions and roles.
3.  **Authentication:** Token-based authentication with automatic refresh token handling in RTK Query.
4.  **Auto-Generated API Client:** Fully typed API client integrated with Redux store to manage remote state effortlessly.

### Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Generate API Client from OpenAPI config
npm run api:gen
```
