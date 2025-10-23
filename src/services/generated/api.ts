import { emptySplitApi as api } from "../baseApi";
export const addTagTypes = [
  "Catalogo",
  "Area",
  "CategoriaMenu",
  "Cliente",
  "Auth",
  "Cuenta",
  "DescuentoAplicado",
  "DetalleCuenta",
  "Empresa",
  "EstacionCocina",
  "EventoPedido",
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
  "FormField",
  "AccesoRuta",
  "RolAccesoRuta",
] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      catalogoInsert: build.mutation<
        CatalogoInsertApiResponse,
        CatalogoInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogo/insert`,
          method: "POST",
          body: queryArg.catalogDto,
        }),
        invalidatesTags: ["Catalogo"],
      }),
      catalogoInsertAsync: build.mutation<
        CatalogoInsertAsyncApiResponse,
        CatalogoInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogo/insert-async`,
          method: "POST",
          body: queryArg.catalogDto,
        }),
        invalidatesTags: ["Catalogo"],
      }),
      catalogoUpdate: build.mutation<
        CatalogoUpdateApiResponse,
        CatalogoUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogo/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.catalogDto,
        }),
        invalidatesTags: ["Catalogo"],
      }),
      catalogoUpdateAsync: build.mutation<
        CatalogoUpdateAsyncApiResponse,
        CatalogoUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogo/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.catalogDto,
        }),
        invalidatesTags: ["Catalogo"],
      }),
      catalogoDelete: build.mutation<
        CatalogoDeleteApiResponse,
        CatalogoDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogo/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Catalogo"],
      }),
      catalogoDeleteAsync: build.mutation<
        CatalogoDeleteAsyncApiResponse,
        CatalogoDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogo/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Catalogo"],
      }),
      catalogoGetAll: build.query<
        CatalogoGetAllApiResponse,
        CatalogoGetAllApiArg
      >({
        query: () => ({ url: `/api/catalogo/getall` }),
        providesTags: ["Catalogo"],
      }),
      catalogoGetAllAsync: build.query<
        CatalogoGetAllAsyncApiResponse,
        CatalogoGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/catalogo/getall-async` }),
        providesTags: ["Catalogo"],
      }),
      catalogoGetById: build.query<
        CatalogoGetByIdApiResponse,
        CatalogoGetByIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/catalogo/getbyid/${queryArg.id}` }),
        providesTags: ["Catalogo"],
      }),
      catalogoGetByIdAsync: build.query<
        CatalogoGetByIdAsyncApiResponse,
        CatalogoGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogo/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["Catalogo"],
      }),
      catalogoGetPaged: build.query<
        CatalogoGetPagedApiResponse,
        CatalogoGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogo/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Catalogo"],
      }),
      catalogoGetPagedAsync: build.query<
        CatalogoGetPagedAsyncApiResponse,
        CatalogoGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogo/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Catalogo"],
      }),
      catalogoCount: build.query<CatalogoCountApiResponse, CatalogoCountApiArg>(
        {
          query: () => ({ url: `/api/catalogo/count` }),
          providesTags: ["Catalogo"],
        },
      ),
      catalogoCountAsync: build.query<
        CatalogoCountAsyncApiResponse,
        CatalogoCountAsyncApiArg
      >({
        query: () => ({ url: `/api/catalogo/count-async` }),
        providesTags: ["Catalogo"],
      }),
      areaInsert: build.mutation<AreaInsertApiResponse, AreaInsertApiArg>({
        query: (queryArg) => ({
          url: `/api/area/insert`,
          method: "POST",
          body: queryArg.areaDto,
        }),
        invalidatesTags: ["Area"],
      }),
      areaInsertAsync: build.mutation<
        AreaInsertAsyncApiResponse,
        AreaInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/area/insert-async`,
          method: "POST",
          body: queryArg.areaDto,
        }),
        invalidatesTags: ["Area"],
      }),
      areaUpdate: build.mutation<AreaUpdateApiResponse, AreaUpdateApiArg>({
        query: (queryArg) => ({
          url: `/api/area/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.areaDto,
        }),
        invalidatesTags: ["Area"],
      }),
      areaUpdateAsync: build.mutation<
        AreaUpdateAsyncApiResponse,
        AreaUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/area/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.areaDto,
        }),
        invalidatesTags: ["Area"],
      }),
      areaDelete: build.mutation<AreaDeleteApiResponse, AreaDeleteApiArg>({
        query: (queryArg) => ({
          url: `/api/area/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Area"],
      }),
      areaDeleteAsync: build.mutation<
        AreaDeleteAsyncApiResponse,
        AreaDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/area/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Area"],
      }),
      areaGetAll: build.query<AreaGetAllApiResponse, AreaGetAllApiArg>({
        query: () => ({ url: `/api/area/getall` }),
        providesTags: ["Area"],
      }),
      areaGetAllAsync: build.query<
        AreaGetAllAsyncApiResponse,
        AreaGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/area/getall-async` }),
        providesTags: ["Area"],
      }),
      areaGetById: build.query<AreaGetByIdApiResponse, AreaGetByIdApiArg>({
        query: (queryArg) => ({ url: `/api/area/getbyid/${queryArg.id}` }),
        providesTags: ["Area"],
      }),
      areaGetByIdAsync: build.query<
        AreaGetByIdAsyncApiResponse,
        AreaGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/area/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["Area"],
      }),
      areaGetPaged: build.query<AreaGetPagedApiResponse, AreaGetPagedApiArg>({
        query: (queryArg) => ({
          url: `/api/area/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Area"],
      }),
      areaGetPagedAsync: build.query<
        AreaGetPagedAsyncApiResponse,
        AreaGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/area/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Area"],
      }),
      areaCount: build.query<AreaCountApiResponse, AreaCountApiArg>({
        query: () => ({ url: `/api/area/count` }),
        providesTags: ["Area"],
      }),
      areaCountAsync: build.query<
        AreaCountAsyncApiResponse,
        AreaCountAsyncApiArg
      >({
        query: () => ({ url: `/api/area/count-async` }),
        providesTags: ["Area"],
      }),
      categoriaMenuInsert: build.mutation<
        CategoriaMenuInsertApiResponse,
        CategoriaMenuInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categoriamenu/insert`,
          method: "POST",
          body: queryArg.categoriaMenuDto,
        }),
        invalidatesTags: ["CategoriaMenu"],
      }),
      categoriaMenuInsertAsync: build.mutation<
        CategoriaMenuInsertAsyncApiResponse,
        CategoriaMenuInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categoriamenu/insert-async`,
          method: "POST",
          body: queryArg.categoriaMenuDto,
        }),
        invalidatesTags: ["CategoriaMenu"],
      }),
      categoriaMenuUpdate: build.mutation<
        CategoriaMenuUpdateApiResponse,
        CategoriaMenuUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categoriamenu/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.categoriaMenuDto,
        }),
        invalidatesTags: ["CategoriaMenu"],
      }),
      categoriaMenuUpdateAsync: build.mutation<
        CategoriaMenuUpdateAsyncApiResponse,
        CategoriaMenuUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categoriamenu/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.categoriaMenuDto,
        }),
        invalidatesTags: ["CategoriaMenu"],
      }),
      categoriaMenuDelete: build.mutation<
        CategoriaMenuDeleteApiResponse,
        CategoriaMenuDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categoriamenu/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["CategoriaMenu"],
      }),
      categoriaMenuDeleteAsync: build.mutation<
        CategoriaMenuDeleteAsyncApiResponse,
        CategoriaMenuDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categoriamenu/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["CategoriaMenu"],
      }),
      categoriaMenuGetAll: build.query<
        CategoriaMenuGetAllApiResponse,
        CategoriaMenuGetAllApiArg
      >({
        query: () => ({ url: `/api/categoriamenu/getall` }),
        providesTags: ["CategoriaMenu"],
      }),
      categoriaMenuGetAllAsync: build.query<
        CategoriaMenuGetAllAsyncApiResponse,
        CategoriaMenuGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/categoriamenu/getall-async` }),
        providesTags: ["CategoriaMenu"],
      }),
      categoriaMenuGetById: build.query<
        CategoriaMenuGetByIdApiResponse,
        CategoriaMenuGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categoriamenu/getbyid/${queryArg.id}`,
        }),
        providesTags: ["CategoriaMenu"],
      }),
      categoriaMenuGetByIdAsync: build.query<
        CategoriaMenuGetByIdAsyncApiResponse,
        CategoriaMenuGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categoriamenu/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["CategoriaMenu"],
      }),
      categoriaMenuGetPaged: build.query<
        CategoriaMenuGetPagedApiResponse,
        CategoriaMenuGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categoriamenu/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["CategoriaMenu"],
      }),
      categoriaMenuGetPagedAsync: build.query<
        CategoriaMenuGetPagedAsyncApiResponse,
        CategoriaMenuGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categoriamenu/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["CategoriaMenu"],
      }),
      categoriaMenuCount: build.query<
        CategoriaMenuCountApiResponse,
        CategoriaMenuCountApiArg
      >({
        query: () => ({ url: `/api/categoriamenu/count` }),
        providesTags: ["CategoriaMenu"],
      }),
      categoriaMenuCountAsync: build.query<
        CategoriaMenuCountAsyncApiResponse,
        CategoriaMenuCountAsyncApiArg
      >({
        query: () => ({ url: `/api/categoriamenu/count-async` }),
        providesTags: ["CategoriaMenu"],
      }),
      clienteInsert: build.mutation<
        ClienteInsertApiResponse,
        ClienteInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/cliente/insert`,
          method: "POST",
          body: queryArg.clienteDto,
        }),
        invalidatesTags: ["Cliente"],
      }),
      clienteInsertAsync: build.mutation<
        ClienteInsertAsyncApiResponse,
        ClienteInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/cliente/insert-async`,
          method: "POST",
          body: queryArg.clienteDto,
        }),
        invalidatesTags: ["Cliente"],
      }),
      clienteUpdate: build.mutation<
        ClienteUpdateApiResponse,
        ClienteUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/cliente/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.clienteDto,
        }),
        invalidatesTags: ["Cliente"],
      }),
      clienteUpdateAsync: build.mutation<
        ClienteUpdateAsyncApiResponse,
        ClienteUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/cliente/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.clienteDto,
        }),
        invalidatesTags: ["Cliente"],
      }),
      clienteDelete: build.mutation<
        ClienteDeleteApiResponse,
        ClienteDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/cliente/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Cliente"],
      }),
      clienteDeleteAsync: build.mutation<
        ClienteDeleteAsyncApiResponse,
        ClienteDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/cliente/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Cliente"],
      }),
      clienteGetAll: build.query<ClienteGetAllApiResponse, ClienteGetAllApiArg>(
        {
          query: () => ({ url: `/api/cliente/getall` }),
          providesTags: ["Cliente"],
        },
      ),
      clienteGetAllAsync: build.query<
        ClienteGetAllAsyncApiResponse,
        ClienteGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/cliente/getall-async` }),
        providesTags: ["Cliente"],
      }),
      clienteGetById: build.query<
        ClienteGetByIdApiResponse,
        ClienteGetByIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/cliente/getbyid/${queryArg.id}` }),
        providesTags: ["Cliente"],
      }),
      clienteGetByIdAsync: build.query<
        ClienteGetByIdAsyncApiResponse,
        ClienteGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/cliente/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["Cliente"],
      }),
      clienteGetPaged: build.query<
        ClienteGetPagedApiResponse,
        ClienteGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/cliente/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Cliente"],
      }),
      clienteGetPagedAsync: build.query<
        ClienteGetPagedAsyncApiResponse,
        ClienteGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/cliente/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Cliente"],
      }),
      clienteCount: build.query<ClienteCountApiResponse, ClienteCountApiArg>({
        query: () => ({ url: `/api/cliente/count` }),
        providesTags: ["Cliente"],
      }),
      clienteCountAsync: build.query<
        ClienteCountAsyncApiResponse,
        ClienteCountAsyncApiArg
      >({
        query: () => ({ url: `/api/cliente/count-async` }),
        providesTags: ["Cliente"],
      }),
      authLogin: build.mutation<AuthLoginApiResponse, AuthLoginApiArg>({
        query: (queryArg) => ({
          url: `/api/auth/login`,
          method: "POST",
          body: queryArg.loginRequest,
        }),
        invalidatesTags: ["Auth"],
      }),
      authMe: build.query<AuthMeApiResponse, AuthMeApiArg>({
        query: () => ({ url: `/api/auth/me` }),
        providesTags: ["Auth"],
      }),
      cuentaInsert: build.mutation<CuentaInsertApiResponse, CuentaInsertApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/cuenta/insert`,
            method: "POST",
            body: queryArg.cuentaDto,
          }),
          invalidatesTags: ["Cuenta"],
        },
      ),
      cuentaInsertAsync: build.mutation<
        CuentaInsertAsyncApiResponse,
        CuentaInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/cuenta/insert-async`,
          method: "POST",
          body: queryArg.cuentaDto,
        }),
        invalidatesTags: ["Cuenta"],
      }),
      cuentaUpdate: build.mutation<CuentaUpdateApiResponse, CuentaUpdateApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/cuenta/update/${queryArg.id}`,
            method: "PUT",
            body: queryArg.cuentaDto,
          }),
          invalidatesTags: ["Cuenta"],
        },
      ),
      cuentaUpdateAsync: build.mutation<
        CuentaUpdateAsyncApiResponse,
        CuentaUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/cuenta/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.cuentaDto,
        }),
        invalidatesTags: ["Cuenta"],
      }),
      cuentaDelete: build.mutation<CuentaDeleteApiResponse, CuentaDeleteApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/cuenta/delete/${queryArg.id}`,
            method: "DELETE",
          }),
          invalidatesTags: ["Cuenta"],
        },
      ),
      cuentaDeleteAsync: build.mutation<
        CuentaDeleteAsyncApiResponse,
        CuentaDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/cuenta/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Cuenta"],
      }),
      cuentaGetAll: build.query<CuentaGetAllApiResponse, CuentaGetAllApiArg>({
        query: () => ({ url: `/api/cuenta/getall` }),
        providesTags: ["Cuenta"],
      }),
      cuentaGetAllAsync: build.query<
        CuentaGetAllAsyncApiResponse,
        CuentaGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/cuenta/getall-async` }),
        providesTags: ["Cuenta"],
      }),
      cuentaGetById: build.query<CuentaGetByIdApiResponse, CuentaGetByIdApiArg>(
        {
          query: (queryArg) => ({ url: `/api/cuenta/getbyid/${queryArg.id}` }),
          providesTags: ["Cuenta"],
        },
      ),
      cuentaGetByIdAsync: build.query<
        CuentaGetByIdAsyncApiResponse,
        CuentaGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/cuenta/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["Cuenta"],
      }),
      descuentoAplicadoInsert: build.mutation<
        DescuentoAplicadoInsertApiResponse,
        DescuentoAplicadoInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/descuentoaplicado/insert`,
          method: "POST",
          body: queryArg.descuentoAplicadoDto,
        }),
        invalidatesTags: ["DescuentoAplicado"],
      }),
      descuentoAplicadoInsertAsync: build.mutation<
        DescuentoAplicadoInsertAsyncApiResponse,
        DescuentoAplicadoInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/descuentoaplicado/insert-async`,
          method: "POST",
          body: queryArg.descuentoAplicadoDto,
        }),
        invalidatesTags: ["DescuentoAplicado"],
      }),
      descuentoAplicadoUpdate: build.mutation<
        DescuentoAplicadoUpdateApiResponse,
        DescuentoAplicadoUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/descuentoaplicado/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.descuentoAplicadoDto,
        }),
        invalidatesTags: ["DescuentoAplicado"],
      }),
      descuentoAplicadoUpdateAsync: build.mutation<
        DescuentoAplicadoUpdateAsyncApiResponse,
        DescuentoAplicadoUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/descuentoaplicado/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.descuentoAplicadoDto,
        }),
        invalidatesTags: ["DescuentoAplicado"],
      }),
      descuentoAplicadoDelete: build.mutation<
        DescuentoAplicadoDeleteApiResponse,
        DescuentoAplicadoDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/descuentoaplicado/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["DescuentoAplicado"],
      }),
      descuentoAplicadoDeleteAsync: build.mutation<
        DescuentoAplicadoDeleteAsyncApiResponse,
        DescuentoAplicadoDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/descuentoaplicado/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["DescuentoAplicado"],
      }),
      descuentoAplicadoGetAll: build.query<
        DescuentoAplicadoGetAllApiResponse,
        DescuentoAplicadoGetAllApiArg
      >({
        query: () => ({ url: `/api/descuentoaplicado/getall` }),
        providesTags: ["DescuentoAplicado"],
      }),
      descuentoAplicadoGetAllAsync: build.query<
        DescuentoAplicadoGetAllAsyncApiResponse,
        DescuentoAplicadoGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/descuentoaplicado/getall-async` }),
        providesTags: ["DescuentoAplicado"],
      }),
      descuentoAplicadoGetById: build.query<
        DescuentoAplicadoGetByIdApiResponse,
        DescuentoAplicadoGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/descuentoaplicado/getbyid/${queryArg.id}`,
        }),
        providesTags: ["DescuentoAplicado"],
      }),
      descuentoAplicadoGetByIdAsync: build.query<
        DescuentoAplicadoGetByIdAsyncApiResponse,
        DescuentoAplicadoGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/descuentoaplicado/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["DescuentoAplicado"],
      }),
      descuentoAplicadoGetPaged: build.query<
        DescuentoAplicadoGetPagedApiResponse,
        DescuentoAplicadoGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/descuentoaplicado/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["DescuentoAplicado"],
      }),
      descuentoAplicadoGetPagedAsync: build.query<
        DescuentoAplicadoGetPagedAsyncApiResponse,
        DescuentoAplicadoGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/descuentoaplicado/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["DescuentoAplicado"],
      }),
      descuentoAplicadoCount: build.query<
        DescuentoAplicadoCountApiResponse,
        DescuentoAplicadoCountApiArg
      >({
        query: () => ({ url: `/api/descuentoaplicado/count` }),
        providesTags: ["DescuentoAplicado"],
      }),
      descuentoAplicadoCountAsync: build.query<
        DescuentoAplicadoCountAsyncApiResponse,
        DescuentoAplicadoCountAsyncApiArg
      >({
        query: () => ({ url: `/api/descuentoaplicado/count-async` }),
        providesTags: ["DescuentoAplicado"],
      }),
      detalleCuentaInsert: build.mutation<
        DetalleCuentaInsertApiResponse,
        DetalleCuentaInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/detallecuenta/insert`,
          method: "POST",
          body: queryArg.detalleCuentaDto,
        }),
        invalidatesTags: ["DetalleCuenta"],
      }),
      detalleCuentaInsertAsync: build.mutation<
        DetalleCuentaInsertAsyncApiResponse,
        DetalleCuentaInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/detallecuenta/insert-async`,
          method: "POST",
          body: queryArg.detalleCuentaDto,
        }),
        invalidatesTags: ["DetalleCuenta"],
      }),
      detalleCuentaUpdate: build.mutation<
        DetalleCuentaUpdateApiResponse,
        DetalleCuentaUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/detallecuenta/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.detalleCuentaDto,
        }),
        invalidatesTags: ["DetalleCuenta"],
      }),
      detalleCuentaUpdateAsync: build.mutation<
        DetalleCuentaUpdateAsyncApiResponse,
        DetalleCuentaUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/detallecuenta/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.detalleCuentaDto,
        }),
        invalidatesTags: ["DetalleCuenta"],
      }),
      detalleCuentaDelete: build.mutation<
        DetalleCuentaDeleteApiResponse,
        DetalleCuentaDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/detallecuenta/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["DetalleCuenta"],
      }),
      detalleCuentaDeleteAsync: build.mutation<
        DetalleCuentaDeleteAsyncApiResponse,
        DetalleCuentaDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/detallecuenta/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["DetalleCuenta"],
      }),
      detalleCuentaGetAll: build.query<
        DetalleCuentaGetAllApiResponse,
        DetalleCuentaGetAllApiArg
      >({
        query: () => ({ url: `/api/detallecuenta/getall` }),
        providesTags: ["DetalleCuenta"],
      }),
      detalleCuentaGetAllAsync: build.query<
        DetalleCuentaGetAllAsyncApiResponse,
        DetalleCuentaGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/detallecuenta/getall-async` }),
        providesTags: ["DetalleCuenta"],
      }),
      detalleCuentaGetById: build.query<
        DetalleCuentaGetByIdApiResponse,
        DetalleCuentaGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/detallecuenta/getbyid/${queryArg.id}`,
        }),
        providesTags: ["DetalleCuenta"],
      }),
      detalleCuentaGetByIdAsync: build.query<
        DetalleCuentaGetByIdAsyncApiResponse,
        DetalleCuentaGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/detallecuenta/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["DetalleCuenta"],
      }),
      detalleCuentaGetPaged: build.query<
        DetalleCuentaGetPagedApiResponse,
        DetalleCuentaGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/detallecuenta/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["DetalleCuenta"],
      }),
      detalleCuentaGetPagedAsync: build.query<
        DetalleCuentaGetPagedAsyncApiResponse,
        DetalleCuentaGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/detallecuenta/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["DetalleCuenta"],
      }),
      detalleCuentaCount: build.query<
        DetalleCuentaCountApiResponse,
        DetalleCuentaCountApiArg
      >({
        query: () => ({ url: `/api/detallecuenta/count` }),
        providesTags: ["DetalleCuenta"],
      }),
      detalleCuentaCountAsync: build.query<
        DetalleCuentaCountAsyncApiResponse,
        DetalleCuentaCountAsyncApiArg
      >({
        query: () => ({ url: `/api/detallecuenta/count-async` }),
        providesTags: ["DetalleCuenta"],
      }),
      empresaInsert: build.mutation<
        EmpresaInsertApiResponse,
        EmpresaInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/empresa/insert`,
          method: "POST",
          body: queryArg.empresaDto,
        }),
        invalidatesTags: ["Empresa"],
      }),
      empresaInsertAsync: build.mutation<
        EmpresaInsertAsyncApiResponse,
        EmpresaInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/empresa/insert-async`,
          method: "POST",
          body: queryArg.empresaDto,
        }),
        invalidatesTags: ["Empresa"],
      }),
      empresaUpdate: build.mutation<
        EmpresaUpdateApiResponse,
        EmpresaUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/empresa/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.empresaDto,
        }),
        invalidatesTags: ["Empresa"],
      }),
      empresaUpdateAsync: build.mutation<
        EmpresaUpdateAsyncApiResponse,
        EmpresaUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/empresa/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.empresaDto,
        }),
        invalidatesTags: ["Empresa"],
      }),
      empresaDelete: build.mutation<
        EmpresaDeleteApiResponse,
        EmpresaDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/empresa/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Empresa"],
      }),
      empresaDeleteAsync: build.mutation<
        EmpresaDeleteAsyncApiResponse,
        EmpresaDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/empresa/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Empresa"],
      }),
      empresaGetAll: build.query<EmpresaGetAllApiResponse, EmpresaGetAllApiArg>(
        {
          query: () => ({ url: `/api/empresa/getall` }),
          providesTags: ["Empresa"],
        },
      ),
      empresaGetAllAsync: build.query<
        EmpresaGetAllAsyncApiResponse,
        EmpresaGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/empresa/getall-async` }),
        providesTags: ["Empresa"],
      }),
      empresaGetById: build.query<
        EmpresaGetByIdApiResponse,
        EmpresaGetByIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/empresa/getbyid/${queryArg.id}` }),
        providesTags: ["Empresa"],
      }),
      empresaGetByIdAsync: build.query<
        EmpresaGetByIdAsyncApiResponse,
        EmpresaGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/empresa/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["Empresa"],
      }),
      empresaGetPaged: build.query<
        EmpresaGetPagedApiResponse,
        EmpresaGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/empresa/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Empresa"],
      }),
      empresaGetPagedAsync: build.query<
        EmpresaGetPagedAsyncApiResponse,
        EmpresaGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/empresa/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Empresa"],
      }),
      empresaCount: build.query<EmpresaCountApiResponse, EmpresaCountApiArg>({
        query: () => ({ url: `/api/empresa/count` }),
        providesTags: ["Empresa"],
      }),
      empresaCountAsync: build.query<
        EmpresaCountAsyncApiResponse,
        EmpresaCountAsyncApiArg
      >({
        query: () => ({ url: `/api/empresa/count-async` }),
        providesTags: ["Empresa"],
      }),
      estacionCocinaInsert: build.mutation<
        EstacionCocinaInsertApiResponse,
        EstacionCocinaInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/estacioncocina/insert`,
          method: "POST",
          body: queryArg.estacionCocinaDto,
        }),
        invalidatesTags: ["EstacionCocina"],
      }),
      estacionCocinaInsertAsync: build.mutation<
        EstacionCocinaInsertAsyncApiResponse,
        EstacionCocinaInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/estacioncocina/insert-async`,
          method: "POST",
          body: queryArg.estacionCocinaDto,
        }),
        invalidatesTags: ["EstacionCocina"],
      }),
      estacionCocinaUpdate: build.mutation<
        EstacionCocinaUpdateApiResponse,
        EstacionCocinaUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/estacioncocina/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.estacionCocinaDto,
        }),
        invalidatesTags: ["EstacionCocina"],
      }),
      estacionCocinaUpdateAsync: build.mutation<
        EstacionCocinaUpdateAsyncApiResponse,
        EstacionCocinaUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/estacioncocina/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.estacionCocinaDto,
        }),
        invalidatesTags: ["EstacionCocina"],
      }),
      estacionCocinaDelete: build.mutation<
        EstacionCocinaDeleteApiResponse,
        EstacionCocinaDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/estacioncocina/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["EstacionCocina"],
      }),
      estacionCocinaDeleteAsync: build.mutation<
        EstacionCocinaDeleteAsyncApiResponse,
        EstacionCocinaDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/estacioncocina/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["EstacionCocina"],
      }),
      estacionCocinaGetAll: build.query<
        EstacionCocinaGetAllApiResponse,
        EstacionCocinaGetAllApiArg
      >({
        query: () => ({ url: `/api/estacioncocina/getall` }),
        providesTags: ["EstacionCocina"],
      }),
      estacionCocinaGetAllAsync: build.query<
        EstacionCocinaGetAllAsyncApiResponse,
        EstacionCocinaGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/estacioncocina/getall-async` }),
        providesTags: ["EstacionCocina"],
      }),
      estacionCocinaGetById: build.query<
        EstacionCocinaGetByIdApiResponse,
        EstacionCocinaGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/estacioncocina/getbyid/${queryArg.id}`,
        }),
        providesTags: ["EstacionCocina"],
      }),
      estacionCocinaGetByIdAsync: build.query<
        EstacionCocinaGetByIdAsyncApiResponse,
        EstacionCocinaGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/estacioncocina/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["EstacionCocina"],
      }),
      estacionCocinaGetPaged: build.query<
        EstacionCocinaGetPagedApiResponse,
        EstacionCocinaGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/estacioncocina/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["EstacionCocina"],
      }),
      estacionCocinaGetPagedAsync: build.query<
        EstacionCocinaGetPagedAsyncApiResponse,
        EstacionCocinaGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/estacioncocina/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["EstacionCocina"],
      }),
      estacionCocinaCount: build.query<
        EstacionCocinaCountApiResponse,
        EstacionCocinaCountApiArg
      >({
        query: () => ({ url: `/api/estacioncocina/count` }),
        providesTags: ["EstacionCocina"],
      }),
      estacionCocinaCountAsync: build.query<
        EstacionCocinaCountAsyncApiResponse,
        EstacionCocinaCountAsyncApiArg
      >({
        query: () => ({ url: `/api/estacioncocina/count-async` }),
        providesTags: ["EstacionCocina"],
      }),
      eventoPedidoInsert: build.mutation<
        EventoPedidoInsertApiResponse,
        EventoPedidoInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/eventopedido/insert`,
          method: "POST",
          body: queryArg.eventoPedidoDto,
        }),
        invalidatesTags: ["EventoPedido"],
      }),
      eventoPedidoInsertAsync: build.mutation<
        EventoPedidoInsertAsyncApiResponse,
        EventoPedidoInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/eventopedido/insert-async`,
          method: "POST",
          body: queryArg.eventoPedidoDto,
        }),
        invalidatesTags: ["EventoPedido"],
      }),
      eventoPedidoUpdate: build.mutation<
        EventoPedidoUpdateApiResponse,
        EventoPedidoUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/eventopedido/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.eventoPedidoDto,
        }),
        invalidatesTags: ["EventoPedido"],
      }),
      eventoPedidoUpdateAsync: build.mutation<
        EventoPedidoUpdateAsyncApiResponse,
        EventoPedidoUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/eventopedido/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.eventoPedidoDto,
        }),
        invalidatesTags: ["EventoPedido"],
      }),
      eventoPedidoDelete: build.mutation<
        EventoPedidoDeleteApiResponse,
        EventoPedidoDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/eventopedido/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["EventoPedido"],
      }),
      eventoPedidoDeleteAsync: build.mutation<
        EventoPedidoDeleteAsyncApiResponse,
        EventoPedidoDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/eventopedido/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["EventoPedido"],
      }),
      eventoPedidoGetAll: build.query<
        EventoPedidoGetAllApiResponse,
        EventoPedidoGetAllApiArg
      >({
        query: () => ({ url: `/api/eventopedido/getall` }),
        providesTags: ["EventoPedido"],
      }),
      eventoPedidoGetAllAsync: build.query<
        EventoPedidoGetAllAsyncApiResponse,
        EventoPedidoGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/eventopedido/getall-async` }),
        providesTags: ["EventoPedido"],
      }),
      eventoPedidoGetById: build.query<
        EventoPedidoGetByIdApiResponse,
        EventoPedidoGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/eventopedido/getbyid/${queryArg.id}`,
        }),
        providesTags: ["EventoPedido"],
      }),
      eventoPedidoGetByIdAsync: build.query<
        EventoPedidoGetByIdAsyncApiResponse,
        EventoPedidoGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/eventopedido/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["EventoPedido"],
      }),
      eventoPedidoGetPaged: build.query<
        EventoPedidoGetPagedApiResponse,
        EventoPedidoGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/eventopedido/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["EventoPedido"],
      }),
      eventoPedidoGetPagedAsync: build.query<
        EventoPedidoGetPagedAsyncApiResponse,
        EventoPedidoGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/eventopedido/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["EventoPedido"],
      }),
      eventoPedidoCount: build.query<
        EventoPedidoCountApiResponse,
        EventoPedidoCountApiArg
      >({
        query: () => ({ url: `/api/eventopedido/count` }),
        providesTags: ["EventoPedido"],
      }),
      eventoPedidoCountAsync: build.query<
        EventoPedidoCountAsyncApiResponse,
        EventoPedidoCountAsyncApiArg
      >({
        query: () => ({ url: `/api/eventopedido/count-async` }),
        providesTags: ["EventoPedido"],
      }),
      grupoModificadorInsert: build.mutation<
        GrupoModificadorInsertApiResponse,
        GrupoModificadorInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificador/insert`,
          method: "POST",
          body: queryArg.grupoModificadorDto,
        }),
        invalidatesTags: ["GrupoModificador"],
      }),
      grupoModificadorInsertAsync: build.mutation<
        GrupoModificadorInsertAsyncApiResponse,
        GrupoModificadorInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificador/insert-async`,
          method: "POST",
          body: queryArg.grupoModificadorDto,
        }),
        invalidatesTags: ["GrupoModificador"],
      }),
      grupoModificadorUpdate: build.mutation<
        GrupoModificadorUpdateApiResponse,
        GrupoModificadorUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificador/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.grupoModificadorDto,
        }),
        invalidatesTags: ["GrupoModificador"],
      }),
      grupoModificadorUpdateAsync: build.mutation<
        GrupoModificadorUpdateAsyncApiResponse,
        GrupoModificadorUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificador/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.grupoModificadorDto,
        }),
        invalidatesTags: ["GrupoModificador"],
      }),
      grupoModificadorDelete: build.mutation<
        GrupoModificadorDeleteApiResponse,
        GrupoModificadorDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificador/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["GrupoModificador"],
      }),
      grupoModificadorDeleteAsync: build.mutation<
        GrupoModificadorDeleteAsyncApiResponse,
        GrupoModificadorDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificador/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["GrupoModificador"],
      }),
      grupoModificadorGetAll: build.query<
        GrupoModificadorGetAllApiResponse,
        GrupoModificadorGetAllApiArg
      >({
        query: () => ({ url: `/api/grupomodificador/getall` }),
        providesTags: ["GrupoModificador"],
      }),
      grupoModificadorGetAllAsync: build.query<
        GrupoModificadorGetAllAsyncApiResponse,
        GrupoModificadorGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/grupomodificador/getall-async` }),
        providesTags: ["GrupoModificador"],
      }),
      grupoModificadorGetById: build.query<
        GrupoModificadorGetByIdApiResponse,
        GrupoModificadorGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificador/getbyid/${queryArg.id}`,
        }),
        providesTags: ["GrupoModificador"],
      }),
      grupoModificadorGetByIdAsync: build.query<
        GrupoModificadorGetByIdAsyncApiResponse,
        GrupoModificadorGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificador/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["GrupoModificador"],
      }),
      grupoModificadorGetPaged: build.query<
        GrupoModificadorGetPagedApiResponse,
        GrupoModificadorGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificador/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["GrupoModificador"],
      }),
      grupoModificadorGetPagedAsync: build.query<
        GrupoModificadorGetPagedAsyncApiResponse,
        GrupoModificadorGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificador/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["GrupoModificador"],
      }),
      grupoModificadorCount: build.query<
        GrupoModificadorCountApiResponse,
        GrupoModificadorCountApiArg
      >({
        query: () => ({ url: `/api/grupomodificador/count` }),
        providesTags: ["GrupoModificador"],
      }),
      grupoModificadorCountAsync: build.query<
        GrupoModificadorCountAsyncApiResponse,
        GrupoModificadorCountAsyncApiArg
      >({
        query: () => ({ url: `/api/grupomodificador/count-async` }),
        providesTags: ["GrupoModificador"],
      }),
      menuInsert: build.mutation<MenuInsertApiResponse, MenuInsertApiArg>({
        query: (queryArg) => ({
          url: `/api/menu/insert`,
          method: "POST",
          body: queryArg.menuDto,
        }),
        invalidatesTags: ["Menu"],
      }),
      menuInsertAsync: build.mutation<
        MenuInsertAsyncApiResponse,
        MenuInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/menu/insert-async`,
          method: "POST",
          body: queryArg.menuDto,
        }),
        invalidatesTags: ["Menu"],
      }),
      menuUpdate: build.mutation<MenuUpdateApiResponse, MenuUpdateApiArg>({
        query: (queryArg) => ({
          url: `/api/menu/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.menuDto,
        }),
        invalidatesTags: ["Menu"],
      }),
      menuUpdateAsync: build.mutation<
        MenuUpdateAsyncApiResponse,
        MenuUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/menu/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.menuDto,
        }),
        invalidatesTags: ["Menu"],
      }),
      menuDelete: build.mutation<MenuDeleteApiResponse, MenuDeleteApiArg>({
        query: (queryArg) => ({
          url: `/api/menu/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Menu"],
      }),
      menuDeleteAsync: build.mutation<
        MenuDeleteAsyncApiResponse,
        MenuDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/menu/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Menu"],
      }),
      menuGetAll: build.query<MenuGetAllApiResponse, MenuGetAllApiArg>({
        query: () => ({ url: `/api/menu/getall` }),
        providesTags: ["Menu"],
      }),
      menuGetAllAsync: build.query<
        MenuGetAllAsyncApiResponse,
        MenuGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/menu/getall-async` }),
        providesTags: ["Menu"],
      }),
      menuGetById: build.query<MenuGetByIdApiResponse, MenuGetByIdApiArg>({
        query: (queryArg) => ({ url: `/api/menu/getbyid/${queryArg.id}` }),
        providesTags: ["Menu"],
      }),
      menuGetByIdAsync: build.query<
        MenuGetByIdAsyncApiResponse,
        MenuGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/menu/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["Menu"],
      }),
      menuGetPaged: build.query<MenuGetPagedApiResponse, MenuGetPagedApiArg>({
        query: (queryArg) => ({
          url: `/api/menu/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Menu"],
      }),
      menuGetPagedAsync: build.query<
        MenuGetPagedAsyncApiResponse,
        MenuGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/menu/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Menu"],
      }),
      menuCount: build.query<MenuCountApiResponse, MenuCountApiArg>({
        query: () => ({ url: `/api/menu/count` }),
        providesTags: ["Menu"],
      }),
      menuCountAsync: build.query<
        MenuCountAsyncApiResponse,
        MenuCountAsyncApiArg
      >({
        query: () => ({ url: `/api/menu/count-async` }),
        providesTags: ["Menu"],
      }),
      mesaInsert: build.mutation<MesaInsertApiResponse, MesaInsertApiArg>({
        query: (queryArg) => ({
          url: `/api/mesa/insert`,
          method: "POST",
          body: queryArg.mesaDto,
        }),
        invalidatesTags: ["Mesa"],
      }),
      mesaInsertAsync: build.mutation<
        MesaInsertAsyncApiResponse,
        MesaInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/mesa/insert-async`,
          method: "POST",
          body: queryArg.mesaDto,
        }),
        invalidatesTags: ["Mesa"],
      }),
      mesaUpdate: build.mutation<MesaUpdateApiResponse, MesaUpdateApiArg>({
        query: (queryArg) => ({
          url: `/api/mesa/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.mesaDto,
        }),
        invalidatesTags: ["Mesa"],
      }),
      mesaUpdateAsync: build.mutation<
        MesaUpdateAsyncApiResponse,
        MesaUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/mesa/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.mesaDto,
        }),
        invalidatesTags: ["Mesa"],
      }),
      mesaDelete: build.mutation<MesaDeleteApiResponse, MesaDeleteApiArg>({
        query: (queryArg) => ({
          url: `/api/mesa/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Mesa"],
      }),
      mesaDeleteAsync: build.mutation<
        MesaDeleteAsyncApiResponse,
        MesaDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/mesa/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Mesa"],
      }),
      mesaGetAll: build.query<MesaGetAllApiResponse, MesaGetAllApiArg>({
        query: () => ({ url: `/api/mesa/getall` }),
        providesTags: ["Mesa"],
      }),
      mesaGetAllAsync: build.query<
        MesaGetAllAsyncApiResponse,
        MesaGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/mesa/getall-async` }),
        providesTags: ["Mesa"],
      }),
      mesaGetById: build.query<MesaGetByIdApiResponse, MesaGetByIdApiArg>({
        query: (queryArg) => ({ url: `/api/mesa/getbyid/${queryArg.id}` }),
        providesTags: ["Mesa"],
      }),
      mesaGetByIdAsync: build.query<
        MesaGetByIdAsyncApiResponse,
        MesaGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/mesa/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["Mesa"],
      }),
      mesaGetPaged: build.query<MesaGetPagedApiResponse, MesaGetPagedApiArg>({
        query: (queryArg) => ({
          url: `/api/mesa/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Mesa"],
      }),
      mesaGetPagedAsync: build.query<
        MesaGetPagedAsyncApiResponse,
        MesaGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/mesa/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Mesa"],
      }),
      mesaCount: build.query<MesaCountApiResponse, MesaCountApiArg>({
        query: () => ({ url: `/api/mesa/count` }),
        providesTags: ["Mesa"],
      }),
      mesaCountAsync: build.query<
        MesaCountAsyncApiResponse,
        MesaCountAsyncApiArg
      >({
        query: () => ({ url: `/api/mesa/count-async` }),
        providesTags: ["Mesa"],
      }),
      movimientoCajaInsert: build.mutation<
        MovimientoCajaInsertApiResponse,
        MovimientoCajaInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/movimientocaja/insert`,
          method: "POST",
          body: queryArg.movimientoCajaDto,
        }),
        invalidatesTags: ["MovimientoCaja"],
      }),
      movimientoCajaInsertAsync: build.mutation<
        MovimientoCajaInsertAsyncApiResponse,
        MovimientoCajaInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/movimientocaja/insert-async`,
          method: "POST",
          body: queryArg.movimientoCajaDto,
        }),
        invalidatesTags: ["MovimientoCaja"],
      }),
      movimientoCajaUpdate: build.mutation<
        MovimientoCajaUpdateApiResponse,
        MovimientoCajaUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/movimientocaja/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.movimientoCajaDto,
        }),
        invalidatesTags: ["MovimientoCaja"],
      }),
      movimientoCajaUpdateAsync: build.mutation<
        MovimientoCajaUpdateAsyncApiResponse,
        MovimientoCajaUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/movimientocaja/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.movimientoCajaDto,
        }),
        invalidatesTags: ["MovimientoCaja"],
      }),
      movimientoCajaDelete: build.mutation<
        MovimientoCajaDeleteApiResponse,
        MovimientoCajaDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/movimientocaja/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["MovimientoCaja"],
      }),
      movimientoCajaDeleteAsync: build.mutation<
        MovimientoCajaDeleteAsyncApiResponse,
        MovimientoCajaDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/movimientocaja/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["MovimientoCaja"],
      }),
      movimientoCajaGetAll: build.query<
        MovimientoCajaGetAllApiResponse,
        MovimientoCajaGetAllApiArg
      >({
        query: () => ({ url: `/api/movimientocaja/getall` }),
        providesTags: ["MovimientoCaja"],
      }),
      movimientoCajaGetAllAsync: build.query<
        MovimientoCajaGetAllAsyncApiResponse,
        MovimientoCajaGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/movimientocaja/getall-async` }),
        providesTags: ["MovimientoCaja"],
      }),
      movimientoCajaGetById: build.query<
        MovimientoCajaGetByIdApiResponse,
        MovimientoCajaGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/movimientocaja/getbyid/${queryArg.id}`,
        }),
        providesTags: ["MovimientoCaja"],
      }),
      movimientoCajaGetByIdAsync: build.query<
        MovimientoCajaGetByIdAsyncApiResponse,
        MovimientoCajaGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/movimientocaja/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["MovimientoCaja"],
      }),
      movimientoCajaGetPaged: build.query<
        MovimientoCajaGetPagedApiResponse,
        MovimientoCajaGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/movimientocaja/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["MovimientoCaja"],
      }),
      movimientoCajaGetPagedAsync: build.query<
        MovimientoCajaGetPagedAsyncApiResponse,
        MovimientoCajaGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/movimientocaja/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["MovimientoCaja"],
      }),
      movimientoCajaCount: build.query<
        MovimientoCajaCountApiResponse,
        MovimientoCajaCountApiArg
      >({
        query: () => ({ url: `/api/movimientocaja/count` }),
        providesTags: ["MovimientoCaja"],
      }),
      movimientoCajaCountAsync: build.query<
        MovimientoCajaCountAsyncApiResponse,
        MovimientoCajaCountAsyncApiArg
      >({
        query: () => ({ url: `/api/movimientocaja/count-async` }),
        providesTags: ["MovimientoCaja"],
      }),
      opcionModificadorInsert: build.mutation<
        OpcionModificadorInsertApiResponse,
        OpcionModificadorInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificador/insert`,
          method: "POST",
          body: queryArg.opcionModificadorDto,
        }),
        invalidatesTags: ["OpcionModificador"],
      }),
      opcionModificadorInsertAsync: build.mutation<
        OpcionModificadorInsertAsyncApiResponse,
        OpcionModificadorInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificador/insert-async`,
          method: "POST",
          body: queryArg.opcionModificadorDto,
        }),
        invalidatesTags: ["OpcionModificador"],
      }),
      opcionModificadorUpdate: build.mutation<
        OpcionModificadorUpdateApiResponse,
        OpcionModificadorUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificador/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.opcionModificadorDto,
        }),
        invalidatesTags: ["OpcionModificador"],
      }),
      opcionModificadorUpdateAsync: build.mutation<
        OpcionModificadorUpdateAsyncApiResponse,
        OpcionModificadorUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificador/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.opcionModificadorDto,
        }),
        invalidatesTags: ["OpcionModificador"],
      }),
      opcionModificadorDelete: build.mutation<
        OpcionModificadorDeleteApiResponse,
        OpcionModificadorDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificador/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["OpcionModificador"],
      }),
      opcionModificadorDeleteAsync: build.mutation<
        OpcionModificadorDeleteAsyncApiResponse,
        OpcionModificadorDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificador/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["OpcionModificador"],
      }),
      opcionModificadorGetAll: build.query<
        OpcionModificadorGetAllApiResponse,
        OpcionModificadorGetAllApiArg
      >({
        query: () => ({ url: `/api/opcionmodificador/getall` }),
        providesTags: ["OpcionModificador"],
      }),
      opcionModificadorGetAllAsync: build.query<
        OpcionModificadorGetAllAsyncApiResponse,
        OpcionModificadorGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/opcionmodificador/getall-async` }),
        providesTags: ["OpcionModificador"],
      }),
      opcionModificadorGetById: build.query<
        OpcionModificadorGetByIdApiResponse,
        OpcionModificadorGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificador/getbyid/${queryArg.id}`,
        }),
        providesTags: ["OpcionModificador"],
      }),
      opcionModificadorGetByIdAsync: build.query<
        OpcionModificadorGetByIdAsyncApiResponse,
        OpcionModificadorGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificador/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["OpcionModificador"],
      }),
      opcionModificadorGetPaged: build.query<
        OpcionModificadorGetPagedApiResponse,
        OpcionModificadorGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificador/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["OpcionModificador"],
      }),
      opcionModificadorGetPagedAsync: build.query<
        OpcionModificadorGetPagedAsyncApiResponse,
        OpcionModificadorGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificador/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["OpcionModificador"],
      }),
      opcionModificadorCount: build.query<
        OpcionModificadorCountApiResponse,
        OpcionModificadorCountApiArg
      >({
        query: () => ({ url: `/api/opcionmodificador/count` }),
        providesTags: ["OpcionModificador"],
      }),
      opcionModificadorCountAsync: build.query<
        OpcionModificadorCountAsyncApiResponse,
        OpcionModificadorCountAsyncApiArg
      >({
        query: () => ({ url: `/api/opcionmodificador/count-async` }),
        providesTags: ["OpcionModificador"],
      }),
      pagoInsert: build.mutation<PagoInsertApiResponse, PagoInsertApiArg>({
        query: (queryArg) => ({
          url: `/api/pago/insert`,
          method: "POST",
          body: queryArg.pagoDto,
        }),
        invalidatesTags: ["Pago"],
      }),
      pagoInsertAsync: build.mutation<
        PagoInsertAsyncApiResponse,
        PagoInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pago/insert-async`,
          method: "POST",
          body: queryArg.pagoDto,
        }),
        invalidatesTags: ["Pago"],
      }),
      pagoUpdate: build.mutation<PagoUpdateApiResponse, PagoUpdateApiArg>({
        query: (queryArg) => ({
          url: `/api/pago/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.pagoDto,
        }),
        invalidatesTags: ["Pago"],
      }),
      pagoUpdateAsync: build.mutation<
        PagoUpdateAsyncApiResponse,
        PagoUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pago/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.pagoDto,
        }),
        invalidatesTags: ["Pago"],
      }),
      pagoDelete: build.mutation<PagoDeleteApiResponse, PagoDeleteApiArg>({
        query: (queryArg) => ({
          url: `/api/pago/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Pago"],
      }),
      pagoDeleteAsync: build.mutation<
        PagoDeleteAsyncApiResponse,
        PagoDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pago/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Pago"],
      }),
      pagoGetAll: build.query<PagoGetAllApiResponse, PagoGetAllApiArg>({
        query: () => ({ url: `/api/pago/getall` }),
        providesTags: ["Pago"],
      }),
      pagoGetAllAsync: build.query<
        PagoGetAllAsyncApiResponse,
        PagoGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/pago/getall-async` }),
        providesTags: ["Pago"],
      }),
      pagoGetById: build.query<PagoGetByIdApiResponse, PagoGetByIdApiArg>({
        query: (queryArg) => ({ url: `/api/pago/getbyid/${queryArg.id}` }),
        providesTags: ["Pago"],
      }),
      pagoGetByIdAsync: build.query<
        PagoGetByIdAsyncApiResponse,
        PagoGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pago/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["Pago"],
      }),
      pagoGetPaged: build.query<PagoGetPagedApiResponse, PagoGetPagedApiArg>({
        query: (queryArg) => ({
          url: `/api/pago/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Pago"],
      }),
      pagoGetPagedAsync: build.query<
        PagoGetPagedAsyncApiResponse,
        PagoGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pago/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Pago"],
      }),
      pagoCount: build.query<PagoCountApiResponse, PagoCountApiArg>({
        query: () => ({ url: `/api/pago/count` }),
        providesTags: ["Pago"],
      }),
      pagoCountAsync: build.query<
        PagoCountAsyncApiResponse,
        PagoCountAsyncApiArg
      >({
        query: () => ({ url: `/api/pago/count-async` }),
        providesTags: ["Pago"],
      }),
      pedidoInsert: build.mutation<PedidoInsertApiResponse, PedidoInsertApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/pedido/insert`,
            method: "POST",
            body: queryArg.pedidoDto,
          }),
          invalidatesTags: ["Pedido"],
        },
      ),
      pedidoInsertAsync: build.mutation<
        PedidoInsertAsyncApiResponse,
        PedidoInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedido/insert-async`,
          method: "POST",
          body: queryArg.pedidoDto,
        }),
        invalidatesTags: ["Pedido"],
      }),
      pedidoUpdate: build.mutation<PedidoUpdateApiResponse, PedidoUpdateApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/pedido/update/${queryArg.id}`,
            method: "PUT",
            body: queryArg.pedidoDto,
          }),
          invalidatesTags: ["Pedido"],
        },
      ),
      pedidoUpdateAsync: build.mutation<
        PedidoUpdateAsyncApiResponse,
        PedidoUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedido/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.pedidoDto,
        }),
        invalidatesTags: ["Pedido"],
      }),
      pedidoDelete: build.mutation<PedidoDeleteApiResponse, PedidoDeleteApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/pedido/delete/${queryArg.id}`,
            method: "DELETE",
          }),
          invalidatesTags: ["Pedido"],
        },
      ),
      pedidoDeleteAsync: build.mutation<
        PedidoDeleteAsyncApiResponse,
        PedidoDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedido/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Pedido"],
      }),
      pedidoGetAll: build.query<PedidoGetAllApiResponse, PedidoGetAllApiArg>({
        query: () => ({ url: `/api/pedido/getall` }),
        providesTags: ["Pedido"],
      }),
      pedidoGetAllAsync: build.query<
        PedidoGetAllAsyncApiResponse,
        PedidoGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/pedido/getall-async` }),
        providesTags: ["Pedido"],
      }),
      pedidoGetById: build.query<PedidoGetByIdApiResponse, PedidoGetByIdApiArg>(
        {
          query: (queryArg) => ({ url: `/api/pedido/getbyid/${queryArg.id}` }),
          providesTags: ["Pedido"],
        },
      ),
      pedidoGetByIdAsync: build.query<
        PedidoGetByIdAsyncApiResponse,
        PedidoGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedido/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["Pedido"],
      }),
      pedidoGetPaged: build.query<
        PedidoGetPagedApiResponse,
        PedidoGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedido/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Pedido"],
      }),
      pedidoGetPagedAsync: build.query<
        PedidoGetPagedAsyncApiResponse,
        PedidoGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedido/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Pedido"],
      }),
      pedidoCount: build.query<PedidoCountApiResponse, PedidoCountApiArg>({
        query: () => ({ url: `/api/pedido/count` }),
        providesTags: ["Pedido"],
      }),
      pedidoCountAsync: build.query<
        PedidoCountAsyncApiResponse,
        PedidoCountAsyncApiArg
      >({
        query: () => ({ url: `/api/pedido/count-async` }),
        providesTags: ["Pedido"],
      }),
      pedidoAsientoInsert: build.mutation<
        PedidoAsientoInsertApiResponse,
        PedidoAsientoInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidoasiento/insert`,
          method: "POST",
          body: queryArg.pedidoAsientoDto,
        }),
        invalidatesTags: ["PedidoAsiento"],
      }),
      pedidoAsientoInsertAsync: build.mutation<
        PedidoAsientoInsertAsyncApiResponse,
        PedidoAsientoInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidoasiento/insert-async`,
          method: "POST",
          body: queryArg.pedidoAsientoDto,
        }),
        invalidatesTags: ["PedidoAsiento"],
      }),
      pedidoAsientoUpdate: build.mutation<
        PedidoAsientoUpdateApiResponse,
        PedidoAsientoUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidoasiento/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.pedidoAsientoDto,
        }),
        invalidatesTags: ["PedidoAsiento"],
      }),
      pedidoAsientoUpdateAsync: build.mutation<
        PedidoAsientoUpdateAsyncApiResponse,
        PedidoAsientoUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidoasiento/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.pedidoAsientoDto,
        }),
        invalidatesTags: ["PedidoAsiento"],
      }),
      pedidoAsientoDelete: build.mutation<
        PedidoAsientoDeleteApiResponse,
        PedidoAsientoDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidoasiento/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["PedidoAsiento"],
      }),
      pedidoAsientoDeleteAsync: build.mutation<
        PedidoAsientoDeleteAsyncApiResponse,
        PedidoAsientoDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidoasiento/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["PedidoAsiento"],
      }),
      pedidoAsientoGetAll: build.query<
        PedidoAsientoGetAllApiResponse,
        PedidoAsientoGetAllApiArg
      >({
        query: () => ({ url: `/api/pedidoasiento/getall` }),
        providesTags: ["PedidoAsiento"],
      }),
      pedidoAsientoGetAllAsync: build.query<
        PedidoAsientoGetAllAsyncApiResponse,
        PedidoAsientoGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/pedidoasiento/getall-async` }),
        providesTags: ["PedidoAsiento"],
      }),
      pedidoAsientoGetById: build.query<
        PedidoAsientoGetByIdApiResponse,
        PedidoAsientoGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidoasiento/getbyid/${queryArg.id}`,
        }),
        providesTags: ["PedidoAsiento"],
      }),
      pedidoAsientoGetByIdAsync: build.query<
        PedidoAsientoGetByIdAsyncApiResponse,
        PedidoAsientoGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidoasiento/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["PedidoAsiento"],
      }),
      pedidoAsientoGetPaged: build.query<
        PedidoAsientoGetPagedApiResponse,
        PedidoAsientoGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidoasiento/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["PedidoAsiento"],
      }),
      pedidoAsientoGetPagedAsync: build.query<
        PedidoAsientoGetPagedAsyncApiResponse,
        PedidoAsientoGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidoasiento/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["PedidoAsiento"],
      }),
      pedidoAsientoCount: build.query<
        PedidoAsientoCountApiResponse,
        PedidoAsientoCountApiArg
      >({
        query: () => ({ url: `/api/pedidoasiento/count` }),
        providesTags: ["PedidoAsiento"],
      }),
      pedidoAsientoCountAsync: build.query<
        PedidoAsientoCountAsyncApiResponse,
        PedidoAsientoCountAsyncApiArg
      >({
        query: () => ({ url: `/api/pedidoasiento/count-async` }),
        providesTags: ["PedidoAsiento"],
      }),
      pedidoDetalleInsert: build.mutation<
        PedidoDetalleInsertApiResponse,
        PedidoDetalleInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidodetalle/insert`,
          method: "POST",
          body: queryArg.pedidoDetalleDto,
        }),
        invalidatesTags: ["PedidoDetalle"],
      }),
      pedidoDetalleInsertAsync: build.mutation<
        PedidoDetalleInsertAsyncApiResponse,
        PedidoDetalleInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidodetalle/insert-async`,
          method: "POST",
          body: queryArg.pedidoDetalleDto,
        }),
        invalidatesTags: ["PedidoDetalle"],
      }),
      pedidoDetalleUpdate: build.mutation<
        PedidoDetalleUpdateApiResponse,
        PedidoDetalleUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidodetalle/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.pedidoDetalleDto,
        }),
        invalidatesTags: ["PedidoDetalle"],
      }),
      pedidoDetalleUpdateAsync: build.mutation<
        PedidoDetalleUpdateAsyncApiResponse,
        PedidoDetalleUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidodetalle/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.pedidoDetalleDto,
        }),
        invalidatesTags: ["PedidoDetalle"],
      }),
      pedidoDetalleDelete: build.mutation<
        PedidoDetalleDeleteApiResponse,
        PedidoDetalleDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidodetalle/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["PedidoDetalle"],
      }),
      pedidoDetalleDeleteAsync: build.mutation<
        PedidoDetalleDeleteAsyncApiResponse,
        PedidoDetalleDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidodetalle/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["PedidoDetalle"],
      }),
      pedidoDetalleGetAll: build.query<
        PedidoDetalleGetAllApiResponse,
        PedidoDetalleGetAllApiArg
      >({
        query: () => ({ url: `/api/pedidodetalle/getall` }),
        providesTags: ["PedidoDetalle"],
      }),
      pedidoDetalleGetAllAsync: build.query<
        PedidoDetalleGetAllAsyncApiResponse,
        PedidoDetalleGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/pedidodetalle/getall-async` }),
        providesTags: ["PedidoDetalle"],
      }),
      pedidoDetalleGetById: build.query<
        PedidoDetalleGetByIdApiResponse,
        PedidoDetalleGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidodetalle/getbyid/${queryArg.id}`,
        }),
        providesTags: ["PedidoDetalle"],
      }),
      pedidoDetalleGetByIdAsync: build.query<
        PedidoDetalleGetByIdAsyncApiResponse,
        PedidoDetalleGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidodetalle/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["PedidoDetalle"],
      }),
      pedidoDetalleGetPaged: build.query<
        PedidoDetalleGetPagedApiResponse,
        PedidoDetalleGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidodetalle/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["PedidoDetalle"],
      }),
      pedidoDetalleGetPagedAsync: build.query<
        PedidoDetalleGetPagedAsyncApiResponse,
        PedidoDetalleGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidodetalle/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["PedidoDetalle"],
      }),
      pedidoDetalleCount: build.query<
        PedidoDetalleCountApiResponse,
        PedidoDetalleCountApiArg
      >({
        query: () => ({ url: `/api/pedidodetalle/count` }),
        providesTags: ["PedidoDetalle"],
      }),
      pedidoDetalleCountAsync: build.query<
        PedidoDetalleCountAsyncApiResponse,
        PedidoDetalleCountAsyncApiArg
      >({
        query: () => ({ url: `/api/pedidodetalle/count-async` }),
        providesTags: ["PedidoDetalle"],
      }),
      pedidoModificadorInsert: build.mutation<
        PedidoModificadorInsertApiResponse,
        PedidoModificadorInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidomodificador/insert`,
          method: "POST",
          body: queryArg.pedidoModificadorDto,
        }),
        invalidatesTags: ["PedidoModificador"],
      }),
      pedidoModificadorInsertAsync: build.mutation<
        PedidoModificadorInsertAsyncApiResponse,
        PedidoModificadorInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidomodificador/insert-async`,
          method: "POST",
          body: queryArg.pedidoModificadorDto,
        }),
        invalidatesTags: ["PedidoModificador"],
      }),
      pedidoModificadorUpdate: build.mutation<
        PedidoModificadorUpdateApiResponse,
        PedidoModificadorUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidomodificador/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.pedidoModificadorDto,
        }),
        invalidatesTags: ["PedidoModificador"],
      }),
      pedidoModificadorUpdateAsync: build.mutation<
        PedidoModificadorUpdateAsyncApiResponse,
        PedidoModificadorUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidomodificador/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.pedidoModificadorDto,
        }),
        invalidatesTags: ["PedidoModificador"],
      }),
      pedidoModificadorDelete: build.mutation<
        PedidoModificadorDeleteApiResponse,
        PedidoModificadorDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidomodificador/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["PedidoModificador"],
      }),
      pedidoModificadorDeleteAsync: build.mutation<
        PedidoModificadorDeleteAsyncApiResponse,
        PedidoModificadorDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidomodificador/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["PedidoModificador"],
      }),
      pedidoModificadorGetAll: build.query<
        PedidoModificadorGetAllApiResponse,
        PedidoModificadorGetAllApiArg
      >({
        query: () => ({ url: `/api/pedidomodificador/getall` }),
        providesTags: ["PedidoModificador"],
      }),
      pedidoModificadorGetAllAsync: build.query<
        PedidoModificadorGetAllAsyncApiResponse,
        PedidoModificadorGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/pedidomodificador/getall-async` }),
        providesTags: ["PedidoModificador"],
      }),
      pedidoModificadorGetById: build.query<
        PedidoModificadorGetByIdApiResponse,
        PedidoModificadorGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidomodificador/getbyid/${queryArg.id}`,
        }),
        providesTags: ["PedidoModificador"],
      }),
      pedidoModificadorGetByIdAsync: build.query<
        PedidoModificadorGetByIdAsyncApiResponse,
        PedidoModificadorGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidomodificador/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["PedidoModificador"],
      }),
      pedidoModificadorGetPaged: build.query<
        PedidoModificadorGetPagedApiResponse,
        PedidoModificadorGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidomodificador/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["PedidoModificador"],
      }),
      pedidoModificadorGetPagedAsync: build.query<
        PedidoModificadorGetPagedAsyncApiResponse,
        PedidoModificadorGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/pedidomodificador/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["PedidoModificador"],
      }),
      pedidoModificadorCount: build.query<
        PedidoModificadorCountApiResponse,
        PedidoModificadorCountApiArg
      >({
        query: () => ({ url: `/api/pedidomodificador/count` }),
        providesTags: ["PedidoModificador"],
      }),
      pedidoModificadorCountAsync: build.query<
        PedidoModificadorCountAsyncApiResponse,
        PedidoModificadorCountAsyncApiArg
      >({
        query: () => ({ url: `/api/pedidomodificador/count-async` }),
        providesTags: ["PedidoModificador"],
      }),
      precioInsert: build.mutation<PrecioInsertApiResponse, PrecioInsertApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/precio/insert`,
            method: "POST",
            body: queryArg.precioDto,
          }),
          invalidatesTags: ["Precio"],
        },
      ),
      precioInsertAsync: build.mutation<
        PrecioInsertAsyncApiResponse,
        PrecioInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/precio/insert-async`,
          method: "POST",
          body: queryArg.precioDto,
        }),
        invalidatesTags: ["Precio"],
      }),
      precioUpdate: build.mutation<PrecioUpdateApiResponse, PrecioUpdateApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/precio/update/${queryArg.id}`,
            method: "PUT",
            body: queryArg.precioDto,
          }),
          invalidatesTags: ["Precio"],
        },
      ),
      precioUpdateAsync: build.mutation<
        PrecioUpdateAsyncApiResponse,
        PrecioUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/precio/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.precioDto,
        }),
        invalidatesTags: ["Precio"],
      }),
      precioDelete: build.mutation<PrecioDeleteApiResponse, PrecioDeleteApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/precio/delete/${queryArg.id}`,
            method: "DELETE",
          }),
          invalidatesTags: ["Precio"],
        },
      ),
      precioDeleteAsync: build.mutation<
        PrecioDeleteAsyncApiResponse,
        PrecioDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/precio/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Precio"],
      }),
      precioGetAll: build.query<PrecioGetAllApiResponse, PrecioGetAllApiArg>({
        query: () => ({ url: `/api/precio/getall` }),
        providesTags: ["Precio"],
      }),
      precioGetAllAsync: build.query<
        PrecioGetAllAsyncApiResponse,
        PrecioGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/precio/getall-async` }),
        providesTags: ["Precio"],
      }),
      precioGetById: build.query<PrecioGetByIdApiResponse, PrecioGetByIdApiArg>(
        {
          query: (queryArg) => ({ url: `/api/precio/getbyid/${queryArg.id}` }),
          providesTags: ["Precio"],
        },
      ),
      precioGetByIdAsync: build.query<
        PrecioGetByIdAsyncApiResponse,
        PrecioGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/precio/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["Precio"],
      }),
      precioGetPaged: build.query<
        PrecioGetPagedApiResponse,
        PrecioGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/precio/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Precio"],
      }),
      precioGetPagedAsync: build.query<
        PrecioGetPagedAsyncApiResponse,
        PrecioGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/precio/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Precio"],
      }),
      precioCount: build.query<PrecioCountApiResponse, PrecioCountApiArg>({
        query: () => ({ url: `/api/precio/count` }),
        providesTags: ["Precio"],
      }),
      precioCountAsync: build.query<
        PrecioCountAsyncApiResponse,
        PrecioCountAsyncApiArg
      >({
        query: () => ({ url: `/api/precio/count-async` }),
        providesTags: ["Precio"],
      }),
      productoInsert: build.mutation<
        ProductoInsertApiResponse,
        ProductoInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/producto/insert`,
          method: "POST",
          body: queryArg.productoDto,
        }),
        invalidatesTags: ["Producto"],
      }),
      productoInsertAsync: build.mutation<
        ProductoInsertAsyncApiResponse,
        ProductoInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/producto/insert-async`,
          method: "POST",
          body: queryArg.productoDto,
        }),
        invalidatesTags: ["Producto"],
      }),
      productoUpdate: build.mutation<
        ProductoUpdateApiResponse,
        ProductoUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/producto/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.productoDto,
        }),
        invalidatesTags: ["Producto"],
      }),
      productoUpdateAsync: build.mutation<
        ProductoUpdateAsyncApiResponse,
        ProductoUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/producto/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.productoDto,
        }),
        invalidatesTags: ["Producto"],
      }),
      productoDelete: build.mutation<
        ProductoDeleteApiResponse,
        ProductoDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/producto/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Producto"],
      }),
      productoDeleteAsync: build.mutation<
        ProductoDeleteAsyncApiResponse,
        ProductoDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/producto/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Producto"],
      }),
      productoGetAll: build.query<
        ProductoGetAllApiResponse,
        ProductoGetAllApiArg
      >({
        query: () => ({ url: `/api/producto/getall` }),
        providesTags: ["Producto"],
      }),
      productoGetAllAsync: build.query<
        ProductoGetAllAsyncApiResponse,
        ProductoGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/producto/getall-async` }),
        providesTags: ["Producto"],
      }),
      productoGetById: build.query<
        ProductoGetByIdApiResponse,
        ProductoGetByIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/producto/getbyid/${queryArg.id}` }),
        providesTags: ["Producto"],
      }),
      productoGetByIdAsync: build.query<
        ProductoGetByIdAsyncApiResponse,
        ProductoGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/producto/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["Producto"],
      }),
      productoGetPaged: build.query<
        ProductoGetPagedApiResponse,
        ProductoGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/producto/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Producto"],
      }),
      productoGetPagedAsync: build.query<
        ProductoGetPagedAsyncApiResponse,
        ProductoGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/producto/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Producto"],
      }),
      productoCount: build.query<ProductoCountApiResponse, ProductoCountApiArg>(
        {
          query: () => ({ url: `/api/producto/count` }),
          providesTags: ["Producto"],
        },
      ),
      productoCountAsync: build.query<
        ProductoCountAsyncApiResponse,
        ProductoCountAsyncApiArg
      >({
        query: () => ({ url: `/api/producto/count-async` }),
        providesTags: ["Producto"],
      }),
      rolInsert: build.mutation<RolInsertApiResponse, RolInsertApiArg>({
        query: (queryArg) => ({
          url: `/api/rol/insert`,
          method: "POST",
          body: queryArg.rolDto,
        }),
        invalidatesTags: ["Rol"],
      }),
      rolInsertAsync: build.mutation<
        RolInsertAsyncApiResponse,
        RolInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/rol/insert-async`,
          method: "POST",
          body: queryArg.rolDto,
        }),
        invalidatesTags: ["Rol"],
      }),
      rolUpdate: build.mutation<RolUpdateApiResponse, RolUpdateApiArg>({
        query: (queryArg) => ({
          url: `/api/rol/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.rolDto,
        }),
        invalidatesTags: ["Rol"],
      }),
      rolUpdateAsync: build.mutation<
        RolUpdateAsyncApiResponse,
        RolUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/rol/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.rolDto,
        }),
        invalidatesTags: ["Rol"],
      }),
      rolDelete: build.mutation<RolDeleteApiResponse, RolDeleteApiArg>({
        query: (queryArg) => ({
          url: `/api/rol/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Rol"],
      }),
      rolDeleteAsync: build.mutation<
        RolDeleteAsyncApiResponse,
        RolDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/rol/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Rol"],
      }),
      rolGetAll: build.query<RolGetAllApiResponse, RolGetAllApiArg>({
        query: () => ({ url: `/api/rol/getall` }),
        providesTags: ["Rol"],
      }),
      rolGetAllAsync: build.query<
        RolGetAllAsyncApiResponse,
        RolGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/rol/getall-async` }),
        providesTags: ["Rol"],
      }),
      rolGetById: build.query<RolGetByIdApiResponse, RolGetByIdApiArg>({
        query: (queryArg) => ({ url: `/api/rol/getbyid/${queryArg.id}` }),
        providesTags: ["Rol"],
      }),
      rolGetByIdAsync: build.query<
        RolGetByIdAsyncApiResponse,
        RolGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({ url: `/api/rol/getbyid-async/${queryArg.id}` }),
        providesTags: ["Rol"],
      }),
      rolGetPaged: build.query<RolGetPagedApiResponse, RolGetPagedApiArg>({
        query: (queryArg) => ({
          url: `/api/rol/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Rol"],
      }),
      rolGetPagedAsync: build.query<
        RolGetPagedAsyncApiResponse,
        RolGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/rol/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Rol"],
      }),
      rolCount: build.query<RolCountApiResponse, RolCountApiArg>({
        query: () => ({ url: `/api/rol/count` }),
        providesTags: ["Rol"],
      }),
      rolCountAsync: build.query<RolCountAsyncApiResponse, RolCountAsyncApiArg>(
        {
          query: () => ({ url: `/api/rol/count-async` }),
          providesTags: ["Rol"],
        },
      ),
      sucursalInsert: build.mutation<
        SucursalInsertApiResponse,
        SucursalInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/sucursal/insert`,
          method: "POST",
          body: queryArg.sucursalDto,
        }),
        invalidatesTags: ["Sucursal"],
      }),
      sucursalInsertAsync: build.mutation<
        SucursalInsertAsyncApiResponse,
        SucursalInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/sucursal/insert-async`,
          method: "POST",
          body: queryArg.sucursalDto,
        }),
        invalidatesTags: ["Sucursal"],
      }),
      sucursalUpdate: build.mutation<
        SucursalUpdateApiResponse,
        SucursalUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/sucursal/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.sucursalDto,
        }),
        invalidatesTags: ["Sucursal"],
      }),
      sucursalUpdateAsync: build.mutation<
        SucursalUpdateAsyncApiResponse,
        SucursalUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/sucursal/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.sucursalDto,
        }),
        invalidatesTags: ["Sucursal"],
      }),
      sucursalDelete: build.mutation<
        SucursalDeleteApiResponse,
        SucursalDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/sucursal/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Sucursal"],
      }),
      sucursalDeleteAsync: build.mutation<
        SucursalDeleteAsyncApiResponse,
        SucursalDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/sucursal/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Sucursal"],
      }),
      sucursalGetAll: build.query<
        SucursalGetAllApiResponse,
        SucursalGetAllApiArg
      >({
        query: () => ({ url: `/api/sucursal/getall` }),
        providesTags: ["Sucursal"],
      }),
      sucursalGetAllAsync: build.query<
        SucursalGetAllAsyncApiResponse,
        SucursalGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/sucursal/getall-async` }),
        providesTags: ["Sucursal"],
      }),
      sucursalGetById: build.query<
        SucursalGetByIdApiResponse,
        SucursalGetByIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/sucursal/getbyid/${queryArg.id}` }),
        providesTags: ["Sucursal"],
      }),
      sucursalGetByIdAsync: build.query<
        SucursalGetByIdAsyncApiResponse,
        SucursalGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/sucursal/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["Sucursal"],
      }),
      sucursalGetPaged: build.query<
        SucursalGetPagedApiResponse,
        SucursalGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/sucursal/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Sucursal"],
      }),
      sucursalGetPagedAsync: build.query<
        SucursalGetPagedAsyncApiResponse,
        SucursalGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/sucursal/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Sucursal"],
      }),
      sucursalCount: build.query<SucursalCountApiResponse, SucursalCountApiArg>(
        {
          query: () => ({ url: `/api/sucursal/count` }),
          providesTags: ["Sucursal"],
        },
      ),
      sucursalCountAsync: build.query<
        SucursalCountAsyncApiResponse,
        SucursalCountAsyncApiArg
      >({
        query: () => ({ url: `/api/sucursal/count-async` }),
        providesTags: ["Sucursal"],
      }),
      ticketCocinaInsert: build.mutation<
        TicketCocinaInsertApiResponse,
        TicketCocinaInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketcocina/insert`,
          method: "POST",
          body: queryArg.ticketCocinaDto,
        }),
        invalidatesTags: ["TicketCocina"],
      }),
      ticketCocinaInsertAsync: build.mutation<
        TicketCocinaInsertAsyncApiResponse,
        TicketCocinaInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketcocina/insert-async`,
          method: "POST",
          body: queryArg.ticketCocinaDto,
        }),
        invalidatesTags: ["TicketCocina"],
      }),
      ticketCocinaUpdate: build.mutation<
        TicketCocinaUpdateApiResponse,
        TicketCocinaUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketcocina/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.ticketCocinaDto,
        }),
        invalidatesTags: ["TicketCocina"],
      }),
      ticketCocinaUpdateAsync: build.mutation<
        TicketCocinaUpdateAsyncApiResponse,
        TicketCocinaUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketcocina/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.ticketCocinaDto,
        }),
        invalidatesTags: ["TicketCocina"],
      }),
      ticketCocinaDelete: build.mutation<
        TicketCocinaDeleteApiResponse,
        TicketCocinaDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketcocina/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["TicketCocina"],
      }),
      ticketCocinaDeleteAsync: build.mutation<
        TicketCocinaDeleteAsyncApiResponse,
        TicketCocinaDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketcocina/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["TicketCocina"],
      }),
      ticketCocinaGetAll: build.query<
        TicketCocinaGetAllApiResponse,
        TicketCocinaGetAllApiArg
      >({
        query: () => ({ url: `/api/ticketcocina/getall` }),
        providesTags: ["TicketCocina"],
      }),
      ticketCocinaGetAllAsync: build.query<
        TicketCocinaGetAllAsyncApiResponse,
        TicketCocinaGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/ticketcocina/getall-async` }),
        providesTags: ["TicketCocina"],
      }),
      ticketCocinaGetById: build.query<
        TicketCocinaGetByIdApiResponse,
        TicketCocinaGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketcocina/getbyid/${queryArg.id}`,
        }),
        providesTags: ["TicketCocina"],
      }),
      ticketCocinaGetByIdAsync: build.query<
        TicketCocinaGetByIdAsyncApiResponse,
        TicketCocinaGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketcocina/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["TicketCocina"],
      }),
      ticketCocinaGetPaged: build.query<
        TicketCocinaGetPagedApiResponse,
        TicketCocinaGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketcocina/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["TicketCocina"],
      }),
      ticketCocinaGetPagedAsync: build.query<
        TicketCocinaGetPagedAsyncApiResponse,
        TicketCocinaGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketcocina/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["TicketCocina"],
      }),
      ticketCocinaCount: build.query<
        TicketCocinaCountApiResponse,
        TicketCocinaCountApiArg
      >({
        query: () => ({ url: `/api/ticketcocina/count` }),
        providesTags: ["TicketCocina"],
      }),
      ticketCocinaCountAsync: build.query<
        TicketCocinaCountAsyncApiResponse,
        TicketCocinaCountAsyncApiArg
      >({
        query: () => ({ url: `/api/ticketcocina/count-async` }),
        providesTags: ["TicketCocina"],
      }),
      ticketDetalleInsert: build.mutation<
        TicketDetalleInsertApiResponse,
        TicketDetalleInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketdetalle/insert`,
          method: "POST",
          body: queryArg.ticketDetalleDto,
        }),
        invalidatesTags: ["TicketDetalle"],
      }),
      ticketDetalleInsertAsync: build.mutation<
        TicketDetalleInsertAsyncApiResponse,
        TicketDetalleInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketdetalle/insert-async`,
          method: "POST",
          body: queryArg.ticketDetalleDto,
        }),
        invalidatesTags: ["TicketDetalle"],
      }),
      ticketDetalleUpdate: build.mutation<
        TicketDetalleUpdateApiResponse,
        TicketDetalleUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketdetalle/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.ticketDetalleDto,
        }),
        invalidatesTags: ["TicketDetalle"],
      }),
      ticketDetalleUpdateAsync: build.mutation<
        TicketDetalleUpdateAsyncApiResponse,
        TicketDetalleUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketdetalle/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.ticketDetalleDto,
        }),
        invalidatesTags: ["TicketDetalle"],
      }),
      ticketDetalleDelete: build.mutation<
        TicketDetalleDeleteApiResponse,
        TicketDetalleDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketdetalle/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["TicketDetalle"],
      }),
      ticketDetalleDeleteAsync: build.mutation<
        TicketDetalleDeleteAsyncApiResponse,
        TicketDetalleDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketdetalle/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["TicketDetalle"],
      }),
      ticketDetalleGetAll: build.query<
        TicketDetalleGetAllApiResponse,
        TicketDetalleGetAllApiArg
      >({
        query: () => ({ url: `/api/ticketdetalle/getall` }),
        providesTags: ["TicketDetalle"],
      }),
      ticketDetalleGetAllAsync: build.query<
        TicketDetalleGetAllAsyncApiResponse,
        TicketDetalleGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/ticketdetalle/getall-async` }),
        providesTags: ["TicketDetalle"],
      }),
      ticketDetalleGetById: build.query<
        TicketDetalleGetByIdApiResponse,
        TicketDetalleGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketdetalle/getbyid/${queryArg.id}`,
        }),
        providesTags: ["TicketDetalle"],
      }),
      ticketDetalleGetByIdAsync: build.query<
        TicketDetalleGetByIdAsyncApiResponse,
        TicketDetalleGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketdetalle/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["TicketDetalle"],
      }),
      ticketDetalleGetPaged: build.query<
        TicketDetalleGetPagedApiResponse,
        TicketDetalleGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketdetalle/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["TicketDetalle"],
      }),
      ticketDetalleGetPagedAsync: build.query<
        TicketDetalleGetPagedAsyncApiResponse,
        TicketDetalleGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/ticketdetalle/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["TicketDetalle"],
      }),
      ticketDetalleCount: build.query<
        TicketDetalleCountApiResponse,
        TicketDetalleCountApiArg
      >({
        query: () => ({ url: `/api/ticketdetalle/count` }),
        providesTags: ["TicketDetalle"],
      }),
      ticketDetalleCountAsync: build.query<
        TicketDetalleCountAsyncApiResponse,
        TicketDetalleCountAsyncApiArg
      >({
        query: () => ({ url: `/api/ticketdetalle/count-async` }),
        providesTags: ["TicketDetalle"],
      }),
      turnoInsert: build.mutation<TurnoInsertApiResponse, TurnoInsertApiArg>({
        query: (queryArg) => ({
          url: `/api/turno/insert`,
          method: "POST",
          body: queryArg.turnoDto,
        }),
        invalidatesTags: ["Turno"],
      }),
      turnoInsertAsync: build.mutation<
        TurnoInsertAsyncApiResponse,
        TurnoInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/turno/insert-async`,
          method: "POST",
          body: queryArg.turnoDto,
        }),
        invalidatesTags: ["Turno"],
      }),
      turnoUpdate: build.mutation<TurnoUpdateApiResponse, TurnoUpdateApiArg>({
        query: (queryArg) => ({
          url: `/api/turno/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.turnoDto,
        }),
        invalidatesTags: ["Turno"],
      }),
      turnoUpdateAsync: build.mutation<
        TurnoUpdateAsyncApiResponse,
        TurnoUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/turno/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.turnoDto,
        }),
        invalidatesTags: ["Turno"],
      }),
      turnoDelete: build.mutation<TurnoDeleteApiResponse, TurnoDeleteApiArg>({
        query: (queryArg) => ({
          url: `/api/turno/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Turno"],
      }),
      turnoDeleteAsync: build.mutation<
        TurnoDeleteAsyncApiResponse,
        TurnoDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/turno/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Turno"],
      }),
      turnoGetAll: build.query<TurnoGetAllApiResponse, TurnoGetAllApiArg>({
        query: () => ({ url: `/api/turno/getall` }),
        providesTags: ["Turno"],
      }),
      turnoGetAllAsync: build.query<
        TurnoGetAllAsyncApiResponse,
        TurnoGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/turno/getall-async` }),
        providesTags: ["Turno"],
      }),
      turnoGetById: build.query<TurnoGetByIdApiResponse, TurnoGetByIdApiArg>({
        query: (queryArg) => ({ url: `/api/turno/getbyid/${queryArg.id}` }),
        providesTags: ["Turno"],
      }),
      turnoGetByIdAsync: build.query<
        TurnoGetByIdAsyncApiResponse,
        TurnoGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/turno/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["Turno"],
      }),
      turnoGetPaged: build.query<TurnoGetPagedApiResponse, TurnoGetPagedApiArg>(
        {
          query: (queryArg) => ({
            url: `/api/turno/getpaged`,
            params: {
              page: queryArg.page,
              pageSize: queryArg.pageSize,
            },
          }),
          providesTags: ["Turno"],
        },
      ),
      turnoGetPagedAsync: build.query<
        TurnoGetPagedAsyncApiResponse,
        TurnoGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/turno/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Turno"],
      }),
      turnoCount: build.query<TurnoCountApiResponse, TurnoCountApiArg>({
        query: () => ({ url: `/api/turno/count` }),
        providesTags: ["Turno"],
      }),
      turnoCountAsync: build.query<
        TurnoCountAsyncApiResponse,
        TurnoCountAsyncApiArg
      >({
        query: () => ({ url: `/api/turno/count-async` }),
        providesTags: ["Turno"],
      }),
      usuarioInsert: build.mutation<
        UsuarioInsertApiResponse,
        UsuarioInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuario/insert`,
          method: "POST",
          body: queryArg.usuarioDto,
        }),
        invalidatesTags: ["Usuario"],
      }),
      usuarioInsertAsync: build.mutation<
        UsuarioInsertAsyncApiResponse,
        UsuarioInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuario/insert-async`,
          method: "POST",
          body: queryArg.usuarioDto,
        }),
        invalidatesTags: ["Usuario"],
      }),
      usuarioUpdate: build.mutation<
        UsuarioUpdateApiResponse,
        UsuarioUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuario/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.usuarioDto,
        }),
        invalidatesTags: ["Usuario"],
      }),
      usuarioUpdateAsync: build.mutation<
        UsuarioUpdateAsyncApiResponse,
        UsuarioUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuario/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.usuarioDto,
        }),
        invalidatesTags: ["Usuario"],
      }),
      usuarioDelete: build.mutation<
        UsuarioDeleteApiResponse,
        UsuarioDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuario/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Usuario"],
      }),
      usuarioDeleteAsync: build.mutation<
        UsuarioDeleteAsyncApiResponse,
        UsuarioDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuario/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Usuario"],
      }),
      usuarioGetAll: build.query<UsuarioGetAllApiResponse, UsuarioGetAllApiArg>(
        {
          query: () => ({ url: `/api/usuario/getall` }),
          providesTags: ["Usuario"],
        },
      ),
      usuarioGetAllAsync: build.query<
        UsuarioGetAllAsyncApiResponse,
        UsuarioGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/usuario/getall-async` }),
        providesTags: ["Usuario"],
      }),
      usuarioGetById: build.query<
        UsuarioGetByIdApiResponse,
        UsuarioGetByIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/usuario/getbyid/${queryArg.id}` }),
        providesTags: ["Usuario"],
      }),
      usuarioGetByIdAsync: build.query<
        UsuarioGetByIdAsyncApiResponse,
        UsuarioGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuario/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["Usuario"],
      }),
      usuarioGetPaged: build.query<
        UsuarioGetPagedApiResponse,
        UsuarioGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuario/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Usuario"],
      }),
      usuarioGetPagedAsync: build.query<
        UsuarioGetPagedAsyncApiResponse,
        UsuarioGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuario/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Usuario"],
      }),
      usuarioCount: build.query<UsuarioCountApiResponse, UsuarioCountApiArg>({
        query: () => ({ url: `/api/usuario/count` }),
        providesTags: ["Usuario"],
      }),
      usuarioCountAsync: build.query<
        UsuarioCountAsyncApiResponse,
        UsuarioCountAsyncApiArg
      >({
        query: () => ({ url: `/api/usuario/count-async` }),
        providesTags: ["Usuario"],
      }),
      usuarioRolInsert: build.mutation<
        UsuarioRolInsertApiResponse,
        UsuarioRolInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuariorol/insert`,
          method: "POST",
          body: queryArg.usuarioRolDto,
        }),
        invalidatesTags: ["UsuarioRol"],
      }),
      usuarioRolInsertAsync: build.mutation<
        UsuarioRolInsertAsyncApiResponse,
        UsuarioRolInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuariorol/insert-async`,
          method: "POST",
          body: queryArg.usuarioRolDto,
        }),
        invalidatesTags: ["UsuarioRol"],
      }),
      usuarioRolUpdate: build.mutation<
        UsuarioRolUpdateApiResponse,
        UsuarioRolUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuariorol/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.usuarioRolDto,
        }),
        invalidatesTags: ["UsuarioRol"],
      }),
      usuarioRolUpdateAsync: build.mutation<
        UsuarioRolUpdateAsyncApiResponse,
        UsuarioRolUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuariorol/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.usuarioRolDto,
        }),
        invalidatesTags: ["UsuarioRol"],
      }),
      usuarioRolDelete: build.mutation<
        UsuarioRolDeleteApiResponse,
        UsuarioRolDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuariorol/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["UsuarioRol"],
      }),
      usuarioRolDeleteAsync: build.mutation<
        UsuarioRolDeleteAsyncApiResponse,
        UsuarioRolDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuariorol/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["UsuarioRol"],
      }),
      usuarioRolGetAll: build.query<
        UsuarioRolGetAllApiResponse,
        UsuarioRolGetAllApiArg
      >({
        query: () => ({ url: `/api/usuariorol/getall` }),
        providesTags: ["UsuarioRol"],
      }),
      usuarioRolGetAllAsync: build.query<
        UsuarioRolGetAllAsyncApiResponse,
        UsuarioRolGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/usuariorol/getall-async` }),
        providesTags: ["UsuarioRol"],
      }),
      usuarioRolGetById: build.query<
        UsuarioRolGetByIdApiResponse,
        UsuarioRolGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuariorol/getbyid/${queryArg.id}`,
        }),
        providesTags: ["UsuarioRol"],
      }),
      usuarioRolGetByIdAsync: build.query<
        UsuarioRolGetByIdAsyncApiResponse,
        UsuarioRolGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuariorol/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["UsuarioRol"],
      }),
      usuarioRolGetPaged: build.query<
        UsuarioRolGetPagedApiResponse,
        UsuarioRolGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuariorol/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["UsuarioRol"],
      }),
      usuarioRolGetPagedAsync: build.query<
        UsuarioRolGetPagedAsyncApiResponse,
        UsuarioRolGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/usuariorol/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["UsuarioRol"],
      }),
      usuarioRolCount: build.query<
        UsuarioRolCountApiResponse,
        UsuarioRolCountApiArg
      >({
        query: () => ({ url: `/api/usuariorol/count` }),
        providesTags: ["UsuarioRol"],
      }),
      usuarioRolCountAsync: build.query<
        UsuarioRolCountAsyncApiResponse,
        UsuarioRolCountAsyncApiArg
      >({
        query: () => ({ url: `/api/usuariorol/count-async` }),
        providesTags: ["UsuarioRol"],
      }),
      varianteProductoInsert: build.mutation<
        VarianteProductoInsertApiResponse,
        VarianteProductoInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/varianteproducto/insert`,
          method: "POST",
          body: queryArg.varianteProductoDto,
        }),
        invalidatesTags: ["VarianteProducto"],
      }),
      varianteProductoInsertAsync: build.mutation<
        VarianteProductoInsertAsyncApiResponse,
        VarianteProductoInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/varianteproducto/insert-async`,
          method: "POST",
          body: queryArg.varianteProductoDto,
        }),
        invalidatesTags: ["VarianteProducto"],
      }),
      varianteProductoUpdate: build.mutation<
        VarianteProductoUpdateApiResponse,
        VarianteProductoUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/varianteproducto/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.varianteProductoDto,
        }),
        invalidatesTags: ["VarianteProducto"],
      }),
      varianteProductoUpdateAsync: build.mutation<
        VarianteProductoUpdateAsyncApiResponse,
        VarianteProductoUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/varianteproducto/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.varianteProductoDto,
        }),
        invalidatesTags: ["VarianteProducto"],
      }),
      varianteProductoDelete: build.mutation<
        VarianteProductoDeleteApiResponse,
        VarianteProductoDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/varianteproducto/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["VarianteProducto"],
      }),
      varianteProductoDeleteAsync: build.mutation<
        VarianteProductoDeleteAsyncApiResponse,
        VarianteProductoDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/varianteproducto/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["VarianteProducto"],
      }),
      varianteProductoGetAll: build.query<
        VarianteProductoGetAllApiResponse,
        VarianteProductoGetAllApiArg
      >({
        query: () => ({ url: `/api/varianteproducto/getall` }),
        providesTags: ["VarianteProducto"],
      }),
      varianteProductoGetAllAsync: build.query<
        VarianteProductoGetAllAsyncApiResponse,
        VarianteProductoGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/varianteproducto/getall-async` }),
        providesTags: ["VarianteProducto"],
      }),
      varianteProductoGetById: build.query<
        VarianteProductoGetByIdApiResponse,
        VarianteProductoGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/varianteproducto/getbyid/${queryArg.id}`,
        }),
        providesTags: ["VarianteProducto"],
      }),
      varianteProductoGetByIdAsync: build.query<
        VarianteProductoGetByIdAsyncApiResponse,
        VarianteProductoGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/varianteproducto/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["VarianteProducto"],
      }),
      varianteProductoGetPaged: build.query<
        VarianteProductoGetPagedApiResponse,
        VarianteProductoGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/varianteproducto/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["VarianteProducto"],
      }),
      varianteProductoGetPagedAsync: build.query<
        VarianteProductoGetPagedAsyncApiResponse,
        VarianteProductoGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/varianteproducto/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["VarianteProducto"],
      }),
      varianteProductoCount: build.query<
        VarianteProductoCountApiResponse,
        VarianteProductoCountApiArg
      >({
        query: () => ({ url: `/api/varianteproducto/count` }),
        providesTags: ["VarianteProducto"],
      }),
      varianteProductoCountAsync: build.query<
        VarianteProductoCountAsyncApiResponse,
        VarianteProductoCountAsyncApiArg
      >({
        query: () => ({ url: `/api/varianteproducto/count-async` }),
        providesTags: ["VarianteProducto"],
      }),
      formFieldInsert: build.mutation<
        FormFieldInsertApiResponse,
        FormFieldInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/formfield/insert`,
          method: "POST",
          body: queryArg.formFieldDto,
        }),
        invalidatesTags: ["FormField"],
      }),
      formFieldInsertAsync: build.mutation<
        FormFieldInsertAsyncApiResponse,
        FormFieldInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/formfield/insert-async`,
          method: "POST",
          body: queryArg.formFieldDto,
        }),
        invalidatesTags: ["FormField"],
      }),
      formFieldUpdate: build.mutation<
        FormFieldUpdateApiResponse,
        FormFieldUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/formfield/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.formFieldDto,
        }),
        invalidatesTags: ["FormField"],
      }),
      formFieldUpdateAsync: build.mutation<
        FormFieldUpdateAsyncApiResponse,
        FormFieldUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/formfield/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.formFieldDto,
        }),
        invalidatesTags: ["FormField"],
      }),
      formFieldDelete: build.mutation<
        FormFieldDeleteApiResponse,
        FormFieldDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/formfield/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["FormField"],
      }),
      formFieldDeleteAsync: build.mutation<
        FormFieldDeleteAsyncApiResponse,
        FormFieldDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/formfield/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["FormField"],
      }),
      formFieldGetAll: build.query<
        FormFieldGetAllApiResponse,
        FormFieldGetAllApiArg
      >({
        query: () => ({ url: `/api/formfield/getall` }),
        providesTags: ["FormField"],
      }),
      formFieldGetAllAsync: build.query<
        FormFieldGetAllAsyncApiResponse,
        FormFieldGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/formfield/getall-async` }),
        providesTags: ["FormField"],
      }),
      formFieldGetById: build.query<
        FormFieldGetByIdApiResponse,
        FormFieldGetByIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/formfield/getbyid/${queryArg.id}` }),
        providesTags: ["FormField"],
      }),
      formFieldGetByIdAsync: build.query<
        FormFieldGetByIdAsyncApiResponse,
        FormFieldGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/formfield/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["FormField"],
      }),
      formFieldGetPaged: build.query<
        FormFieldGetPagedApiResponse,
        FormFieldGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/formfield/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["FormField"],
      }),
      formFieldGetPagedAsync: build.query<
        FormFieldGetPagedAsyncApiResponse,
        FormFieldGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/formfield/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["FormField"],
      }),
      formFieldCount: build.query<
        FormFieldCountApiResponse,
        FormFieldCountApiArg
      >({
        query: () => ({ url: `/api/formfield/count` }),
        providesTags: ["FormField"],
      }),
      formFieldCountAsync: build.query<
        FormFieldCountAsyncApiResponse,
        FormFieldCountAsyncApiArg
      >({
        query: () => ({ url: `/api/formfield/count-async` }),
        providesTags: ["FormField"],
      }),
      formFieldGetFormFieldByFormCatId: build.query<
        FormFieldGetFormFieldByFormCatIdApiResponse,
        FormFieldGetFormFieldByFormCatIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/formfield/GetFormFieldByFormCatId/${queryArg.code}`,
        }),
        providesTags: ["FormField"],
      }),
      formFieldGetFormFieldByFormCatIdAsyncAsync: build.query<
        FormFieldGetFormFieldByFormCatIdAsyncAsyncApiResponse,
        FormFieldGetFormFieldByFormCatIdAsyncAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/formfield/GetFormFieldByFormCatIdAsync/${queryArg.id}`,
        }),
        providesTags: ["FormField"],
      }),
      accesoRutaInsert: build.mutation<
        AccesoRutaInsertApiResponse,
        AccesoRutaInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/accesoruta/insert`,
          method: "POST",
          body: queryArg.accesoRutaDto,
        }),
        invalidatesTags: ["AccesoRuta"],
      }),
      accesoRutaInsertAsync: build.mutation<
        AccesoRutaInsertAsyncApiResponse,
        AccesoRutaInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/accesoruta/insert-async`,
          method: "POST",
          body: queryArg.accesoRutaDto,
        }),
        invalidatesTags: ["AccesoRuta"],
      }),
      accesoRutaUpdate: build.mutation<
        AccesoRutaUpdateApiResponse,
        AccesoRutaUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/accesoruta/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.accesoRutaDto,
        }),
        invalidatesTags: ["AccesoRuta"],
      }),
      accesoRutaUpdateAsync: build.mutation<
        AccesoRutaUpdateAsyncApiResponse,
        AccesoRutaUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/accesoruta/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.accesoRutaDto,
        }),
        invalidatesTags: ["AccesoRuta"],
      }),
      accesoRutaDelete: build.mutation<
        AccesoRutaDeleteApiResponse,
        AccesoRutaDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/accesoruta/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["AccesoRuta"],
      }),
      accesoRutaDeleteAsync: build.mutation<
        AccesoRutaDeleteAsyncApiResponse,
        AccesoRutaDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/accesoruta/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["AccesoRuta"],
      }),
      accesoRutaGetAll: build.query<
        AccesoRutaGetAllApiResponse,
        AccesoRutaGetAllApiArg
      >({
        query: () => ({ url: `/api/accesoruta/getall` }),
        providesTags: ["AccesoRuta"],
      }),
      accesoRutaGetAllAsync: build.query<
        AccesoRutaGetAllAsyncApiResponse,
        AccesoRutaGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/accesoruta/getall-async` }),
        providesTags: ["AccesoRuta"],
      }),
      accesoRutaGetById: build.query<
        AccesoRutaGetByIdApiResponse,
        AccesoRutaGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/accesoruta/getbyid/${queryArg.id}`,
        }),
        providesTags: ["AccesoRuta"],
      }),
      accesoRutaGetByIdAsync: build.query<
        AccesoRutaGetByIdAsyncApiResponse,
        AccesoRutaGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/accesoruta/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["AccesoRuta"],
      }),
      accesoRutaGetPaged: build.query<
        AccesoRutaGetPagedApiResponse,
        AccesoRutaGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/accesoruta/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["AccesoRuta"],
      }),
      accesoRutaGetPagedAsync: build.query<
        AccesoRutaGetPagedAsyncApiResponse,
        AccesoRutaGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/accesoruta/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["AccesoRuta"],
      }),
      accesoRutaCount: build.query<
        AccesoRutaCountApiResponse,
        AccesoRutaCountApiArg
      >({
        query: () => ({ url: `/api/accesoruta/count` }),
        providesTags: ["AccesoRuta"],
      }),
      accesoRutaCountAsync: build.query<
        AccesoRutaCountAsyncApiResponse,
        AccesoRutaCountAsyncApiArg
      >({
        query: () => ({ url: `/api/accesoruta/count-async` }),
        providesTags: ["AccesoRuta"],
      }),
      rolAccesoRutaInsert: build.mutation<
        RolAccesoRutaInsertApiResponse,
        RolAccesoRutaInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/rolaccesoruta/insert`,
          method: "POST",
          body: queryArg.rolAccesoRutaDto,
        }),
        invalidatesTags: ["RolAccesoRuta"],
      }),
      rolAccesoRutaInsertAsync: build.mutation<
        RolAccesoRutaInsertAsyncApiResponse,
        RolAccesoRutaInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/rolaccesoruta/insert-async`,
          method: "POST",
          body: queryArg.rolAccesoRutaDto,
        }),
        invalidatesTags: ["RolAccesoRuta"],
      }),
      rolAccesoRutaUpdate: build.mutation<
        RolAccesoRutaUpdateApiResponse,
        RolAccesoRutaUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/rolaccesoruta/update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.rolAccesoRutaDto,
        }),
        invalidatesTags: ["RolAccesoRuta"],
      }),
      rolAccesoRutaUpdateAsync: build.mutation<
        RolAccesoRutaUpdateAsyncApiResponse,
        RolAccesoRutaUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/rolaccesoruta/update-async/${queryArg.id}`,
          method: "PUT",
          body: queryArg.rolAccesoRutaDto,
        }),
        invalidatesTags: ["RolAccesoRuta"],
      }),
      rolAccesoRutaDelete: build.mutation<
        RolAccesoRutaDeleteApiResponse,
        RolAccesoRutaDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/rolaccesoruta/delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["RolAccesoRuta"],
      }),
      rolAccesoRutaDeleteAsync: build.mutation<
        RolAccesoRutaDeleteAsyncApiResponse,
        RolAccesoRutaDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/rolaccesoruta/delete-async/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["RolAccesoRuta"],
      }),
      rolAccesoRutaGetAll: build.query<
        RolAccesoRutaGetAllApiResponse,
        RolAccesoRutaGetAllApiArg
      >({
        query: () => ({ url: `/api/rolaccesoruta/getall` }),
        providesTags: ["RolAccesoRuta"],
      }),
      rolAccesoRutaGetAllAsync: build.query<
        RolAccesoRutaGetAllAsyncApiResponse,
        RolAccesoRutaGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/rolaccesoruta/getall-async` }),
        providesTags: ["RolAccesoRuta"],
      }),
      rolAccesoRutaGetById: build.query<
        RolAccesoRutaGetByIdApiResponse,
        RolAccesoRutaGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/rolaccesoruta/getbyid/${queryArg.id}`,
        }),
        providesTags: ["RolAccesoRuta"],
      }),
      rolAccesoRutaGetByIdAsync: build.query<
        RolAccesoRutaGetByIdAsyncApiResponse,
        RolAccesoRutaGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/rolaccesoruta/getbyid-async/${queryArg.id}`,
        }),
        providesTags: ["RolAccesoRuta"],
      }),
      rolAccesoRutaGetPaged: build.query<
        RolAccesoRutaGetPagedApiResponse,
        RolAccesoRutaGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/rolaccesoruta/getpaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["RolAccesoRuta"],
      }),
      rolAccesoRutaGetPagedAsync: build.query<
        RolAccesoRutaGetPagedAsyncApiResponse,
        RolAccesoRutaGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/rolaccesoruta/getpaged-async`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["RolAccesoRuta"],
      }),
      rolAccesoRutaCount: build.query<
        RolAccesoRutaCountApiResponse,
        RolAccesoRutaCountApiArg
      >({
        query: () => ({ url: `/api/rolaccesoruta/count` }),
        providesTags: ["RolAccesoRuta"],
      }),
      rolAccesoRutaCountAsync: build.query<
        RolAccesoRutaCountAsyncApiResponse,
        RolAccesoRutaCountAsyncApiArg
      >({
        query: () => ({ url: `/api/rolaccesoruta/count-async` }),
        providesTags: ["RolAccesoRuta"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type CatalogoInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type CatalogoInsertApiArg = {
  catalogDto: CatalogDto;
};
export type CatalogoInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CatalogoInsertAsyncApiArg = {
  catalogDto: CatalogDto;
};
export type CatalogoUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type CatalogoUpdateApiArg = {
  id: number;
  catalogDto: CatalogDto;
};
export type CatalogoUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CatalogoUpdateAsyncApiArg = {
  id: number;
  catalogDto: CatalogDto;
};
export type CatalogoDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type CatalogoDeleteApiArg = {
  id: number;
};
export type CatalogoDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CatalogoDeleteAsyncApiArg = {
  id: number;
};
export type CatalogoGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfCatalogDto;
export type CatalogoGetAllApiArg = void;
export type CatalogoGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfCatalogDto;
export type CatalogoGetAllAsyncApiArg = void;
export type CatalogoGetByIdApiResponse =
  /** status 200 OK */ ResponseOfCatalogDto;
export type CatalogoGetByIdApiArg = {
  id: number;
};
export type CatalogoGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfCatalogDto;
export type CatalogoGetByIdAsyncApiArg = {
  id: number;
};
export type CatalogoGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfCatalogDto;
export type CatalogoGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type CatalogoGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfCatalogDto;
export type CatalogoGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type CatalogoCountApiResponse = /** status 200 OK */ ResponseOfint;
export type CatalogoCountApiArg = void;
export type CatalogoCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type CatalogoCountAsyncApiArg = void;
export type AreaInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type AreaInsertApiArg = {
  areaDto: AreaDto;
};
export type AreaInsertAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type AreaInsertAsyncApiArg = {
  areaDto: AreaDto;
};
export type AreaUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type AreaUpdateApiArg = {
  id: number;
  areaDto: AreaDto;
};
export type AreaUpdateAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type AreaUpdateAsyncApiArg = {
  id: number;
  areaDto: AreaDto;
};
export type AreaDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type AreaDeleteApiArg = {
  id: number;
};
export type AreaDeleteAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type AreaDeleteAsyncApiArg = {
  id: number;
};
export type AreaGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfAreaDto;
export type AreaGetAllApiArg = void;
export type AreaGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfAreaDto;
export type AreaGetAllAsyncApiArg = void;
export type AreaGetByIdApiResponse = /** status 200 OK */ ResponseOfAreaDto;
export type AreaGetByIdApiArg = {
  id: number;
};
export type AreaGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfAreaDto;
export type AreaGetByIdAsyncApiArg = {
  id: number;
};
export type AreaGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfAreaDto;
export type AreaGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type AreaGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfAreaDto;
export type AreaGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type AreaCountApiResponse = /** status 200 OK */ ResponseOfint;
export type AreaCountApiArg = void;
export type AreaCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type AreaCountAsyncApiArg = void;
export type CategoriaMenuInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CategoriaMenuInsertApiArg = {
  categoriaMenuDto: CategoriaMenuDto;
};
export type CategoriaMenuInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CategoriaMenuInsertAsyncApiArg = {
  categoriaMenuDto: CategoriaMenuDto;
};
export type CategoriaMenuUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CategoriaMenuUpdateApiArg = {
  id: number;
  categoriaMenuDto: CategoriaMenuDto;
};
export type CategoriaMenuUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CategoriaMenuUpdateAsyncApiArg = {
  id: number;
  categoriaMenuDto: CategoriaMenuDto;
};
export type CategoriaMenuDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CategoriaMenuDeleteApiArg = {
  id: number;
};
export type CategoriaMenuDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CategoriaMenuDeleteAsyncApiArg = {
  id: number;
};
export type CategoriaMenuGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfCategoriaMenuDto;
export type CategoriaMenuGetAllApiArg = void;
export type CategoriaMenuGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfCategoriaMenuDto;
export type CategoriaMenuGetAllAsyncApiArg = void;
export type CategoriaMenuGetByIdApiResponse =
  /** status 200 OK */ ResponseOfCategoriaMenuDto;
export type CategoriaMenuGetByIdApiArg = {
  id: number;
};
export type CategoriaMenuGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfCategoriaMenuDto;
export type CategoriaMenuGetByIdAsyncApiArg = {
  id: number;
};
export type CategoriaMenuGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfCategoriaMenuDto;
export type CategoriaMenuGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type CategoriaMenuGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfCategoriaMenuDto;
export type CategoriaMenuGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type CategoriaMenuCountApiResponse = /** status 200 OK */ ResponseOfint;
export type CategoriaMenuCountApiArg = void;
export type CategoriaMenuCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type CategoriaMenuCountAsyncApiArg = void;
export type ClienteInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type ClienteInsertApiArg = {
  clienteDto: ClienteDto;
};
export type ClienteInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type ClienteInsertAsyncApiArg = {
  clienteDto: ClienteDto;
};
export type ClienteUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type ClienteUpdateApiArg = {
  id: number;
  clienteDto: ClienteDto;
};
export type ClienteUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type ClienteUpdateAsyncApiArg = {
  id: number;
  clienteDto: ClienteDto;
};
export type ClienteDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type ClienteDeleteApiArg = {
  id: number;
};
export type ClienteDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type ClienteDeleteAsyncApiArg = {
  id: number;
};
export type ClienteGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfClienteDto;
export type ClienteGetAllApiArg = void;
export type ClienteGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfClienteDto;
export type ClienteGetAllAsyncApiArg = void;
export type ClienteGetByIdApiResponse =
  /** status 200 OK */ ResponseOfClienteDto;
export type ClienteGetByIdApiArg = {
  id: number;
};
export type ClienteGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfClienteDto;
export type ClienteGetByIdAsyncApiArg = {
  id: number;
};
export type ClienteGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfClienteDto;
export type ClienteGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type ClienteGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfClienteDto;
export type ClienteGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type ClienteCountApiResponse = /** status 200 OK */ ResponseOfint;
export type ClienteCountApiArg = void;
export type ClienteCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type ClienteCountAsyncApiArg = void;
export type AuthLoginApiResponse =
  /** status 200 OK */ ResponseOfAuthResponseDto;
export type AuthLoginApiArg = {
  loginRequest: LoginRequest;
};
export type AuthMeApiResponse = /** status 200 OK */ ResponseOfAuthMeDto;
export type AuthMeApiArg = void;
export type CuentaInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type CuentaInsertApiArg = {
  cuentaDto: CuentaDto;
};
export type CuentaInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CuentaInsertAsyncApiArg = {
  cuentaDto: CuentaDto;
};
export type CuentaUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type CuentaUpdateApiArg = {
  id: number;
  cuentaDto: CuentaDto;
};
export type CuentaUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CuentaUpdateAsyncApiArg = {
  id: number;
  cuentaDto: CuentaDto;
};
export type CuentaDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type CuentaDeleteApiArg = {
  id: number;
};
export type CuentaDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CuentaDeleteAsyncApiArg = {
  id: number;
};
export type CuentaGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfCuentaDto;
export type CuentaGetAllApiArg = void;
export type CuentaGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfCuentaDto;
export type CuentaGetAllAsyncApiArg = void;
export type CuentaGetByIdApiResponse = /** status 200 OK */ ResponseOfCuentaDto;
export type CuentaGetByIdApiArg = {
  id: number;
};
export type CuentaGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfCuentaDto;
export type CuentaGetByIdAsyncApiArg = {
  id: number;
};
export type DescuentoAplicadoInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type DescuentoAplicadoInsertApiArg = {
  descuentoAplicadoDto: DescuentoAplicadoDto;
};
export type DescuentoAplicadoInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type DescuentoAplicadoInsertAsyncApiArg = {
  descuentoAplicadoDto: DescuentoAplicadoDto;
};
export type DescuentoAplicadoUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type DescuentoAplicadoUpdateApiArg = {
  id: number;
  descuentoAplicadoDto: DescuentoAplicadoDto;
};
export type DescuentoAplicadoUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type DescuentoAplicadoUpdateAsyncApiArg = {
  id: number;
  descuentoAplicadoDto: DescuentoAplicadoDto;
};
export type DescuentoAplicadoDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type DescuentoAplicadoDeleteApiArg = {
  id: number;
};
export type DescuentoAplicadoDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type DescuentoAplicadoDeleteAsyncApiArg = {
  id: number;
};
export type DescuentoAplicadoGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfDescuentoAplicadoDto;
export type DescuentoAplicadoGetAllApiArg = void;
export type DescuentoAplicadoGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfDescuentoAplicadoDto;
export type DescuentoAplicadoGetAllAsyncApiArg = void;
export type DescuentoAplicadoGetByIdApiResponse =
  /** status 200 OK */ ResponseOfDescuentoAplicadoDto;
export type DescuentoAplicadoGetByIdApiArg = {
  id: number;
};
export type DescuentoAplicadoGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfDescuentoAplicadoDto;
export type DescuentoAplicadoGetByIdAsyncApiArg = {
  id: number;
};
export type DescuentoAplicadoGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfDescuentoAplicadoDto;
export type DescuentoAplicadoGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type DescuentoAplicadoGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfDescuentoAplicadoDto;
export type DescuentoAplicadoGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type DescuentoAplicadoCountApiResponse =
  /** status 200 OK */ ResponseOfint;
export type DescuentoAplicadoCountApiArg = void;
export type DescuentoAplicadoCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type DescuentoAplicadoCountAsyncApiArg = void;
export type DetalleCuentaInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type DetalleCuentaInsertApiArg = {
  detalleCuentaDto: DetalleCuentaDto;
};
export type DetalleCuentaInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type DetalleCuentaInsertAsyncApiArg = {
  detalleCuentaDto: DetalleCuentaDto;
};
export type DetalleCuentaUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type DetalleCuentaUpdateApiArg = {
  id: number;
  detalleCuentaDto: DetalleCuentaDto;
};
export type DetalleCuentaUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type DetalleCuentaUpdateAsyncApiArg = {
  id: number;
  detalleCuentaDto: DetalleCuentaDto;
};
export type DetalleCuentaDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type DetalleCuentaDeleteApiArg = {
  id: number;
};
export type DetalleCuentaDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type DetalleCuentaDeleteAsyncApiArg = {
  id: number;
};
export type DetalleCuentaGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfDetalleCuentaDto;
export type DetalleCuentaGetAllApiArg = void;
export type DetalleCuentaGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfDetalleCuentaDto;
export type DetalleCuentaGetAllAsyncApiArg = void;
export type DetalleCuentaGetByIdApiResponse =
  /** status 200 OK */ ResponseOfDetalleCuentaDto;
export type DetalleCuentaGetByIdApiArg = {
  id: number;
};
export type DetalleCuentaGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfDetalleCuentaDto;
export type DetalleCuentaGetByIdAsyncApiArg = {
  id: number;
};
export type DetalleCuentaGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfDetalleCuentaDto;
export type DetalleCuentaGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type DetalleCuentaGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfDetalleCuentaDto;
export type DetalleCuentaGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type DetalleCuentaCountApiResponse = /** status 200 OK */ ResponseOfint;
export type DetalleCuentaCountApiArg = void;
export type DetalleCuentaCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type DetalleCuentaCountAsyncApiArg = void;
export type EmpresaInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type EmpresaInsertApiArg = {
  empresaDto: EmpresaDto;
};
export type EmpresaInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EmpresaInsertAsyncApiArg = {
  empresaDto: EmpresaDto;
};
export type EmpresaUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type EmpresaUpdateApiArg = {
  id: number;
  empresaDto: EmpresaDto;
};
export type EmpresaUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EmpresaUpdateAsyncApiArg = {
  id: number;
  empresaDto: EmpresaDto;
};
export type EmpresaDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type EmpresaDeleteApiArg = {
  id: number;
};
export type EmpresaDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EmpresaDeleteAsyncApiArg = {
  id: number;
};
export type EmpresaGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfEmpresaDto;
export type EmpresaGetAllApiArg = void;
export type EmpresaGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfEmpresaDto;
export type EmpresaGetAllAsyncApiArg = void;
export type EmpresaGetByIdApiResponse =
  /** status 200 OK */ ResponseOfEmpresaDto;
export type EmpresaGetByIdApiArg = {
  id: number;
};
export type EmpresaGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfEmpresaDto;
export type EmpresaGetByIdAsyncApiArg = {
  id: number;
};
export type EmpresaGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfEmpresaDto;
export type EmpresaGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type EmpresaGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfEmpresaDto;
export type EmpresaGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type EmpresaCountApiResponse = /** status 200 OK */ ResponseOfint;
export type EmpresaCountApiArg = void;
export type EmpresaCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type EmpresaCountAsyncApiArg = void;
export type EstacionCocinaInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EstacionCocinaInsertApiArg = {
  estacionCocinaDto: EstacionCocinaDto;
};
export type EstacionCocinaInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EstacionCocinaInsertAsyncApiArg = {
  estacionCocinaDto: EstacionCocinaDto;
};
export type EstacionCocinaUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EstacionCocinaUpdateApiArg = {
  id: number;
  estacionCocinaDto: EstacionCocinaDto;
};
export type EstacionCocinaUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EstacionCocinaUpdateAsyncApiArg = {
  id: number;
  estacionCocinaDto: EstacionCocinaDto;
};
export type EstacionCocinaDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EstacionCocinaDeleteApiArg = {
  id: number;
};
export type EstacionCocinaDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EstacionCocinaDeleteAsyncApiArg = {
  id: number;
};
export type EstacionCocinaGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfEstacionCocinaDto;
export type EstacionCocinaGetAllApiArg = void;
export type EstacionCocinaGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfEstacionCocinaDto;
export type EstacionCocinaGetAllAsyncApiArg = void;
export type EstacionCocinaGetByIdApiResponse =
  /** status 200 OK */ ResponseOfEstacionCocinaDto;
export type EstacionCocinaGetByIdApiArg = {
  id: number;
};
export type EstacionCocinaGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfEstacionCocinaDto;
export type EstacionCocinaGetByIdAsyncApiArg = {
  id: number;
};
export type EstacionCocinaGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfEstacionCocinaDto;
export type EstacionCocinaGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type EstacionCocinaGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfEstacionCocinaDto;
export type EstacionCocinaGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type EstacionCocinaCountApiResponse = /** status 200 OK */ ResponseOfint;
export type EstacionCocinaCountApiArg = void;
export type EstacionCocinaCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type EstacionCocinaCountAsyncApiArg = void;
export type EventoPedidoInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EventoPedidoInsertApiArg = {
  eventoPedidoDto: EventoPedidoDto;
};
export type EventoPedidoInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EventoPedidoInsertAsyncApiArg = {
  eventoPedidoDto: EventoPedidoDto;
};
export type EventoPedidoUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EventoPedidoUpdateApiArg = {
  id: number;
  eventoPedidoDto: EventoPedidoDto;
};
export type EventoPedidoUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EventoPedidoUpdateAsyncApiArg = {
  id: number;
  eventoPedidoDto: EventoPedidoDto;
};
export type EventoPedidoDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EventoPedidoDeleteApiArg = {
  id: number;
};
export type EventoPedidoDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EventoPedidoDeleteAsyncApiArg = {
  id: number;
};
export type EventoPedidoGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfEventoPedidoDto;
export type EventoPedidoGetAllApiArg = void;
export type EventoPedidoGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfEventoPedidoDto;
export type EventoPedidoGetAllAsyncApiArg = void;
export type EventoPedidoGetByIdApiResponse =
  /** status 200 OK */ ResponseOfEventoPedidoDto;
export type EventoPedidoGetByIdApiArg = {
  id: number;
};
export type EventoPedidoGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfEventoPedidoDto;
export type EventoPedidoGetByIdAsyncApiArg = {
  id: number;
};
export type EventoPedidoGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfEventoPedidoDto;
export type EventoPedidoGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type EventoPedidoGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfEventoPedidoDto;
export type EventoPedidoGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type EventoPedidoCountApiResponse = /** status 200 OK */ ResponseOfint;
export type EventoPedidoCountApiArg = void;
export type EventoPedidoCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type EventoPedidoCountAsyncApiArg = void;
export type GrupoModificadorInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type GrupoModificadorInsertApiArg = {
  grupoModificadorDto: GrupoModificadorDto;
};
export type GrupoModificadorInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type GrupoModificadorInsertAsyncApiArg = {
  grupoModificadorDto: GrupoModificadorDto;
};
export type GrupoModificadorUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type GrupoModificadorUpdateApiArg = {
  id: number;
  grupoModificadorDto: GrupoModificadorDto;
};
export type GrupoModificadorUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type GrupoModificadorUpdateAsyncApiArg = {
  id: number;
  grupoModificadorDto: GrupoModificadorDto;
};
export type GrupoModificadorDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type GrupoModificadorDeleteApiArg = {
  id: number;
};
export type GrupoModificadorDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type GrupoModificadorDeleteAsyncApiArg = {
  id: number;
};
export type GrupoModificadorGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfGrupoModificadorDto;
export type GrupoModificadorGetAllApiArg = void;
export type GrupoModificadorGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfGrupoModificadorDto;
export type GrupoModificadorGetAllAsyncApiArg = void;
export type GrupoModificadorGetByIdApiResponse =
  /** status 200 OK */ ResponseOfGrupoModificadorDto;
export type GrupoModificadorGetByIdApiArg = {
  id: number;
};
export type GrupoModificadorGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfGrupoModificadorDto;
export type GrupoModificadorGetByIdAsyncApiArg = {
  id: number;
};
export type GrupoModificadorGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfGrupoModificadorDto;
export type GrupoModificadorGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type GrupoModificadorGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfGrupoModificadorDto;
export type GrupoModificadorGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type GrupoModificadorCountApiResponse =
  /** status 200 OK */ ResponseOfint;
export type GrupoModificadorCountApiArg = void;
export type GrupoModificadorCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type GrupoModificadorCountAsyncApiArg = void;
export type MenuInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type MenuInsertApiArg = {
  menuDto: MenuDto;
};
export type MenuInsertAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type MenuInsertAsyncApiArg = {
  menuDto: MenuDto;
};
export type MenuUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type MenuUpdateApiArg = {
  id: number;
  menuDto: MenuDto;
};
export type MenuUpdateAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type MenuUpdateAsyncApiArg = {
  id: number;
  menuDto: MenuDto;
};
export type MenuDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type MenuDeleteApiArg = {
  id: number;
};
export type MenuDeleteAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type MenuDeleteAsyncApiArg = {
  id: number;
};
export type MenuGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfMenuDto;
export type MenuGetAllApiArg = void;
export type MenuGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfMenuDto;
export type MenuGetAllAsyncApiArg = void;
export type MenuGetByIdApiResponse = /** status 200 OK */ ResponseOfMenuDto;
export type MenuGetByIdApiArg = {
  id: number;
};
export type MenuGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfMenuDto;
export type MenuGetByIdAsyncApiArg = {
  id: number;
};
export type MenuGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfMenuDto;
export type MenuGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type MenuGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfMenuDto;
export type MenuGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type MenuCountApiResponse = /** status 200 OK */ ResponseOfint;
export type MenuCountApiArg = void;
export type MenuCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type MenuCountAsyncApiArg = void;
export type MesaInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type MesaInsertApiArg = {
  mesaDto: MesaDto;
};
export type MesaInsertAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type MesaInsertAsyncApiArg = {
  mesaDto: MesaDto;
};
export type MesaUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type MesaUpdateApiArg = {
  id: number;
  mesaDto: MesaDto;
};
export type MesaUpdateAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type MesaUpdateAsyncApiArg = {
  id: number;
  mesaDto: MesaDto;
};
export type MesaDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type MesaDeleteApiArg = {
  id: number;
};
export type MesaDeleteAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type MesaDeleteAsyncApiArg = {
  id: number;
};
export type MesaGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfMesaDto;
export type MesaGetAllApiArg = void;
export type MesaGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfMesaDto;
export type MesaGetAllAsyncApiArg = void;
export type MesaGetByIdApiResponse = /** status 200 OK */ ResponseOfMesaDto;
export type MesaGetByIdApiArg = {
  id: number;
};
export type MesaGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfMesaDto;
export type MesaGetByIdAsyncApiArg = {
  id: number;
};
export type MesaGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfMesaDto;
export type MesaGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type MesaGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfMesaDto;
export type MesaGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type MesaCountApiResponse = /** status 200 OK */ ResponseOfint;
export type MesaCountApiArg = void;
export type MesaCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type MesaCountAsyncApiArg = void;
export type MovimientoCajaInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type MovimientoCajaInsertApiArg = {
  movimientoCajaDto: MovimientoCajaDto;
};
export type MovimientoCajaInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type MovimientoCajaInsertAsyncApiArg = {
  movimientoCajaDto: MovimientoCajaDto;
};
export type MovimientoCajaUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type MovimientoCajaUpdateApiArg = {
  id: number;
  movimientoCajaDto: MovimientoCajaDto;
};
export type MovimientoCajaUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type MovimientoCajaUpdateAsyncApiArg = {
  id: number;
  movimientoCajaDto: MovimientoCajaDto;
};
export type MovimientoCajaDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type MovimientoCajaDeleteApiArg = {
  id: number;
};
export type MovimientoCajaDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type MovimientoCajaDeleteAsyncApiArg = {
  id: number;
};
export type MovimientoCajaGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfMovimientoCajaDto;
export type MovimientoCajaGetAllApiArg = void;
export type MovimientoCajaGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfMovimientoCajaDto;
export type MovimientoCajaGetAllAsyncApiArg = void;
export type MovimientoCajaGetByIdApiResponse =
  /** status 200 OK */ ResponseOfMovimientoCajaDto;
export type MovimientoCajaGetByIdApiArg = {
  id: number;
};
export type MovimientoCajaGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfMovimientoCajaDto;
export type MovimientoCajaGetByIdAsyncApiArg = {
  id: number;
};
export type MovimientoCajaGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfMovimientoCajaDto;
export type MovimientoCajaGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type MovimientoCajaGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfMovimientoCajaDto;
export type MovimientoCajaGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type MovimientoCajaCountApiResponse = /** status 200 OK */ ResponseOfint;
export type MovimientoCajaCountApiArg = void;
export type MovimientoCajaCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type MovimientoCajaCountAsyncApiArg = void;
export type OpcionModificadorInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type OpcionModificadorInsertApiArg = {
  opcionModificadorDto: OpcionModificadorDto;
};
export type OpcionModificadorInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type OpcionModificadorInsertAsyncApiArg = {
  opcionModificadorDto: OpcionModificadorDto;
};
export type OpcionModificadorUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type OpcionModificadorUpdateApiArg = {
  id: number;
  opcionModificadorDto: OpcionModificadorDto;
};
export type OpcionModificadorUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type OpcionModificadorUpdateAsyncApiArg = {
  id: number;
  opcionModificadorDto: OpcionModificadorDto;
};
export type OpcionModificadorDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type OpcionModificadorDeleteApiArg = {
  id: number;
};
export type OpcionModificadorDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type OpcionModificadorDeleteAsyncApiArg = {
  id: number;
};
export type OpcionModificadorGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfOpcionModificadorDto;
export type OpcionModificadorGetAllApiArg = void;
export type OpcionModificadorGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfOpcionModificadorDto;
export type OpcionModificadorGetAllAsyncApiArg = void;
export type OpcionModificadorGetByIdApiResponse =
  /** status 200 OK */ ResponseOfOpcionModificadorDto;
export type OpcionModificadorGetByIdApiArg = {
  id: number;
};
export type OpcionModificadorGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfOpcionModificadorDto;
export type OpcionModificadorGetByIdAsyncApiArg = {
  id: number;
};
export type OpcionModificadorGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfOpcionModificadorDto;
export type OpcionModificadorGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type OpcionModificadorGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfOpcionModificadorDto;
export type OpcionModificadorGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type OpcionModificadorCountApiResponse =
  /** status 200 OK */ ResponseOfint;
export type OpcionModificadorCountApiArg = void;
export type OpcionModificadorCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type OpcionModificadorCountAsyncApiArg = void;
export type PagoInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type PagoInsertApiArg = {
  pagoDto: PagoDto;
};
export type PagoInsertAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type PagoInsertAsyncApiArg = {
  pagoDto: PagoDto;
};
export type PagoUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type PagoUpdateApiArg = {
  id: number;
  pagoDto: PagoDto;
};
export type PagoUpdateAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type PagoUpdateAsyncApiArg = {
  id: number;
  pagoDto: PagoDto;
};
export type PagoDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type PagoDeleteApiArg = {
  id: number;
};
export type PagoDeleteAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type PagoDeleteAsyncApiArg = {
  id: number;
};
export type PagoGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfPagoDto;
export type PagoGetAllApiArg = void;
export type PagoGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfPagoDto;
export type PagoGetAllAsyncApiArg = void;
export type PagoGetByIdApiResponse = /** status 200 OK */ ResponseOfPagoDto;
export type PagoGetByIdApiArg = {
  id: number;
};
export type PagoGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfPagoDto;
export type PagoGetByIdAsyncApiArg = {
  id: number;
};
export type PagoGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfPagoDto;
export type PagoGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type PagoGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfPagoDto;
export type PagoGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type PagoCountApiResponse = /** status 200 OK */ ResponseOfint;
export type PagoCountApiArg = void;
export type PagoCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type PagoCountAsyncApiArg = void;
export type PedidoInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type PedidoInsertApiArg = {
  pedidoDto: PedidoDto;
};
export type PedidoInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoInsertAsyncApiArg = {
  pedidoDto: PedidoDto;
};
export type PedidoUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type PedidoUpdateApiArg = {
  id: number;
  pedidoDto: PedidoDto;
};
export type PedidoUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoUpdateAsyncApiArg = {
  id: number;
  pedidoDto: PedidoDto;
};
export type PedidoDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type PedidoDeleteApiArg = {
  id: number;
};
export type PedidoDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoDeleteAsyncApiArg = {
  id: number;
};
export type PedidoGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfPedidoDto;
export type PedidoGetAllApiArg = void;
export type PedidoGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfPedidoDto;
export type PedidoGetAllAsyncApiArg = void;
export type PedidoGetByIdApiResponse = /** status 200 OK */ ResponseOfPedidoDto;
export type PedidoGetByIdApiArg = {
  id: number;
};
export type PedidoGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfPedidoDto;
export type PedidoGetByIdAsyncApiArg = {
  id: number;
};
export type PedidoGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfPedidoDto;
export type PedidoGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type PedidoGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfPedidoDto;
export type PedidoGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type PedidoCountApiResponse = /** status 200 OK */ ResponseOfint;
export type PedidoCountApiArg = void;
export type PedidoCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type PedidoCountAsyncApiArg = void;
export type PedidoAsientoInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoAsientoInsertApiArg = {
  pedidoAsientoDto: PedidoAsientoDto;
};
export type PedidoAsientoInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoAsientoInsertAsyncApiArg = {
  pedidoAsientoDto: PedidoAsientoDto;
};
export type PedidoAsientoUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoAsientoUpdateApiArg = {
  id: number;
  pedidoAsientoDto: PedidoAsientoDto;
};
export type PedidoAsientoUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoAsientoUpdateAsyncApiArg = {
  id: number;
  pedidoAsientoDto: PedidoAsientoDto;
};
export type PedidoAsientoDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoAsientoDeleteApiArg = {
  id: number;
};
export type PedidoAsientoDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoAsientoDeleteAsyncApiArg = {
  id: number;
};
export type PedidoAsientoGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfPedidoAsientoDto;
export type PedidoAsientoGetAllApiArg = void;
export type PedidoAsientoGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfPedidoAsientoDto;
export type PedidoAsientoGetAllAsyncApiArg = void;
export type PedidoAsientoGetByIdApiResponse =
  /** status 200 OK */ ResponseOfPedidoAsientoDto;
export type PedidoAsientoGetByIdApiArg = {
  id: number;
};
export type PedidoAsientoGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfPedidoAsientoDto;
export type PedidoAsientoGetByIdAsyncApiArg = {
  id: number;
};
export type PedidoAsientoGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfPedidoAsientoDto;
export type PedidoAsientoGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type PedidoAsientoGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfPedidoAsientoDto;
export type PedidoAsientoGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type PedidoAsientoCountApiResponse = /** status 200 OK */ ResponseOfint;
export type PedidoAsientoCountApiArg = void;
export type PedidoAsientoCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type PedidoAsientoCountAsyncApiArg = void;
export type PedidoDetalleInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoDetalleInsertApiArg = {
  pedidoDetalleDto: PedidoDetalleDto;
};
export type PedidoDetalleInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoDetalleInsertAsyncApiArg = {
  pedidoDetalleDto: PedidoDetalleDto;
};
export type PedidoDetalleUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoDetalleUpdateApiArg = {
  id: number;
  pedidoDetalleDto: PedidoDetalleDto;
};
export type PedidoDetalleUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoDetalleUpdateAsyncApiArg = {
  id: number;
  pedidoDetalleDto: PedidoDetalleDto;
};
export type PedidoDetalleDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoDetalleDeleteApiArg = {
  id: number;
};
export type PedidoDetalleDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoDetalleDeleteAsyncApiArg = {
  id: number;
};
export type PedidoDetalleGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfPedidoDetalleDto;
export type PedidoDetalleGetAllApiArg = void;
export type PedidoDetalleGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfPedidoDetalleDto;
export type PedidoDetalleGetAllAsyncApiArg = void;
export type PedidoDetalleGetByIdApiResponse =
  /** status 200 OK */ ResponseOfPedidoDetalleDto;
export type PedidoDetalleGetByIdApiArg = {
  id: number;
};
export type PedidoDetalleGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfPedidoDetalleDto;
export type PedidoDetalleGetByIdAsyncApiArg = {
  id: number;
};
export type PedidoDetalleGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfPedidoDetalleDto;
export type PedidoDetalleGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type PedidoDetalleGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfPedidoDetalleDto;
export type PedidoDetalleGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type PedidoDetalleCountApiResponse = /** status 200 OK */ ResponseOfint;
export type PedidoDetalleCountApiArg = void;
export type PedidoDetalleCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type PedidoDetalleCountAsyncApiArg = void;
export type PedidoModificadorInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoModificadorInsertApiArg = {
  pedidoModificadorDto: PedidoModificadorDto;
};
export type PedidoModificadorInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoModificadorInsertAsyncApiArg = {
  pedidoModificadorDto: PedidoModificadorDto;
};
export type PedidoModificadorUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoModificadorUpdateApiArg = {
  id: number;
  pedidoModificadorDto: PedidoModificadorDto;
};
export type PedidoModificadorUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoModificadorUpdateAsyncApiArg = {
  id: number;
  pedidoModificadorDto: PedidoModificadorDto;
};
export type PedidoModificadorDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoModificadorDeleteApiArg = {
  id: number;
};
export type PedidoModificadorDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PedidoModificadorDeleteAsyncApiArg = {
  id: number;
};
export type PedidoModificadorGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfPedidoModificadorDto;
export type PedidoModificadorGetAllApiArg = void;
export type PedidoModificadorGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfPedidoModificadorDto;
export type PedidoModificadorGetAllAsyncApiArg = void;
export type PedidoModificadorGetByIdApiResponse =
  /** status 200 OK */ ResponseOfPedidoModificadorDto;
export type PedidoModificadorGetByIdApiArg = {
  id: number;
};
export type PedidoModificadorGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfPedidoModificadorDto;
export type PedidoModificadorGetByIdAsyncApiArg = {
  id: number;
};
export type PedidoModificadorGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfPedidoModificadorDto;
export type PedidoModificadorGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type PedidoModificadorGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfPedidoModificadorDto;
export type PedidoModificadorGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type PedidoModificadorCountApiResponse =
  /** status 200 OK */ ResponseOfint;
export type PedidoModificadorCountApiArg = void;
export type PedidoModificadorCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type PedidoModificadorCountAsyncApiArg = void;
export type PrecioInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type PrecioInsertApiArg = {
  precioDto: PrecioDto;
};
export type PrecioInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PrecioInsertAsyncApiArg = {
  precioDto: PrecioDto;
};
export type PrecioUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type PrecioUpdateApiArg = {
  id: number;
  precioDto: PrecioDto;
};
export type PrecioUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PrecioUpdateAsyncApiArg = {
  id: number;
  precioDto: PrecioDto;
};
export type PrecioDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type PrecioDeleteApiArg = {
  id: number;
};
export type PrecioDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PrecioDeleteAsyncApiArg = {
  id: number;
};
export type PrecioGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfPrecioDto;
export type PrecioGetAllApiArg = void;
export type PrecioGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfPrecioDto;
export type PrecioGetAllAsyncApiArg = void;
export type PrecioGetByIdApiResponse = /** status 200 OK */ ResponseOfPrecioDto;
export type PrecioGetByIdApiArg = {
  id: number;
};
export type PrecioGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfPrecioDto;
export type PrecioGetByIdAsyncApiArg = {
  id: number;
};
export type PrecioGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfPrecioDto;
export type PrecioGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type PrecioGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfPrecioDto;
export type PrecioGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type PrecioCountApiResponse = /** status 200 OK */ ResponseOfint;
export type PrecioCountApiArg = void;
export type PrecioCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type PrecioCountAsyncApiArg = void;
export type ProductoInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type ProductoInsertApiArg = {
  productoDto: ProductoDto;
};
export type ProductoInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type ProductoInsertAsyncApiArg = {
  productoDto: ProductoDto;
};
export type ProductoUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type ProductoUpdateApiArg = {
  id: number;
  productoDto: ProductoDto;
};
export type ProductoUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type ProductoUpdateAsyncApiArg = {
  id: number;
  productoDto: ProductoDto;
};
export type ProductoDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type ProductoDeleteApiArg = {
  id: number;
};
export type ProductoDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type ProductoDeleteAsyncApiArg = {
  id: number;
};
export type ProductoGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfProductoDto;
export type ProductoGetAllApiArg = void;
export type ProductoGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfProductoDto;
export type ProductoGetAllAsyncApiArg = void;
export type ProductoGetByIdApiResponse =
  /** status 200 OK */ ResponseOfProductoDto;
export type ProductoGetByIdApiArg = {
  id: number;
};
export type ProductoGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfProductoDto;
export type ProductoGetByIdAsyncApiArg = {
  id: number;
};
export type ProductoGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfProductoDto;
export type ProductoGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type ProductoGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfProductoDto;
export type ProductoGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type ProductoCountApiResponse = /** status 200 OK */ ResponseOfint;
export type ProductoCountApiArg = void;
export type ProductoCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type ProductoCountAsyncApiArg = void;
export type RolInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type RolInsertApiArg = {
  rolDto: RolDto;
};
export type RolInsertAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type RolInsertAsyncApiArg = {
  rolDto: RolDto;
};
export type RolUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type RolUpdateApiArg = {
  id: number;
  rolDto: RolDto;
};
export type RolUpdateAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type RolUpdateAsyncApiArg = {
  id: number;
  rolDto: RolDto;
};
export type RolDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type RolDeleteApiArg = {
  id: number;
};
export type RolDeleteAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type RolDeleteAsyncApiArg = {
  id: number;
};
export type RolGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfRolDto;
export type RolGetAllApiArg = void;
export type RolGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfRolDto;
export type RolGetAllAsyncApiArg = void;
export type RolGetByIdApiResponse = /** status 200 OK */ ResponseOfRolDto;
export type RolGetByIdApiArg = {
  id: number;
};
export type RolGetByIdAsyncApiResponse = /** status 200 OK */ ResponseOfRolDto;
export type RolGetByIdAsyncApiArg = {
  id: number;
};
export type RolGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfRolDto;
export type RolGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type RolGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfRolDto;
export type RolGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type RolCountApiResponse = /** status 200 OK */ ResponseOfint;
export type RolCountApiArg = void;
export type RolCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type RolCountAsyncApiArg = void;
export type SucursalInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type SucursalInsertApiArg = {
  sucursalDto: SucursalDto;
};
export type SucursalInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type SucursalInsertAsyncApiArg = {
  sucursalDto: SucursalDto;
};
export type SucursalUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type SucursalUpdateApiArg = {
  id: number;
  sucursalDto: SucursalDto;
};
export type SucursalUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type SucursalUpdateAsyncApiArg = {
  id: number;
  sucursalDto: SucursalDto;
};
export type SucursalDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type SucursalDeleteApiArg = {
  id: number;
};
export type SucursalDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type SucursalDeleteAsyncApiArg = {
  id: number;
};
export type SucursalGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfSucursalDto;
export type SucursalGetAllApiArg = void;
export type SucursalGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfSucursalDto;
export type SucursalGetAllAsyncApiArg = void;
export type SucursalGetByIdApiResponse =
  /** status 200 OK */ ResponseOfSucursalDto;
export type SucursalGetByIdApiArg = {
  id: number;
};
export type SucursalGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfSucursalDto;
export type SucursalGetByIdAsyncApiArg = {
  id: number;
};
export type SucursalGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfSucursalDto;
export type SucursalGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type SucursalGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfSucursalDto;
export type SucursalGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type SucursalCountApiResponse = /** status 200 OK */ ResponseOfint;
export type SucursalCountApiArg = void;
export type SucursalCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type SucursalCountAsyncApiArg = void;
export type TicketCocinaInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type TicketCocinaInsertApiArg = {
  ticketCocinaDto: TicketCocinaDto;
};
export type TicketCocinaInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type TicketCocinaInsertAsyncApiArg = {
  ticketCocinaDto: TicketCocinaDto;
};
export type TicketCocinaUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type TicketCocinaUpdateApiArg = {
  id: number;
  ticketCocinaDto: TicketCocinaDto;
};
export type TicketCocinaUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type TicketCocinaUpdateAsyncApiArg = {
  id: number;
  ticketCocinaDto: TicketCocinaDto;
};
export type TicketCocinaDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type TicketCocinaDeleteApiArg = {
  id: number;
};
export type TicketCocinaDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type TicketCocinaDeleteAsyncApiArg = {
  id: number;
};
export type TicketCocinaGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfTicketCocinaDto;
export type TicketCocinaGetAllApiArg = void;
export type TicketCocinaGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfTicketCocinaDto;
export type TicketCocinaGetAllAsyncApiArg = void;
export type TicketCocinaGetByIdApiResponse =
  /** status 200 OK */ ResponseOfTicketCocinaDto;
export type TicketCocinaGetByIdApiArg = {
  id: number;
};
export type TicketCocinaGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfTicketCocinaDto;
export type TicketCocinaGetByIdAsyncApiArg = {
  id: number;
};
export type TicketCocinaGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfTicketCocinaDto;
export type TicketCocinaGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type TicketCocinaGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfTicketCocinaDto;
export type TicketCocinaGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type TicketCocinaCountApiResponse = /** status 200 OK */ ResponseOfint;
export type TicketCocinaCountApiArg = void;
export type TicketCocinaCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type TicketCocinaCountAsyncApiArg = void;
export type TicketDetalleInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type TicketDetalleInsertApiArg = {
  ticketDetalleDto: TicketDetalleDto;
};
export type TicketDetalleInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type TicketDetalleInsertAsyncApiArg = {
  ticketDetalleDto: TicketDetalleDto;
};
export type TicketDetalleUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type TicketDetalleUpdateApiArg = {
  id: number;
  ticketDetalleDto: TicketDetalleDto;
};
export type TicketDetalleUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type TicketDetalleUpdateAsyncApiArg = {
  id: number;
  ticketDetalleDto: TicketDetalleDto;
};
export type TicketDetalleDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type TicketDetalleDeleteApiArg = {
  id: number;
};
export type TicketDetalleDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type TicketDetalleDeleteAsyncApiArg = {
  id: number;
};
export type TicketDetalleGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfTicketDetalleDto;
export type TicketDetalleGetAllApiArg = void;
export type TicketDetalleGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfTicketDetalleDto;
export type TicketDetalleGetAllAsyncApiArg = void;
export type TicketDetalleGetByIdApiResponse =
  /** status 200 OK */ ResponseOfTicketDetalleDto;
export type TicketDetalleGetByIdApiArg = {
  id: number;
};
export type TicketDetalleGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfTicketDetalleDto;
export type TicketDetalleGetByIdAsyncApiArg = {
  id: number;
};
export type TicketDetalleGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfTicketDetalleDto;
export type TicketDetalleGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type TicketDetalleGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfTicketDetalleDto;
export type TicketDetalleGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type TicketDetalleCountApiResponse = /** status 200 OK */ ResponseOfint;
export type TicketDetalleCountApiArg = void;
export type TicketDetalleCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type TicketDetalleCountAsyncApiArg = void;
export type TurnoInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type TurnoInsertApiArg = {
  turnoDto: TurnoDto;
};
export type TurnoInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type TurnoInsertAsyncApiArg = {
  turnoDto: TurnoDto;
};
export type TurnoUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type TurnoUpdateApiArg = {
  id: number;
  turnoDto: TurnoDto;
};
export type TurnoUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type TurnoUpdateAsyncApiArg = {
  id: number;
  turnoDto: TurnoDto;
};
export type TurnoDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type TurnoDeleteApiArg = {
  id: number;
};
export type TurnoDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type TurnoDeleteAsyncApiArg = {
  id: number;
};
export type TurnoGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfTurnoDto;
export type TurnoGetAllApiArg = void;
export type TurnoGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfTurnoDto;
export type TurnoGetAllAsyncApiArg = void;
export type TurnoGetByIdApiResponse = /** status 200 OK */ ResponseOfTurnoDto;
export type TurnoGetByIdApiArg = {
  id: number;
};
export type TurnoGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfTurnoDto;
export type TurnoGetByIdAsyncApiArg = {
  id: number;
};
export type TurnoGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfTurnoDto;
export type TurnoGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type TurnoGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfTurnoDto;
export type TurnoGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type TurnoCountApiResponse = /** status 200 OK */ ResponseOfint;
export type TurnoCountApiArg = void;
export type TurnoCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type TurnoCountAsyncApiArg = void;
export type UsuarioInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type UsuarioInsertApiArg = {
  usuarioDto: UsuarioDto;
};
export type UsuarioInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type UsuarioInsertAsyncApiArg = {
  usuarioDto: UsuarioDto;
};
export type UsuarioUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type UsuarioUpdateApiArg = {
  id: number;
  usuarioDto: UsuarioDto;
};
export type UsuarioUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type UsuarioUpdateAsyncApiArg = {
  id: number;
  usuarioDto: UsuarioDto;
};
export type UsuarioDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type UsuarioDeleteApiArg = {
  id: number;
};
export type UsuarioDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type UsuarioDeleteAsyncApiArg = {
  id: number;
};
export type UsuarioGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfUsuarioDto;
export type UsuarioGetAllApiArg = void;
export type UsuarioGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfUsuarioDto;
export type UsuarioGetAllAsyncApiArg = void;
export type UsuarioGetByIdApiResponse =
  /** status 200 OK */ ResponseOfUsuarioDto;
export type UsuarioGetByIdApiArg = {
  id: number;
};
export type UsuarioGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfUsuarioDto;
export type UsuarioGetByIdAsyncApiArg = {
  id: number;
};
export type UsuarioGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfUsuarioDto;
export type UsuarioGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type UsuarioGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfUsuarioDto;
export type UsuarioGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type UsuarioCountApiResponse = /** status 200 OK */ ResponseOfint;
export type UsuarioCountApiArg = void;
export type UsuarioCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type UsuarioCountAsyncApiArg = void;
export type UsuarioRolInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type UsuarioRolInsertApiArg = {
  usuarioRolDto: UsuarioRolDto;
};
export type UsuarioRolInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type UsuarioRolInsertAsyncApiArg = {
  usuarioRolDto: UsuarioRolDto;
};
export type UsuarioRolUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type UsuarioRolUpdateApiArg = {
  id: number;
  usuarioRolDto: UsuarioRolDto;
};
export type UsuarioRolUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type UsuarioRolUpdateAsyncApiArg = {
  id: number;
  usuarioRolDto: UsuarioRolDto;
};
export type UsuarioRolDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type UsuarioRolDeleteApiArg = {
  id: number;
};
export type UsuarioRolDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type UsuarioRolDeleteAsyncApiArg = {
  id: number;
};
export type UsuarioRolGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfUsuarioRolDto;
export type UsuarioRolGetAllApiArg = void;
export type UsuarioRolGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfUsuarioRolDto;
export type UsuarioRolGetAllAsyncApiArg = void;
export type UsuarioRolGetByIdApiResponse =
  /** status 200 OK */ ResponseOfUsuarioRolDto;
export type UsuarioRolGetByIdApiArg = {
  id: number;
};
export type UsuarioRolGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfUsuarioRolDto;
export type UsuarioRolGetByIdAsyncApiArg = {
  id: number;
};
export type UsuarioRolGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfUsuarioRolDto;
export type UsuarioRolGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type UsuarioRolGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfUsuarioRolDto;
export type UsuarioRolGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type UsuarioRolCountApiResponse = /** status 200 OK */ ResponseOfint;
export type UsuarioRolCountApiArg = void;
export type UsuarioRolCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type UsuarioRolCountAsyncApiArg = void;
export type VarianteProductoInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type VarianteProductoInsertApiArg = {
  varianteProductoDto: VarianteProductoDto;
};
export type VarianteProductoInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type VarianteProductoInsertAsyncApiArg = {
  varianteProductoDto: VarianteProductoDto;
};
export type VarianteProductoUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type VarianteProductoUpdateApiArg = {
  id: number;
  varianteProductoDto: VarianteProductoDto;
};
export type VarianteProductoUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type VarianteProductoUpdateAsyncApiArg = {
  id: number;
  varianteProductoDto: VarianteProductoDto;
};
export type VarianteProductoDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type VarianteProductoDeleteApiArg = {
  id: number;
};
export type VarianteProductoDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type VarianteProductoDeleteAsyncApiArg = {
  id: number;
};
export type VarianteProductoGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfVarianteProductoDto;
export type VarianteProductoGetAllApiArg = void;
export type VarianteProductoGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfVarianteProductoDto;
export type VarianteProductoGetAllAsyncApiArg = void;
export type VarianteProductoGetByIdApiResponse =
  /** status 200 OK */ ResponseOfVarianteProductoDto;
export type VarianteProductoGetByIdApiArg = {
  id: number;
};
export type VarianteProductoGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfVarianteProductoDto;
export type VarianteProductoGetByIdAsyncApiArg = {
  id: number;
};
export type VarianteProductoGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfVarianteProductoDto;
export type VarianteProductoGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type VarianteProductoGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfVarianteProductoDto;
export type VarianteProductoGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type VarianteProductoCountApiResponse =
  /** status 200 OK */ ResponseOfint;
export type VarianteProductoCountApiArg = void;
export type VarianteProductoCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type VarianteProductoCountAsyncApiArg = void;
export type FormFieldInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type FormFieldInsertApiArg = {
  formFieldDto: FormFieldDto;
};
export type FormFieldInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type FormFieldInsertAsyncApiArg = {
  formFieldDto: FormFieldDto;
};
export type FormFieldUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type FormFieldUpdateApiArg = {
  id: number;
  formFieldDto: FormFieldDto;
};
export type FormFieldUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type FormFieldUpdateAsyncApiArg = {
  id: number;
  formFieldDto: FormFieldDto;
};
export type FormFieldDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type FormFieldDeleteApiArg = {
  id: number;
};
export type FormFieldDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type FormFieldDeleteAsyncApiArg = {
  id: number;
};
export type FormFieldGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfFormFieldDto;
export type FormFieldGetAllApiArg = void;
export type FormFieldGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfFormFieldDto;
export type FormFieldGetAllAsyncApiArg = void;
export type FormFieldGetByIdApiResponse =
  /** status 200 OK */ ResponseOfFormFieldDto;
export type FormFieldGetByIdApiArg = {
  id: number;
};
export type FormFieldGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfFormFieldDto;
export type FormFieldGetByIdAsyncApiArg = {
  id: number;
};
export type FormFieldGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfFormFieldDto;
export type FormFieldGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type FormFieldGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfFormFieldDto;
export type FormFieldGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type FormFieldCountApiResponse = /** status 200 OK */ ResponseOfint;
export type FormFieldCountApiArg = void;
export type FormFieldCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type FormFieldCountAsyncApiArg = void;
export type FormFieldGetFormFieldByFormCatIdApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfFormFieldDto;
export type FormFieldGetFormFieldByFormCatIdApiArg = {
  code: string;
};
export type FormFieldGetFormFieldByFormCatIdAsyncAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfFormFieldDto;
export type FormFieldGetFormFieldByFormCatIdAsyncAsyncApiArg = {
  id: number;
};
export type AccesoRutaInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type AccesoRutaInsertApiArg = {
  accesoRutaDto: AccesoRutaDto;
};
export type AccesoRutaInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type AccesoRutaInsertAsyncApiArg = {
  accesoRutaDto: AccesoRutaDto;
};
export type AccesoRutaUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type AccesoRutaUpdateApiArg = {
  id: number;
  accesoRutaDto: AccesoRutaDto;
};
export type AccesoRutaUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type AccesoRutaUpdateAsyncApiArg = {
  id: number;
  accesoRutaDto: AccesoRutaDto;
};
export type AccesoRutaDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type AccesoRutaDeleteApiArg = {
  id: number;
};
export type AccesoRutaDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type AccesoRutaDeleteAsyncApiArg = {
  id: number;
};
export type AccesoRutaGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfAccesoRutaDto;
export type AccesoRutaGetAllApiArg = void;
export type AccesoRutaGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfAccesoRutaDto;
export type AccesoRutaGetAllAsyncApiArg = void;
export type AccesoRutaGetByIdApiResponse =
  /** status 200 OK */ ResponseOfAccesoRutaDto;
export type AccesoRutaGetByIdApiArg = {
  id: number;
};
export type AccesoRutaGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfAccesoRutaDto;
export type AccesoRutaGetByIdAsyncApiArg = {
  id: number;
};
export type AccesoRutaGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfAccesoRutaDto;
export type AccesoRutaGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type AccesoRutaGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfAccesoRutaDto;
export type AccesoRutaGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type AccesoRutaCountApiResponse = /** status 200 OK */ ResponseOfint;
export type AccesoRutaCountApiArg = void;
export type AccesoRutaCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type AccesoRutaCountAsyncApiArg = void;
export type RolAccesoRutaInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type RolAccesoRutaInsertApiArg = {
  rolAccesoRutaDto: RolAccesoRutaDto;
};
export type RolAccesoRutaInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type RolAccesoRutaInsertAsyncApiArg = {
  rolAccesoRutaDto: RolAccesoRutaDto;
};
export type RolAccesoRutaUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type RolAccesoRutaUpdateApiArg = {
  id: number;
  rolAccesoRutaDto: RolAccesoRutaDto;
};
export type RolAccesoRutaUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type RolAccesoRutaUpdateAsyncApiArg = {
  id: number;
  rolAccesoRutaDto: RolAccesoRutaDto;
};
export type RolAccesoRutaDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type RolAccesoRutaDeleteApiArg = {
  id: number;
};
export type RolAccesoRutaDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type RolAccesoRutaDeleteAsyncApiArg = {
  id: number;
};
export type RolAccesoRutaGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfRolAccesoRutaDto;
export type RolAccesoRutaGetAllApiArg = void;
export type RolAccesoRutaGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfRolAccesoRutaDto;
export type RolAccesoRutaGetAllAsyncApiArg = void;
export type RolAccesoRutaGetByIdApiResponse =
  /** status 200 OK */ ResponseOfRolAccesoRutaDto;
export type RolAccesoRutaGetByIdApiArg = {
  id: number;
};
export type RolAccesoRutaGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfRolAccesoRutaDto;
export type RolAccesoRutaGetByIdAsyncApiArg = {
  id: number;
};
export type RolAccesoRutaGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfRolAccesoRutaDto;
export type RolAccesoRutaGetPagedApiArg = {
  page: number;
  pageSize: number;
};
export type RolAccesoRutaGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfRolAccesoRutaDto;
export type RolAccesoRutaGetPagedAsyncApiArg = {
  page: number;
  pageSize: number;
};
export type RolAccesoRutaCountApiResponse = /** status 200 OK */ ResponseOfint;
export type RolAccesoRutaCountApiArg = void;
export type RolAccesoRutaCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type RolAccesoRutaCountAsyncApiArg = void;
export type Severity = number;
export type ValidationFailure = {
  propertyName?: string | null;
  errorMessage?: string | null;
  attemptedValue?: any;
  customState?: any;
  severity?: Severity;
  errorCode?: string | null;
  formattedMessagePlaceholderValues?: object | null;
};
export type ResponseOfboolean = {
  data?: boolean;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type CatalogDto = {
  id?: number;
  code?: string;
  name?: string;
};
export type ResponseOfIEnumerableOfCatalogDto = {
  data?: CatalogDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type CatalogDto2 = {
  id?: number;
  code?: string;
  name?: string;
} | null;
export type ResponseOfCatalogDto = {
  data?: CatalogDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfCatalogDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: CatalogDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponseOfint = {
  data?: number;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type AreaDto = {
  id?: number;
  idSucursal?: number;
  nombre?: string | null;
  orden?: number;
};
export type ResponseOfIEnumerableOfAreaDto = {
  data?: AreaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type AreaDto2 = {
  id?: number;
  idSucursal?: number;
  nombre?: string | null;
  orden?: number;
} | null;
export type ResponseOfAreaDto = {
  data?: AreaDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfAreaDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: AreaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type CategoriaMenuDto = {
  id?: number;
  idMenu?: number;
  nombre?: string | null;
  orden?: number;
};
export type ResponseOfIEnumerableOfCategoriaMenuDto = {
  data?: CategoriaMenuDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type CategoriaMenuDto2 = {
  id?: number;
  idMenu?: number;
  nombre?: string | null;
  orden?: number;
} | null;
export type ResponseOfCategoriaMenuDto = {
  data?: CategoriaMenuDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfCategoriaMenuDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: CategoriaMenuDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ClienteDto = {
  id?: number;
  idEmpresa?: number;
  nombre?: string | null;
  telefono?: string | null;
  correo?: string | null;
};
export type ResponseOfIEnumerableOfClienteDto = {
  data?: ClienteDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ClienteDto2 = {
  id?: number;
  idEmpresa?: number;
  nombre?: string | null;
  telefono?: string | null;
  correo?: string | null;
} | null;
export type ResponseOfClienteDto = {
  data?: ClienteDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfClienteDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: ClienteDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type TokenDto = {
  accessToken: string;
  expiresAtUtc: string;
  refreshToken?: string | null;
};
export type UserSessionDto = {
  usuarioId: number;
  idEmpresa: number;
  correo: string;
  nombreCompleto?: string | null;
  roles: string[];
  accesos: string[];
  permsVersion?: string | null;
};
export type AuthResponseDto = {
  token: TokenDto;
  session: UserSessionDto;
} | null;
export type ResponseOfAuthResponseDto = {
  data?: AuthResponseDto;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type LoginRequest = {
  userOrEmail: string;
  password: string;
  empresaId?: number | null;
  sucursalId?: number | null;
};
export type AuthMeDto = {
  usuarioId: number;
  idEmpresa: number;
  correo?: string | null;
  nombre?: string | null;
  sucursalId?: string | null;
  turnoAbierto?: boolean;
  roles: string[];
  permissions: string[];
  accesos: string[];
  permsVersion?: string | null;
  permissionsChanged?: boolean;
} | null;
export type ResponseOfAuthMeDto = {
  data?: AuthMeDto;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type CuentaDto = {
  id?: number;
  idPedido?: number;
  subtotal?: number;
  descuentoTotal?: number;
  cargoServicio?: number;
  impuestoTotal?: number;
  total?: number;
  creadaEn?: string;
  estadoCatalogId?: number;
  estadoItemId?: number;
};
export type ResponseOfIEnumerableOfCuentaDto = {
  data?: CuentaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type CuentaDto2 = {
  id?: number;
  idPedido?: number;
  subtotal?: number;
  descuentoTotal?: number;
  cargoServicio?: number;
  impuestoTotal?: number;
  total?: number;
  creadaEn?: string;
  estadoCatalogId?: number;
  estadoItemId?: number;
} | null;
export type ResponseOfCuentaDto = {
  data?: CuentaDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type DescuentoAplicadoDto = {
  id?: number;
  idCuenta?: number;
  tipoCatalogId?: number;
  tipoItemId?: number;
  valor?: number;
  alcance?: string | null;
  condiciones?: string | null;
};
export type ResponseOfIEnumerableOfDescuentoAplicadoDto = {
  data?: DescuentoAplicadoDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type DescuentoAplicadoDto2 = {
  id?: number;
  idCuenta?: number;
  tipoCatalogId?: number;
  tipoItemId?: number;
  valor?: number;
  alcance?: string | null;
  condiciones?: string | null;
} | null;
export type ResponseOfDescuentoAplicadoDto = {
  data?: DescuentoAplicadoDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfDescuentoAplicadoDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: DescuentoAplicadoDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type DetalleCuentaDto = {
  id?: number;
  idCuenta?: number;
  tipoOrigen?: string;
  idOrigen?: number | null;
  descripcion?: string | null;
  monto?: number;
};
export type ResponseOfIEnumerableOfDetalleCuentaDto = {
  data?: DetalleCuentaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type DetalleCuentaDto2 = {
  id?: number;
  idCuenta?: number;
  tipoOrigen?: string;
  idOrigen?: number | null;
  descripcion?: string | null;
  monto?: number;
} | null;
export type ResponseOfDetalleCuentaDto = {
  data?: DetalleCuentaDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfDetalleCuentaDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: DetalleCuentaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type EmpresaDto = {
  id?: number;
  nombre?: string | null;
  rfc?: string | null;
};
export type ResponseOfIEnumerableOfEmpresaDto = {
  data?: EmpresaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type EmpresaDto2 = {
  id?: number;
  nombre?: string | null;
  rfc?: string | null;
} | null;
export type ResponseOfEmpresaDto = {
  data?: EmpresaDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfEmpresaDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: EmpresaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type EstacionCocinaDto = {
  id?: number;
  idSucursal?: number;
  nombre?: string | null;
};
export type ResponseOfIEnumerableOfEstacionCocinaDto = {
  data?: EstacionCocinaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type EstacionCocinaDto2 = {
  id?: number;
  idSucursal?: number;
  nombre?: string | null;
} | null;
export type ResponseOfEstacionCocinaDto = {
  data?: EstacionCocinaDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfEstacionCocinaDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: EstacionCocinaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type EventoPedidoDto = {
  id?: number;
  idPedido?: number;
  idUsuario?: number | null;
  tipoEvento?: string | null;
  payload?: string | null;
};
export type ResponseOfIEnumerableOfEventoPedidoDto = {
  data?: EventoPedidoDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type EventoPedidoDto2 = {
  id?: number;
  idPedido?: number;
  idUsuario?: number | null;
  tipoEvento?: string | null;
  payload?: string | null;
} | null;
export type ResponseOfEventoPedidoDto = {
  data?: EventoPedidoDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfEventoPedidoDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: EventoPedidoDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type GrupoModificadorDto = {
  id?: number;
  idProducto?: number;
  nombre?: string | null;
  minSeleccion?: number;
  maxSeleccion?: number;
  obligatorio?: boolean;
};
export type ResponseOfIEnumerableOfGrupoModificadorDto = {
  data?: GrupoModificadorDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type GrupoModificadorDto2 = {
  id?: number;
  idProducto?: number;
  nombre?: string | null;
  minSeleccion?: number;
  maxSeleccion?: number;
  obligatorio?: boolean;
} | null;
export type ResponseOfGrupoModificadorDto = {
  data?: GrupoModificadorDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfGrupoModificadorDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: GrupoModificadorDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type MenuDto = {
  id?: number;
  idSucursal?: number;
  nombre?: string | null;
};
export type ResponseOfIEnumerableOfMenuDto = {
  data?: MenuDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type MenuDto2 = {
  id?: number;
  idSucursal?: number;
  nombre?: string | null;
} | null;
export type ResponseOfMenuDto = {
  data?: MenuDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfMenuDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: MenuDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type MesaDto = {
  id?: number;
  idSucursal?: number;
  idArea?: number | null;
  codigo?: string;
  asientos?: number;
  estadoCatalogId?: number;
  estadoItemId?: number;
};
export type ResponseOfIEnumerableOfMesaDto = {
  data?: MesaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type MesaDto2 = {
  id?: number;
  idSucursal?: number;
  idArea?: number | null;
  codigo?: string;
  asientos?: number;
  estadoCatalogId?: number;
  estadoItemId?: number;
} | null;
export type ResponseOfMesaDto = {
  data?: MesaDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfMesaDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: MesaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type MovimientoCajaDto = {
  id?: number;
  idTurno?: number;
  tipo?: string;
  monto?: number;
  nota?: string | null;
};
export type ResponseOfIEnumerableOfMovimientoCajaDto = {
  data?: MovimientoCajaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type MovimientoCajaDto2 = {
  id?: number;
  idTurno?: number;
  tipo?: string;
  monto?: number;
  nota?: string | null;
} | null;
export type ResponseOfMovimientoCajaDto = {
  data?: MovimientoCajaDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfMovimientoCajaDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: MovimientoCajaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type OpcionModificadorDto = {
  id?: number;
  idGrupo?: number;
  nombre?: string | null;
  precioExtra?: number;
  esDefault?: boolean;
};
export type ResponseOfIEnumerableOfOpcionModificadorDto = {
  data?: OpcionModificadorDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type OpcionModificadorDto2 = {
  id?: number;
  idGrupo?: number;
  nombre?: string | null;
  precioExtra?: number;
  esDefault?: boolean;
} | null;
export type ResponseOfOpcionModificadorDto = {
  data?: OpcionModificadorDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfOpcionModificadorDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: OpcionModificadorDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type PagoDto = {
  id?: number;
  idCuenta?: number;
  monto?: number;
  moneda?: string;
  propina?: number;
  pagadoEn?: string;
  referencia?: string | null;
  recibidoPor?: number | null;
  metodoCatalogId?: number;
  metodoItemId?: number;
};
export type ResponseOfIEnumerableOfPagoDto = {
  data?: PagoDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type PagoDto2 = {
  id?: number;
  idCuenta?: number;
  monto?: number;
  moneda?: string;
  propina?: number;
  pagadoEn?: string;
  referencia?: string | null;
  recibidoPor?: number | null;
  metodoCatalogId?: number;
  metodoItemId?: number;
} | null;
export type ResponseOfPagoDto = {
  data?: PagoDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfPagoDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: PagoDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type PedidoDto = {
  id?: number;
  idEmpresa?: number;
  idSucursal?: number;
  idMesa?: number | null;
  idCliente?: number | null;
  abiertoPor?: number | null;
  cerradoPor?: number | null;
  abiertoEn?: string;
  cerradoEn?: string | null;
  notas?: string | null;
  tipoCatalogId?: number;
  tipoItemId?: number;
  estadoCatalogId?: number;
  estadoItemId?: number;
  cargoServicioPct?: number;
};
export type ResponseOfIEnumerableOfPedidoDto = {
  data?: PedidoDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type PedidoDto2 = {
  id?: number;
  idEmpresa?: number;
  idSucursal?: number;
  idMesa?: number | null;
  idCliente?: number | null;
  abiertoPor?: number | null;
  cerradoPor?: number | null;
  abiertoEn?: string;
  cerradoEn?: string | null;
  notas?: string | null;
  tipoCatalogId?: number;
  tipoItemId?: number;
  estadoCatalogId?: number;
  estadoItemId?: number;
  cargoServicioPct?: number;
} | null;
export type ResponseOfPedidoDto = {
  data?: PedidoDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfPedidoDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: PedidoDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type PedidoAsientoDto = {
  id?: number;
  idPedido?: number;
  numeroAsiento?: number;
};
export type ResponseOfIEnumerableOfPedidoAsientoDto = {
  data?: PedidoAsientoDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type PedidoAsientoDto2 = {
  id?: number;
  idPedido?: number;
  numeroAsiento?: number;
} | null;
export type ResponseOfPedidoAsientoDto = {
  data?: PedidoAsientoDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfPedidoAsientoDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: PedidoAsientoDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type PedidoDetalleDto = {
  id?: number;
  idPedido?: number;
  idAsiento?: number | null;
  idProducto?: number;
  idVariante?: number | null;
  cantidad?: number;
  precioUnitario?: number;
  notas?: string | null;
  estadoCatalogId?: number;
  estadoItemId?: number;
  impuestoCatalogId?: number;
  impuestoItemId?: number;
};
export type ResponseOfIEnumerableOfPedidoDetalleDto = {
  data?: PedidoDetalleDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type PedidoDetalleDto2 = {
  id?: number;
  idPedido?: number;
  idAsiento?: number | null;
  idProducto?: number;
  idVariante?: number | null;
  cantidad?: number;
  precioUnitario?: number;
  notas?: string | null;
  estadoCatalogId?: number;
  estadoItemId?: number;
  impuestoCatalogId?: number;
  impuestoItemId?: number;
} | null;
export type ResponseOfPedidoDetalleDto = {
  data?: PedidoDetalleDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfPedidoDetalleDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: PedidoDetalleDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type PedidoModificadorDto = {
  id?: number;
  idDetalle?: number;
  idOpcion?: number;
  precioExtra?: number;
};
export type ResponseOfIEnumerableOfPedidoModificadorDto = {
  data?: PedidoModificadorDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type PedidoModificadorDto2 = {
  id?: number;
  idDetalle?: number;
  idOpcion?: number;
  precioExtra?: number;
} | null;
export type ResponseOfPedidoModificadorDto = {
  data?: PedidoModificadorDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfPedidoModificadorDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: PedidoModificadorDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type PrecioDto = {
  id?: number;
  idVariante?: number;
  monto?: number;
  moneda?: string;
  impuestoCatalogId?: number;
  impuestoItemId?: number;
  validoDesde?: string | null;
  validoHasta?: string | null;
  dias?: string | null;
  horario?: string | null;
};
export type ResponseOfIEnumerableOfPrecioDto = {
  data?: PrecioDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type PrecioDto2 = {
  id?: number;
  idVariante?: number;
  monto?: number;
  moneda?: string;
  impuestoCatalogId?: number;
  impuestoItemId?: number;
  validoDesde?: string | null;
  validoHasta?: string | null;
  dias?: string | null;
  horario?: string | null;
} | null;
export type ResponseOfPrecioDto = {
  data?: PrecioDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfPrecioDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: PrecioDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ProductoDto = {
  id?: number;
  idMenu?: number;
  idCategoria?: number;
  codigo?: string | null;
  nombre?: string | null;
  descripcion?: string | null;
  activo?: boolean;
  estacionCatalogId?: number | null;
  estacionItemId?: number | null;
};
export type ResponseOfIEnumerableOfProductoDto = {
  data?: ProductoDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ProductoDto2 = {
  id?: number;
  idMenu?: number;
  idCategoria?: number;
  codigo?: string | null;
  nombre?: string | null;
  descripcion?: string | null;
  activo?: boolean;
  estacionCatalogId?: number | null;
  estacionItemId?: number | null;
} | null;
export type ResponseOfProductoDto = {
  data?: ProductoDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfProductoDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: ProductoDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type RolDto = {
  id?: number;
  nombre?: string;
  isSystem?: boolean;
  isAssignable?: boolean;
  concurrencyStamp?: string | null;
};
export type ResponseOfIEnumerableOfRolDto = {
  data?: RolDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type RolDto2 = {
  id?: number;
  nombre?: string;
  isSystem?: boolean;
  isAssignable?: boolean;
  concurrencyStamp?: string | null;
} | null;
export type ResponseOfRolDto = {
  data?: RolDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfRolDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: RolDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type SucursalDto = {
  id?: number;
  idEmpresa?: number;
  nombre?: string | null;
  direccion?: string | null;
  zonaHoraria?: string | null;
};
export type ResponseOfIEnumerableOfSucursalDto = {
  data?: SucursalDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type SucursalDto2 = {
  id?: number;
  idEmpresa?: number;
  nombre?: string | null;
  direccion?: string | null;
  zonaHoraria?: string | null;
} | null;
export type ResponseOfSucursalDto = {
  data?: SucursalDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfSucursalDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: SucursalDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type TicketCocinaDto = {
  id?: number;
  idEstacion?: number;
  idPedido?: number;
  estadoCatalogId?: number;
  estadoItemId?: number;
  completadoEn?: string | null;
};
export type ResponseOfIEnumerableOfTicketCocinaDto = {
  data?: TicketCocinaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type TicketCocinaDto2 = {
  id?: number;
  idEstacion?: number;
  idPedido?: number;
  estadoCatalogId?: number;
  estadoItemId?: number;
  completadoEn?: string | null;
} | null;
export type ResponseOfTicketCocinaDto = {
  data?: TicketCocinaDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfTicketCocinaDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: TicketCocinaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type TicketDetalleDto = {
  id?: number;
  idTicket?: number;
  idDetalle?: number;
  estadoCatalogId?: number;
  estadoItemId?: number;
};
export type ResponseOfIEnumerableOfTicketDetalleDto = {
  data?: TicketDetalleDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type TicketDetalleDto2 = {
  id?: number;
  idTicket?: number;
  idDetalle?: number;
  estadoCatalogId?: number;
  estadoItemId?: number;
} | null;
export type ResponseOfTicketDetalleDto = {
  data?: TicketDetalleDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfTicketDetalleDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: TicketDetalleDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type TurnoDto = {
  id?: number;
  idUsuario?: number;
  idSucursal?: number;
  apertura?: string;
  cierre?: string | null;
  cajaInicial?: number;
  cajaFinal?: number | null;
};
export type ResponseOfIEnumerableOfTurnoDto = {
  data?: TurnoDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type TurnoDto2 = {
  id?: number;
  idUsuario?: number;
  idSucursal?: number;
  apertura?: string;
  cierre?: string | null;
  cajaInicial?: number;
  cajaFinal?: number | null;
} | null;
export type ResponseOfTurnoDto = {
  data?: TurnoDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfTurnoDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: TurnoDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type UsuarioDto = {
  id?: number;
  idEmpresa?: number;
  nombreCompleto?: string | null;
  correo?: string | null;
};
export type ResponseOfIEnumerableOfUsuarioDto = {
  data?: UsuarioDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type UsuarioDto2 = {
  id?: number;
  idEmpresa?: number;
  nombreCompleto?: string | null;
  correo?: string | null;
} | null;
export type ResponseOfUsuarioDto = {
  data?: UsuarioDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfUsuarioDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: UsuarioDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type UsuarioRolDto = {
  id?: number;
  idUsuario?: number;
  idRol?: number;
};
export type ResponseOfIEnumerableOfUsuarioRolDto = {
  data?: UsuarioRolDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type UsuarioRolDto2 = {
  id?: number;
  idUsuario?: number;
  idRol?: number;
} | null;
export type ResponseOfUsuarioRolDto = {
  data?: UsuarioRolDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfUsuarioRolDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: UsuarioRolDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type VarianteProductoDto = {
  id?: number;
  idProducto?: number;
  nombre?: string | null;
  codigo?: string | null;
  esDefault?: boolean;
};
export type ResponseOfIEnumerableOfVarianteProductoDto = {
  data?: VarianteProductoDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type VarianteProductoDto2 = {
  id?: number;
  idProducto?: number;
  nombre?: string | null;
  codigo?: string | null;
  esDefault?: boolean;
} | null;
export type ResponseOfVarianteProductoDto = {
  data?: VarianteProductoDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfVarianteProductoDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: VarianteProductoDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type FormValidation = {
  type?: string;
  value?: number;
};
export type SelectFormOption = {
  id?: number;
  nombre?: string;
};
export type Catalog = {
  code?: string;
  name?: string;
  items?: CatalogItem[];
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string | null;
  updatedBy?: string;
  id?: number;
  isActive?: boolean;
};
export type CatalogItem = {
  code?: string;
  name?: string;
  sortOrder?: number;
  validFrom?: string | null;
  validTo?: string | null;
  extraJson?: string | null;
  catalogId?: number;
  catalog?: Catalog;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string | null;
  updatedBy?: string;
  id?: number;
  isActive?: boolean;
};
export type FormFieldDto = {
  id?: number;
  type?: string;
  name?: string;
  placeholder?: string;
  label?: string;
  value?: string;
  validations?: FormValidation[];
  options?: SelectFormOption[] | null;
  formulario?: CatalogItem;
  catalogId?: number | null;
  catalog?: Catalog;
  order?: number;
};
export type ResponseOfIEnumerableOfFormFieldDto = {
  data?: FormFieldDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type FormFieldDto2 = {
  id?: number;
  type?: string;
  name?: string;
  placeholder?: string;
  label?: string;
  value?: string;
  validations?: FormValidation[];
  options?: SelectFormOption[] | null;
  formulario?: CatalogItem;
  catalogId?: number | null;
  catalog?: Catalog;
  order?: number;
} | null;
export type ResponseOfFormFieldDto = {
  data?: FormFieldDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfFormFieldDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: FormFieldDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type AccesoRutaDto = {
  id?: number;
  nombre?: string;
  path?: string;
  descripcion?: string | null;
};
export type ResponseOfIEnumerableOfAccesoRutaDto = {
  data?: AccesoRutaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type AccesoRutaDto2 = {
  id?: number;
  nombre?: string;
  path?: string;
  descripcion?: string | null;
} | null;
export type ResponseOfAccesoRutaDto = {
  data?: AccesoRutaDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfAccesoRutaDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: AccesoRutaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type RolAccesoRutaDto = {
  id?: number;
  idRol?: number;
  idAccesoRuta?: number;
};
export type ResponseOfIEnumerableOfRolAccesoRutaDto = {
  data?: RolAccesoRutaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type RolAccesoRutaDto2 = {
  id?: number;
  idRol?: number;
  idAccesoRuta?: number;
} | null;
export type ResponseOfRolAccesoRutaDto = {
  data?: RolAccesoRutaDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfRolAccesoRutaDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: RolAccesoRutaDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export const {
  useCatalogoInsertMutation,
  useCatalogoInsertAsyncMutation,
  useCatalogoUpdateMutation,
  useCatalogoUpdateAsyncMutation,
  useCatalogoDeleteMutation,
  useCatalogoDeleteAsyncMutation,
  useCatalogoGetAllQuery,
  useLazyCatalogoGetAllQuery,
  useCatalogoGetAllAsyncQuery,
  useLazyCatalogoGetAllAsyncQuery,
  useCatalogoGetByIdQuery,
  useLazyCatalogoGetByIdQuery,
  useCatalogoGetByIdAsyncQuery,
  useLazyCatalogoGetByIdAsyncQuery,
  useCatalogoGetPagedQuery,
  useLazyCatalogoGetPagedQuery,
  useCatalogoGetPagedAsyncQuery,
  useLazyCatalogoGetPagedAsyncQuery,
  useCatalogoCountQuery,
  useLazyCatalogoCountQuery,
  useCatalogoCountAsyncQuery,
  useLazyCatalogoCountAsyncQuery,
  useAreaInsertMutation,
  useAreaInsertAsyncMutation,
  useAreaUpdateMutation,
  useAreaUpdateAsyncMutation,
  useAreaDeleteMutation,
  useAreaDeleteAsyncMutation,
  useAreaGetAllQuery,
  useLazyAreaGetAllQuery,
  useAreaGetAllAsyncQuery,
  useLazyAreaGetAllAsyncQuery,
  useAreaGetByIdQuery,
  useLazyAreaGetByIdQuery,
  useAreaGetByIdAsyncQuery,
  useLazyAreaGetByIdAsyncQuery,
  useAreaGetPagedQuery,
  useLazyAreaGetPagedQuery,
  useAreaGetPagedAsyncQuery,
  useLazyAreaGetPagedAsyncQuery,
  useAreaCountQuery,
  useLazyAreaCountQuery,
  useAreaCountAsyncQuery,
  useLazyAreaCountAsyncQuery,
  useCategoriaMenuInsertMutation,
  useCategoriaMenuInsertAsyncMutation,
  useCategoriaMenuUpdateMutation,
  useCategoriaMenuUpdateAsyncMutation,
  useCategoriaMenuDeleteMutation,
  useCategoriaMenuDeleteAsyncMutation,
  useCategoriaMenuGetAllQuery,
  useLazyCategoriaMenuGetAllQuery,
  useCategoriaMenuGetAllAsyncQuery,
  useLazyCategoriaMenuGetAllAsyncQuery,
  useCategoriaMenuGetByIdQuery,
  useLazyCategoriaMenuGetByIdQuery,
  useCategoriaMenuGetByIdAsyncQuery,
  useLazyCategoriaMenuGetByIdAsyncQuery,
  useCategoriaMenuGetPagedQuery,
  useLazyCategoriaMenuGetPagedQuery,
  useCategoriaMenuGetPagedAsyncQuery,
  useLazyCategoriaMenuGetPagedAsyncQuery,
  useCategoriaMenuCountQuery,
  useLazyCategoriaMenuCountQuery,
  useCategoriaMenuCountAsyncQuery,
  useLazyCategoriaMenuCountAsyncQuery,
  useClienteInsertMutation,
  useClienteInsertAsyncMutation,
  useClienteUpdateMutation,
  useClienteUpdateAsyncMutation,
  useClienteDeleteMutation,
  useClienteDeleteAsyncMutation,
  useClienteGetAllQuery,
  useLazyClienteGetAllQuery,
  useClienteGetAllAsyncQuery,
  useLazyClienteGetAllAsyncQuery,
  useClienteGetByIdQuery,
  useLazyClienteGetByIdQuery,
  useClienteGetByIdAsyncQuery,
  useLazyClienteGetByIdAsyncQuery,
  useClienteGetPagedQuery,
  useLazyClienteGetPagedQuery,
  useClienteGetPagedAsyncQuery,
  useLazyClienteGetPagedAsyncQuery,
  useClienteCountQuery,
  useLazyClienteCountQuery,
  useClienteCountAsyncQuery,
  useLazyClienteCountAsyncQuery,
  useAuthLoginMutation,
  useAuthMeQuery,
  useLazyAuthMeQuery,
  useCuentaInsertMutation,
  useCuentaInsertAsyncMutation,
  useCuentaUpdateMutation,
  useCuentaUpdateAsyncMutation,
  useCuentaDeleteMutation,
  useCuentaDeleteAsyncMutation,
  useCuentaGetAllQuery,
  useLazyCuentaGetAllQuery,
  useCuentaGetAllAsyncQuery,
  useLazyCuentaGetAllAsyncQuery,
  useCuentaGetByIdQuery,
  useLazyCuentaGetByIdQuery,
  useCuentaGetByIdAsyncQuery,
  useLazyCuentaGetByIdAsyncQuery,
  useDescuentoAplicadoInsertMutation,
  useDescuentoAplicadoInsertAsyncMutation,
  useDescuentoAplicadoUpdateMutation,
  useDescuentoAplicadoUpdateAsyncMutation,
  useDescuentoAplicadoDeleteMutation,
  useDescuentoAplicadoDeleteAsyncMutation,
  useDescuentoAplicadoGetAllQuery,
  useLazyDescuentoAplicadoGetAllQuery,
  useDescuentoAplicadoGetAllAsyncQuery,
  useLazyDescuentoAplicadoGetAllAsyncQuery,
  useDescuentoAplicadoGetByIdQuery,
  useLazyDescuentoAplicadoGetByIdQuery,
  useDescuentoAplicadoGetByIdAsyncQuery,
  useLazyDescuentoAplicadoGetByIdAsyncQuery,
  useDescuentoAplicadoGetPagedQuery,
  useLazyDescuentoAplicadoGetPagedQuery,
  useDescuentoAplicadoGetPagedAsyncQuery,
  useLazyDescuentoAplicadoGetPagedAsyncQuery,
  useDescuentoAplicadoCountQuery,
  useLazyDescuentoAplicadoCountQuery,
  useDescuentoAplicadoCountAsyncQuery,
  useLazyDescuentoAplicadoCountAsyncQuery,
  useDetalleCuentaInsertMutation,
  useDetalleCuentaInsertAsyncMutation,
  useDetalleCuentaUpdateMutation,
  useDetalleCuentaUpdateAsyncMutation,
  useDetalleCuentaDeleteMutation,
  useDetalleCuentaDeleteAsyncMutation,
  useDetalleCuentaGetAllQuery,
  useLazyDetalleCuentaGetAllQuery,
  useDetalleCuentaGetAllAsyncQuery,
  useLazyDetalleCuentaGetAllAsyncQuery,
  useDetalleCuentaGetByIdQuery,
  useLazyDetalleCuentaGetByIdQuery,
  useDetalleCuentaGetByIdAsyncQuery,
  useLazyDetalleCuentaGetByIdAsyncQuery,
  useDetalleCuentaGetPagedQuery,
  useLazyDetalleCuentaGetPagedQuery,
  useDetalleCuentaGetPagedAsyncQuery,
  useLazyDetalleCuentaGetPagedAsyncQuery,
  useDetalleCuentaCountQuery,
  useLazyDetalleCuentaCountQuery,
  useDetalleCuentaCountAsyncQuery,
  useLazyDetalleCuentaCountAsyncQuery,
  useEmpresaInsertMutation,
  useEmpresaInsertAsyncMutation,
  useEmpresaUpdateMutation,
  useEmpresaUpdateAsyncMutation,
  useEmpresaDeleteMutation,
  useEmpresaDeleteAsyncMutation,
  useEmpresaGetAllQuery,
  useLazyEmpresaGetAllQuery,
  useEmpresaGetAllAsyncQuery,
  useLazyEmpresaGetAllAsyncQuery,
  useEmpresaGetByIdQuery,
  useLazyEmpresaGetByIdQuery,
  useEmpresaGetByIdAsyncQuery,
  useLazyEmpresaGetByIdAsyncQuery,
  useEmpresaGetPagedQuery,
  useLazyEmpresaGetPagedQuery,
  useEmpresaGetPagedAsyncQuery,
  useLazyEmpresaGetPagedAsyncQuery,
  useEmpresaCountQuery,
  useLazyEmpresaCountQuery,
  useEmpresaCountAsyncQuery,
  useLazyEmpresaCountAsyncQuery,
  useEstacionCocinaInsertMutation,
  useEstacionCocinaInsertAsyncMutation,
  useEstacionCocinaUpdateMutation,
  useEstacionCocinaUpdateAsyncMutation,
  useEstacionCocinaDeleteMutation,
  useEstacionCocinaDeleteAsyncMutation,
  useEstacionCocinaGetAllQuery,
  useLazyEstacionCocinaGetAllQuery,
  useEstacionCocinaGetAllAsyncQuery,
  useLazyEstacionCocinaGetAllAsyncQuery,
  useEstacionCocinaGetByIdQuery,
  useLazyEstacionCocinaGetByIdQuery,
  useEstacionCocinaGetByIdAsyncQuery,
  useLazyEstacionCocinaGetByIdAsyncQuery,
  useEstacionCocinaGetPagedQuery,
  useLazyEstacionCocinaGetPagedQuery,
  useEstacionCocinaGetPagedAsyncQuery,
  useLazyEstacionCocinaGetPagedAsyncQuery,
  useEstacionCocinaCountQuery,
  useLazyEstacionCocinaCountQuery,
  useEstacionCocinaCountAsyncQuery,
  useLazyEstacionCocinaCountAsyncQuery,
  useEventoPedidoInsertMutation,
  useEventoPedidoInsertAsyncMutation,
  useEventoPedidoUpdateMutation,
  useEventoPedidoUpdateAsyncMutation,
  useEventoPedidoDeleteMutation,
  useEventoPedidoDeleteAsyncMutation,
  useEventoPedidoGetAllQuery,
  useLazyEventoPedidoGetAllQuery,
  useEventoPedidoGetAllAsyncQuery,
  useLazyEventoPedidoGetAllAsyncQuery,
  useEventoPedidoGetByIdQuery,
  useLazyEventoPedidoGetByIdQuery,
  useEventoPedidoGetByIdAsyncQuery,
  useLazyEventoPedidoGetByIdAsyncQuery,
  useEventoPedidoGetPagedQuery,
  useLazyEventoPedidoGetPagedQuery,
  useEventoPedidoGetPagedAsyncQuery,
  useLazyEventoPedidoGetPagedAsyncQuery,
  useEventoPedidoCountQuery,
  useLazyEventoPedidoCountQuery,
  useEventoPedidoCountAsyncQuery,
  useLazyEventoPedidoCountAsyncQuery,
  useGrupoModificadorInsertMutation,
  useGrupoModificadorInsertAsyncMutation,
  useGrupoModificadorUpdateMutation,
  useGrupoModificadorUpdateAsyncMutation,
  useGrupoModificadorDeleteMutation,
  useGrupoModificadorDeleteAsyncMutation,
  useGrupoModificadorGetAllQuery,
  useLazyGrupoModificadorGetAllQuery,
  useGrupoModificadorGetAllAsyncQuery,
  useLazyGrupoModificadorGetAllAsyncQuery,
  useGrupoModificadorGetByIdQuery,
  useLazyGrupoModificadorGetByIdQuery,
  useGrupoModificadorGetByIdAsyncQuery,
  useLazyGrupoModificadorGetByIdAsyncQuery,
  useGrupoModificadorGetPagedQuery,
  useLazyGrupoModificadorGetPagedQuery,
  useGrupoModificadorGetPagedAsyncQuery,
  useLazyGrupoModificadorGetPagedAsyncQuery,
  useGrupoModificadorCountQuery,
  useLazyGrupoModificadorCountQuery,
  useGrupoModificadorCountAsyncQuery,
  useLazyGrupoModificadorCountAsyncQuery,
  useMenuInsertMutation,
  useMenuInsertAsyncMutation,
  useMenuUpdateMutation,
  useMenuUpdateAsyncMutation,
  useMenuDeleteMutation,
  useMenuDeleteAsyncMutation,
  useMenuGetAllQuery,
  useLazyMenuGetAllQuery,
  useMenuGetAllAsyncQuery,
  useLazyMenuGetAllAsyncQuery,
  useMenuGetByIdQuery,
  useLazyMenuGetByIdQuery,
  useMenuGetByIdAsyncQuery,
  useLazyMenuGetByIdAsyncQuery,
  useMenuGetPagedQuery,
  useLazyMenuGetPagedQuery,
  useMenuGetPagedAsyncQuery,
  useLazyMenuGetPagedAsyncQuery,
  useMenuCountQuery,
  useLazyMenuCountQuery,
  useMenuCountAsyncQuery,
  useLazyMenuCountAsyncQuery,
  useMesaInsertMutation,
  useMesaInsertAsyncMutation,
  useMesaUpdateMutation,
  useMesaUpdateAsyncMutation,
  useMesaDeleteMutation,
  useMesaDeleteAsyncMutation,
  useMesaGetAllQuery,
  useLazyMesaGetAllQuery,
  useMesaGetAllAsyncQuery,
  useLazyMesaGetAllAsyncQuery,
  useMesaGetByIdQuery,
  useLazyMesaGetByIdQuery,
  useMesaGetByIdAsyncQuery,
  useLazyMesaGetByIdAsyncQuery,
  useMesaGetPagedQuery,
  useLazyMesaGetPagedQuery,
  useMesaGetPagedAsyncQuery,
  useLazyMesaGetPagedAsyncQuery,
  useMesaCountQuery,
  useLazyMesaCountQuery,
  useMesaCountAsyncQuery,
  useLazyMesaCountAsyncQuery,
  useMovimientoCajaInsertMutation,
  useMovimientoCajaInsertAsyncMutation,
  useMovimientoCajaUpdateMutation,
  useMovimientoCajaUpdateAsyncMutation,
  useMovimientoCajaDeleteMutation,
  useMovimientoCajaDeleteAsyncMutation,
  useMovimientoCajaGetAllQuery,
  useLazyMovimientoCajaGetAllQuery,
  useMovimientoCajaGetAllAsyncQuery,
  useLazyMovimientoCajaGetAllAsyncQuery,
  useMovimientoCajaGetByIdQuery,
  useLazyMovimientoCajaGetByIdQuery,
  useMovimientoCajaGetByIdAsyncQuery,
  useLazyMovimientoCajaGetByIdAsyncQuery,
  useMovimientoCajaGetPagedQuery,
  useLazyMovimientoCajaGetPagedQuery,
  useMovimientoCajaGetPagedAsyncQuery,
  useLazyMovimientoCajaGetPagedAsyncQuery,
  useMovimientoCajaCountQuery,
  useLazyMovimientoCajaCountQuery,
  useMovimientoCajaCountAsyncQuery,
  useLazyMovimientoCajaCountAsyncQuery,
  useOpcionModificadorInsertMutation,
  useOpcionModificadorInsertAsyncMutation,
  useOpcionModificadorUpdateMutation,
  useOpcionModificadorUpdateAsyncMutation,
  useOpcionModificadorDeleteMutation,
  useOpcionModificadorDeleteAsyncMutation,
  useOpcionModificadorGetAllQuery,
  useLazyOpcionModificadorGetAllQuery,
  useOpcionModificadorGetAllAsyncQuery,
  useLazyOpcionModificadorGetAllAsyncQuery,
  useOpcionModificadorGetByIdQuery,
  useLazyOpcionModificadorGetByIdQuery,
  useOpcionModificadorGetByIdAsyncQuery,
  useLazyOpcionModificadorGetByIdAsyncQuery,
  useOpcionModificadorGetPagedQuery,
  useLazyOpcionModificadorGetPagedQuery,
  useOpcionModificadorGetPagedAsyncQuery,
  useLazyOpcionModificadorGetPagedAsyncQuery,
  useOpcionModificadorCountQuery,
  useLazyOpcionModificadorCountQuery,
  useOpcionModificadorCountAsyncQuery,
  useLazyOpcionModificadorCountAsyncQuery,
  usePagoInsertMutation,
  usePagoInsertAsyncMutation,
  usePagoUpdateMutation,
  usePagoUpdateAsyncMutation,
  usePagoDeleteMutation,
  usePagoDeleteAsyncMutation,
  usePagoGetAllQuery,
  useLazyPagoGetAllQuery,
  usePagoGetAllAsyncQuery,
  useLazyPagoGetAllAsyncQuery,
  usePagoGetByIdQuery,
  useLazyPagoGetByIdQuery,
  usePagoGetByIdAsyncQuery,
  useLazyPagoGetByIdAsyncQuery,
  usePagoGetPagedQuery,
  useLazyPagoGetPagedQuery,
  usePagoGetPagedAsyncQuery,
  useLazyPagoGetPagedAsyncQuery,
  usePagoCountQuery,
  useLazyPagoCountQuery,
  usePagoCountAsyncQuery,
  useLazyPagoCountAsyncQuery,
  usePedidoInsertMutation,
  usePedidoInsertAsyncMutation,
  usePedidoUpdateMutation,
  usePedidoUpdateAsyncMutation,
  usePedidoDeleteMutation,
  usePedidoDeleteAsyncMutation,
  usePedidoGetAllQuery,
  useLazyPedidoGetAllQuery,
  usePedidoGetAllAsyncQuery,
  useLazyPedidoGetAllAsyncQuery,
  usePedidoGetByIdQuery,
  useLazyPedidoGetByIdQuery,
  usePedidoGetByIdAsyncQuery,
  useLazyPedidoGetByIdAsyncQuery,
  usePedidoGetPagedQuery,
  useLazyPedidoGetPagedQuery,
  usePedidoGetPagedAsyncQuery,
  useLazyPedidoGetPagedAsyncQuery,
  usePedidoCountQuery,
  useLazyPedidoCountQuery,
  usePedidoCountAsyncQuery,
  useLazyPedidoCountAsyncQuery,
  usePedidoAsientoInsertMutation,
  usePedidoAsientoInsertAsyncMutation,
  usePedidoAsientoUpdateMutation,
  usePedidoAsientoUpdateAsyncMutation,
  usePedidoAsientoDeleteMutation,
  usePedidoAsientoDeleteAsyncMutation,
  usePedidoAsientoGetAllQuery,
  useLazyPedidoAsientoGetAllQuery,
  usePedidoAsientoGetAllAsyncQuery,
  useLazyPedidoAsientoGetAllAsyncQuery,
  usePedidoAsientoGetByIdQuery,
  useLazyPedidoAsientoGetByIdQuery,
  usePedidoAsientoGetByIdAsyncQuery,
  useLazyPedidoAsientoGetByIdAsyncQuery,
  usePedidoAsientoGetPagedQuery,
  useLazyPedidoAsientoGetPagedQuery,
  usePedidoAsientoGetPagedAsyncQuery,
  useLazyPedidoAsientoGetPagedAsyncQuery,
  usePedidoAsientoCountQuery,
  useLazyPedidoAsientoCountQuery,
  usePedidoAsientoCountAsyncQuery,
  useLazyPedidoAsientoCountAsyncQuery,
  usePedidoDetalleInsertMutation,
  usePedidoDetalleInsertAsyncMutation,
  usePedidoDetalleUpdateMutation,
  usePedidoDetalleUpdateAsyncMutation,
  usePedidoDetalleDeleteMutation,
  usePedidoDetalleDeleteAsyncMutation,
  usePedidoDetalleGetAllQuery,
  useLazyPedidoDetalleGetAllQuery,
  usePedidoDetalleGetAllAsyncQuery,
  useLazyPedidoDetalleGetAllAsyncQuery,
  usePedidoDetalleGetByIdQuery,
  useLazyPedidoDetalleGetByIdQuery,
  usePedidoDetalleGetByIdAsyncQuery,
  useLazyPedidoDetalleGetByIdAsyncQuery,
  usePedidoDetalleGetPagedQuery,
  useLazyPedidoDetalleGetPagedQuery,
  usePedidoDetalleGetPagedAsyncQuery,
  useLazyPedidoDetalleGetPagedAsyncQuery,
  usePedidoDetalleCountQuery,
  useLazyPedidoDetalleCountQuery,
  usePedidoDetalleCountAsyncQuery,
  useLazyPedidoDetalleCountAsyncQuery,
  usePedidoModificadorInsertMutation,
  usePedidoModificadorInsertAsyncMutation,
  usePedidoModificadorUpdateMutation,
  usePedidoModificadorUpdateAsyncMutation,
  usePedidoModificadorDeleteMutation,
  usePedidoModificadorDeleteAsyncMutation,
  usePedidoModificadorGetAllQuery,
  useLazyPedidoModificadorGetAllQuery,
  usePedidoModificadorGetAllAsyncQuery,
  useLazyPedidoModificadorGetAllAsyncQuery,
  usePedidoModificadorGetByIdQuery,
  useLazyPedidoModificadorGetByIdQuery,
  usePedidoModificadorGetByIdAsyncQuery,
  useLazyPedidoModificadorGetByIdAsyncQuery,
  usePedidoModificadorGetPagedQuery,
  useLazyPedidoModificadorGetPagedQuery,
  usePedidoModificadorGetPagedAsyncQuery,
  useLazyPedidoModificadorGetPagedAsyncQuery,
  usePedidoModificadorCountQuery,
  useLazyPedidoModificadorCountQuery,
  usePedidoModificadorCountAsyncQuery,
  useLazyPedidoModificadorCountAsyncQuery,
  usePrecioInsertMutation,
  usePrecioInsertAsyncMutation,
  usePrecioUpdateMutation,
  usePrecioUpdateAsyncMutation,
  usePrecioDeleteMutation,
  usePrecioDeleteAsyncMutation,
  usePrecioGetAllQuery,
  useLazyPrecioGetAllQuery,
  usePrecioGetAllAsyncQuery,
  useLazyPrecioGetAllAsyncQuery,
  usePrecioGetByIdQuery,
  useLazyPrecioGetByIdQuery,
  usePrecioGetByIdAsyncQuery,
  useLazyPrecioGetByIdAsyncQuery,
  usePrecioGetPagedQuery,
  useLazyPrecioGetPagedQuery,
  usePrecioGetPagedAsyncQuery,
  useLazyPrecioGetPagedAsyncQuery,
  usePrecioCountQuery,
  useLazyPrecioCountQuery,
  usePrecioCountAsyncQuery,
  useLazyPrecioCountAsyncQuery,
  useProductoInsertMutation,
  useProductoInsertAsyncMutation,
  useProductoUpdateMutation,
  useProductoUpdateAsyncMutation,
  useProductoDeleteMutation,
  useProductoDeleteAsyncMutation,
  useProductoGetAllQuery,
  useLazyProductoGetAllQuery,
  useProductoGetAllAsyncQuery,
  useLazyProductoGetAllAsyncQuery,
  useProductoGetByIdQuery,
  useLazyProductoGetByIdQuery,
  useProductoGetByIdAsyncQuery,
  useLazyProductoGetByIdAsyncQuery,
  useProductoGetPagedQuery,
  useLazyProductoGetPagedQuery,
  useProductoGetPagedAsyncQuery,
  useLazyProductoGetPagedAsyncQuery,
  useProductoCountQuery,
  useLazyProductoCountQuery,
  useProductoCountAsyncQuery,
  useLazyProductoCountAsyncQuery,
  useRolInsertMutation,
  useRolInsertAsyncMutation,
  useRolUpdateMutation,
  useRolUpdateAsyncMutation,
  useRolDeleteMutation,
  useRolDeleteAsyncMutation,
  useRolGetAllQuery,
  useLazyRolGetAllQuery,
  useRolGetAllAsyncQuery,
  useLazyRolGetAllAsyncQuery,
  useRolGetByIdQuery,
  useLazyRolGetByIdQuery,
  useRolGetByIdAsyncQuery,
  useLazyRolGetByIdAsyncQuery,
  useRolGetPagedQuery,
  useLazyRolGetPagedQuery,
  useRolGetPagedAsyncQuery,
  useLazyRolGetPagedAsyncQuery,
  useRolCountQuery,
  useLazyRolCountQuery,
  useRolCountAsyncQuery,
  useLazyRolCountAsyncQuery,
  useSucursalInsertMutation,
  useSucursalInsertAsyncMutation,
  useSucursalUpdateMutation,
  useSucursalUpdateAsyncMutation,
  useSucursalDeleteMutation,
  useSucursalDeleteAsyncMutation,
  useSucursalGetAllQuery,
  useLazySucursalGetAllQuery,
  useSucursalGetAllAsyncQuery,
  useLazySucursalGetAllAsyncQuery,
  useSucursalGetByIdQuery,
  useLazySucursalGetByIdQuery,
  useSucursalGetByIdAsyncQuery,
  useLazySucursalGetByIdAsyncQuery,
  useSucursalGetPagedQuery,
  useLazySucursalGetPagedQuery,
  useSucursalGetPagedAsyncQuery,
  useLazySucursalGetPagedAsyncQuery,
  useSucursalCountQuery,
  useLazySucursalCountQuery,
  useSucursalCountAsyncQuery,
  useLazySucursalCountAsyncQuery,
  useTicketCocinaInsertMutation,
  useTicketCocinaInsertAsyncMutation,
  useTicketCocinaUpdateMutation,
  useTicketCocinaUpdateAsyncMutation,
  useTicketCocinaDeleteMutation,
  useTicketCocinaDeleteAsyncMutation,
  useTicketCocinaGetAllQuery,
  useLazyTicketCocinaGetAllQuery,
  useTicketCocinaGetAllAsyncQuery,
  useLazyTicketCocinaGetAllAsyncQuery,
  useTicketCocinaGetByIdQuery,
  useLazyTicketCocinaGetByIdQuery,
  useTicketCocinaGetByIdAsyncQuery,
  useLazyTicketCocinaGetByIdAsyncQuery,
  useTicketCocinaGetPagedQuery,
  useLazyTicketCocinaGetPagedQuery,
  useTicketCocinaGetPagedAsyncQuery,
  useLazyTicketCocinaGetPagedAsyncQuery,
  useTicketCocinaCountQuery,
  useLazyTicketCocinaCountQuery,
  useTicketCocinaCountAsyncQuery,
  useLazyTicketCocinaCountAsyncQuery,
  useTicketDetalleInsertMutation,
  useTicketDetalleInsertAsyncMutation,
  useTicketDetalleUpdateMutation,
  useTicketDetalleUpdateAsyncMutation,
  useTicketDetalleDeleteMutation,
  useTicketDetalleDeleteAsyncMutation,
  useTicketDetalleGetAllQuery,
  useLazyTicketDetalleGetAllQuery,
  useTicketDetalleGetAllAsyncQuery,
  useLazyTicketDetalleGetAllAsyncQuery,
  useTicketDetalleGetByIdQuery,
  useLazyTicketDetalleGetByIdQuery,
  useTicketDetalleGetByIdAsyncQuery,
  useLazyTicketDetalleGetByIdAsyncQuery,
  useTicketDetalleGetPagedQuery,
  useLazyTicketDetalleGetPagedQuery,
  useTicketDetalleGetPagedAsyncQuery,
  useLazyTicketDetalleGetPagedAsyncQuery,
  useTicketDetalleCountQuery,
  useLazyTicketDetalleCountQuery,
  useTicketDetalleCountAsyncQuery,
  useLazyTicketDetalleCountAsyncQuery,
  useTurnoInsertMutation,
  useTurnoInsertAsyncMutation,
  useTurnoUpdateMutation,
  useTurnoUpdateAsyncMutation,
  useTurnoDeleteMutation,
  useTurnoDeleteAsyncMutation,
  useTurnoGetAllQuery,
  useLazyTurnoGetAllQuery,
  useTurnoGetAllAsyncQuery,
  useLazyTurnoGetAllAsyncQuery,
  useTurnoGetByIdQuery,
  useLazyTurnoGetByIdQuery,
  useTurnoGetByIdAsyncQuery,
  useLazyTurnoGetByIdAsyncQuery,
  useTurnoGetPagedQuery,
  useLazyTurnoGetPagedQuery,
  useTurnoGetPagedAsyncQuery,
  useLazyTurnoGetPagedAsyncQuery,
  useTurnoCountQuery,
  useLazyTurnoCountQuery,
  useTurnoCountAsyncQuery,
  useLazyTurnoCountAsyncQuery,
  useUsuarioInsertMutation,
  useUsuarioInsertAsyncMutation,
  useUsuarioUpdateMutation,
  useUsuarioUpdateAsyncMutation,
  useUsuarioDeleteMutation,
  useUsuarioDeleteAsyncMutation,
  useUsuarioGetAllQuery,
  useLazyUsuarioGetAllQuery,
  useUsuarioGetAllAsyncQuery,
  useLazyUsuarioGetAllAsyncQuery,
  useUsuarioGetByIdQuery,
  useLazyUsuarioGetByIdQuery,
  useUsuarioGetByIdAsyncQuery,
  useLazyUsuarioGetByIdAsyncQuery,
  useUsuarioGetPagedQuery,
  useLazyUsuarioGetPagedQuery,
  useUsuarioGetPagedAsyncQuery,
  useLazyUsuarioGetPagedAsyncQuery,
  useUsuarioCountQuery,
  useLazyUsuarioCountQuery,
  useUsuarioCountAsyncQuery,
  useLazyUsuarioCountAsyncQuery,
  useUsuarioRolInsertMutation,
  useUsuarioRolInsertAsyncMutation,
  useUsuarioRolUpdateMutation,
  useUsuarioRolUpdateAsyncMutation,
  useUsuarioRolDeleteMutation,
  useUsuarioRolDeleteAsyncMutation,
  useUsuarioRolGetAllQuery,
  useLazyUsuarioRolGetAllQuery,
  useUsuarioRolGetAllAsyncQuery,
  useLazyUsuarioRolGetAllAsyncQuery,
  useUsuarioRolGetByIdQuery,
  useLazyUsuarioRolGetByIdQuery,
  useUsuarioRolGetByIdAsyncQuery,
  useLazyUsuarioRolGetByIdAsyncQuery,
  useUsuarioRolGetPagedQuery,
  useLazyUsuarioRolGetPagedQuery,
  useUsuarioRolGetPagedAsyncQuery,
  useLazyUsuarioRolGetPagedAsyncQuery,
  useUsuarioRolCountQuery,
  useLazyUsuarioRolCountQuery,
  useUsuarioRolCountAsyncQuery,
  useLazyUsuarioRolCountAsyncQuery,
  useVarianteProductoInsertMutation,
  useVarianteProductoInsertAsyncMutation,
  useVarianteProductoUpdateMutation,
  useVarianteProductoUpdateAsyncMutation,
  useVarianteProductoDeleteMutation,
  useVarianteProductoDeleteAsyncMutation,
  useVarianteProductoGetAllQuery,
  useLazyVarianteProductoGetAllQuery,
  useVarianteProductoGetAllAsyncQuery,
  useLazyVarianteProductoGetAllAsyncQuery,
  useVarianteProductoGetByIdQuery,
  useLazyVarianteProductoGetByIdQuery,
  useVarianteProductoGetByIdAsyncQuery,
  useLazyVarianteProductoGetByIdAsyncQuery,
  useVarianteProductoGetPagedQuery,
  useLazyVarianteProductoGetPagedQuery,
  useVarianteProductoGetPagedAsyncQuery,
  useLazyVarianteProductoGetPagedAsyncQuery,
  useVarianteProductoCountQuery,
  useLazyVarianteProductoCountQuery,
  useVarianteProductoCountAsyncQuery,
  useLazyVarianteProductoCountAsyncQuery,
  useFormFieldInsertMutation,
  useFormFieldInsertAsyncMutation,
  useFormFieldUpdateMutation,
  useFormFieldUpdateAsyncMutation,
  useFormFieldDeleteMutation,
  useFormFieldDeleteAsyncMutation,
  useFormFieldGetAllQuery,
  useLazyFormFieldGetAllQuery,
  useFormFieldGetAllAsyncQuery,
  useLazyFormFieldGetAllAsyncQuery,
  useFormFieldGetByIdQuery,
  useLazyFormFieldGetByIdQuery,
  useFormFieldGetByIdAsyncQuery,
  useLazyFormFieldGetByIdAsyncQuery,
  useFormFieldGetPagedQuery,
  useLazyFormFieldGetPagedQuery,
  useFormFieldGetPagedAsyncQuery,
  useLazyFormFieldGetPagedAsyncQuery,
  useFormFieldCountQuery,
  useLazyFormFieldCountQuery,
  useFormFieldCountAsyncQuery,
  useLazyFormFieldCountAsyncQuery,
  useFormFieldGetFormFieldByFormCatIdQuery,
  useLazyFormFieldGetFormFieldByFormCatIdQuery,
  useFormFieldGetFormFieldByFormCatIdAsyncAsyncQuery,
  useLazyFormFieldGetFormFieldByFormCatIdAsyncAsyncQuery,
  useAccesoRutaInsertMutation,
  useAccesoRutaInsertAsyncMutation,
  useAccesoRutaUpdateMutation,
  useAccesoRutaUpdateAsyncMutation,
  useAccesoRutaDeleteMutation,
  useAccesoRutaDeleteAsyncMutation,
  useAccesoRutaGetAllQuery,
  useLazyAccesoRutaGetAllQuery,
  useAccesoRutaGetAllAsyncQuery,
  useLazyAccesoRutaGetAllAsyncQuery,
  useAccesoRutaGetByIdQuery,
  useLazyAccesoRutaGetByIdQuery,
  useAccesoRutaGetByIdAsyncQuery,
  useLazyAccesoRutaGetByIdAsyncQuery,
  useAccesoRutaGetPagedQuery,
  useLazyAccesoRutaGetPagedQuery,
  useAccesoRutaGetPagedAsyncQuery,
  useLazyAccesoRutaGetPagedAsyncQuery,
  useAccesoRutaCountQuery,
  useLazyAccesoRutaCountQuery,
  useAccesoRutaCountAsyncQuery,
  useLazyAccesoRutaCountAsyncQuery,
  useRolAccesoRutaInsertMutation,
  useRolAccesoRutaInsertAsyncMutation,
  useRolAccesoRutaUpdateMutation,
  useRolAccesoRutaUpdateAsyncMutation,
  useRolAccesoRutaDeleteMutation,
  useRolAccesoRutaDeleteAsyncMutation,
  useRolAccesoRutaGetAllQuery,
  useLazyRolAccesoRutaGetAllQuery,
  useRolAccesoRutaGetAllAsyncQuery,
  useLazyRolAccesoRutaGetAllAsyncQuery,
  useRolAccesoRutaGetByIdQuery,
  useLazyRolAccesoRutaGetByIdQuery,
  useRolAccesoRutaGetByIdAsyncQuery,
  useLazyRolAccesoRutaGetByIdAsyncQuery,
  useRolAccesoRutaGetPagedQuery,
  useLazyRolAccesoRutaGetPagedQuery,
  useRolAccesoRutaGetPagedAsyncQuery,
  useLazyRolAccesoRutaGetPagedAsyncQuery,
  useRolAccesoRutaCountQuery,
  useLazyRolAccesoRutaCountQuery,
  useRolAccesoRutaCountAsyncQuery,
  useLazyRolAccesoRutaCountAsyncQuery,
} = injectedRtkApi;
