// src/services/importadorMenuApi.ts
//
// Endpoints del Importador Inteligente de Menú y Catálogos (spec 022-importador-menu-catalogos-excel-csv).
// Escrito a mano siguiendo el patrón de `movimientoCajaApi.ts` / `facturacionApi.ts` porque
// `npm run api:gen` está roto por un bug preexistente (rutas duplicadas en otros controladores)
// no relacionado con este feature.
//
// NOTA: Al momento de escribir este archivo, el backend local (http://localhost:5286) respondía
// en `/openapi/v1.json` pero el `CatalogosImportacionController` de la spec 022 aún no aparecía
// publicado en ese documento (probablemente el proceso corriendo no había recogido el build más
// reciente). Los DTOs se modelaron entonces a partir del contrato exacto documentado en
// `specs/022-importador-menu-catalogos-excel-csv/spec.md` (sección 3), que ya especifica los
// nombres de campo en camelCase. Si al conectar contra el backend real los nombres difieren,
// ajustar únicamente aquí sin tocar los componentes que consumen los hooks.
import { emptySplitApi as rawApi } from './baseApi';

// Los tagTypes declarados en `baseApi.ts` son singulares ("Producto", "Categoria", ...)
// pero las queries CRUD de `src/services/generated/api.ts` (ProductosGetAll, CategoriasGetAll,
// etc.) usan tags plurales agregados vía `enhanceEndpoints({ addTagTypes })`. Se replica el
// mismo patrón aquí para poder invalidar esas queries desde la confirmación de importación.
const api = rawApi.enhanceEndpoints({
  addTagTypes: ['Productos', 'Categorias', 'GrupoModificadores', 'OpcionModificadores', 'Catalogos'] as const,
});

export type ModoImportacionMenu = 'Merge' | 'Overwrite';

export interface AdvertenciaImportacion {
  fila: number;
  columna: string;
  mensaje: string;
}

export interface ErrorImportacion {
  fila: number;
  columna: string;
  mensaje: string;
}

export interface PreviewImportacionMenuResponse {
  tokenPreview: string;
  totalRenglones: number;
  categoriasNuevas: number;
  productosNuevos: number;
  productosActualizar: number;
  gruposModificadoresDetectados: number;
  esValido: boolean;
  errores: ErrorImportacion[];
  advertencias: AdvertenciaImportacion[];
}

export interface PreviewImportacionMenuRequest {
  archivo: File;
  modo: ModoImportacionMenu;
  sucursalId: number;
}

export interface ConfirmarImportacionMenuRequest {
  tokenPreview: string;
  modo: ModoImportacionMenu;
  sucursalId: number;
}

export interface ConfirmarImportacionMenuResponse {
  isSuccess: boolean;
  message?: string;
  categoriasCreadas?: number;
  productosCreados?: number;
  productosActualizados?: number;
}

export const importadorMenuApi = api.injectEndpoints({
  endpoints: (build) => ({
    previewImportacionMenu: build.mutation<
      PreviewImportacionMenuResponse,
      PreviewImportacionMenuRequest
    >({
      query: ({ archivo, modo, sucursalId }) => {
        const formData = new FormData();
        formData.append('Archivo', archivo);
        formData.append('Modo', modo);
        formData.append('SucursalId', String(sucursalId));
        return {
          url: '/api/catalogos/importar-menu/preview',
          method: 'POST',
          body: formData,
        };
      },
    }),

    confirmarImportacionMenu: build.mutation<
      ConfirmarImportacionMenuResponse,
      ConfirmarImportacionMenuRequest
    >({
      query: (body) => ({
        url: '/api/catalogos/importar-menu/confirmar',
        method: 'POST',
        body,
      }),
      // Nota: los tags plurales ("Productos", "Categorias", etc.) coinciden con los que
      // usa `src/services/generated/api.ts` en sus mutaciones CRUD (no con los tagTypes
      // singulares declarados en `baseApi.ts`, un mismatch preexistente en el proyecto).
      // Se replican aquí tal cual para que las queries de esas pantallas se refresquen.
      invalidatesTags: ['Productos', 'Categorias', 'GrupoModificadores', 'OpcionModificadores', 'Catalogos'],
    }),
  }),
});

export const {
  usePreviewImportacionMenuMutation,
  useConfirmarImportacionMenuMutation,
} = importadorMenuApi;

/**
 * Descarga la plantilla oficial `Plantilla_Menu_MesaFacil.xlsx`. Sigue el mismo patrón
 * autocontenido de `descargarArchivoFactura` en `facturacionApi.ts`: fetch directo a blob
 * con el Bearer token de sesión (si existe) y un link temporal para disparar la descarga.
 */
export async function descargarPlantillaMenu(): Promise<void> {
  const headers: HeadersInit = {};
  try {
    const raw = localStorage.getItem('mf_auth');
    if (raw) {
      const { accessToken } = JSON.parse(raw);
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    }
  } catch {
    // sin sesión activa: continúa sin header
  }

  const res = await fetch('/api/catalogos/importar-menu/plantilla', {
    method: 'GET',
    headers,
    credentials: 'include',
  });
  if (!res.ok) {
    throw new Error(`No se pudo descargar la plantilla (HTTP ${res.status})`);
  }
  const blob = await res.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = 'Plantilla_Menu_MesaFacil.xlsx';
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
}
