import { emptySplitApi } from "./baseApi";

export interface UnirMesasDTO {
  idMesaPrincipal: number;
  idsMesasSecundarias: number[];
}

export const mesasApi = emptySplitApi.injectEndpoints({
  endpoints: (build) => ({
    unirMesas: build.mutation<{ isSuccess: boolean; message: string; data?: boolean }, UnirMesasDTO>({
      query: (body) => ({
        url: "/api/Mesas/Unir",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Mesas", "Mesa"],
    }),
    desunirMesa: build.mutation<{ isSuccess: boolean; message: string; data?: boolean }, number>({
      query: (idMesa) => ({
        url: `/api/Mesas/Desunir/${idMesa}`,
        method: "POST",
      }),
      invalidatesTags: ["Mesas", "Mesa"],
    }),
    desunirGrupo: build.mutation<{ isSuccess: boolean; message: string; data?: boolean }, number>({
      query: (idMesaPrincipal) => ({
        url: `/api/Mesas/DesunirGrupo/${idMesaPrincipal}`,
        method: "POST",
      }),
      invalidatesTags: ["Mesas", "Mesa"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useUnirMesasMutation,
  useDesunirMesaMutation,
  useDesunirGrupoMutation,
} = mesasApi;
