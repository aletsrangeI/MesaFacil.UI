// Endpoints reutilizados del mismo backend que ya consume el POS (src/pages/operacion/pos/index.tsx).
// Se inyectan bajo nombres propios (en vez de importar los del módulo POS) para no acoplar
// el bundle del comandero móvil al POS ni duplicar claves de endpoint en el mismo slice de RTK Query.
import { emptySplitApi as api } from '../../../services/baseApi';

const comanderoApi = api.injectEndpoints({
  endpoints: (build) => ({
    comanderoGetPedidoActivoByMesa: build.query<any, number>({
      query: (idMesa) => `/api/Pedidos/GetPedidoActivoByMesa/${idMesa}`,
      providesTags: ['Pedido'],
    }),
    comanderoAgregarDetalles: build.mutation<any, { idPedido: string; detalles: any[] }>({
      query: ({ idPedido, detalles }) => ({
        url: `/api/Pedidos/AgregarDetalles/${idPedido}`,
        method: 'POST',
        body: detalles,
      }),
      invalidatesTags: ['Pedido', 'Mesa'],
    }),
    comanderoSolicitarCuenta: build.mutation<any, number>({
      query: (idMesa) => ({
        url: `/api/Mesas/${idMesa}/solicitar-cuenta`,
        method: 'PUT',
      }),
      invalidatesTags: ['Mesa'],
    }),
  }),
});

export const {
  useComanderoGetPedidoActivoByMesaQuery,
  useComanderoAgregarDetallesMutation,
  useComanderoSolicitarCuentaMutation,
} = comanderoApi;

