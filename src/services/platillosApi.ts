import { emptySplitApi } from "./baseApi";

export interface PlatilloVarianteItem {
  nombre: string;
  codigo?: string;
  precioVenta: number;
  esDefault: boolean;
}

export interface CrearPlatilloCompletoPayload {
  nombre: string;
  descripcion?: string;
  codigo?: string;
  idCategoria: number;
  idMenu: number;
  idEstacionCocina?: number;
  tieneVariantes: boolean;
  precioVenta?: number;
  variantes?: PlatilloVarianteItem[];
}

export interface CrearPlatilloCompletoResult {
  idProducto: number;
  nombre: string;
  idVarianteDefault: number;
  precioVentaDefault: number;
}

interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
}

export const platillosApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    crearPlatilloCompleto: builder.mutation<CrearPlatilloCompletoResult, CrearPlatilloCompletoPayload>({
      query: (body) => ({
        url: "/api/productos/CrearPlatilloCompleto",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<CrearPlatilloCompletoResult>) => response.data,
      invalidatesTags: ["Producto" as any, "VarianteProducto" as any, "Precio" as any],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCrearPlatilloCompletoMutation,
} = platillosApi;
