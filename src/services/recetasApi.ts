import { emptySplitApi } from "./baseApi";

export interface RecetaDetalle {
  id?: number;
  idReceta?: number;
  idInsumo?: number;
  insumoCodigo?: string;
  insumoNombre?: string;
  idSubReceta?: number;
  subRecetaNombre?: string;
  cantidad: number;
  idUnidadMedida: number;
  unidadMedidaCodigo?: string;
  unidadMedidaNombre?: string;
  porcentajeMermaEsperada: number;
  costoUnitarioInsumo?: number;
  costoCalculado?: number;
  participacionPct?: number;
}

export interface Receta {
  id: number;
  idProducto?: number;
  productoNombre?: string;
  idVariante?: number;
  varianteNombre?: string;
  idOpcionModificador?: number;
  opcionModificadorNombre?: string;
  nombre: string;
  descripcion?: string;
  esSubReceta: boolean;
  rendimiento: number;
  idUnidadMedidaRendimiento: number;
  unidadMedidaRendimientoCodigo?: string;
  unidadMedidaRendimientoNombre?: string;
  costoEstimadoUnitario: number;
  costoTotalLote: number;
  precioVentaActual?: number;
  margenBrutoMonto?: number;
  margenBrutoPct?: number;
  foodCostPct?: number;
  nivelSaludMargen: "Optimo" | "Ajustado" | "Critico";
  isActive: boolean;
  detalles: RecetaDetalle[];
}

export interface CrearRecetaDetallePayload {
  idInsumo?: number;
  idSubReceta?: number;
  cantidad: number;
  idUnidadMedida: number;
  porcentajeMermaEsperada: number;
}

export interface CrearRecetaPayload {
  idProducto?: number;
  idVariante?: number;
  idOpcionModificador?: number;
  nombre: string;
  descripcion?: string;
  esSubReceta: boolean;
  rendimiento: number;
  idUnidadMedidaRendimiento: number;
  detalles: CrearRecetaDetallePayload[];
}

export interface ActualizarRecetaPayload extends CrearRecetaPayload {
  isActive: boolean;
}

export interface SubRecetaSimple {
  id: number;
  nombre: string;
  rendimiento: number;
  idUnidadMedidaRendimiento: number;
  unidadMedidaCodigo: string;
  unidadMedidaNombre: string;
  costoEstimadoUnitario: number;
}

export interface SimulacionIngredienteResult {
  idInsumo?: number;
  idSubReceta?: number;
  nombre: string;
  cantidad: number;
  unidadMedida: string;
  costoUnitario: number;
  cantidadEquivalenteBase: number;
  mermaPct: number;
  costoTotal: number;
  participacionCostoPct: number;
}

export interface SimulacionCosteoResponse {
  costoTotalLote: number;
  costoPorcion: number;
  foodCostPct: number;
  margenBrutoPct: number;
  margenBrutoMonto: number;
  precioVentaCalculado: number;
  precioVentaConIva: number;
  nivelSaludMargen: "Optimo" | "Ajustado" | "Critico";
  desglose: SimulacionIngredienteResult[];
}

export interface SimulacionCosteoPayload {
  rendimiento: number;
  idUnidadMedidaRendimiento: number;
  precioVenta?: number;
  margenObjetivoPct?: number;
  detalles: CrearRecetaDetallePayload[];
}

interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
}

export const recetasApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecetas: builder.query<
      Receta[],
      {
        idProducto?: number;
        idVariante?: number;
        idOpcionModificador?: number;
        esSubReceta?: boolean;
        search?: string;
      } | void
    >({
      query: (params) => ({
        url: "/api/Recetas",
        params: params || undefined,
      }),
      transformResponse: (response: ApiResponse<Receta[]>) => response.data,
      providesTags: ["Receta" as any],
    }),

    getRecetaById: builder.query<Receta, number>({
      query: (id) => `/api/Recetas/${id}`,
      transformResponse: (response: ApiResponse<Receta>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "Receta" as any, id }],
    }),

    getSubRecetasDisponibles: builder.query<SubRecetaSimple[], { idRecetaExcluir?: number } | void>({
      query: (params) => ({
        url: "/api/Recetas/SubRecetasDisponibles",
        params: params || undefined,
      }),
      transformResponse: (response: ApiResponse<SubRecetaSimple[]>) => response.data,
      providesTags: ["Receta" as any],
    }),

    simularCosteo: builder.mutation<SimulacionCosteoResponse, SimulacionCosteoPayload>({
      query: (body) => ({
        url: "/api/Recetas/Simular",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<SimulacionCosteoResponse>) => response.data,
    }),

    crearReceta: builder.mutation<Receta, CrearRecetaPayload>({
      query: (body) => ({
        url: "/api/Recetas",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<Receta>) => response.data,
      invalidatesTags: ["Receta" as any],
    }),

    actualizarReceta: builder.mutation<Receta, { id: number; payload: ActualizarRecetaPayload }>({
      query: ({ id, payload }) => ({
        url: `/api/Recetas/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: ApiResponse<Receta>) => response.data,
      invalidatesTags: (_result, _error, { id }) => ["Receta" as any, { type: "Receta" as any, id }],
    }),

    eliminarReceta: builder.mutation<boolean, number>({
      query: (id) => ({
        url: `/api/Recetas/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<boolean>) => response.data,
      invalidatesTags: ["Receta" as any],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetRecetasQuery,
  useGetRecetaByIdQuery,
  useGetSubRecetasDisponiblesQuery,
  useSimularCosteoMutation,
  useCrearRecetaMutation,
  useActualizarRecetaMutation,
  useEliminarRecetaMutation,
} = recetasApi;
