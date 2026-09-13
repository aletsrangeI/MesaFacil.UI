// src/services/impresorasApi.ts
import { emptySplitApi as api } from './baseApi';

/** Estados semafóricos devueltos por el motor de diagnóstico */
export type EstadoImpresora =
  | 'Ok'
  | 'NoAlcanzable'
  | 'TapaAbierta'
  | 'SinPapel'
  | 'ErrorHardware';

export type TipoConexionImpresora = 'RedLAN' | 'USBLocal' | 'NavegadorDialogo';

/** Configuración de impresora (CRUD) — coincide con ConfiguracionImpresoraDTO */
export interface ConfiguracionImpresora {
  id: number;
  idSucursal: number;
  nombre: string;
  tipoConexion: TipoConexionImpresora | string;
  anchoPapel: number; // 58 | 80
  direccionIp?: string | null;
  puerto: number;
  aperturaCajon: boolean;
  autocorte: boolean;
  estacionAsociada?: string | null;
}

export type ConfiguracionImpresoraRequest = Omit<ConfiguracionImpresora, 'id'> & {
  id?: number;
};

/**
 * Respuesta del endpoint de diagnóstico. IMPORTANTE: a diferencia del resto de
 * la app, este endpoint (y el de test-print) devuelve el DTO DIRECTO, sin el
 * wrapper habitual `{ isSuccess, data, message }`. Confirmado contra
 * http://localhost:5286/openapi/v1.json (schema DiagnosticoImpresoraResponseDTO).
 */
export interface DiagnosticoImpresoraResponse {
  idImpresora: number;
  nombre: string;
  direccionIp?: string | null;
  puerto: number;
  latenciaMs?: number | null;
  estado: EstadoImpresora;
  tapaAbierta: boolean;
  sinPapel: boolean;
  mensajeDiagnostico: string;
  accionSugerida: string;
}

/**
 * Respuesta del endpoint de test de impresión. También es el DTO directo,
 * sin wrapper (schema TestPrintResponseDTO).
 */
export interface TestPrintResponse {
  exitoso: boolean;
  mensaje: string;
}

interface ApiEnvelope<T> {
  isSuccess: boolean;
  data: T;
  message?: string;
}

export const impresorasApi = api.injectEndpoints({
  endpoints: (build) => ({
    getImpresorasAll: build.query<ApiEnvelope<ConfiguracionImpresora[]>, void>({
      query: () => ({ url: '/api/impresoras/GetAll' }),
      providesTags: ['Impresora'],
    }),

    getImpresorasBySucursal: build.query<ApiEnvelope<ConfiguracionImpresora[]>, number>({
      query: (idSucursal) => ({ url: `/api/impresoras/sucursal/${idSucursal}` }),
      providesTags: ['Impresora'],
    }),

    getImpresoraById: build.query<ApiEnvelope<ConfiguracionImpresora>, number>({
      query: (id) => ({ url: `/api/impresoras/GetById/${id}` }),
      providesTags: ['Impresora'],
    }),

    insertImpresora: build.mutation<ApiEnvelope<number>, ConfiguracionImpresoraRequest>({
      query: (body) => ({
        url: '/api/impresoras/Insert',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Impresora'],
    }),

    updateImpresora: build.mutation<ApiEnvelope<boolean>, ConfiguracionImpresora>({
      query: (body) => ({
        url: '/api/impresoras/Update',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Impresora'],
    }),

    deleteImpresora: build.mutation<ApiEnvelope<boolean>, number>({
      query: (id) => ({
        url: `/api/impresoras/Delete/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Impresora'],
    }),

    diagnosticarImpresora: build.mutation<DiagnosticoImpresoraResponse, number>({
      query: (idImpresora) => ({
        url: `/api/impresoras/diagnostico/${idImpresora}`,
        method: 'POST',
      }),
    }),

    testPrintImpresora: build.mutation<TestPrintResponse, number>({
      query: (idImpresora) => ({
        url: `/api/impresoras/test-print/${idImpresora}`,
        method: 'POST',
      }),
    }),
  }),
});

export const {
  useGetImpresorasAllQuery,
  useGetImpresorasBySucursalQuery,
  useGetImpresoraByIdQuery,
  useInsertImpresoraMutation,
  useUpdateImpresoraMutation,
  useDeleteImpresoraMutation,
  useDiagnosticarImpresoraMutation,
  useTestPrintImpresoraMutation,
} = impresorasApi;
