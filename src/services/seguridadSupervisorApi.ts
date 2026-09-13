// src/services/seguridadSupervisorApi.ts
// Spec 024: Candado de Supervisor (PIN 4 Dígitos) y Alerta de Cancelaciones Sospechosas.
//
// Contratos confirmados directamente contra el código fuente del backend (el openapi/v1.json en
// vivo no estaba disponible al momento de escribir este archivo):
//   - WebApi/Controllers/SeguridadSupervisorController.cs
//   - WebApi/Controllers/AuditoriaCancelacionesController.cs
//   - DTO/Seguridad/*.cs, DTO/Auditoria/*.cs
//
// Nota importante: idPedido/idPedidoDetalle son Guid (string) en la implementación real, NO int
// como en el borrador original del spec.md (Pedido.Id es Guid/UUIDv7 desde spec 019).
//
// Nota sobre wrappers: la mayoría de los endpoints del proyecto devuelven el sobre habitual
// { data, isSuccess, message, errors }. La EXCEPCIÓN es POST /api/seguridad/autorizar-supervisor-pin,
// que devuelve el DTO de respuesta DIRECTO (sin sobre) — confirmado en el controlador, que regresa
// siempre HTTP 200 con `autorizado: false` en el body en vez de un código de error, para que el
// teclado táctil del POS pueda mostrar el mensaje sin manejar códigos HTTP.
import { emptySplitApi as api } from './baseApi';

export type AccionProtegida = 'CancelarPlatilloCocina' | 'DescuentoExcesivo' | 'CancelarCuenta';

export interface AutorizarSupervisorPinRequest {
  pin: string;
  accionProtegida: AccionProtegida;
  idPedido: string;
  idPedidoDetalle?: string | null;
  motivo: string;
}

/** DTO directo (sin wrapper) — ver nota arriba. */
export interface AutorizarSupervisorPinResponse {
  autorizado: boolean;
  supervisorId?: number | null;
  nombreSupervisor?: string | null;
  tokenAutorizacion?: string | null;
  mensaje?: string | null;
  bloqueado: boolean;
  bloqueadoHastaUtc?: string | null;
}

export interface ConfigurarPinRequest {
  idUsuario?: number | null;
  nuevoPin: string;
}

export interface MotivoCancelacion {
  id: number;
  descripcion: string;
}

export interface DesgloseCancelacion {
  fechaHora: string;
  mesa?: string | null;
  platillo?: string | null;
  importe: number;
  mesero?: string | null;
  supervisor?: string | null;
  motivo?: string | null;
}

export interface ResumenCancelacionesTurno {
  totalVentasTurno: number;
  totalCancelacionesTurno: number;
  porcentajeCancelaciones: number;
  superaUmbralAlerta: boolean;
  totalEventos: number;
  desglose: DesgloseCancelacion[];
}

interface ApiEnvelope<T> {
  isSuccess: boolean;
  data: T;
  message?: string;
}

export const seguridadSupervisorApi = api.injectEndpoints({
  endpoints: (build) => ({
    /** POST /api/seguridad/autorizar-supervisor-pin — desafío de PIN táctil en el POS. */
    autorizarSupervisorPin: build.mutation<AutorizarSupervisorPinResponse, AutorizarSupervisorPinRequest>({
      query: (body) => ({
        url: '/api/seguridad/autorizar-supervisor-pin',
        method: 'POST',
        body,
      }),
    }),

    /** POST /api/seguridad/configurar-pin — un Gerente/Admin configura o cambia su propio PIN. */
    configurarPin: build.mutation<ApiEnvelope<boolean>, ConfigurarPinRequest>({
      query: (body) => ({
        url: '/api/seguridad/configurar-pin',
        method: 'POST',
        body,
      }),
    }),

    /** GET /api/auditoria/motivos-cancelacion — catálogo para el <select> obligatorio del modal. */
    getMotivosCancelacion: build.query<ApiEnvelope<MotivoCancelacion[]>, void>({
      query: () => ({ url: '/api/auditoria/motivos-cancelacion' }),
      providesTags: ['Catalogo'],
    }),

    /** GET /api/auditoria/cancelaciones-turno?idTurno=X — KPIs y semáforo para el Dashboard. */
    getCancelacionesTurno: build.query<ApiEnvelope<ResumenCancelacionesTurno>, { idTurno: number }>({
      query: ({ idTurno }) => ({ url: '/api/auditoria/cancelaciones-turno', params: { idTurno } }),
      providesTags: ['EventoPedido'],
    }),
  }),
});

export const {
  useAutorizarSupervisorPinMutation,
  useConfigurarPinMutation,
  useGetMotivosCancelacionQuery,
  useGetCancelacionesTurnoQuery,
} = seguridadSupervisorApi;
