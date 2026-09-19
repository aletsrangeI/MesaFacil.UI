import { emptySplitApi } from './baseApi';

export interface FilaEsperaItemDTO {
  id: number;
  idSucursal: number;
  nombreCliente: string;
  telefono?: string;
  comensales: number;
  notas?: string;
  zonaPreferencia?: string;
  estado: 'EnEspera' | 'Sentado' | 'Cancelado' | 'NoShow';
  fechaLlegada: string;
  minutosTranscurridos: number;
  tiempoEsperaEstimadoMinutos: number;
  urlWhatsApp?: string;
  idMesaAsignada?: number;
  fechaAsignacion?: string;
}

export interface RegistrarWaitlistDTO {
  idSucursal: number;
  nombreCliente: string;
  telefono?: string;
  telefonoCliente?: string;
  comensales: number;
  numeroPersonas?: number;
  notas?: string;
  zonaPreferencia?: string;
}

export interface SentarWaitlistDTO {
  idMesa: number;
}

export interface ReservaMesaDTO {
  id: number;
  idSucursal: number;
  nombreCliente: string;
  telefono?: string;
  telefonoCliente?: string;
  correo?: string;
  comensales: number;
  numeroPersonas?: number;
  fechaHoraReserva: string;
  idMesa?: number;
  idMesaAsignada?: number;
  codigoMesa?: string;
  estado: 'Pendiente' | 'Confirmada' | 'Sentada' | 'Cancelada' | 'NoShow';
  estadoReserva?: string;
  depositoGarantia: number;
  anticipoPagado?: number;
  depositoPagado: boolean;
  notas?: string;
  creadoEn: string;
}

export interface CrearReservaDTO {
  idSucursal: number;
  nombreCliente: string;
  telefono?: string;
  telefonoCliente?: string;
  correo?: string;
  comensales: number;
  numeroPersonas?: number;
  fechaHoraReserva: string;
  idMesa?: number;
  idMesaAsignada?: number;
  depositoGarantia?: number;
  anticipoPagado?: number;
  depositoPagado?: boolean;
  notas?: string;
}

export interface ConfirmarLlegadaReservaDTO {
  idMesa?: number;
}

export interface HostessDashboardSummaryDTO {
  totalEnEspera: number;
  tiempoPromedioEsperaMinutos: number;
  reservasHoyTotal: number;
  reservasHoyConfirmadas: number;
  mesasDisponibles: number;
  mesasPidiendoCuenta: number;
  mesasLimpieza: number;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
  message?: string;
}

export const hostessApi = emptySplitApi.injectEndpoints({
  endpoints: (build) => ({
    getWaitlist: build.query<ApiResponse<FilaEsperaItemDTO[]>, { idSucursal: number; soloActivos?: boolean }>({
      query: ({ idSucursal, soloActivos = true }) => ({
        url: '/api/hostess/waitlist',
        params: { idSucursal, soloActivos },
      }),
      providesTags: ['HostessWaitlist'],
    }),

    registrarWaitlist: build.mutation<ApiResponse<FilaEsperaItemDTO>, RegistrarWaitlistDTO>({
      query: (body) => ({
        url: '/api/hostess/waitlist',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['HostessWaitlist'],
    }),

    sentarWaitlist: build.mutation<ApiResponse<FilaEsperaItemDTO>, { id: number; data: SentarWaitlistDTO }>({
      query: ({ id, data }) => ({
        url: `/api/hostess/waitlist/${id}/sentar`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['HostessWaitlist', 'Mesa'],
    }),

    cancelarWaitlist: build.mutation<ApiResponse<boolean>, number>({
      query: (id) => ({
        url: `/api/hostess/waitlist/${id}/cancelar`,
        method: 'PUT',
      }),
      invalidatesTags: ['HostessWaitlist'],
    }),

    marcarNoShowWaitlist: build.mutation<ApiResponse<boolean>, number>({
      query: (id) => ({
        url: `/api/hostess/waitlist/${id}/no-show`,
        method: 'PUT',
      }),
      invalidatesTags: ['HostessWaitlist'],
    }),

    getReservas: build.query<ApiResponse<ReservaMesaDTO[]>, { idSucursal: number; fecha?: string }>({
      query: ({ idSucursal, fecha }) => ({
        url: '/api/hostess/reservas',
        params: { idSucursal, fecha },
      }),
      providesTags: ['HostessReserva'],
    }),

    crearReserva: build.mutation<ApiResponse<ReservaMesaDTO>, CrearReservaDTO>({
      query: (body) => ({
        url: '/api/hostess/reservas',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['HostessReserva'],
    }),

    confirmarReserva: build.mutation<ApiResponse<ReservaMesaDTO>, number>({
      query: (id) => ({
        url: `/api/hostess/reservas/${id}/confirmar`,
        method: 'PUT',
      }),
      invalidatesTags: ['HostessReserva'],
    }),

    confirmarLlegadaReserva: build.mutation<ApiResponse<ReservaMesaDTO>, { id: number; data?: ConfirmarLlegadaReservaDTO }>({
      query: ({ id, data }) => ({
        url: `/api/hostess/reservas/${id}/llegada`,
        method: 'PUT',
        body: data || {},
      }),
      invalidatesTags: ['HostessReserva', 'Mesa'],
    }),

    cancelarReserva: build.mutation<ApiResponse<boolean>, number>({
      query: (id) => ({
        url: `/api/hostess/reservas/${id}/cancelar`,
        method: 'PUT',
      }),
      invalidatesTags: ['HostessReserva'],
    }),

    getHostessDashboardSummary: build.query<ApiResponse<HostessDashboardSummaryDTO>, number>({
      query: (idSucursal) => ({
        url: '/api/hostess/dashboard-summary',
        params: { idSucursal },
      }),
      providesTags: ['HostessWaitlist', 'HostessReserva', 'Mesa'],
    }),
  }),
});

export const {
  useGetWaitlistQuery,
  useRegistrarWaitlistMutation,
  useSentarWaitlistMutation,
  useCancelarWaitlistMutation,
  useMarcarNoShowWaitlistMutation,
  useGetReservasQuery,
  useCrearReservaMutation,
  useConfirmarReservaMutation,
  useConfirmarLlegadaReservaMutation,
  useCancelarReservaMutation,
  useGetHostessDashboardSummaryQuery,
} = hostessApi;
