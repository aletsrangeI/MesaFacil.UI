// src/services/dashboardApi.ts
import { emptySplitApi as api } from './baseApi';

export const dashboardApi = api.injectEndpoints({
  endpoints: (build) => ({
    getKdsBoardDashboard: build.query<any, number | void>({
      query: (idEstacion) => ({
        url: '/api/TicketsCocina/GetKdsBoard',
        params: idEstacion ? { idEstacion } : undefined
      }),
      providesTags: ['TicketCocina', 'TicketDetalle']
    })
  })
});

export const { useGetKdsBoardDashboardQuery } = dashboardApi;
