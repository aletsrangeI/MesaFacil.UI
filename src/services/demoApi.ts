// src/services/demoApi.ts
import { emptySplitApi as api } from './baseApi';

export const demoApi = api.injectEndpoints({
  endpoints: (build) => ({
    seedRestauranteCompleto: build.mutation<any, { resetOrders?: boolean } | void>({
      query: (arg) => ({
        url: `/api/Demo/SeedRestauranteCompleto?resetOrders=${arg?.resetOrders ?? true}`,
        method: 'POST'
      }),
      invalidatesTags: [
        'Mesa',
        'Pedido',
        'Turno',
        'TicketCocina',
        'TicketDetalle',
        'Cuenta',
        'Pago',
        'CorteCaja',
        'MovimientoCaja',
        'Area',
        'CategoriaMenu',
        'Producto',
        'Precio',
        'VarianteProducto'
      ]
    })
  })
});

export const { useSeedRestauranteCompletoMutation } = demoApi;
