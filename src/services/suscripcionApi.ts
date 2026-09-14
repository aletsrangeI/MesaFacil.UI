// src/services/suscripcionApi.ts
import { emptySplitApi } from "./baseApi";

export interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message?: string;
}

/** Catálogo de planes de suscripción (público, sin autenticación) */
export interface CatPlanSuscripcion {
  id: number;
  codigo: string;
  nombre: string;
  precioMensualMxn: number;
  precioAnualMxn: number;
  maxSucursales: number;
  maxKdsBase: number;
  permiteMesas: boolean;
  permiteSplitBill: boolean;
  permiteRecetas: boolean;
  permiteCfdiXml: boolean;
  permiteCxP: boolean;
}

/** Suscripción vigente de la empresa autenticada */
export interface EmpresaSuscripcion {
  id: number;
  idEmpresa: number;
  idPlan: number;
  planCodigo: string;
  planNombre: string;
  esPagoAnual: boolean;
  fechaInicio: string;
  fechaFinVigencia: string;
  estadoSuscripcion: string;
  kdsAddonsContratados: number;
  comanderosAddons: number;
  enPeriodoGracia: boolean;
  maxKdsPermitidos: number;
}

export interface AsignarPlanSuscripcionRequest {
  idPlan: number;
  esPagoAnual: boolean;
  kdsAddonsContratados?: number;
  comanderosAddons?: number;
}

export const suscripcionApi = emptySplitApi.injectEndpoints({
  endpoints: (build) => ({
    getPlanesSuscripcion: build.query<CatPlanSuscripcion[], void>({
      query: () => "/api/planes-suscripcion",
      transformResponse: (response: ApiResponse<CatPlanSuscripcion[]>) =>
        response.data ?? [],
      providesTags: [{ type: "PlanSuscripcion", id: "LIST" }],
    }),

    getMiSuscripcion: build.query<EmpresaSuscripcion | null, void>({
      query: () => "/api/empresa-suscripcion/mi-suscripcion",
      transformResponse: (response: ApiResponse<EmpresaSuscripcion>) =>
        response.data ?? null,
      providesTags: [{ type: "EmpresaSuscripcion", id: "ACTUAL" }],
    }),

    updateSuscripcionEmpresa: build.mutation<
      EmpresaSuscripcion,
      { empresaId: number; body: AsignarPlanSuscripcionRequest }
    >({
      query: ({ empresaId, body }) => ({
        url: `/api/empresa-suscripcion/${empresaId}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: ApiResponse<EmpresaSuscripcion>) =>
        response.data,
      invalidatesTags: [{ type: "EmpresaSuscripcion", id: "ACTUAL" }],
    }),
  }),
});

export const {
  useGetPlanesSuscripcionQuery,
  useGetMiSuscripcionQuery,
  useUpdateSuscripcionEmpresaMutation,
} = suscripcionApi;
