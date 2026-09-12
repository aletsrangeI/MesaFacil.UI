# Guía para Agentes de IA - Frontend

## Objetivo
Definir cómo trabaja un agente de IA sobre el Frontend.

## Alcance
Operaciones, arquitectura y reglas específicas para agentes asistiendo en MesaFacil.UI.

## Cuándo consultar este documento
Siempre que un agente de IA vaya a modificar o leer el Frontend.

## Información que debe contener
IMPORTANTE: SIEMPRE debe leer primero:
- `../../docs/WORKFLOW.md`
- `../../docs/ROADMAP.md`
- `../../docs/DOMAIN_MODEL.md`
- `../../docs/DECISIONS.md`

Después consultar la documentación del Frontend.

- Cómo crear componentes
- Cómo crear páginas
- Cómo consumir APIs
- Cómo crear formularios
- Cómo mantener el Design System

---

## Estándares de Arquitectura Frontend Obligatorios

### 1. Navegación SPA Estricta (Baneo de Recargas de Navegador)
- **PROHIBIDO**: El uso de `window.location.href`, `window.location.assign()` o `window.location.replace()` para rutas internas de la aplicación.
  - Provoca destrucción del DOM, pérdida de caché de RTK Query, parpadeos de pantalla en blanco y recarga innecesaria de assets.
- **OBLIGATORIO**: Utilizar siempre la navegación SPA de `react-router-dom`:
  - **Componentes / Botones**: Usar `const navigate = useNavigate()` y llamar `navigate("/ruta")`, o envolver con `<Link to="/ruta">`.
  - **Transición suave**: Mantener transiciones de entrada suaves mediante animaciones CSS estándar (`fadeIn` con curvas `cubic-bezier` de 0.2s) para evitar saltos bruscos.
- **Excepción única**: Redirección externa a dominios de terceros (ej. pasarelas de pago externas o portales de autenticación externos independientes).

### 2. Estilos y Sistema de Diseño
- `MesaFacil.UI` utiliza tokens puros de CSS (`tokens.css` y hojas de estilo modulares por vista como `compras.css`, `inventario.css`). **NO** se utiliza Tailwind CSS.
- Todos los `<select>` deben ser alimentados por endpoints y catálogos de base de datos.

## Estado
> En constante actualización. Estándar SPA activo.
