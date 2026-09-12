import { emptySplitApi } from "./baseApi";

export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
}

export interface CuentaPorPagarItem {
  id: number;
  idEmpresa: number;
  idSucursal: number;
  sucursalNombre: string;
  idProveedor: number;
  proveedorRFC: string;
  proveedorRazonSocial: string;
  proveedorNombreComercial?: string;
  idCompraFactura?: number;
  facturaUUID?: string;
  facturaSerie?: string;
  facturaFolio?: string;
  montoTotal: number;
  saldoInsoluto: number;
  totalAbonado: number;
  fechaEmision: string;
  fechaVencimiento: string;
  diasCredito: number;
  estado: string; // "Pendiente" | "Abonada" | "Pagada" | "Cancelada"
  semaforo: "Vencida" | "PorVencer" | "AlCorriente";
  diasParaVencer: number;
  observaciones?: string;
  cantidadAbonos: number;
}

export interface PagoCuentaPorPagar {
  id: number;
  idCuentaPorPagar: number;
  monto: number;
  fechaPago: string;
  idMetodoPago: number;
  metodoPagoNombre: string;
  idMovimientoCaja?: number;
  turnoUsuario?: string;
  referenciaBancaria?: string;
  comprobanteUrl?: string;
  idUsuario?: number;
  usuarioNombre?: string;
  observaciones?: string;
}

export interface CuentaPorPagarDetalle extends CuentaPorPagarItem {
  pagos: PagoCuentaPorPagar[];
}

export interface RegistrarPagoPayload {
  idCuentaPorPagar: number;
  monto: number;
  fechaPago?: string;
  idMetodoPago: number;
  pagarDesdeCajaChica: boolean;
  idTurno?: number;
  referenciaBancaria?: string;
  observaciones?: string;
}

export interface FiltroCxP {
  idSucursal?: number;
  idProveedor?: number;
  estado?: string;
  semaforo?: string;
  fechaInicio?: string;
  fechaFin?: string;
  buscar?: string;
}

export interface ResumenKpisCxP {
  totalPorPagar: number;
  totalVencido: number;
  totalVenceEstaSemana: number;
  totalPagadoMes: number;
  cantidadPendientes: number;
  cantidadVencidas: number;
}

export interface AntiguedadBucket {
  alCorriente: number;
  de1A15: number;
  de16A30: number;
  de31A60: number;
  masDe60: number;
  total: number;
}

export interface AntiguedadProveedor extends AntiguedadBucket {
  idProveedor: number;
  rfc: string;
  razonSocial: string;
}

export interface ReporteAntiguedadSaldos {
  totales: AntiguedadBucket;
  proveedores: AntiguedadProveedor[];
}

export interface MovimientoEstadoCuenta {
  fecha: string;
  tipo: string;
  referencia: string;
  cargo: number;
  abono: number;
  saldoAcumulado: number;
  metodoPago?: string;
  observaciones?: string;
}

export interface EstadoCuentaProveedor {
  idProveedor: number;
  rfc: string;
  razonSocial: string;
  diasCredito: number;
  saldoTotalPendiente: number;
  totalCompradoCredito: number;
  totalAbonado: number;
  movimientos: MovimientoEstadoCuenta[];
}

export interface TurnoActivo {
  idTurno: number;
  idSucursal: number;
  sucursalNombre: string;
  idUsuario: number;
  usuarioNombre: string;
  apertura: string;
  cajaInicial: number;
}

export const cxpApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getCuentasPorPagar: builder.query<CuentaPorPagarItem[], FiltroCxP | void>({
      query: (filtro) => ({
        url: "/api/CxP",
        params: filtro ? {
          ...(filtro.idSucursal ? { IdSucursal: filtro.idSucursal } : {}),
          ...(filtro.idProveedor ? { IdProveedor: filtro.idProveedor } : {}),
          ...(filtro.estado && filtro.estado !== "Todos" ? { Estado: filtro.estado } : {}),
          ...(filtro.semaforo && filtro.semaforo !== "Todos" ? { Semaforo: filtro.semaforo } : {}),
          ...(filtro.fechaInicio ? { FechaInicio: filtro.fechaInicio } : {}),
          ...(filtro.fechaFin ? { FechaFin: filtro.fechaFin } : {}),
          ...(filtro.buscar ? { Buscar: filtro.buscar } : {}),
        } : {},
      }),
      transformResponse: (response: ApiResponse<CuentaPorPagarItem[]>) => response.data ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "CuentaPorPagar" as const, id })),
              { type: "CuentaPorPagar", id: "LIST" },
            ]
          : [{ type: "CuentaPorPagar", id: "LIST" }],
    }),

    getCuentaPorPagarById: builder.query<CuentaPorPagarDetalle, number>({
      query: (id) => `/api/CxP/${id}`,
      transformResponse: (response: ApiResponse<CuentaPorPagarDetalle>) => response.data,
      providesTags: (_result, _error, id) => [{ type: "CuentaPorPagar", id }],
    }),

    getKpisCxP: builder.query<ResumenKpisCxP, number | undefined>({
      query: (idSucursal) => ({
        url: "/api/CxP/Kpis",
        params: idSucursal ? { idSucursal } : {},
      }),
      transformResponse: (response: ApiResponse<ResumenKpisCxP>) => response.data,
      providesTags: [{ type: "CuentaPorPagar", id: "KPIS" }],
    }),

    registrarAbono: builder.mutation<PagoCuentaPorPagar, RegistrarPagoPayload>({
      query: (payload) => ({
        url: "/api/CxP/Abonar",
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: ApiResponse<PagoCuentaPorPagar>) => response.data,
      invalidatesTags: [
        { type: "CuentaPorPagar", id: "LIST" },
        { type: "CuentaPorPagar", id: "KPIS" },
        { type: "PagoCxP", id: "LIST" },
        { type: "ReporteAntiguedad", id: "LIST" },
        "MovimientoCaja",
        "CorteCaja",
      ],
    }),

    cancelarCuentaPorPagar: builder.mutation<boolean, { id: number; motivo?: string }>({
      query: ({ id, motivo }) => ({
        url: `/api/CxP/${id}/Cancelar`,
        method: "POST",
        params: motivo ? { motivo } : {},
      }),
      transformResponse: (response: ApiResponse<boolean>) => response.data,
      invalidatesTags: [
        { type: "CuentaPorPagar", id: "LIST" },
        { type: "CuentaPorPagar", id: "KPIS" },
        { type: "ReporteAntiguedad", id: "LIST" },
      ],
    }),

    getReporteAntiguedadSaldos: builder.query<ReporteAntiguedadSaldos, number | undefined>({
      query: (idSucursal) => ({
        url: "/api/CxP/AntiguedadSaldos",
        params: idSucursal ? { idSucursal } : {},
      }),
      transformResponse: (response: ApiResponse<ReporteAntiguedadSaldos>) => response.data,
      providesTags: [{ type: "ReporteAntiguedad", id: "LIST" }],
    }),

    getEstadoCuentaProveedor: builder.query<EstadoCuentaProveedor, { idProveedor: number; idSucursal?: number }>({
      query: ({ idProveedor, idSucursal }) => ({
        url: `/api/CxP/EstadoCuenta/${idProveedor}`,
        params: idSucursal ? { idSucursal } : {},
      }),
      transformResponse: (response: ApiResponse<EstadoCuentaProveedor>) => response.data,
      providesTags: (_result, _err, arg) => [{ type: "CuentaPorPagar", id: `PROV_${arg.idProveedor}` }],
    }),

    getTurnosActivos: builder.query<TurnoActivo[], number>({
      query: (idSucursal) => `/api/CxP/TurnosActivos/${idSucursal}`,
      transformResponse: (response: ApiResponse<TurnoActivo[]>) => response.data ?? [],
      providesTags: ["Turno"],
    }),
  }),
});

export const {
  useGetCuentasPorPagarQuery,
  useGetCuentaPorPagarByIdQuery,
  useGetKpisCxPQuery,
  useRegistrarAbonoMutation,
  useCancelarCuentaPorPagarMutation,
  useGetReporteAntiguedadSaldosQuery,
  useGetEstadoCuentaProveedorQuery,
  useGetTurnosActivosQuery,
} = cxpApi;
