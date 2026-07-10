# Folder Structure

The `src` directory is organized by feature and technical responsibility, adhering to standard modular patterns for React/Redux applications.

```text
src/
├── app/                  # App-level configuration
│   ├── api/              # (if custom API logic exists)
│   ├── providers/        # Context providers
│   ├── routes/           # Centralized routing logic (AppRouter, guards)
│   ├── security/         # Security utilities
│   ├── hooks.ts          # Typed Redux hooks (useAppDispatch, useAppSelector)
│   └── store.ts          # Redux Store configuration
│
├── assets/               # Static assets (images, fonts, global icons)
│
├── components/           # Reusable, domain-agnostic UI components
│
├── config/               # Static configuration files
│   └── nav.config.tsx    # Sidebar navigation definitions
│
├── forms/                # Server-Driven UI engine
│   ├── FieldRenderer.tsx # Maps API field types to components
│   ├── FormGenerator.tsx # Core SDUI component
│   ├── normalize.ts      # Field normalization logic
│   ├── schema.ts         # Dynamic Yup schema builder
│   └── types.ts          # Form-related TypeScript definitions
│
├── helpers/              # Utility functions and formatters
│
├── hooks/                # Custom React hooks (domain-specific)
│
├── layout/               # Global application layouts (AppLayout, Sidebar)
│
├── lib/                  # Third-party library configurations
│
├── pages/                # Route-level view components (grouped by feature)
│   ├── auth/             # Login, Registration
│   ├── catalogos/        # Generic catalogs
│   ├── formularios/      # Dynamic forms preview
│   ├── roles/            # Role management
│   └── seguridad/        # Security pages (usuarios)
│
├── services/             # API interaction layer
│   ├── baseApi.ts        # Base query configuration and interceptors (401 refresh)
│   └── generated/        # Auto-generated RTK Query endpoints
│
├── session/              # Session management utilities
│
├── state/                # Redux slices (Client state)
│   ├── auth.listeners.ts # Redux listeners for auth events
│   ├── auth.types.ts     # Types for auth state
│   └── authSlice.ts      # Authentication slice (tokens, roles, permissions)
│
└── styles/               # Global styling
    ├── globals.css       # Global resets and utility classes
    └── tokens.css        # CSS variables for the design system
```

## Guidelines for Adding Files
1. **Views/Pages:** Must be placed in `src/pages/` inside a folder representing the feature, using an `index.tsx` entry point.
2. **Components:** Reusable UI elements go to `src/components/`. If a component is only used in one page, colocate it in the page's folder.
3. **Styles:** Rely on `src/styles/tokens.css` for constants. Place component-specific `.css` alongside the component.
