# Documento de Diseño — Identidad Visual UI Kit Restaurante

## 1. Concepto Visual
El sistema comunica **modernidad, calidez y accesibilidad**, evocando la experiencia gastronómica de un restaurante con un lenguaje **digital minimalista**.  
La interfaz se fundamenta en un **estilo flat con micro-sombra suave** y bordes redondeados amplios, equilibrando **claridad funcional** con **personalidad visual**.

---

## 2. Paleta Cromática (Tokens)

| Nombre        | Token CSS                | Hex      | Uso principal |
|---------------|--------------------------|----------|---------------|
| Primario      | `--color-primary`        | `#D64545` | Botones, foco, error |
| Secundario    | `--color-secondary`      | `#E9B949` | Acentos, badges |
| Éxito (verde) | `--color-success`        | `#3C8D40` | Mensajes success, confirmaciones |
| Fondo base    | `--color-bg`             | `#FFFFFF` | Fondo principal |
| Texto base    | `--color-text`           | `#1F1F1F` | Texto primario |
| Texto mutado  | `--color-text-muted`     | `#6B7280` | Texto secundario |
| Borde         | `--color-border`         | `rgba(0,0,0,0.12)` | Inputs, divisores |

> **Nota:** Definir estos tokens como variables globales en `:root {}` dentro de `tokens.css`.

---

## 3. Tipografía (Tokens)

| Rol           | Fuente sugerida         | Tamaño base | Peso | Token CSS |
|---------------|-------------------------|-------------|------|-----------|
| Display H1    | Fredoka / Baloo 2       | 28–32px     | 600  | `--font-h1` |
| Heading H2    | Fredoka / Baloo 2       | 20–24px     | 500  | `--font-h2` |
| Body          | Inter / Roboto          | 14–16px     | 400  | `--font-body` |
| Helper/Caption| Inter / Roboto          | 12px        | 400  | `--font-caption` |

> **Sugerencia:** usar `rem` relativo a `16px` como base para escalabilidad.

---

## 4. Spacings (Tokens)

| Token        | Valor px | Uso sugerido |
|--------------|----------|--------------|
| `--space-1`  | 4px      | Ajustes finos |
| `--space-2`  | 8px      | Padding interno mínimo |
| `--space-3`  | 12px     | Separación entre elementos |
| `--space-4`  | 16px     | Botones, inputs |
| `--space-6`  | 24px     | Secciones en layouts |
| `--space-8`  | 32px     | Espaciado mayor en vistas |

---

## 5. Radius (Tokens)

| Token          | Valor px | Aplicación |
|----------------|----------|------------|
| `--radius-sm`  | 6px      | Tags, badges |
| `--radius-md`  | 12px     | Inputs, botones |
| `--radius-lg`  | 20px     | Contenedores, cards grandes |

---

## 6. Sombras (Tokens)

| Token           | Definición | Uso |
|-----------------|------------|-----|
| `--shadow-sm`   | `0 2px 4px rgba(0,0,0,0.06)` | Elementos pequeños |
| `--shadow-md`   | `0 4px 12px rgba(0,0,0,0.08)` | Tarjetas, modales |
| `--shadow-lg`   | `0 8px 20px rgba(0,0,0,0.12)` | Superposiciones |

---

## 7. Iconografía
- **Set recomendado:** [`lucide-react`](https://lucide.dev) (licencia ISC, libre para uso comercial).  
- **Line weight:** 2px.  
- **Color:** hereda de `currentColor`.  
- **Sizing:** tokens dinámicos (`--icon-sm: 16px`, `--icon-md: 20px`, `--icon-lg: 24px`).  

---

## 8. Componentes Base
### Botón
- Variantes: primario, secundario, ghost, link.  
- Padding 12–16px.  
- Estados: hover (más oscuro), disabled (opacidad reducida).  

### Input / Select
- Label persistente.  
- Estados: default, focus (halo terracota), error (borde rojo).  
- Helper/error text a 12px.  

### Toggle
- Interruptor redondeado con animación.  
- Estado ON → terracota.  

### Toast
- Notificación flotante (bottom-right).  
- Variantes: info, success, error.  
- Auto-dismiss configurable.  

### Container
- Max-width (`--container-md: 768px`, `--container-lg: 1200px`).  
- Padding horizontal `--space-4` o mayor.  

---

## 9. Accesibilidad
- Contraste mínimo AA (WCAG 2.1).  
- `:focus-visible` con halo semitransparente.  
- Touch targets ≥ 44px.  
- Uso de `aria-label` en icon buttons.  

---

## 10. Moodboard Referencial
- **Uber Eats:** jerarquía tipográfica, grillas.  
- **Chili’s App:** calidez cromática.  
- **Material Design 3:** escalabilidad, motion sutil, bordes amplios.  

---
