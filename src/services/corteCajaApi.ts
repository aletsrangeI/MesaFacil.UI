import { emptySplitApi as api } from './baseApi';

export interface CorteCajaHistorialItem {
  id: number;
  idTurno?: number;
  idSucursal: number;
  nombreSucursal: string;
  nombreCajero: string;
  fechaInicio: string;
  fechaFin: string;
  cajaInicial: number;
  totalVentas: number;
  totalPagos: number;
  totalEfectivo: number;
  totalTarjeta: number;
  totalPlataformas?: number;
  totalOtros: number;
  totalPropinas: number;
  totalPropinasTarjeta: number;
  totalPropinasEfectivo: number;
  totalIngresos: number;
  totalEgresos: number;
  cajaEsperada: number;
  declarado: number;
  diferencia: number;
  observaciones?: string;
  cantidadCuentasPagadas: number;
  creadoEn: string;
}

export interface ResumenHistorialCortes {
  totalVentas: number;
  totalEfectivo: number;
  totalTarjeta: number;
  totalPropinasTarjeta: number;
  diferenciaNeta: number;
  cantidadCortes: number;
  cortes: CorteCajaHistorialItem[];
}

export interface ResumenCorteDTO {
  idTurno?: number;
  idSucursal: number;
  fechaInicio: string;
  fechaFin: string;
  cajaInicial: number;
  totalVentas: number;
  totalPagos: number;
  totalEfectivo: number;
  totalTarjeta: number;
  totalPlataformas?: number;
  totalOtros: number;
  totalPropinas: number;
  totalPropinasTarjeta: number;
  totalPropinasEfectivo: number;
  totalIngresos: number;
  totalEgresos: number;
  cajaEsperada: number;
  cantidadCuentasPagadas: number;
}

export const corteCajaApi = api.injectEndpoints({
  endpoints: (build) => ({
    getResumenCorte: build.query<
      { isSuccess: boolean; data: ResumenCorteDTO; message?: string },
      { idSucursal?: number; idTurno?: number }
    >({
      query: (params) => ({
        url: '/api/corteCaja/resumen-actual',
        params,
      }),
      providesTags: ['Pedido', 'MovimientoCaja', 'Turno'],
    }),

    getHistorialCortes: build.query<
      { isSuccess: boolean; data: ResumenHistorialCortes; message?: string },
      { fechaInicio?: string; fechaFin?: string; idSucursal?: number }
    >({
      query: (params) => ({
        url: '/api/corteCaja/historial',
        params,
      }),
      providesTags: ['Pedido', 'MovimientoCaja', 'Turno'],
    }),

    realizarCorte: build.mutation<
      { isSuccess: boolean; message?: string; data?: any },
      { idSucursal: number; idTurno?: number; declarado: number; observaciones?: string }
    >({
      query: (body) => ({
        url: '/api/corteCaja/realizar-corte',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Pedido', 'Mesa', 'Turno'],
    }),
  }),
});

export const {
  useGetResumenCorteQuery,
  useGetHistorialCortesQuery,
  useRealizarCorteMutation,
} = corteCajaApi;
