// src/services/baseApi.ts
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "../app/store";
import { logout, setTokens } from "../state/authSlice";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "",
  prepareHeaders: (headers) => {
    const raw = localStorage.getItem("mf_auth");
    if (raw) {
      const { accessToken } = JSON.parse(raw);
      if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
  credentials: "include", // si NO usas cookies, puedes quitarlo
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  // 1) llamada normal
  let result = await rawBaseQuery(args, api, extraOptions);

  // 2) si 401, intenta refrescar y reintenta
  if (result.error?.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth?.refreshToken;

    if (!refreshToken) {
      api.dispatch(logout());
      return result;
    }

    const refresh = await rawBaseQuery(
      { url: "/auth/refresh", method: "POST", body: refreshToken },
      api,
      extraOptions
    );

    if (refresh.data) {
      const d = refresh.data as any;
      api.dispatch(
        setTokens({
          accessToken: d.accessToken,
          refreshToken: d.refreshToken,
          expiresAt: d.expiresAt,
        })
      );
      result = await rawBaseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const emptySplitApi = createApi({
  reducerPath: "mesafacilApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
  tagTypes: [
    // opcional: agrega aquí tus tags si tu spec los usa
    "Auth",
    "Area",
    "Catalogo",
    "CategoriaMenu",
    "Cliente",
    "Cuenta",
    "DescuentoAplicado",
    "DetalleCuenta",
    "Empresa",
    "EstacionCocina",
    "EventoPedido",
    "FormField",
    "GrupoModificador",
    "Menu",
    "Mesa",
    "MovimientoCaja",
    "OpcionModificador",
    "Pago",
    "Pedido",
    "PedidoAsiento",
    "PedidoDetalle",
    "PedidoModificador",
    "Precio",
    "Producto",
    "Rol",
    "Sucursal",
    "TicketCocina",
    "TicketDetalle",
    "Turno",
    "Usuario",
    "UsuarioRol",
    "VarianteProducto",
    "Delivery",
    "Kds",
    "CorteCaja",
    "Insumo",
    "Almacen",
    "InventarioExistencia",
    "KardexMovimiento",
    "TraspasoAlmacen",
    "Proveedor",
    "CompraFactura",
    "MapeoInsumo",
    "CuentaPorPagar",
    "PagoCxP",
    "ReporteAntiguedad",
  ],
});
