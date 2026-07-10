# Design System & Styling

MesaFácil uses a Vanilla CSS approach guided by a strict design token system.

## Tokens (`src/styles/tokens.css`)

All colors, typography, spacing, border radii, and shadows must be referenced from `tokens.css`. Do not hardcode hex colors or pixel values for these properties in individual CSS files.

### Key Variables

*   **Colors:** `--color-primary` (terracota), `--color-secondary` (mustard), `--color-success`, `--color-bg`, `--color-text`.
*   **Typography:** `--font-sans`, `--font-h1`, `--font-body`.
*   **Spacing:** `--space-1` to `--space-8`.
*   **Border Radius:** `--radius-sm`, `--radius-md`, `--radius-lg`.

## Usage Example

```css
/* Good */
.my-card {
  background-color: var(--color-sidebar-bg);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  color: var(--color-text);
}

/* Bad */
.my-card {
  background-color: #FFFFFF;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  color: #333;
}
```

## Component Styles
Create a separate `.css` file for each component and import it directly into the `.tsx` file.

## Page Structure Standard (BEM)
Todas las vistas principales (Pages) de administración deben seguir el estándar visual establecido en `RolesPage` y `UsuariosPage`.
*   **BEM Methodology:** Usa un contenedor principal como `<Container className="[entidad]-page">`. Los elementos hijos deben seguir el estándar de BEM, e.g. `[entidad]-page__header`, `[entidad]-page__title-area`, `[entidad]-page__content`, etc.
*   **Modales:** Usa el elemento nativo `<dialog ref={dialogRef} className="[entidad]-page__dialog">`. NO uses librerías externas o `<Modal>` genéricos si rompen el diseño.
*   **CSS:** Cada página debe tener su propio archivo CSS asociado (`[entidad].css`) que define estas clases basándose en el estándar de diseño. NUNCA uses clases utilitarias estilo Tailwind.
