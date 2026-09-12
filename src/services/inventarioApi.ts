import { emptySplitApi } from "./baseApi";

export interface UnidadMedida {
  id: number;
  codigo: string;
  nombre: string;
  tipo: string;
  isActive: boolean;
}

export interface CategoriaInsumo {
  id: number;
  codigo: string;
  nombre: string;
  descripcion?: string;
  isActive: boolean;
}

export interface Insumo {
  id: number;
  codigo: string;
  nombre: string;
  idCategoriaInsumo: number;
  categoriaNombre: string;
  idUnidadMedidaBase: number;
  unidadMedidaCodigo: string;
  unidadMedidaNombre: string;
  costoPromedio: number;
  ultimoCosto: number;
  stockMinimo: number;
  stockMaximo: number;
  esCritico: boolean;
  isActive: boolean;
  stockTotalConsolidado: number;
  valorizadoConsolidado: number;
}

export interface CrearInsumoPayload {
  codigo?: string;
  nombre: string;
  idCategoriaInsumo: number;
  idUnidadMedidaBase: number;
  costoInicial: number;
  stockMinimo: number;
  stockMaximo: number;
  esCritico: boolean;
  idAlmacenInicial?: number;
  stockInicial: number;
}

export interface ActualizarInsumoPayload {
  codigo?: string;
  nombre?: string;
  idCategoriaInsumo: number;
  idUnidadMedidaBase: number;
  stockMinimo: number;
  stockMaximo: number;
  esCritico: boolean;
  isActive: boolean;
}

export interface Almacen {
  id: number;
  idSucursal: number;
  sucursalNombre: string;
  codigo: string;
  nombre: string;
  tipoAlmacen: string;
  esPrincipal: boolean;
  isActive: boolean;
  totalInsumos: number;
  valorizadoTotal: number;
}

export interface CrearAlmacenPayload {
  idSucursal: number;
  codigo?: string;
  nombre: string;
  tipoAlmacen?: string;
  esPrincipal?: boolean;
}

export interface Existencia {
  id: number;
  idAlmacen: number;
  almacenNombre: string;
  idSucursal: number;
  sucursalNombre: string;
  idInsumo: number;
  insumoCodigo: string;
  insumoNombre: string;
  categoriaNombre: string;
  unidadMedidaCodigo: string;
  stockActual: number;
  stockMinimo: number;
  stockMaximo: number;
  costoPromedio: number;
  valorizado: number;
  esCritico: boolean;
  estadoStock: "Normal" | "Bajo" | "Agotado" | "SobreInventario";
  fechaUltimoMovimiento: string;
}

export interface MovimientoManualPayload {
  idAlmacen: number;
  idInsumo: number;
  tipoMovimiento: "EntradaManual" | "SalidaMerma" | "AjusteInventario";
  submotivo?: string;
  cantidad: number;
  costoUnitario?: number;
  documentoReferencia?: string;
  observaciones?: string;
}

export interface KardexMovimientoItem {
  id: number;
  idAlmacen: number;
  almacenNombre: string;
  idInsumo: number;
  insumoCodigo: string;
  insumoNombre: string;
  unidadMedidaCodigo: string;
  tipoMovimiento: string;
  submotivo?: string;
  cantidad: number;
  costoUnitario: number;
  costoTotal: number;
  saldoAnterior: number;
  saldoNuevo: number;
  costoPromedioResultante: number;
  documentoReferencia?: string;
  observaciones?: string;
  usuarioNombre?: string;
  fechaHora: string;
}

export interface KardexReporte {
  insumoId: number;
  insumoCodigo: string;
  insumoNombre: string;
  unidadMedida: string;
  almacenId?: number;
  almacenNombre?: string;
  saldoInicial: number;
  totalEntradas: number;
  totalSalidas: number;
  saldoFinal: number;
  costoPromedioFinal: number;
  valorizadoFinal: number;
  movimientos: KardexMovimientoItem[];
}

export interface TraspasoItem {
  idInsumo: number;
  insumoNombre?: string;
  unidadMedida?: string;
  cantidad: number;
  stockDisponible?: number;
}

export interface TraspasoCrearPayload {
  idAlmacenOrigen: number;
  idAlmacenDestino: number;
  observaciones?: string;
  items: TraspasoItem[];
}

export interface TraspasoResumen {
  id: number;
  folio: string;
  idAlmacenOrigen: number;
  almacenOrigenNombre: string;
  idAlmacenDestino: number;
  almacenDestinoNombre: string;
  estado: string;
  usuarioSolicitaNombre: string;
  fechaSolicitud: string;
  observaciones?: string;
  totalItems: number;
  detalles: TraspasoItem[];
}

export interface ConteoFisicoItem {
  idInsumo: number;
  insumoCodigo: string;
  insumoNombre: string;
  unidadMedida: string;
  stockTeorico: number;
  stockFisico: number;
  discrepancia: number;
  costoPromedio: number;
  impactoMonetario: number;
  esCritico: boolean;
}

export interface LoteConteoFisicoPayload {
  idAlmacen: number;
  observaciones?: string;
  conteos: {
    idInsumo: number;
    stockFisico: number;
  }[];
}

export interface CatalogosBaseInventario {
  unidadesMedida: UnidadMedida[];
  categorias: CategoriaInsumo[];
  almacenes: Almacen[];
  sucursales: Array<{ id: number; codigo: string; nombre: string }>;
  tiposAlmacen?: Array<{ id: number; codigo: string; descripcion: string }>;
  motivosMovimiento?: Array<{ id: number; codigo: string; tipoMovimiento: string; descripcion: string }>;
}

interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
}

export const inventarioApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getCatalogosBaseInventario: builder.query<CatalogosBaseInventario, { idSucursal?: number } | void>({
      query: (arg) => ({
        url: "/api/Inventario/CatalogosBase",
        params: arg?.idSucursal ? { idSucursal: arg.idSucursal } : undefined,
      }),
      transformResponse: (response: ApiResponse<CatalogosBaseInventario>) => response.data,
      providesTags: ["Catalogo", "Almacen"],
    }),

    getInsumos: builder.query<
      Insumo[],
      { idCategoria?: number; esCritico?: boolean; search?: string } | void
    >({
      query: (params) => ({
        url: "/api/Inventario/Insumos",
        params: params || undefined,
      }),
      transformResponse: (response: ApiResponse<Insumo[]>) => response.data,
      providesTags: ["Insumo"],
    }),

    crearInsumo: builder.mutation<Insumo, CrearInsumoPayload>({
      query: (body) => ({
        url: "/api/Inventario/Insumos",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<Insumo>) => response.data,
      invalidatesTags: ["Insumo", "InventarioExistencia", "KardexMovimiento"],
    }),

    actualizarInsumo: builder.mutation<boolean, { id: number; payload: ActualizarInsumoPayload }>({
      query: ({ id, payload }) => ({
        url: `/api/Inventario/Insumos/${id}`,
        method: "PUT",
        body: payload,
      }),
      transformResponse: (response: ApiResponse<boolean>) => response.data,
      invalidatesTags: ["Insumo", "InventarioExistencia"],
    }),

    eliminarInsumo: builder.mutation<boolean, number>({
      query: (id) => ({
        url: `/api/Inventario/Insumos/${id}`,
        method: "DELETE",
      }),
      transformResponse: (response: ApiResponse<boolean>) => response.data,
      invalidatesTags: ["Insumo", "InventarioExistencia"],
    }),

    getAlmacenes: builder.query<Almacen[], { idSucursal?: number } | void>({
      query: (arg) => ({
        url: "/api/Inventario/Almacenes",
        params: arg?.idSucursal ? { idSucursal: arg.idSucursal } : undefined,
      }),
      transformResponse: (response: ApiResponse<Almacen[]>) => response.data,
      providesTags: ["Almacen"],
    }),

    crearAlmacen: builder.mutation<Almacen, CrearAlmacenPayload>({
      query: (body) => ({
        url: "/api/Inventario/Almacenes",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<Almacen>) => response.data,
      invalidatesTags: ["Almacen", "Catalogo"],
    }),

    getExistencias: builder.query<
      Existencia[],
      {
        idSucursal?: number;
        idAlmacen?: number;
        idCategoria?: number;
        soloBajoStock?: boolean;
        search?: string;
      } | void
    >({
      query: (params) => ({
        url: "/api/Inventario/Existencias",
        params: params || undefined,
      }),
      transformResponse: (response: ApiResponse<Existencia[]>) => response.data,
      providesTags: ["InventarioExistencia"],
    }),

    registrarMovimientoInventario: builder.mutation<boolean, MovimientoManualPayload>({
      query: (body) => ({
        url: "/api/Inventario/Movimiento",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<boolean>) => response.data,
      invalidatesTags: ["Insumo", "InventarioExistencia", "KardexMovimiento", "Almacen"],
    }),

    getKardex: builder.query<
      KardexReporte,
      {
        idInsumo: number;
        idAlmacen?: number;
        fechaInicio?: string;
        fechaFin?: string;
      }
    >({
      query: (params) => ({
        url: "/api/Inventario/Kardex",
        params,
      }),
      transformResponse: (response: ApiResponse<KardexReporte>) => response.data,
      providesTags: ["KardexMovimiento"],
    }),

    registrarTraspaso: builder.mutation<TraspasoResumen, TraspasoCrearPayload>({
      query: (body) => ({
        url: "/api/Inventario/Traspaso",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<TraspasoResumen>) => response.data,
      invalidatesTags: ["InventarioExistencia", "KardexMovimiento", "TraspasoAlmacen", "Almacen"],
    }),

    aplicarAjustesConteoFisico: builder.mutation<number, LoteConteoFisicoPayload>({
      query: (body) => ({
        url: "/api/Inventario/ConteoFisico/Ajustar",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<number>) => response.data,
      invalidatesTags: ["InventarioExistencia", "KardexMovimiento", "Insumo", "Almacen"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCatalogosBaseInventarioQuery,
  useGetInsumosQuery,
  useCrearInsumoMutation,
  useActualizarInsumoMutation,
  useEliminarInsumoMutation,
  useGetAlmacenesQuery,
  useCrearAlmacenMutation,
  useGetExistenciasQuery,
  useRegistrarMovimientoInventarioMutation,
  useGetKardexQuery,
  useLazyGetKardexQuery,
  useRegistrarTraspasoMutation,
  useAplicarAjustesConteoFisicoMutation,
} = inventarioApi;
