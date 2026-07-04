# MesaFácil UI - Arquitectura y Lineamientos de Desarrollo

Este archivo sirve como guía de referencia rápida para comprender la arquitectura, tecnologías y reglas de desarrollo del frontend de **MesaFácil**. Está diseñado para que cualquier desarrollador o agente de IA pueda entender rápidamente la estructura y decisiones clave del proyecto.

---

## 1. Stack Tecnológico

*   **Framework Principal:** React 19 (con TypeScript y Vite como bundler).
*   **Manejador de Rutas:** React Router DOM (v7).
*   **Manejo de Estado Global y API:** Redux Toolkit y RTK Query.
*   **Estilos:** CSS Vanilla estructurado, utilizando un sistema de tokens de diseño (`src/styles/tokens.css`) para variables globales de color, espaciado y tipografía.
*   **Gestión de Formularios:** Formik y validación de esquemas con Yup.

---

## 2. Arquitectura Clave: Server-Driven UI (SDUI)

MesaFácil utiliza **Server-Driven UI** para renderizar formularios dinámicamente según la configuración provista por el backend. Esto permite modificar la estructura, validaciones, etiquetas y orden de los campos desde el servidor sin necesidad de desplegar código en el frontend.

### Componentes de SDUI en el Proyecto
*   **`src/forms/FormGenerator.tsx`:** Componente principal que recibe un arreglo de campos (`ApiFormField[]`) y los mapea a los componentes correspondientes de React, gestionando los valores iniciales y la validación mediante Formik/Yup de forma transparente.
*   **`src/forms/normalize.ts` y `src/forms/schema.ts`:** Normalizan los tipos de campo y construyen dinámicamente el esquema de validación Yup basado en las reglas enviadas por la API.
*   **`src/forms/types.ts`:** Contiene las definiciones de tipos para campos de formularios de la API (`ApiFormField`, `ValidationRule`, `SelectOptionApi`).
*   **`src/components/ui/adapters.ts`:** Vincula los tipos de campo abstractos del backend (p. ej., `text`, `select`, `password`) a los componentes reales de UI del frontend (como `Input`, `Select`, etc.).

### Flujo de Trabajo con Formularios SDUI
1.  **Obtener estructura:** Invocar el hook generado por RTK Query `useFormFieldGetFormFieldByFormCatIdQuery` pasando el ID de categoría del formulario definido en `FORM_CATEGORY_IDS` (`src/forms/types.ts`):
    *   `FORM_CATEGORY_IDS.LOGIN` (`0`): Formulario de Login (Iniciar Sesión).
    *   `FORM_CATEGORY_IDS.REGISTRO_USUARIO` (`1`): Formulario de Registro de Usuario.
    *   `FORM_CATEGORY_IDS.GESTION_USUARIOS` (`2`): Formulario de Gestión de Usuarios (Panel de Seguridad).
2.  **Renderizado:** Pasar los campos obtenidos del backend al componente `<FormGenerator>` junto con los adaptadores y el callback de envío.
3.  **Ejemplo de uso:**
    ```tsx
    const { fields, isLoading, handleSubmit } = useAuthLoginForm(FORM_CATEGORY_IDS.REGISTRO_USUARIO); // Registro
    
    return (
      <FormGenerator
        formId="mi-formulario-id"
        showDefaultSubmit={false}
        fields={fields}
        components={mesaFacilFields}
        onSubmit={handleSubmit}
      />
    );
    ```

---

## 3. Estructura de Directorios

```
src/
├── app/
│   ├── hooks.ts            # Hooks de Redux tipados (useAppDispatch, useAppSelector)
│   ├── routes/             # Enrutamiento de la aplicación (AppRouter, PrivateRoute, guards)
│   └── store.ts            # Configuración centralizada de Redux Store
├── components/             # Componentes de UI reutilizables (Button, Input, Icon, Sidebar, etc.)
├── config/                 # Configuraciones estáticas (nav.config.tsx para el Sidebar)
├── forms/                  # Motor de Server-Driven UI (FormGenerator, esquemas, normalización)
├── layout/                 # Plantillas de diseño de la aplicación (AppLayout)
├── pages/                  # Vistas y páginas agrupadas por funcionalidad (auth, seguridad, dashboard)
├── services/               # Clientes de API generados (RTK Query generados vía OpenAPI)
├── state/                  # Slices de estado de Redux (authSlice, etc.)
└── styles/                 # Tokens CSS, temas y estilos globales
```

---

## 4. Lineamientos de Desarrollo (Reglas del Proyecto)

### 📌 Enrutamiento y Navegación
*   **Consistencia de Rutas:** Cuando agregues, modifiques o elimines una ruta en la aplicación:
    1.  Edita [AppRouter.tsx](file:///home/aletsrangel/Proyectos/mesafacil.ui/src/app/routes/AppRouter.tsx) para definir la ruta, su componente correspondiente, y aplica los guards de permisos (`PermissionGuard`) correspondientes.
    2.  Edita [nav.config.tsx](file:///home/aletsrangel/Proyectos/mesafacil.ui/src/config/nav.config.tsx) para registrar el enlace en la sección correcta del Sidebar. **La propiedad `path` debe coincidir exactamente** con la declarada en el enrutador y la devuelta en la lista de accesos globales del usuario.
*   **Permisos y Accesos:** No expongas rutas privadas sin envolverlas en `PrivateRoute` y `PermissionGuard`. El Sidebar filtra automáticamente los accesos del usuario utilizando `filterByAccesos` basándose en las rutas exactas.

### 📌 Desarrollo de Formularios
*   **No Hardcodear Inputs:** Si una vista requiere un formulario dinámico provisto por el backend, utiliza siempre `<FormGenerator>`. No construyas inputs estáticos a mano para estas vistas.
*   **Extensión de Campos:** Si se agregan nuevos tipos de campos en el backend, actualiza los adaptadores en `src/components/ui/adapters` y la lógica de renderizado en `src/forms/FieldRenderer.tsx` y `src/forms/FormGenerator.tsx`.

### 📌 Estilos y Presentación
*   **Mantener la Identidad Visual:** Utiliza estrictamente las variables de CSS de [tokens.css](file:///home/aletsrangel/Proyectos/mesafacil.ui/src/styles/tokens.css) para mantener la consistencia (ejemplo: `var(--color-primary)`, `var(--spacing-md)`).
*   **CSS Limpio:** Escribe CSS en archivos separados asociados al componente o vista (p. ej., `usuarios.css` para `UsuariosPage.tsx`). Evita estilos inline o utilities ad-hoc salvo para ajustes muy menores de layout dinámico.

### 📌 Generación de API
*   **Cliente de API Generado:** La capa de servicios (`src/services/generated/api.ts`) es autogenerada a partir del esquema OpenAPI del backend.
*   Si cambias el esquema en el backend o necesitas regenerar los servicios, ejecuta el script:
    ```bash
    npm run api:gen
    ```
    No modifiques el archivo autogenerado manualmente.
