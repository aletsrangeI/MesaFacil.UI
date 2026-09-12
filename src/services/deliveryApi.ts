import { emptySplitApi as api } from './baseApi';

export interface DeliveryItemDetalle {
  idDetalle: number;
  productoNombre: string;
  varianteNombre?: string;
  cantidad: number;
  precioUnitario: number;
  notas?: string;
  modificadores: string[];
}

export interface DeliveryQueueItem {
  idPedido: number;
  folio: string;
  tipoPedido: string;
  isComedor: boolean;
  canalOrigen: string; // "POS", "Uber Eats", "Rappi", "Didi Food", "Delivery Propio"
  idExterno?: string;
  clienteNombre?: string;
  clienteTelefono?: string;
  direccionEntrega?: string;
  nombreRepartidor?: string;
  telefonoRepartidor?: string;
  idEstadoPedido: number;
  estadoNombre: string;
  total: number;
  estaPagado: boolean;
  abiertoEn: string;
  listoEn?: string;
  despachadoEn?: string;
  entregadoEn?: string;
  minutosEnEstado: number;
  items: DeliveryItemDetalle[];
}

export interface DespacharPedidoRequest {
  id: number;
  nombreRepartidor?: string;
  telefonoRepartidor?: string;
  idExterno?: string;
}

export interface RebotarPedidoRequest {
  id: number;
  motivo: string;
}

export interface DeliveryEventoAuditoria {
  id: number;
  tipoEvento: string;
  createdAt: string;
  createdBy?: string;
  payload?: string;
  descripcion: string;
}

export interface DeliveryHistorialItem {
  idPedido: number;
  folio: string;
  tipoPedido: string;
  canalOrigen: string;
  idExterno?: string;
  clienteNombre?: string;
  clienteTelefono?: string;
  direccionEntrega?: string;
  nombreRepartidor?: string;
  telefonoRepartidor?: string;
  idEstadoPedido: number;
  estadoNombre: string;
  total: number;
  estaPagado: boolean;
  abiertoEn: string;
  listoEn?: string;
  despachadoEn?: string;
  entregadoEn?: string;
  cerradoEn?: string;
  minutosTotales?: number;
  motivoCancelacion?: string;
  items: DeliveryItemDetalle[];
  eventos: DeliveryEventoAuditoria[];
}

export interface CanalVentaResumen {
  canal: string;
  cantidadPedidos: number;
  totalVentas: number;
  porcentaje: number;
}

export interface ResumenHistorialDelivery {
  fechaInicio: string;
  fechaFin: string;
  totalPedidos: number;
  totalVentas: number;
  totalEntregados: number;
  totalRebotados: number;
  totalEnCamino: number;
  tasaExitoPorcentaje: number;
  tiempoPromedioEntregaMinutos: number;
  ventasPorCanal: CanalVentaResumen[];
  pedidos: DeliveryHistorialItem[];
}

export const deliveryApi = api.injectEndpoints({
  endpoints: (build) => ({
    getDeliveryQueue: build.query<
      { isSuccess: boolean; data: DeliveryQueueItem[]; message?: string },
      { idSucursal?: number } | void
    >({
      query: (params) => ({
        url: '/api/Pedidos/DeliveryQueue',
        params: params || {},
      }),
      providesTags: ['Pedido', 'Delivery', 'Kds'],
    }),

    getDeliveryHistorial: build.query<
      { isSuccess: boolean; data: ResumenHistorialDelivery; message?: string },
      {
        fechaInicio?: string;
        fechaFin?: string;
        idSucursal?: number;
        canal?: string;
        idEstado?: number;
      }
    >({
      query: (params) => ({
        url: '/api/Pedidos/DeliveryHistorial',
        params,
      }),
      providesTags: ['Pedido', 'Delivery'],
    }),

    marcarListoPedido: build.mutation<
      { isSuccess: boolean; message?: string; data?: boolean },
      number
    >({
      query: (id) => ({
        url: `/api/Pedidos/${id}/MarcarListo`,
        method: 'PUT',
      }),
      invalidatesTags: ['Pedido', 'Delivery', 'Kds'],
    }),

    despacharPedido: build.mutation<
      { isSuccess: boolean; message?: string; data?: boolean },
      DespacharPedidoRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/api/Pedidos/${id}/Despachar`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Pedido', 'Delivery', 'Kds'],
    }),

    entregarPedido: build.mutation<
      { isSuccess: boolean; message?: string; data?: boolean },
      number | { id: number; idMetodoDePago?: number }
    >({
      query: (arg) => {
        const id = typeof arg === 'number' ? arg : arg.id;
        const body = typeof arg === 'number' ? {} : { idMetodoDePago: arg.idMetodoDePago };
        return {
          url: `/api/Pedidos/${id}/Entregar`,
          method: 'PUT',
          body,
        };
      },
      invalidatesTags: ['Pedido', 'Delivery', 'Kds', 'Mesa', 'CorteCaja'],
    }),

    rebotarPedido: build.mutation<
      { isSuccess: boolean; message?: string; data?: boolean },
      RebotarPedidoRequest
    >({
      query: ({ id, ...body }) => ({
        url: `/api/Pedidos/${id}/Rebotar`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Pedido', 'Delivery', 'Kds', 'Mesa'],
    }),
  }),
});

export const {
  useGetDeliveryQueueQuery,
  useGetDeliveryHistorialQuery,
  useMarcarListoPedidoMutation,
  useDespacharPedidoMutation,
  useEntregarPedidoMutation,
  useRebotarPedidoMutation,
} = deliveryApi;


