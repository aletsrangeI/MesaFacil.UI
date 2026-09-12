import { emptySplitApi as api } from './baseApi';

export interface RegistrarMovimientoRequest {
  idTurno: number;
  tipo: 'Egreso' | 'Ingreso';
  monto: number;
  nota?: string;
}

export interface MovimientoCajaItem {
  id: number;
  idTurno: number;
  idSucursal: number;
  nombreSucursal: string;
  nombreUsuario: string;
  tipo: 'Egreso' | 'Ingreso';
  monto: number;
  concepto: string;
  nota?: string;
  createdAt: string;
}

export const movimientoCajaApi = api.injectEndpoints({
  endpoints: (build) => ({
    getHistorialMovimientos: build.query<
      { isSuccess: boolean; data: MovimientoCajaItem[]; message?: string },
      { fechaInicio?: string; fechaFin?: string; idSucursal?: number; idTurno?: number }
    >({
      query: (params) => ({
        url: '/api/movimientocaja/historial',
        params,
      }),
      providesTags: ['MovimientoCaja'],
    }),

    registrarMovimiento: build.mutation<
      { isSuccess: boolean; message?: string },
      RegistrarMovimientoRequest
    >({
      query: (body) => ({
        url: '/api/movimientocaja/insert-async',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['MovimientoCaja', 'Pedido'],
    }),
  }),
});

export const {
  useGetHistorialMovimientosQuery,
  useRegistrarMovimientoMutation,
} = movimientoCajaApi;
