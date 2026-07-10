import { emptySplitApi as api } from "../baseApi";
export const addTagTypes = [
  "Auth",
  "Catalogos",
  "CatCredencial",
  "Categorias",
  "Empresa",
  "FormField",
  "Formulario",
  "GrupoModificadores",
  "Menus",
  "OpcionModificadores",
  "Precios",
  "Productos",
  "Rol",
  "Usuario",
  "VarianteProductos",
] as const;
const injectedRtkApi = api
  .enhanceEndpoints({
    addTagTypes,
  })
  .injectEndpoints({
    endpoints: (build) => ({
      authLogin: build.mutation<AuthLoginApiResponse, AuthLoginApiArg>({
        query: (queryArg) => ({
          url: `/api/Auth/login`,
          method: "POST",
          body: queryArg.loginRequest,
        }),
        invalidatesTags: ["Auth"],
      }),
      authLoginWithPin: build.mutation<
        AuthLoginWithPinApiResponse,
        AuthLoginWithPinApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Auth/login-pin`,
          method: "POST",
          body: queryArg.pinLoginRequest,
        }),
        invalidatesTags: ["Auth"],
      }),
      authMe: build.query<AuthMeApiResponse, AuthMeApiArg>({
        query: () => ({ url: `/api/Auth/me` }),
        providesTags: ["Auth"],
      }),
      catalogosGetAll: build.query<
        CatalogosGetAllApiResponse,
        CatalogosGetAllApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogos/${queryArg.catalog}/GetAll`,
        }),
        providesTags: ["Catalogos"],
      }),
      catalogosGetById: build.query<
        CatalogosGetByIdApiResponse,
        CatalogosGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogos/${queryArg.catalog}/GetById/${queryArg.id}`,
        }),
        providesTags: ["Catalogos"],
      }),
      catalogosInsert: build.mutation<
        CatalogosInsertApiResponse,
        CatalogosInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogos/${queryArg.catalog}/Insert`,
          method: "POST",
          body: queryArg.genericCatalogDto,
        }),
        invalidatesTags: ["Catalogos"],
      }),
      catalogosUpdate: build.mutation<
        CatalogosUpdateApiResponse,
        CatalogosUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogos/${queryArg.catalog}/Update`,
          method: "PUT",
          body: queryArg.genericCatalogDto,
        }),
        invalidatesTags: ["Catalogos"],
      }),
      catalogosDelete: build.mutation<
        CatalogosDeleteApiResponse,
        CatalogosDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogos/${queryArg.catalog}/Delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Catalogos"],
      }),
      catalogosGetAllWithPagination: build.query<
        CatalogosGetAllWithPaginationApiResponse,
        CatalogosGetAllWithPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogos/${queryArg.catalog}/GetAllWithPagination`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Catalogos"],
      }),
      catalogosCount: build.query<
        CatalogosCountApiResponse,
        CatalogosCountApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogos/${queryArg.catalog}/Count`,
        }),
        providesTags: ["Catalogos"],
      }),
      catalogosGetAllAsync: build.query<
        CatalogosGetAllAsyncApiResponse,
        CatalogosGetAllAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogos/${queryArg.catalog}/GetAllAsync`,
        }),
        providesTags: ["Catalogos"],
      }),
      catalogosGetByIdAsync: build.query<
        CatalogosGetByIdAsyncApiResponse,
        CatalogosGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogos/${queryArg.catalog}/GetByIdAsync/${queryArg.id}`,
        }),
        providesTags: ["Catalogos"],
      }),
      catalogosInsertAsync: build.mutation<
        CatalogosInsertAsyncApiResponse,
        CatalogosInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogos/${queryArg.catalog}/InsertAsync`,
          method: "POST",
          body: queryArg.genericCatalogDto,
        }),
        invalidatesTags: ["Catalogos"],
      }),
      catalogosUpdateAsync: build.mutation<
        CatalogosUpdateAsyncApiResponse,
        CatalogosUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogos/${queryArg.catalog}/UpdateAsync`,
          method: "PUT",
          body: queryArg.genericCatalogDto,
        }),
        invalidatesTags: ["Catalogos"],
      }),
      catalogosDeleteAsync: build.mutation<
        CatalogosDeleteAsyncApiResponse,
        CatalogosDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogos/${queryArg.catalog}/DeleteAsync/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Catalogos"],
      }),
      catalogosGetAllWithPaginationAsync: build.query<
        CatalogosGetAllWithPaginationAsyncApiResponse,
        CatalogosGetAllWithPaginationAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogos/${queryArg.catalog}/GetAllWithPaginationAsync`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Catalogos"],
      }),
      catalogosCountAsync: build.query<
        CatalogosCountAsyncApiResponse,
        CatalogosCountAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/catalogos/${queryArg.catalog}/CountAsync`,
        }),
        providesTags: ["Catalogos"],
      }),
      catCredencialInsert: build.mutation<
        CatCredencialInsertApiResponse,
        CatCredencialInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/CatCredencial/Insert`,
          method: "POST",
          body: queryArg.catCredencialDto,
        }),
        invalidatesTags: ["CatCredencial"],
      }),
      catCredencialGetAll: build.query<
        CatCredencialGetAllApiResponse,
        CatCredencialGetAllApiArg
      >({
        query: () => ({ url: `/api/CatCredencial/GetAll` }),
        providesTags: ["CatCredencial"],
      }),
      catCredencialGetById: build.query<
        CatCredencialGetByIdApiResponse,
        CatCredencialGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/CatCredencial/GetById/${queryArg.id}`,
        }),
        providesTags: ["CatCredencial"],
      }),
      catCredencialUpdate: build.mutation<
        CatCredencialUpdateApiResponse,
        CatCredencialUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/CatCredencial/Update`,
          method: "PUT",
          body: queryArg.catCredencialDto,
        }),
        invalidatesTags: ["CatCredencial"],
      }),
      catCredencialDelete: build.mutation<
        CatCredencialDeleteApiResponse,
        CatCredencialDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/CatCredencial/Delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["CatCredencial"],
      }),
      catCredencialGetAllWithPagination: build.query<
        CatCredencialGetAllWithPaginationApiResponse,
        CatCredencialGetAllWithPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/CatCredencial/GetAllWithPagination`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["CatCredencial"],
      }),
      catCredencialCount: build.query<
        CatCredencialCountApiResponse,
        CatCredencialCountApiArg
      >({
        query: () => ({ url: `/api/CatCredencial/Count` }),
        providesTags: ["CatCredencial"],
      }),
      catCredencialInsertAsync: build.mutation<
        CatCredencialInsertAsyncApiResponse,
        CatCredencialInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/CatCredencial/InsertAsync`,
          method: "POST",
          body: queryArg.catCredencialDto,
        }),
        invalidatesTags: ["CatCredencial"],
      }),
      catCredencialGetAllAsync: build.query<
        CatCredencialGetAllAsyncApiResponse,
        CatCredencialGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/CatCredencial/GetAllAsync` }),
        providesTags: ["CatCredencial"],
      }),
      catCredencialGetByIdAsync: build.query<
        CatCredencialGetByIdAsyncApiResponse,
        CatCredencialGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/CatCredencial/GetByIdAsync/${queryArg.id}`,
        }),
        providesTags: ["CatCredencial"],
      }),
      catCredencialUpdateAsync: build.mutation<
        CatCredencialUpdateAsyncApiResponse,
        CatCredencialUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/CatCredencial/UpdateAsync`,
          method: "PUT",
          body: queryArg.catCredencialDto,
        }),
        invalidatesTags: ["CatCredencial"],
      }),
      catCredencialDeleteAsync: build.mutation<
        CatCredencialDeleteAsyncApiResponse,
        CatCredencialDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/CatCredencial/DeleteAsync/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["CatCredencial"],
      }),
      catCredencialGetAllWithPaginationAsync: build.query<
        CatCredencialGetAllWithPaginationAsyncApiResponse,
        CatCredencialGetAllWithPaginationAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/CatCredencial/GetAllWithPaginationAsync`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["CatCredencial"],
      }),
      catCredencialCountAsync: build.query<
        CatCredencialCountAsyncApiResponse,
        CatCredencialCountAsyncApiArg
      >({
        query: () => ({ url: `/api/CatCredencial/CountAsync` }),
        providesTags: ["CatCredencial"],
      }),
      categoriasInsert: build.mutation<
        CategoriasInsertApiResponse,
        CategoriasInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categorias/Insert`,
          method: "POST",
          body: queryArg.categoriaMenuDto,
        }),
        invalidatesTags: ["Categorias"],
      }),
      categoriasGetAll: build.query<
        CategoriasGetAllApiResponse,
        CategoriasGetAllApiArg
      >({
        query: () => ({ url: `/api/categorias/GetAll` }),
        providesTags: ["Categorias"],
      }),
      categoriasGetById: build.query<
        CategoriasGetByIdApiResponse,
        CategoriasGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categorias/GetById/${queryArg.id}`,
        }),
        providesTags: ["Categorias"],
      }),
      categoriasUpdate: build.mutation<
        CategoriasUpdateApiResponse,
        CategoriasUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categorias/Update`,
          method: "PUT",
          body: queryArg.categoriaMenuDto,
        }),
        invalidatesTags: ["Categorias"],
      }),
      categoriasDelete: build.mutation<
        CategoriasDeleteApiResponse,
        CategoriasDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categorias/Delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Categorias"],
      }),
      categoriasGetAllWithPagination: build.query<
        CategoriasGetAllWithPaginationApiResponse,
        CategoriasGetAllWithPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categorias/GetAllWithPagination`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Categorias"],
      }),
      categoriasCount: build.query<
        CategoriasCountApiResponse,
        CategoriasCountApiArg
      >({
        query: () => ({ url: `/api/categorias/Count` }),
        providesTags: ["Categorias"],
      }),
      categoriasInsertAsync: build.mutation<
        CategoriasInsertAsyncApiResponse,
        CategoriasInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categorias/InsertAsync`,
          method: "POST",
          body: queryArg.categoriaMenuDto,
        }),
        invalidatesTags: ["Categorias"],
      }),
      categoriasGetAllAsync: build.query<
        CategoriasGetAllAsyncApiResponse,
        CategoriasGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/categorias/GetAllAsync` }),
        providesTags: ["Categorias"],
      }),
      categoriasGetByIdAsync: build.query<
        CategoriasGetByIdAsyncApiResponse,
        CategoriasGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categorias/GetByIdAsync/${queryArg.id}`,
        }),
        providesTags: ["Categorias"],
      }),
      categoriasUpdateAsync: build.mutation<
        CategoriasUpdateAsyncApiResponse,
        CategoriasUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categorias/UpdateAsync`,
          method: "PUT",
          body: queryArg.categoriaMenuDto,
        }),
        invalidatesTags: ["Categorias"],
      }),
      categoriasDeleteAsync: build.mutation<
        CategoriasDeleteAsyncApiResponse,
        CategoriasDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categorias/DeleteAsync/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Categorias"],
      }),
      categoriasGetAllWithPaginationAsync: build.query<
        CategoriasGetAllWithPaginationAsyncApiResponse,
        CategoriasGetAllWithPaginationAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/categorias/GetAllWithPaginationAsync`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Categorias"],
      }),
      categoriasCountAsync: build.query<
        CategoriasCountAsyncApiResponse,
        CategoriasCountAsyncApiArg
      >({
        query: () => ({ url: `/api/categorias/CountAsync` }),
        providesTags: ["Categorias"],
      }),
      empresaInsert: build.mutation<
        EmpresaInsertApiResponse,
        EmpresaInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Empresa/Insert`,
          method: "POST",
          body: queryArg.empresaDto,
        }),
        invalidatesTags: ["Empresa"],
      }),
      empresaGetAll: build.query<EmpresaGetAllApiResponse, EmpresaGetAllApiArg>(
        {
          query: () => ({ url: `/api/Empresa/GetAll` }),
          providesTags: ["Empresa"],
        },
      ),
      empresaGetById: build.query<
        EmpresaGetByIdApiResponse,
        EmpresaGetByIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/Empresa/GetById/${queryArg.id}` }),
        providesTags: ["Empresa"],
      }),
      empresaUpdate: build.mutation<
        EmpresaUpdateApiResponse,
        EmpresaUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Empresa/Update`,
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
          url: `/api/Empresa/Delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Empresa"],
      }),
      empresaGetAllWithPagination: build.query<
        EmpresaGetAllWithPaginationApiResponse,
        EmpresaGetAllWithPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Empresa/GetAllWithPagination`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Empresa"],
      }),
      empresaCount: build.query<EmpresaCountApiResponse, EmpresaCountApiArg>({
        query: () => ({ url: `/api/Empresa/Count` }),
        providesTags: ["Empresa"],
      }),
      empresaInsertAsync: build.mutation<
        EmpresaInsertAsyncApiResponse,
        EmpresaInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Empresa/InsertAsync`,
          method: "POST",
          body: queryArg.empresaDto,
        }),
        invalidatesTags: ["Empresa"],
      }),
      empresaGetAllAsync: build.query<
        EmpresaGetAllAsyncApiResponse,
        EmpresaGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/Empresa/GetAllAsync` }),
        providesTags: ["Empresa"],
      }),
      empresaGetByIdAsync: build.query<
        EmpresaGetByIdAsyncApiResponse,
        EmpresaGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Empresa/GetByIdAsync/${queryArg.id}`,
        }),
        providesTags: ["Empresa"],
      }),
      empresaUpdateAsync: build.mutation<
        EmpresaUpdateAsyncApiResponse,
        EmpresaUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Empresa/UpdateAsync`,
          method: "PUT",
          body: queryArg.empresaDto,
        }),
        invalidatesTags: ["Empresa"],
      }),
      empresaDeleteAsync: build.mutation<
        EmpresaDeleteAsyncApiResponse,
        EmpresaDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Empresa/DeleteAsync/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Empresa"],
      }),
      empresaGetAllWithPaginationAsync: build.query<
        EmpresaGetAllWithPaginationAsyncApiResponse,
        EmpresaGetAllWithPaginationAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Empresa/GetAllWithPaginationAsync`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Empresa"],
      }),
      empresaCountAsync: build.query<
        EmpresaCountAsyncApiResponse,
        EmpresaCountAsyncApiArg
      >({
        query: () => ({ url: `/api/Empresa/CountAsync` }),
        providesTags: ["Empresa"],
      }),
      formFieldInsert: build.mutation<
        FormFieldInsertApiResponse,
        FormFieldInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/FormField/Insert`,
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
          url: `/api/FormField/Update/${queryArg.id}`,
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
          url: `/api/FormField/Delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["FormField"],
      }),
      formFieldGetById: build.query<
        FormFieldGetByIdApiResponse,
        FormFieldGetByIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/FormField/GetById/${queryArg.id}` }),
        providesTags: ["FormField"],
      }),
      formFieldGetAll: build.query<
        FormFieldGetAllApiResponse,
        FormFieldGetAllApiArg
      >({
        query: () => ({ url: `/api/FormField/GetAll` }),
        providesTags: ["FormField"],
      }),
      formFieldGetPaged: build.query<
        FormFieldGetPagedApiResponse,
        FormFieldGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/FormField/GetPaged`,
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
        query: () => ({ url: `/api/FormField/Count` }),
        providesTags: ["FormField"],
      }),
      formFieldGetFormFieldByFormCatId: build.query<
        FormFieldGetFormFieldByFormCatIdApiResponse,
        FormFieldGetFormFieldByFormCatIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/FormField/GetFormFieldByFormCatId/${queryArg.id}`,
        }),
        providesTags: ["FormField"],
      }),
      formFieldInsertAsync: build.mutation<
        FormFieldInsertAsyncApiResponse,
        FormFieldInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/FormField/InsertAsync`,
          method: "POST",
          body: queryArg.formFieldDto,
        }),
        invalidatesTags: ["FormField"],
      }),
      formFieldUpdateAsync: build.mutation<
        FormFieldUpdateAsyncApiResponse,
        FormFieldUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/FormField/UpdateAsync/${queryArg.id}`,
          method: "PUT",
          body: queryArg.formFieldDto,
        }),
        invalidatesTags: ["FormField"],
      }),
      formFieldDeleteAsync: build.mutation<
        FormFieldDeleteAsyncApiResponse,
        FormFieldDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/FormField/DeleteAsync/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["FormField"],
      }),
      formFieldGetByIdAsync: build.query<
        FormFieldGetByIdAsyncApiResponse,
        FormFieldGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/FormField/GetByIdAsync/${queryArg.id}`,
        }),
        providesTags: ["FormField"],
      }),
      formFieldGetAllAsync: build.query<
        FormFieldGetAllAsyncApiResponse,
        FormFieldGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/FormField/GetAllAsync` }),
        providesTags: ["FormField"],
      }),
      formFieldGetPagedAsync: build.query<
        FormFieldGetPagedAsyncApiResponse,
        FormFieldGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/FormField/GetPagedAsync`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["FormField"],
      }),
      formFieldCountAsync: build.query<
        FormFieldCountAsyncApiResponse,
        FormFieldCountAsyncApiArg
      >({
        query: () => ({ url: `/api/FormField/CountAsync` }),
        providesTags: ["FormField"],
      }),
      formFieldGetFormFieldByFormCatIdAsyncAsync: build.query<
        FormFieldGetFormFieldByFormCatIdAsyncAsyncApiResponse,
        FormFieldGetFormFieldByFormCatIdAsyncAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/FormField/GetFormFieldByFormCatIdAsync/${queryArg.id}`,
        }),
        providesTags: ["FormField"],
      }),
      formularioInsert: build.mutation<
        FormularioInsertApiResponse,
        FormularioInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Formulario/Insert`,
          method: "POST",
          body: queryArg.formularioDto,
        }),
        invalidatesTags: ["Formulario"],
      }),
      formularioUpdate: build.mutation<
        FormularioUpdateApiResponse,
        FormularioUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Formulario/Update/${queryArg.id}`,
          method: "PUT",
          body: queryArg.formularioDto,
        }),
        invalidatesTags: ["Formulario"],
      }),
      formularioDelete: build.mutation<
        FormularioDeleteApiResponse,
        FormularioDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Formulario/Delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Formulario"],
      }),
      formularioGetById: build.query<
        FormularioGetByIdApiResponse,
        FormularioGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Formulario/GetById/${queryArg.id}`,
        }),
        providesTags: ["Formulario"],
      }),
      formularioGetAll: build.query<
        FormularioGetAllApiResponse,
        FormularioGetAllApiArg
      >({
        query: () => ({ url: `/api/Formulario/GetAll` }),
        providesTags: ["Formulario"],
      }),
      formularioGetPaged: build.query<
        FormularioGetPagedApiResponse,
        FormularioGetPagedApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Formulario/GetPaged`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Formulario"],
      }),
      formularioCount: build.query<
        FormularioCountApiResponse,
        FormularioCountApiArg
      >({
        query: () => ({ url: `/api/Formulario/Count` }),
        providesTags: ["Formulario"],
      }),
      formularioInsertAsync: build.mutation<
        FormularioInsertAsyncApiResponse,
        FormularioInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Formulario/InsertAsync`,
          method: "POST",
          body: queryArg.formularioDto,
        }),
        invalidatesTags: ["Formulario"],
      }),
      formularioUpdateAsync: build.mutation<
        FormularioUpdateAsyncApiResponse,
        FormularioUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Formulario/UpdateAsync/${queryArg.id}`,
          method: "PUT",
          body: queryArg.formularioDto,
        }),
        invalidatesTags: ["Formulario"],
      }),
      formularioDeleteAsync: build.mutation<
        FormularioDeleteAsyncApiResponse,
        FormularioDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Formulario/DeleteAsync/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Formulario"],
      }),
      formularioGetByIdAsync: build.query<
        FormularioGetByIdAsyncApiResponse,
        FormularioGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Formulario/GetByIdAsync/${queryArg.id}`,
        }),
        providesTags: ["Formulario"],
      }),
      formularioGetAllAsync: build.query<
        FormularioGetAllAsyncApiResponse,
        FormularioGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/Formulario/GetAllAsync` }),
        providesTags: ["Formulario"],
      }),
      formularioGetPagedAsync: build.query<
        FormularioGetPagedAsyncApiResponse,
        FormularioGetPagedAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Formulario/GetPagedAsync`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Formulario"],
      }),
      formularioCountAsync: build.query<
        FormularioCountAsyncApiResponse,
        FormularioCountAsyncApiArg
      >({
        query: () => ({ url: `/api/Formulario/CountAsync` }),
        providesTags: ["Formulario"],
      }),
      grupoModificadoresInsert: build.mutation<
        GrupoModificadoresInsertApiResponse,
        GrupoModificadoresInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificadores/Insert`,
          method: "POST",
          body: queryArg.grupoModificadorDto,
        }),
        invalidatesTags: ["GrupoModificadores"],
      }),
      grupoModificadoresGetAll: build.query<
        GrupoModificadoresGetAllApiResponse,
        GrupoModificadoresGetAllApiArg
      >({
        query: () => ({ url: `/api/grupomodificadores/GetAll` }),
        providesTags: ["GrupoModificadores"],
      }),
      grupoModificadoresGetById: build.query<
        GrupoModificadoresGetByIdApiResponse,
        GrupoModificadoresGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificadores/GetById/${queryArg.id}`,
        }),
        providesTags: ["GrupoModificadores"],
      }),
      grupoModificadoresUpdate: build.mutation<
        GrupoModificadoresUpdateApiResponse,
        GrupoModificadoresUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificadores/Update`,
          method: "PUT",
          body: queryArg.grupoModificadorDto,
        }),
        invalidatesTags: ["GrupoModificadores"],
      }),
      grupoModificadoresDelete: build.mutation<
        GrupoModificadoresDeleteApiResponse,
        GrupoModificadoresDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificadores/Delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["GrupoModificadores"],
      }),
      grupoModificadoresGetAllWithPagination: build.query<
        GrupoModificadoresGetAllWithPaginationApiResponse,
        GrupoModificadoresGetAllWithPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificadores/GetAllWithPagination`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["GrupoModificadores"],
      }),
      grupoModificadoresCount: build.query<
        GrupoModificadoresCountApiResponse,
        GrupoModificadoresCountApiArg
      >({
        query: () => ({ url: `/api/grupomodificadores/Count` }),
        providesTags: ["GrupoModificadores"],
      }),
      grupoModificadoresInsertAsync: build.mutation<
        GrupoModificadoresInsertAsyncApiResponse,
        GrupoModificadoresInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificadores/InsertAsync`,
          method: "POST",
          body: queryArg.grupoModificadorDto,
        }),
        invalidatesTags: ["GrupoModificadores"],
      }),
      grupoModificadoresGetAllAsync: build.query<
        GrupoModificadoresGetAllAsyncApiResponse,
        GrupoModificadoresGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/grupomodificadores/GetAllAsync` }),
        providesTags: ["GrupoModificadores"],
      }),
      grupoModificadoresGetByIdAsync: build.query<
        GrupoModificadoresGetByIdAsyncApiResponse,
        GrupoModificadoresGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificadores/GetByIdAsync/${queryArg.id}`,
        }),
        providesTags: ["GrupoModificadores"],
      }),
      grupoModificadoresUpdateAsync: build.mutation<
        GrupoModificadoresUpdateAsyncApiResponse,
        GrupoModificadoresUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificadores/UpdateAsync`,
          method: "PUT",
          body: queryArg.grupoModificadorDto,
        }),
        invalidatesTags: ["GrupoModificadores"],
      }),
      grupoModificadoresDeleteAsync: build.mutation<
        GrupoModificadoresDeleteAsyncApiResponse,
        GrupoModificadoresDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificadores/DeleteAsync/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["GrupoModificadores"],
      }),
      grupoModificadoresGetAllWithPaginationAsync: build.query<
        GrupoModificadoresGetAllWithPaginationAsyncApiResponse,
        GrupoModificadoresGetAllWithPaginationAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/grupomodificadores/GetAllWithPaginationAsync`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["GrupoModificadores"],
      }),
      grupoModificadoresCountAsync: build.query<
        GrupoModificadoresCountAsyncApiResponse,
        GrupoModificadoresCountAsyncApiArg
      >({
        query: () => ({ url: `/api/grupomodificadores/CountAsync` }),
        providesTags: ["GrupoModificadores"],
      }),
      menusInsert: build.mutation<MenusInsertApiResponse, MenusInsertApiArg>({
        query: (queryArg) => ({
          url: `/api/menus/Insert`,
          method: "POST",
          body: queryArg.menuDto,
        }),
        invalidatesTags: ["Menus"],
      }),
      menusGetAll: build.query<MenusGetAllApiResponse, MenusGetAllApiArg>({
        query: () => ({ url: `/api/menus/GetAll` }),
        providesTags: ["Menus"],
      }),
      menusGetById: build.query<MenusGetByIdApiResponse, MenusGetByIdApiArg>({
        query: (queryArg) => ({ url: `/api/menus/GetById/${queryArg.id}` }),
        providesTags: ["Menus"],
      }),
      menusUpdate: build.mutation<MenusUpdateApiResponse, MenusUpdateApiArg>({
        query: (queryArg) => ({
          url: `/api/menus/Update`,
          method: "PUT",
          body: queryArg.menuDto,
        }),
        invalidatesTags: ["Menus"],
      }),
      menusDelete: build.mutation<MenusDeleteApiResponse, MenusDeleteApiArg>({
        query: (queryArg) => ({
          url: `/api/menus/Delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Menus"],
      }),
      menusGetAllWithPagination: build.query<
        MenusGetAllWithPaginationApiResponse,
        MenusGetAllWithPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/menus/GetAllWithPagination`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Menus"],
      }),
      menusCount: build.query<MenusCountApiResponse, MenusCountApiArg>({
        query: () => ({ url: `/api/menus/Count` }),
        providesTags: ["Menus"],
      }),
      menusInsertAsync: build.mutation<
        MenusInsertAsyncApiResponse,
        MenusInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/menus/InsertAsync`,
          method: "POST",
          body: queryArg.menuDto,
        }),
        invalidatesTags: ["Menus"],
      }),
      menusGetAllAsync: build.query<
        MenusGetAllAsyncApiResponse,
        MenusGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/menus/GetAllAsync` }),
        providesTags: ["Menus"],
      }),
      menusGetByIdAsync: build.query<
        MenusGetByIdAsyncApiResponse,
        MenusGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/menus/GetByIdAsync/${queryArg.id}`,
        }),
        providesTags: ["Menus"],
      }),
      menusUpdateAsync: build.mutation<
        MenusUpdateAsyncApiResponse,
        MenusUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/menus/UpdateAsync`,
          method: "PUT",
          body: queryArg.menuDto,
        }),
        invalidatesTags: ["Menus"],
      }),
      menusDeleteAsync: build.mutation<
        MenusDeleteAsyncApiResponse,
        MenusDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/menus/DeleteAsync/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Menus"],
      }),
      menusGetAllWithPaginationAsync: build.query<
        MenusGetAllWithPaginationAsyncApiResponse,
        MenusGetAllWithPaginationAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/menus/GetAllWithPaginationAsync`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Menus"],
      }),
      menusCountAsync: build.query<
        MenusCountAsyncApiResponse,
        MenusCountAsyncApiArg
      >({
        query: () => ({ url: `/api/menus/CountAsync` }),
        providesTags: ["Menus"],
      }),
      opcionModificadoresInsert: build.mutation<
        OpcionModificadoresInsertApiResponse,
        OpcionModificadoresInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificadores/Insert`,
          method: "POST",
          body: queryArg.opcionModificadorDto,
        }),
        invalidatesTags: ["OpcionModificadores"],
      }),
      opcionModificadoresGetAll: build.query<
        OpcionModificadoresGetAllApiResponse,
        OpcionModificadoresGetAllApiArg
      >({
        query: () => ({ url: `/api/opcionmodificadores/GetAll` }),
        providesTags: ["OpcionModificadores"],
      }),
      opcionModificadoresGetById: build.query<
        OpcionModificadoresGetByIdApiResponse,
        OpcionModificadoresGetByIdApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificadores/GetById/${queryArg.id}`,
        }),
        providesTags: ["OpcionModificadores"],
      }),
      opcionModificadoresUpdate: build.mutation<
        OpcionModificadoresUpdateApiResponse,
        OpcionModificadoresUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificadores/Update`,
          method: "PUT",
          body: queryArg.opcionModificadorDto,
        }),
        invalidatesTags: ["OpcionModificadores"],
      }),
      opcionModificadoresDelete: build.mutation<
        OpcionModificadoresDeleteApiResponse,
        OpcionModificadoresDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificadores/Delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["OpcionModificadores"],
      }),
      opcionModificadoresGetAllWithPagination: build.query<
        OpcionModificadoresGetAllWithPaginationApiResponse,
        OpcionModificadoresGetAllWithPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificadores/GetAllWithPagination`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["OpcionModificadores"],
      }),
      opcionModificadoresCount: build.query<
        OpcionModificadoresCountApiResponse,
        OpcionModificadoresCountApiArg
      >({
        query: () => ({ url: `/api/opcionmodificadores/Count` }),
        providesTags: ["OpcionModificadores"],
      }),
      opcionModificadoresInsertAsync: build.mutation<
        OpcionModificadoresInsertAsyncApiResponse,
        OpcionModificadoresInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificadores/InsertAsync`,
          method: "POST",
          body: queryArg.opcionModificadorDto,
        }),
        invalidatesTags: ["OpcionModificadores"],
      }),
      opcionModificadoresGetAllAsync: build.query<
        OpcionModificadoresGetAllAsyncApiResponse,
        OpcionModificadoresGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/opcionmodificadores/GetAllAsync` }),
        providesTags: ["OpcionModificadores"],
      }),
      opcionModificadoresGetByIdAsync: build.query<
        OpcionModificadoresGetByIdAsyncApiResponse,
        OpcionModificadoresGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificadores/GetByIdAsync/${queryArg.id}`,
        }),
        providesTags: ["OpcionModificadores"],
      }),
      opcionModificadoresUpdateAsync: build.mutation<
        OpcionModificadoresUpdateAsyncApiResponse,
        OpcionModificadoresUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificadores/UpdateAsync`,
          method: "PUT",
          body: queryArg.opcionModificadorDto,
        }),
        invalidatesTags: ["OpcionModificadores"],
      }),
      opcionModificadoresDeleteAsync: build.mutation<
        OpcionModificadoresDeleteAsyncApiResponse,
        OpcionModificadoresDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificadores/DeleteAsync/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["OpcionModificadores"],
      }),
      opcionModificadoresGetAllWithPaginationAsync: build.query<
        OpcionModificadoresGetAllWithPaginationAsyncApiResponse,
        OpcionModificadoresGetAllWithPaginationAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/opcionmodificadores/GetAllWithPaginationAsync`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["OpcionModificadores"],
      }),
      opcionModificadoresCountAsync: build.query<
        OpcionModificadoresCountAsyncApiResponse,
        OpcionModificadoresCountAsyncApiArg
      >({
        query: () => ({ url: `/api/opcionmodificadores/CountAsync` }),
        providesTags: ["OpcionModificadores"],
      }),
      preciosInsert: build.mutation<
        PreciosInsertApiResponse,
        PreciosInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/precios/Insert`,
          method: "POST",
          body: queryArg.precioDto,
        }),
        invalidatesTags: ["Precios"],
      }),
      preciosGetAll: build.query<PreciosGetAllApiResponse, PreciosGetAllApiArg>(
        {
          query: () => ({ url: `/api/precios/GetAll` }),
          providesTags: ["Precios"],
        },
      ),
      preciosGetById: build.query<
        PreciosGetByIdApiResponse,
        PreciosGetByIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/precios/GetById/${queryArg.id}` }),
        providesTags: ["Precios"],
      }),
      preciosUpdate: build.mutation<
        PreciosUpdateApiResponse,
        PreciosUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/precios/Update`,
          method: "PUT",
          body: queryArg.precioDto,
        }),
        invalidatesTags: ["Precios"],
      }),
      preciosDelete: build.mutation<
        PreciosDeleteApiResponse,
        PreciosDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/precios/Delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Precios"],
      }),
      preciosGetAllWithPagination: build.query<
        PreciosGetAllWithPaginationApiResponse,
        PreciosGetAllWithPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/precios/GetAllWithPagination`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Precios"],
      }),
      preciosCount: build.query<PreciosCountApiResponse, PreciosCountApiArg>({
        query: () => ({ url: `/api/precios/Count` }),
        providesTags: ["Precios"],
      }),
      preciosInsertAsync: build.mutation<
        PreciosInsertAsyncApiResponse,
        PreciosInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/precios/InsertAsync`,
          method: "POST",
          body: queryArg.precioDto,
        }),
        invalidatesTags: ["Precios"],
      }),
      preciosGetAllAsync: build.query<
        PreciosGetAllAsyncApiResponse,
        PreciosGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/precios/GetAllAsync` }),
        providesTags: ["Precios"],
      }),
      preciosGetByIdAsync: build.query<
        PreciosGetByIdAsyncApiResponse,
        PreciosGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/precios/GetByIdAsync/${queryArg.id}`,
        }),
        providesTags: ["Precios"],
      }),
      preciosUpdateAsync: build.mutation<
        PreciosUpdateAsyncApiResponse,
        PreciosUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/precios/UpdateAsync`,
          method: "PUT",
          body: queryArg.precioDto,
        }),
        invalidatesTags: ["Precios"],
      }),
      preciosDeleteAsync: build.mutation<
        PreciosDeleteAsyncApiResponse,
        PreciosDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/precios/DeleteAsync/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Precios"],
      }),
      preciosGetAllWithPaginationAsync: build.query<
        PreciosGetAllWithPaginationAsyncApiResponse,
        PreciosGetAllWithPaginationAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/precios/GetAllWithPaginationAsync`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Precios"],
      }),
      preciosCountAsync: build.query<
        PreciosCountAsyncApiResponse,
        PreciosCountAsyncApiArg
      >({
        query: () => ({ url: `/api/precios/CountAsync` }),
        providesTags: ["Precios"],
      }),
      productosInsert: build.mutation<
        ProductosInsertApiResponse,
        ProductosInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/productos/Insert`,
          method: "POST",
          body: queryArg.productoDto,
        }),
        invalidatesTags: ["Productos"],
      }),
      productosGetAll: build.query<
        ProductosGetAllApiResponse,
        ProductosGetAllApiArg
      >({
        query: () => ({ url: `/api/productos/GetAll` }),
        providesTags: ["Productos"],
      }),
      productosGetById: build.query<
        ProductosGetByIdApiResponse,
        ProductosGetByIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/productos/GetById/${queryArg.id}` }),
        providesTags: ["Productos"],
      }),
      productosUpdate: build.mutation<
        ProductosUpdateApiResponse,
        ProductosUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/productos/Update`,
          method: "PUT",
          body: queryArg.productoDto,
        }),
        invalidatesTags: ["Productos"],
      }),
      productosDelete: build.mutation<
        ProductosDeleteApiResponse,
        ProductosDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/productos/Delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Productos"],
      }),
      productosGetAllWithPagination: build.query<
        ProductosGetAllWithPaginationApiResponse,
        ProductosGetAllWithPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/productos/GetAllWithPagination`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Productos"],
      }),
      productosCount: build.query<
        ProductosCountApiResponse,
        ProductosCountApiArg
      >({
        query: () => ({ url: `/api/productos/Count` }),
        providesTags: ["Productos"],
      }),
      productosInsertAsync: build.mutation<
        ProductosInsertAsyncApiResponse,
        ProductosInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/productos/InsertAsync`,
          method: "POST",
          body: queryArg.productoDto,
        }),
        invalidatesTags: ["Productos"],
      }),
      productosGetAllAsync: build.query<
        ProductosGetAllAsyncApiResponse,
        ProductosGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/productos/GetAllAsync` }),
        providesTags: ["Productos"],
      }),
      productosGetByIdAsync: build.query<
        ProductosGetByIdAsyncApiResponse,
        ProductosGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/productos/GetByIdAsync/${queryArg.id}`,
        }),
        providesTags: ["Productos"],
      }),
      productosUpdateAsync: build.mutation<
        ProductosUpdateAsyncApiResponse,
        ProductosUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/productos/UpdateAsync`,
          method: "PUT",
          body: queryArg.productoDto,
        }),
        invalidatesTags: ["Productos"],
      }),
      productosDeleteAsync: build.mutation<
        ProductosDeleteAsyncApiResponse,
        ProductosDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/productos/DeleteAsync/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Productos"],
      }),
      productosGetAllWithPaginationAsync: build.query<
        ProductosGetAllWithPaginationAsyncApiResponse,
        ProductosGetAllWithPaginationAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/productos/GetAllWithPaginationAsync`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Productos"],
      }),
      productosCountAsync: build.query<
        ProductosCountAsyncApiResponse,
        ProductosCountAsyncApiArg
      >({
        query: () => ({ url: `/api/productos/CountAsync` }),
        providesTags: ["Productos"],
      }),
      rolInsert: build.mutation<RolInsertApiResponse, RolInsertApiArg>({
        query: (queryArg) => ({
          url: `/api/Rol/Insert`,
          method: "POST",
          body: queryArg.rolDto,
        }),
        invalidatesTags: ["Rol"],
      }),
      rolGetAll: build.query<RolGetAllApiResponse, RolGetAllApiArg>({
        query: () => ({ url: `/api/Rol/GetAll` }),
        providesTags: ["Rol"],
      }),
      rolGetById: build.query<RolGetByIdApiResponse, RolGetByIdApiArg>({
        query: (queryArg) => ({ url: `/api/Rol/GetById/${queryArg.id}` }),
        providesTags: ["Rol"],
      }),
      rolUpdate: build.mutation<RolUpdateApiResponse, RolUpdateApiArg>({
        query: (queryArg) => ({
          url: `/api/Rol/Update`,
          method: "PUT",
          body: queryArg.rolDto,
        }),
        invalidatesTags: ["Rol"],
      }),
      rolDelete: build.mutation<RolDeleteApiResponse, RolDeleteApiArg>({
        query: (queryArg) => ({
          url: `/api/Rol/Delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Rol"],
      }),
      rolGetAllWithPagination: build.query<
        RolGetAllWithPaginationApiResponse,
        RolGetAllWithPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Rol/GetAllWithPagination`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Rol"],
      }),
      rolCount: build.query<RolCountApiResponse, RolCountApiArg>({
        query: () => ({ url: `/api/Rol/Count` }),
        providesTags: ["Rol"],
      }),
      rolInsertAsync: build.mutation<
        RolInsertAsyncApiResponse,
        RolInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Rol/InsertAsync`,
          method: "POST",
          body: queryArg.rolDto,
        }),
        invalidatesTags: ["Rol"],
      }),
      rolGetAllAsync: build.query<
        RolGetAllAsyncApiResponse,
        RolGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/Rol/GetAllAsync` }),
        providesTags: ["Rol"],
      }),
      rolGetByIdAsync: build.query<
        RolGetByIdAsyncApiResponse,
        RolGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({ url: `/api/Rol/GetByIdAsync/${queryArg.id}` }),
        providesTags: ["Rol"],
      }),
      rolUpdateAsync: build.mutation<
        RolUpdateAsyncApiResponse,
        RolUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Rol/UpdateAsync`,
          method: "PUT",
          body: queryArg.rolDto,
        }),
        invalidatesTags: ["Rol"],
      }),
      rolDeleteAsync: build.mutation<
        RolDeleteAsyncApiResponse,
        RolDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Rol/DeleteAsync/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Rol"],
      }),
      rolGetAllWithPaginationAsync: build.query<
        RolGetAllWithPaginationAsyncApiResponse,
        RolGetAllWithPaginationAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Rol/GetAllWithPaginationAsync`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Rol"],
      }),
      rolCountAsync: build.query<RolCountAsyncApiResponse, RolCountAsyncApiArg>(
        {
          query: () => ({ url: `/api/Rol/CountAsync` }),
          providesTags: ["Rol"],
        },
      ),
      usuarioInsert: build.mutation<
        UsuarioInsertApiResponse,
        UsuarioInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Usuario/Insert`,
          method: "POST",
          body: queryArg.usuarioDto,
        }),
        invalidatesTags: ["Usuario"],
      }),
      usuarioGetAll: build.query<UsuarioGetAllApiResponse, UsuarioGetAllApiArg>(
        {
          query: () => ({ url: `/api/Usuario/GetAll` }),
          providesTags: ["Usuario"],
        },
      ),
      usuarioGetById: build.query<
        UsuarioGetByIdApiResponse,
        UsuarioGetByIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/Usuario/GetById/${queryArg.id}` }),
        providesTags: ["Usuario"],
      }),
      usuarioUpdate: build.mutation<
        UsuarioUpdateApiResponse,
        UsuarioUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Usuario/Update`,
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
          url: `/api/Usuario/Delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Usuario"],
      }),
      usuarioGetAllWithPagination: build.query<
        UsuarioGetAllWithPaginationApiResponse,
        UsuarioGetAllWithPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Usuario/GetAllWithPagination`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Usuario"],
      }),
      usuarioCount: build.query<UsuarioCountApiResponse, UsuarioCountApiArg>({
        query: () => ({ url: `/api/Usuario/Count` }),
        providesTags: ["Usuario"],
      }),
      usuarioInsertAsync: build.mutation<
        UsuarioInsertAsyncApiResponse,
        UsuarioInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Usuario/InsertAsync`,
          method: "POST",
          body: queryArg.usuarioDto,
        }),
        invalidatesTags: ["Usuario"],
      }),
      usuarioGetAllAsync: build.query<
        UsuarioGetAllAsyncApiResponse,
        UsuarioGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/Usuario/GetAllAsync` }),
        providesTags: ["Usuario"],
      }),
      usuarioGetByIdAsync: build.query<
        UsuarioGetByIdAsyncApiResponse,
        UsuarioGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Usuario/GetByIdAsync/${queryArg.id}`,
        }),
        providesTags: ["Usuario"],
      }),
      usuarioUpdateAsync: build.mutation<
        UsuarioUpdateAsyncApiResponse,
        UsuarioUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Usuario/UpdateAsync`,
          method: "PUT",
          body: queryArg.usuarioDto,
        }),
        invalidatesTags: ["Usuario"],
      }),
      usuarioDeleteAsync: build.mutation<
        UsuarioDeleteAsyncApiResponse,
        UsuarioDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Usuario/DeleteAsync/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["Usuario"],
      }),
      usuarioGetAllWithPaginationAsync: build.query<
        UsuarioGetAllWithPaginationAsyncApiResponse,
        UsuarioGetAllWithPaginationAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Usuario/GetAllWithPaginationAsync`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["Usuario"],
      }),
      usuarioCountAsync: build.query<
        UsuarioCountAsyncApiResponse,
        UsuarioCountAsyncApiArg
      >({
        query: () => ({ url: `/api/Usuario/CountAsync` }),
        providesTags: ["Usuario"],
      }),
      usuarioGetByCorreoWithRolesAndCredentialsAsync: build.query<
        UsuarioGetByCorreoWithRolesAndCredentialsAsyncApiResponse,
        UsuarioGetByCorreoWithRolesAndCredentialsAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Usuario/GetByCorreoWithRolesAndCredentialsAsync/${queryArg.correo}`,
        }),
        providesTags: ["Usuario"],
      }),
      usuarioGetByUserOrEmailWithAuthGraphAsync: build.query<
        UsuarioGetByUserOrEmailWithAuthGraphAsyncApiResponse,
        UsuarioGetByUserOrEmailWithAuthGraphAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Usuario/GetByUserOrEmailWithAuthGraphAsync/${queryArg.userOrEmail}`,
        }),
        providesTags: ["Usuario"],
      }),
      usuarioGetRoleNamesAsync: build.query<
        UsuarioGetRoleNamesAsyncApiResponse,
        UsuarioGetRoleNamesAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Usuario/GetRoleNamesAsync/${queryArg.usuarioId}`,
        }),
        providesTags: ["Usuario"],
      }),
      usuarioGetAccesoPathsByUsuarioIdAsync: build.query<
        UsuarioGetAccesoPathsByUsuarioIdAsyncApiResponse,
        UsuarioGetAccesoPathsByUsuarioIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Usuario/GetAccesoPathsByUsuarioIdAsync/${queryArg.usuarioId}`,
        }),
        providesTags: ["Usuario"],
      }),
      usuarioGetPasswordCredentialAsync: build.query<
        UsuarioGetPasswordCredentialAsyncApiResponse,
        UsuarioGetPasswordCredentialAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Usuario/GetPasswordCredentialAsync/${queryArg.usuarioId}`,
        }),
        providesTags: ["Usuario"],
      }),
      usuarioHasOpenTurnoAsync: build.query<
        UsuarioHasOpenTurnoAsyncApiResponse,
        UsuarioHasOpenTurnoAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Usuario/HasOpenTurnoAsync/${queryArg.idUsuario}`,
        }),
        providesTags: ["Usuario"],
      }),
      usuarioGetPermissionKeysByUsuarioIdAsync: build.query<
        UsuarioGetPermissionKeysByUsuarioIdAsyncApiResponse,
        UsuarioGetPermissionKeysByUsuarioIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Usuario/GetPermissionKeysByUsuarioIdAsync/${queryArg.usuarioId}`,
        }),
        providesTags: ["Usuario"],
      }),
      usuarioGetPermissionsVersionAsync: build.query<
        UsuarioGetPermissionsVersionAsyncApiResponse,
        UsuarioGetPermissionsVersionAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/Usuario/GetPermissionsVersionAsync/${queryArg.usuarioId}`,
        }),
        providesTags: ["Usuario"],
      }),
      varianteProductosInsert: build.mutation<
        VarianteProductosInsertApiResponse,
        VarianteProductosInsertApiArg
      >({
        query: (queryArg) => ({
          url: `/api/variantes/Insert`,
          method: "POST",
          body: queryArg.varianteProductoDto,
        }),
        invalidatesTags: ["VarianteProductos"],
      }),
      varianteProductosGetAll: build.query<
        VarianteProductosGetAllApiResponse,
        VarianteProductosGetAllApiArg
      >({
        query: () => ({ url: `/api/variantes/GetAll` }),
        providesTags: ["VarianteProductos"],
      }),
      varianteProductosGetById: build.query<
        VarianteProductosGetByIdApiResponse,
        VarianteProductosGetByIdApiArg
      >({
        query: (queryArg) => ({ url: `/api/variantes/GetById/${queryArg.id}` }),
        providesTags: ["VarianteProductos"],
      }),
      varianteProductosUpdate: build.mutation<
        VarianteProductosUpdateApiResponse,
        VarianteProductosUpdateApiArg
      >({
        query: (queryArg) => ({
          url: `/api/variantes/Update`,
          method: "PUT",
          body: queryArg.varianteProductoDto,
        }),
        invalidatesTags: ["VarianteProductos"],
      }),
      varianteProductosDelete: build.mutation<
        VarianteProductosDeleteApiResponse,
        VarianteProductosDeleteApiArg
      >({
        query: (queryArg) => ({
          url: `/api/variantes/Delete/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["VarianteProductos"],
      }),
      varianteProductosGetAllWithPagination: build.query<
        VarianteProductosGetAllWithPaginationApiResponse,
        VarianteProductosGetAllWithPaginationApiArg
      >({
        query: (queryArg) => ({
          url: `/api/variantes/GetAllWithPagination`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["VarianteProductos"],
      }),
      varianteProductosCount: build.query<
        VarianteProductosCountApiResponse,
        VarianteProductosCountApiArg
      >({
        query: () => ({ url: `/api/variantes/Count` }),
        providesTags: ["VarianteProductos"],
      }),
      varianteProductosInsertAsync: build.mutation<
        VarianteProductosInsertAsyncApiResponse,
        VarianteProductosInsertAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/variantes/InsertAsync`,
          method: "POST",
          body: queryArg.varianteProductoDto,
        }),
        invalidatesTags: ["VarianteProductos"],
      }),
      varianteProductosGetAllAsync: build.query<
        VarianteProductosGetAllAsyncApiResponse,
        VarianteProductosGetAllAsyncApiArg
      >({
        query: () => ({ url: `/api/variantes/GetAllAsync` }),
        providesTags: ["VarianteProductos"],
      }),
      varianteProductosGetByIdAsync: build.query<
        VarianteProductosGetByIdAsyncApiResponse,
        VarianteProductosGetByIdAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/variantes/GetByIdAsync/${queryArg.id}`,
        }),
        providesTags: ["VarianteProductos"],
      }),
      varianteProductosUpdateAsync: build.mutation<
        VarianteProductosUpdateAsyncApiResponse,
        VarianteProductosUpdateAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/variantes/UpdateAsync`,
          method: "PUT",
          body: queryArg.varianteProductoDto,
        }),
        invalidatesTags: ["VarianteProductos"],
      }),
      varianteProductosDeleteAsync: build.mutation<
        VarianteProductosDeleteAsyncApiResponse,
        VarianteProductosDeleteAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/variantes/DeleteAsync/${queryArg.id}`,
          method: "DELETE",
        }),
        invalidatesTags: ["VarianteProductos"],
      }),
      varianteProductosGetAllWithPaginationAsync: build.query<
        VarianteProductosGetAllWithPaginationAsyncApiResponse,
        VarianteProductosGetAllWithPaginationAsyncApiArg
      >({
        query: (queryArg) => ({
          url: `/api/variantes/GetAllWithPaginationAsync`,
          params: {
            page: queryArg.page,
            pageSize: queryArg.pageSize,
          },
        }),
        providesTags: ["VarianteProductos"],
      }),
      varianteProductosCountAsync: build.query<
        VarianteProductosCountAsyncApiResponse,
        VarianteProductosCountAsyncApiArg
      >({
        query: () => ({ url: `/api/variantes/CountAsync` }),
        providesTags: ["VarianteProductos"],
      }),
    }),
    overrideExisting: false,
  });
export { injectedRtkApi as enhancedApi };
export type AuthLoginApiResponse =
  /** status 200 OK */ ResponseOfAuthResponseDto;
export type AuthLoginApiArg = {
  loginRequest: LoginRequest;
};
export type AuthLoginWithPinApiResponse =
  /** status 200 OK */ ResponseOfAuthResponseDto;
export type AuthLoginWithPinApiArg = {
  pinLoginRequest: PinLoginRequest;
};
export type AuthMeApiResponse = /** status 200 OK */ ResponseOfAuthMeDto;
export type AuthMeApiArg = void;
export type CatalogosGetAllApiResponse = unknown;
export type CatalogosGetAllApiArg = {
  catalog: string;
};
export type CatalogosGetByIdApiResponse = unknown;
export type CatalogosGetByIdApiArg = {
  catalog: string;
  id: number;
};
export type CatalogosInsertApiResponse = unknown;
export type CatalogosInsertApiArg = {
  catalog: string;
  genericCatalogDto: GenericCatalogDto;
};
export type CatalogosUpdateApiResponse = unknown;
export type CatalogosUpdateApiArg = {
  catalog: string;
  genericCatalogDto: GenericCatalogDto;
};
export type CatalogosDeleteApiResponse = unknown;
export type CatalogosDeleteApiArg = {
  catalog: string;
  id: number;
};
export type CatalogosGetAllWithPaginationApiResponse = unknown;
export type CatalogosGetAllWithPaginationApiArg = {
  catalog: string;
  page?: number;
  pageSize?: number;
};
export type CatalogosCountApiResponse = unknown;
export type CatalogosCountApiArg = {
  catalog: string;
};
export type CatalogosGetAllAsyncApiResponse = unknown;
export type CatalogosGetAllAsyncApiArg = {
  catalog: string;
};
export type CatalogosGetByIdAsyncApiResponse = unknown;
export type CatalogosGetByIdAsyncApiArg = {
  catalog: string;
  id: number;
};
export type CatalogosInsertAsyncApiResponse = unknown;
export type CatalogosInsertAsyncApiArg = {
  catalog: string;
  genericCatalogDto: GenericCatalogDto;
};
export type CatalogosUpdateAsyncApiResponse = unknown;
export type CatalogosUpdateAsyncApiArg = {
  catalog: string;
  genericCatalogDto: GenericCatalogDto;
};
export type CatalogosDeleteAsyncApiResponse = unknown;
export type CatalogosDeleteAsyncApiArg = {
  catalog: string;
  id: number;
};
export type CatalogosGetAllWithPaginationAsyncApiResponse = unknown;
export type CatalogosGetAllWithPaginationAsyncApiArg = {
  catalog: string;
  page?: number;
  pageSize?: number;
};
export type CatalogosCountAsyncApiResponse = unknown;
export type CatalogosCountAsyncApiArg = {
  catalog: string;
};
export type CatCredencialInsertApiResponse = unknown;
export type CatCredencialInsertApiArg = {
  catCredencialDto: CatCredencialDto;
};
export type CatCredencialGetAllApiResponse = unknown;
export type CatCredencialGetAllApiArg = void;
export type CatCredencialGetByIdApiResponse = unknown;
export type CatCredencialGetByIdApiArg = {
  id: number;
};
export type CatCredencialUpdateApiResponse = unknown;
export type CatCredencialUpdateApiArg = {
  catCredencialDto: CatCredencialDto;
};
export type CatCredencialDeleteApiResponse = unknown;
export type CatCredencialDeleteApiArg = {
  id: number;
};
export type CatCredencialGetAllWithPaginationApiResponse = unknown;
export type CatCredencialGetAllWithPaginationApiArg = {
  page?: number;
  pageSize?: number;
};
export type CatCredencialCountApiResponse = unknown;
export type CatCredencialCountApiArg = void;
export type CatCredencialInsertAsyncApiResponse = unknown;
export type CatCredencialInsertAsyncApiArg = {
  catCredencialDto: CatCredencialDto;
};
export type CatCredencialGetAllAsyncApiResponse = unknown;
export type CatCredencialGetAllAsyncApiArg = void;
export type CatCredencialGetByIdAsyncApiResponse = unknown;
export type CatCredencialGetByIdAsyncApiArg = {
  id: number;
};
export type CatCredencialUpdateAsyncApiResponse = unknown;
export type CatCredencialUpdateAsyncApiArg = {
  catCredencialDto: CatCredencialDto;
};
export type CatCredencialDeleteAsyncApiResponse = unknown;
export type CatCredencialDeleteAsyncApiArg = {
  id: number;
};
export type CatCredencialGetAllWithPaginationAsyncApiResponse = unknown;
export type CatCredencialGetAllWithPaginationAsyncApiArg = {
  page?: number;
  pageSize?: number;
};
export type CatCredencialCountAsyncApiResponse = unknown;
export type CatCredencialCountAsyncApiArg = void;
export type CategoriasInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CategoriasInsertApiArg = {
  categoriaMenuDto: CategoriaMenuDto;
};
export type CategoriasGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfCategoriaMenuDto;
export type CategoriasGetAllApiArg = void;
export type CategoriasGetByIdApiResponse =
  /** status 200 OK */ ResponseOfCategoriaMenuDto;
export type CategoriasGetByIdApiArg = {
  id: number;
};
export type CategoriasUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CategoriasUpdateApiArg = {
  categoriaMenuDto: CategoriaMenuDto;
};
export type CategoriasDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CategoriasDeleteApiArg = {
  id: number;
};
export type CategoriasGetAllWithPaginationApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfCategoriaMenuDto;
export type CategoriasGetAllWithPaginationApiArg = {
  page?: number;
  pageSize?: number;
};
export type CategoriasCountApiResponse = /** status 200 OK */ ResponseOfint;
export type CategoriasCountApiArg = void;
export type CategoriasInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CategoriasInsertAsyncApiArg = {
  categoriaMenuDto: CategoriaMenuDto;
};
export type CategoriasGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfCategoriaMenuDto;
export type CategoriasGetAllAsyncApiArg = void;
export type CategoriasGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfCategoriaMenuDto;
export type CategoriasGetByIdAsyncApiArg = {
  id: number;
};
export type CategoriasUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CategoriasUpdateAsyncApiArg = {
  categoriaMenuDto: CategoriaMenuDto;
};
export type CategoriasDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type CategoriasDeleteAsyncApiArg = {
  id: number;
};
export type CategoriasGetAllWithPaginationAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfCategoriaMenuDto;
export type CategoriasGetAllWithPaginationAsyncApiArg = {
  page?: number;
  pageSize?: number;
};
export type CategoriasCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type CategoriasCountAsyncApiArg = void;
export type EmpresaInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type EmpresaInsertApiArg = {
  empresaDto: EmpresaDto;
};
export type EmpresaGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfEmpresaDto;
export type EmpresaGetAllApiArg = void;
export type EmpresaGetByIdApiResponse =
  /** status 200 OK */ ResponseOfEmpresaDto;
export type EmpresaGetByIdApiArg = {
  id: number;
};
export type EmpresaUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type EmpresaUpdateApiArg = {
  empresaDto: EmpresaDto;
};
export type EmpresaDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type EmpresaDeleteApiArg = {
  id: number;
};
export type EmpresaGetAllWithPaginationApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfEmpresaDto;
export type EmpresaGetAllWithPaginationApiArg = {
  page?: number;
  pageSize?: number;
};
export type EmpresaCountApiResponse = /** status 200 OK */ ResponseOfint;
export type EmpresaCountApiArg = void;
export type EmpresaInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EmpresaInsertAsyncApiArg = {
  empresaDto: EmpresaDto;
};
export type EmpresaGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfEmpresaDto;
export type EmpresaGetAllAsyncApiArg = void;
export type EmpresaGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfEmpresaDto;
export type EmpresaGetByIdAsyncApiArg = {
  id: number;
};
export type EmpresaUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EmpresaUpdateAsyncApiArg = {
  empresaDto: EmpresaDto;
};
export type EmpresaDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type EmpresaDeleteAsyncApiArg = {
  id: number;
};
export type EmpresaGetAllWithPaginationAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfEmpresaDto;
export type EmpresaGetAllWithPaginationAsyncApiArg = {
  page?: number;
  pageSize?: number;
};
export type EmpresaCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type EmpresaCountAsyncApiArg = void;
export type FormFieldInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type FormFieldInsertApiArg = {
  formFieldDto: FormFieldDto;
};
export type FormFieldUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type FormFieldUpdateApiArg = {
  id: number;
  formFieldDto: FormFieldDto;
};
export type FormFieldDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type FormFieldDeleteApiArg = {
  id: number;
};
export type FormFieldGetByIdApiResponse =
  /** status 200 OK */ ResponseOfFormFieldDto;
export type FormFieldGetByIdApiArg = {
  id: number;
};
export type FormFieldGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfFormFieldDto;
export type FormFieldGetAllApiArg = void;
export type FormFieldGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfFormFieldDto;
export type FormFieldGetPagedApiArg = {
  page?: number;
  pageSize?: number;
};
export type FormFieldCountApiResponse = /** status 200 OK */ ResponseOfint;
export type FormFieldCountApiArg = void;
export type FormFieldGetFormFieldByFormCatIdApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfFormFieldDto;
export type FormFieldGetFormFieldByFormCatIdApiArg = {
  id: number;
};
export type FormFieldInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type FormFieldInsertAsyncApiArg = {
  formFieldDto: FormFieldDto;
};
export type FormFieldUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type FormFieldUpdateAsyncApiArg = {
  id: number;
  formFieldDto: FormFieldDto;
};
export type FormFieldDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type FormFieldDeleteAsyncApiArg = {
  id: number;
};
export type FormFieldGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfFormFieldDto;
export type FormFieldGetByIdAsyncApiArg = {
  id: number;
};
export type FormFieldGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfFormFieldDto;
export type FormFieldGetAllAsyncApiArg = void;
export type FormFieldGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfFormFieldDto;
export type FormFieldGetPagedAsyncApiArg = {
  page?: number;
  pageSize?: number;
};
export type FormFieldCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type FormFieldCountAsyncApiArg = void;
export type FormFieldGetFormFieldByFormCatIdAsyncAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfFormFieldDto;
export type FormFieldGetFormFieldByFormCatIdAsyncAsyncApiArg = {
  id: number;
};
export type FormularioInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type FormularioInsertApiArg = {
  formularioDto: FormularioDto;
};
export type FormularioUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type FormularioUpdateApiArg = {
  id: number;
  formularioDto: FormularioDto;
};
export type FormularioDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type FormularioDeleteApiArg = {
  id: number;
};
export type FormularioGetByIdApiResponse =
  /** status 200 OK */ ResponseOfFormularioDto;
export type FormularioGetByIdApiArg = {
  id: number;
};
export type FormularioGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfFormularioDto;
export type FormularioGetAllApiArg = void;
export type FormularioGetPagedApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfFormularioDto;
export type FormularioGetPagedApiArg = {
  page?: number;
  pageSize?: number;
};
export type FormularioCountApiResponse = /** status 200 OK */ ResponseOfint;
export type FormularioCountApiArg = void;
export type FormularioInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type FormularioInsertAsyncApiArg = {
  formularioDto: FormularioDto;
};
export type FormularioUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type FormularioUpdateAsyncApiArg = {
  id: number;
  formularioDto: FormularioDto;
};
export type FormularioDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type FormularioDeleteAsyncApiArg = {
  id: number;
};
export type FormularioGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfFormularioDto;
export type FormularioGetByIdAsyncApiArg = {
  id: number;
};
export type FormularioGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfFormularioDto;
export type FormularioGetAllAsyncApiArg = void;
export type FormularioGetPagedAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfFormularioDto;
export type FormularioGetPagedAsyncApiArg = {
  page?: number;
  pageSize?: number;
};
export type FormularioCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type FormularioCountAsyncApiArg = void;
export type GrupoModificadoresInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type GrupoModificadoresInsertApiArg = {
  grupoModificadorDto: GrupoModificadorDto;
};
export type GrupoModificadoresGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfGrupoModificadorDto;
export type GrupoModificadoresGetAllApiArg = void;
export type GrupoModificadoresGetByIdApiResponse =
  /** status 200 OK */ ResponseOfGrupoModificadorDto;
export type GrupoModificadoresGetByIdApiArg = {
  id: number;
};
export type GrupoModificadoresUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type GrupoModificadoresUpdateApiArg = {
  grupoModificadorDto: GrupoModificadorDto;
};
export type GrupoModificadoresDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type GrupoModificadoresDeleteApiArg = {
  id: number;
};
export type GrupoModificadoresGetAllWithPaginationApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfGrupoModificadorDto;
export type GrupoModificadoresGetAllWithPaginationApiArg = {
  page?: number;
  pageSize?: number;
};
export type GrupoModificadoresCountApiResponse =
  /** status 200 OK */ ResponseOfint;
export type GrupoModificadoresCountApiArg = void;
export type GrupoModificadoresInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type GrupoModificadoresInsertAsyncApiArg = {
  grupoModificadorDto: GrupoModificadorDto;
};
export type GrupoModificadoresGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfGrupoModificadorDto;
export type GrupoModificadoresGetAllAsyncApiArg = void;
export type GrupoModificadoresGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfGrupoModificadorDto;
export type GrupoModificadoresGetByIdAsyncApiArg = {
  id: number;
};
export type GrupoModificadoresUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type GrupoModificadoresUpdateAsyncApiArg = {
  grupoModificadorDto: GrupoModificadorDto;
};
export type GrupoModificadoresDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type GrupoModificadoresDeleteAsyncApiArg = {
  id: number;
};
export type GrupoModificadoresGetAllWithPaginationAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfGrupoModificadorDto;
export type GrupoModificadoresGetAllWithPaginationAsyncApiArg = {
  page?: number;
  pageSize?: number;
};
export type GrupoModificadoresCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type GrupoModificadoresCountAsyncApiArg = void;
export type MenusInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type MenusInsertApiArg = {
  menuDto: MenuDto;
};
export type MenusGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfMenuDto;
export type MenusGetAllApiArg = void;
export type MenusGetByIdApiResponse = /** status 200 OK */ ResponseOfMenuDto;
export type MenusGetByIdApiArg = {
  id: number;
};
export type MenusUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type MenusUpdateApiArg = {
  menuDto: MenuDto;
};
export type MenusDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type MenusDeleteApiArg = {
  id: number;
};
export type MenusGetAllWithPaginationApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfMenuDto;
export type MenusGetAllWithPaginationApiArg = {
  page?: number;
  pageSize?: number;
};
export type MenusCountApiResponse = /** status 200 OK */ ResponseOfint;
export type MenusCountApiArg = void;
export type MenusInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type MenusInsertAsyncApiArg = {
  menuDto: MenuDto;
};
export type MenusGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfMenuDto;
export type MenusGetAllAsyncApiArg = void;
export type MenusGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfMenuDto;
export type MenusGetByIdAsyncApiArg = {
  id: number;
};
export type MenusUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type MenusUpdateAsyncApiArg = {
  menuDto: MenuDto;
};
export type MenusDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type MenusDeleteAsyncApiArg = {
  id: number;
};
export type MenusGetAllWithPaginationAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfMenuDto;
export type MenusGetAllWithPaginationAsyncApiArg = {
  page?: number;
  pageSize?: number;
};
export type MenusCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type MenusCountAsyncApiArg = void;
export type OpcionModificadoresInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type OpcionModificadoresInsertApiArg = {
  opcionModificadorDto: OpcionModificadorDto;
};
export type OpcionModificadoresGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfOpcionModificadorDto;
export type OpcionModificadoresGetAllApiArg = void;
export type OpcionModificadoresGetByIdApiResponse =
  /** status 200 OK */ ResponseOfOpcionModificadorDto;
export type OpcionModificadoresGetByIdApiArg = {
  id: number;
};
export type OpcionModificadoresUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type OpcionModificadoresUpdateApiArg = {
  opcionModificadorDto: OpcionModificadorDto;
};
export type OpcionModificadoresDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type OpcionModificadoresDeleteApiArg = {
  id: number;
};
export type OpcionModificadoresGetAllWithPaginationApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfOpcionModificadorDto;
export type OpcionModificadoresGetAllWithPaginationApiArg = {
  page?: number;
  pageSize?: number;
};
export type OpcionModificadoresCountApiResponse =
  /** status 200 OK */ ResponseOfint;
export type OpcionModificadoresCountApiArg = void;
export type OpcionModificadoresInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type OpcionModificadoresInsertAsyncApiArg = {
  opcionModificadorDto: OpcionModificadorDto;
};
export type OpcionModificadoresGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfOpcionModificadorDto;
export type OpcionModificadoresGetAllAsyncApiArg = void;
export type OpcionModificadoresGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfOpcionModificadorDto;
export type OpcionModificadoresGetByIdAsyncApiArg = {
  id: number;
};
export type OpcionModificadoresUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type OpcionModificadoresUpdateAsyncApiArg = {
  opcionModificadorDto: OpcionModificadorDto;
};
export type OpcionModificadoresDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type OpcionModificadoresDeleteAsyncApiArg = {
  id: number;
};
export type OpcionModificadoresGetAllWithPaginationAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfOpcionModificadorDto;
export type OpcionModificadoresGetAllWithPaginationAsyncApiArg = {
  page?: number;
  pageSize?: number;
};
export type OpcionModificadoresCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type OpcionModificadoresCountAsyncApiArg = void;
export type PreciosInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type PreciosInsertApiArg = {
  precioDto: PrecioDto;
};
export type PreciosGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfPrecioDto;
export type PreciosGetAllApiArg = void;
export type PreciosGetByIdApiResponse =
  /** status 200 OK */ ResponseOfPrecioDto;
export type PreciosGetByIdApiArg = {
  id: number;
};
export type PreciosUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type PreciosUpdateApiArg = {
  precioDto: PrecioDto;
};
export type PreciosDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type PreciosDeleteApiArg = {
  id: number;
};
export type PreciosGetAllWithPaginationApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfPrecioDto;
export type PreciosGetAllWithPaginationApiArg = {
  page?: number;
  pageSize?: number;
};
export type PreciosCountApiResponse = /** status 200 OK */ ResponseOfint;
export type PreciosCountApiArg = void;
export type PreciosInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PreciosInsertAsyncApiArg = {
  precioDto: PrecioDto;
};
export type PreciosGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfPrecioDto;
export type PreciosGetAllAsyncApiArg = void;
export type PreciosGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfPrecioDto;
export type PreciosGetByIdAsyncApiArg = {
  id: number;
};
export type PreciosUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PreciosUpdateAsyncApiArg = {
  precioDto: PrecioDto;
};
export type PreciosDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type PreciosDeleteAsyncApiArg = {
  id: number;
};
export type PreciosGetAllWithPaginationAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfPrecioDto;
export type PreciosGetAllWithPaginationAsyncApiArg = {
  page?: number;
  pageSize?: number;
};
export type PreciosCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type PreciosCountAsyncApiArg = void;
export type ProductosInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type ProductosInsertApiArg = {
  productoDto: ProductoDto;
};
export type ProductosGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfProductoDto;
export type ProductosGetAllApiArg = void;
export type ProductosGetByIdApiResponse =
  /** status 200 OK */ ResponseOfProductoDto;
export type ProductosGetByIdApiArg = {
  id: number;
};
export type ProductosUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type ProductosUpdateApiArg = {
  productoDto: ProductoDto;
};
export type ProductosDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type ProductosDeleteApiArg = {
  id: number;
};
export type ProductosGetAllWithPaginationApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfProductoDto;
export type ProductosGetAllWithPaginationApiArg = {
  page?: number;
  pageSize?: number;
};
export type ProductosCountApiResponse = /** status 200 OK */ ResponseOfint;
export type ProductosCountApiArg = void;
export type ProductosInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type ProductosInsertAsyncApiArg = {
  productoDto: ProductoDto;
};
export type ProductosGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfProductoDto;
export type ProductosGetAllAsyncApiArg = void;
export type ProductosGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfProductoDto;
export type ProductosGetByIdAsyncApiArg = {
  id: number;
};
export type ProductosUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type ProductosUpdateAsyncApiArg = {
  productoDto: ProductoDto;
};
export type ProductosDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type ProductosDeleteAsyncApiArg = {
  id: number;
};
export type ProductosGetAllWithPaginationAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfProductoDto;
export type ProductosGetAllWithPaginationAsyncApiArg = {
  page?: number;
  pageSize?: number;
};
export type ProductosCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type ProductosCountAsyncApiArg = void;
export type RolInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type RolInsertApiArg = {
  rolDto: RolDto;
};
export type RolGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfRolDto;
export type RolGetAllApiArg = void;
export type RolGetByIdApiResponse = /** status 200 OK */ ResponseOfRolDto;
export type RolGetByIdApiArg = {
  id: number;
};
export type RolUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type RolUpdateApiArg = {
  rolDto: RolDto;
};
export type RolDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type RolDeleteApiArg = {
  id: number;
};
export type RolGetAllWithPaginationApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfRolDto;
export type RolGetAllWithPaginationApiArg = {
  page?: number;
  pageSize?: number;
};
export type RolCountApiResponse = /** status 200 OK */ ResponseOfint;
export type RolCountApiArg = void;
export type RolInsertAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type RolInsertAsyncApiArg = {
  rolDto: RolDto;
};
export type RolGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfRolDto;
export type RolGetAllAsyncApiArg = void;
export type RolGetByIdAsyncApiResponse = /** status 200 OK */ ResponseOfRolDto;
export type RolGetByIdAsyncApiArg = {
  id: number;
};
export type RolUpdateAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type RolUpdateAsyncApiArg = {
  rolDto: RolDto;
};
export type RolDeleteAsyncApiResponse = /** status 200 OK */ ResponseOfboolean;
export type RolDeleteAsyncApiArg = {
  id: number;
};
export type RolGetAllWithPaginationAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfRolDto;
export type RolGetAllWithPaginationAsyncApiArg = {
  page?: number;
  pageSize?: number;
};
export type RolCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type RolCountAsyncApiArg = void;
export type UsuarioInsertApiResponse = /** status 200 OK */ ResponseOfboolean;
export type UsuarioInsertApiArg = {
  usuarioDto: UsuarioDto;
};
export type UsuarioGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfUsuarioDto;
export type UsuarioGetAllApiArg = void;
export type UsuarioGetByIdApiResponse =
  /** status 200 OK */ ResponseOfUsuarioDto;
export type UsuarioGetByIdApiArg = {
  id: number;
};
export type UsuarioUpdateApiResponse = /** status 200 OK */ ResponseOfboolean;
export type UsuarioUpdateApiArg = {
  usuarioDto: UsuarioDto;
};
export type UsuarioDeleteApiResponse = /** status 200 OK */ ResponseOfboolean;
export type UsuarioDeleteApiArg = {
  id: number;
};
export type UsuarioGetAllWithPaginationApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfUsuarioDto;
export type UsuarioGetAllWithPaginationApiArg = {
  page?: number;
  pageSize?: number;
};
export type UsuarioCountApiResponse = /** status 200 OK */ ResponseOfint;
export type UsuarioCountApiArg = void;
export type UsuarioInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type UsuarioInsertAsyncApiArg = {
  usuarioDto: UsuarioDto;
};
export type UsuarioGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfUsuarioDto;
export type UsuarioGetAllAsyncApiArg = void;
export type UsuarioGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfUsuarioDto;
export type UsuarioGetByIdAsyncApiArg = {
  id: number;
};
export type UsuarioUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type UsuarioUpdateAsyncApiArg = {
  usuarioDto: UsuarioDto;
};
export type UsuarioDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type UsuarioDeleteAsyncApiArg = {
  id: number;
};
export type UsuarioGetAllWithPaginationAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfUsuarioDto;
export type UsuarioGetAllWithPaginationAsyncApiArg = {
  page?: number;
  pageSize?: number;
};
export type UsuarioCountAsyncApiResponse = /** status 200 OK */ ResponseOfint;
export type UsuarioCountAsyncApiArg = void;
export type UsuarioGetByCorreoWithRolesAndCredentialsAsyncApiResponse =
  /** status 200 OK */ ResponseOfUsuarioDto;
export type UsuarioGetByCorreoWithRolesAndCredentialsAsyncApiArg = {
  correo: string;
};
export type UsuarioGetByUserOrEmailWithAuthGraphAsyncApiResponse =
  /** status 200 OK */ ResponseOfUsuarioDto;
export type UsuarioGetByUserOrEmailWithAuthGraphAsyncApiArg = {
  userOrEmail: string;
};
export type UsuarioGetRoleNamesAsyncApiResponse =
  /** status 200 OK */ ResponseOfIReadOnlyListOfstring;
export type UsuarioGetRoleNamesAsyncApiArg = {
  usuarioId: number;
};
export type UsuarioGetAccesoPathsByUsuarioIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfIReadOnlyListOfstring;
export type UsuarioGetAccesoPathsByUsuarioIdAsyncApiArg = {
  usuarioId: number;
};
export type UsuarioGetPasswordCredentialAsyncApiResponse =
  /** status 200 OK */ ResponseOfObject;
export type UsuarioGetPasswordCredentialAsyncApiArg = {
  usuarioId: number;
};
export type UsuarioHasOpenTurnoAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type UsuarioHasOpenTurnoAsyncApiArg = {
  idUsuario: number;
};
export type UsuarioGetPermissionKeysByUsuarioIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfListOfstring;
export type UsuarioGetPermissionKeysByUsuarioIdAsyncApiArg = {
  usuarioId: number;
};
export type UsuarioGetPermissionsVersionAsyncApiResponse =
  /** status 200 OK */ ResponseOfstring;
export type UsuarioGetPermissionsVersionAsyncApiArg = {
  usuarioId: number;
};
export type VarianteProductosInsertApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type VarianteProductosInsertApiArg = {
  varianteProductoDto: VarianteProductoDto;
};
export type VarianteProductosGetAllApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfVarianteProductoDto;
export type VarianteProductosGetAllApiArg = void;
export type VarianteProductosGetByIdApiResponse =
  /** status 200 OK */ ResponseOfVarianteProductoDto;
export type VarianteProductosGetByIdApiArg = {
  id: number;
};
export type VarianteProductosUpdateApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type VarianteProductosUpdateApiArg = {
  varianteProductoDto: VarianteProductoDto;
};
export type VarianteProductosDeleteApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type VarianteProductosDeleteApiArg = {
  id: number;
};
export type VarianteProductosGetAllWithPaginationApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfVarianteProductoDto;
export type VarianteProductosGetAllWithPaginationApiArg = {
  page?: number;
  pageSize?: number;
};
export type VarianteProductosCountApiResponse =
  /** status 200 OK */ ResponseOfint;
export type VarianteProductosCountApiArg = void;
export type VarianteProductosInsertAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type VarianteProductosInsertAsyncApiArg = {
  varianteProductoDto: VarianteProductoDto;
};
export type VarianteProductosGetAllAsyncApiResponse =
  /** status 200 OK */ ResponseOfIEnumerableOfVarianteProductoDto;
export type VarianteProductosGetAllAsyncApiArg = void;
export type VarianteProductosGetByIdAsyncApiResponse =
  /** status 200 OK */ ResponseOfVarianteProductoDto;
export type VarianteProductosGetByIdAsyncApiArg = {
  id: number;
};
export type VarianteProductosUpdateAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type VarianteProductosUpdateAsyncApiArg = {
  varianteProductoDto: VarianteProductoDto;
};
export type VarianteProductosDeleteAsyncApiResponse =
  /** status 200 OK */ ResponseOfboolean;
export type VarianteProductosDeleteAsyncApiArg = {
  id: number;
};
export type VarianteProductosGetAllWithPaginationAsyncApiResponse =
  /** status 200 OK */ ResponsePaginationOfIEnumerableOfVarianteProductoDto;
export type VarianteProductosGetAllWithPaginationAsyncApiArg = {
  page?: number;
  pageSize?: number;
};
export type VarianteProductosCountAsyncApiResponse =
  /** status 200 OK */ ResponseOfint;
export type VarianteProductosCountAsyncApiArg = void;
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
export type PinLoginRequest = {
  userOrEmail: string | null;
  pin: string;
  usuarioId?: number | null;
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
export type GenericCatalogDto = {
  id?: number;
  descripcion?: string;
  isActive?: boolean;
  createdAt?: string;
  createdBy?: string | null;
  updatedAt?: string | null;
  updatedBy?: string | null;
};
export type CatCredencialDto = {
  id?: number;
  descripcion?: string;
};
export type ResponseOfboolean = {
  data?: boolean;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type CategoriaMenuDto = {
  id?: number;
  idMenu?: number;
  nombre?: string | null;
  orden?: number;
  activo?: boolean;
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
  activo?: boolean;
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
export type ResponseOfint = {
  data?: number;
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
export type FormValidation = {
  type?: string;
  value?: number;
};
export type SelectFormOption = {
  id?: number;
  nombre?: string;
};
export type FormFieldDto = {
  id?: number;
  type?: string;
  name?: string;
  placeholder?: string | null;
  label?: string;
  value?: string | null;
  validations?: FormValidation[];
  options?: SelectFormOption[];
  idFormulario?: number;
  formularioNombre?: string | null;
  dataSource?: string | null;
  orden?: number;
  isActive?: boolean;
};
export type FormFieldDto2 = {
  id?: number;
  type?: string;
  name?: string;
  placeholder?: string | null;
  label?: string;
  value?: string | null;
  validations?: FormValidation[];
  options?: SelectFormOption[];
  idFormulario?: number;
  formularioNombre?: string | null;
  dataSource?: string | null;
  orden?: number;
  isActive?: boolean;
} | null;
export type ResponseOfFormFieldDto = {
  data?: FormFieldDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponseOfIEnumerableOfFormFieldDto = {
  data?: FormFieldDto[] | null;
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
export type FormularioDto = {
  id?: number;
  codigo?: string;
  nombre?: string;
  descripcion?: string | null;
  campos?: FormFieldDto[];
};
export type FormularioDto2 = {
  id?: number;
  codigo?: string;
  nombre?: string;
  descripcion?: string | null;
  campos?: FormFieldDto[];
} | null;
export type ResponseOfFormularioDto = {
  data?: FormularioDto2;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponseOfIEnumerableOfFormularioDto = {
  data?: FormularioDto[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponsePaginationOfIEnumerableOfFormularioDto = {
  pageNumber?: number;
  totalPages?: number;
  totalCount?: number;
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
  data?: FormularioDto[] | null;
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
  activo?: boolean;
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
  activo?: boolean;
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
  activo?: boolean;
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
  activo?: boolean;
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
export type OpcionModificadorDto = {
  id?: number;
  idGrupo?: number;
  nombre?: string | null;
  precioExtra?: number;
  esDefault?: boolean;
  activo?: boolean;
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
  activo?: boolean;
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
export type PrecioDto = {
  id?: number;
  idVariante?: number;
  monto?: number;
  moneda?: string;
  idImpuesto?: number;
  idMoneda?: number;
  validoDesde?: string | null;
  validoHasta?: string | null;
  dias?: string | null;
  horario?: string | null;
  activo?: boolean;
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
  idImpuesto?: number;
  idMoneda?: number;
  validoDesde?: string | null;
  validoHasta?: string | null;
  dias?: string | null;
  horario?: string | null;
  activo?: boolean;
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
export type UsuarioDto = {
  id?: number;
  idEmpresa?: number;
  nombreEmpresa?: string | null;
  nombreCompleto?: string | null;
  correo?: string | null;
  isActive?: boolean;
  password?: string | null;
  pin?: string | null;
  idRol?: number | null;
  nombreRol?: string | null;
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
  nombreEmpresa?: string | null;
  nombreCompleto?: string | null;
  correo?: string | null;
  isActive?: boolean;
  password?: string | null;
  pin?: string | null;
  idRol?: number | null;
  nombreRol?: string | null;
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
export type ResponseOfIReadOnlyListOfstring = {
  data?: string[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponseOfObject = {
  data?: any;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponseOfListOfstring = {
  data?: string[] | null;
  isSuccess?: boolean;
  message?: string;
  errors?: ValidationFailure[];
};
export type ResponseOfstring = {
  data?: string | null;
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
  activo?: boolean;
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
  activo?: boolean;
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
export const {
  useAuthLoginMutation,
  useAuthLoginWithPinMutation,
  useAuthMeQuery,
  useLazyAuthMeQuery,
  useCatalogosGetAllQuery,
  useLazyCatalogosGetAllQuery,
  useCatalogosGetByIdQuery,
  useLazyCatalogosGetByIdQuery,
  useCatalogosInsertMutation,
  useCatalogosUpdateMutation,
  useCatalogosDeleteMutation,
  useCatalogosGetAllWithPaginationQuery,
  useLazyCatalogosGetAllWithPaginationQuery,
  useCatalogosCountQuery,
  useLazyCatalogosCountQuery,
  useCatalogosGetAllAsyncQuery,
  useLazyCatalogosGetAllAsyncQuery,
  useCatalogosGetByIdAsyncQuery,
  useLazyCatalogosGetByIdAsyncQuery,
  useCatalogosInsertAsyncMutation,
  useCatalogosUpdateAsyncMutation,
  useCatalogosDeleteAsyncMutation,
  useCatalogosGetAllWithPaginationAsyncQuery,
  useLazyCatalogosGetAllWithPaginationAsyncQuery,
  useCatalogosCountAsyncQuery,
  useLazyCatalogosCountAsyncQuery,
  useCatCredencialInsertMutation,
  useCatCredencialGetAllQuery,
  useLazyCatCredencialGetAllQuery,
  useCatCredencialGetByIdQuery,
  useLazyCatCredencialGetByIdQuery,
  useCatCredencialUpdateMutation,
  useCatCredencialDeleteMutation,
  useCatCredencialGetAllWithPaginationQuery,
  useLazyCatCredencialGetAllWithPaginationQuery,
  useCatCredencialCountQuery,
  useLazyCatCredencialCountQuery,
  useCatCredencialInsertAsyncMutation,
  useCatCredencialGetAllAsyncQuery,
  useLazyCatCredencialGetAllAsyncQuery,
  useCatCredencialGetByIdAsyncQuery,
  useLazyCatCredencialGetByIdAsyncQuery,
  useCatCredencialUpdateAsyncMutation,
  useCatCredencialDeleteAsyncMutation,
  useCatCredencialGetAllWithPaginationAsyncQuery,
  useLazyCatCredencialGetAllWithPaginationAsyncQuery,
  useCatCredencialCountAsyncQuery,
  useLazyCatCredencialCountAsyncQuery,
  useCategoriasInsertMutation,
  useCategoriasGetAllQuery,
  useLazyCategoriasGetAllQuery,
  useCategoriasGetByIdQuery,
  useLazyCategoriasGetByIdQuery,
  useCategoriasUpdateMutation,
  useCategoriasDeleteMutation,
  useCategoriasGetAllWithPaginationQuery,
  useLazyCategoriasGetAllWithPaginationQuery,
  useCategoriasCountQuery,
  useLazyCategoriasCountQuery,
  useCategoriasInsertAsyncMutation,
  useCategoriasGetAllAsyncQuery,
  useLazyCategoriasGetAllAsyncQuery,
  useCategoriasGetByIdAsyncQuery,
  useLazyCategoriasGetByIdAsyncQuery,
  useCategoriasUpdateAsyncMutation,
  useCategoriasDeleteAsyncMutation,
  useCategoriasGetAllWithPaginationAsyncQuery,
  useLazyCategoriasGetAllWithPaginationAsyncQuery,
  useCategoriasCountAsyncQuery,
  useLazyCategoriasCountAsyncQuery,
  useEmpresaInsertMutation,
  useEmpresaGetAllQuery,
  useLazyEmpresaGetAllQuery,
  useEmpresaGetByIdQuery,
  useLazyEmpresaGetByIdQuery,
  useEmpresaUpdateMutation,
  useEmpresaDeleteMutation,
  useEmpresaGetAllWithPaginationQuery,
  useLazyEmpresaGetAllWithPaginationQuery,
  useEmpresaCountQuery,
  useLazyEmpresaCountQuery,
  useEmpresaInsertAsyncMutation,
  useEmpresaGetAllAsyncQuery,
  useLazyEmpresaGetAllAsyncQuery,
  useEmpresaGetByIdAsyncQuery,
  useLazyEmpresaGetByIdAsyncQuery,
  useEmpresaUpdateAsyncMutation,
  useEmpresaDeleteAsyncMutation,
  useEmpresaGetAllWithPaginationAsyncQuery,
  useLazyEmpresaGetAllWithPaginationAsyncQuery,
  useEmpresaCountAsyncQuery,
  useLazyEmpresaCountAsyncQuery,
  useFormFieldInsertMutation,
  useFormFieldUpdateMutation,
  useFormFieldDeleteMutation,
  useFormFieldGetByIdQuery,
  useLazyFormFieldGetByIdQuery,
  useFormFieldGetAllQuery,
  useLazyFormFieldGetAllQuery,
  useFormFieldGetPagedQuery,
  useLazyFormFieldGetPagedQuery,
  useFormFieldCountQuery,
  useLazyFormFieldCountQuery,
  useFormFieldGetFormFieldByFormCatIdQuery,
  useLazyFormFieldGetFormFieldByFormCatIdQuery,
  useFormFieldInsertAsyncMutation,
  useFormFieldUpdateAsyncMutation,
  useFormFieldDeleteAsyncMutation,
  useFormFieldGetByIdAsyncQuery,
  useLazyFormFieldGetByIdAsyncQuery,
  useFormFieldGetAllAsyncQuery,
  useLazyFormFieldGetAllAsyncQuery,
  useFormFieldGetPagedAsyncQuery,
  useLazyFormFieldGetPagedAsyncQuery,
  useFormFieldCountAsyncQuery,
  useLazyFormFieldCountAsyncQuery,
  useFormFieldGetFormFieldByFormCatIdAsyncAsyncQuery,
  useLazyFormFieldGetFormFieldByFormCatIdAsyncAsyncQuery,
  useFormularioInsertMutation,
  useFormularioUpdateMutation,
  useFormularioDeleteMutation,
  useFormularioGetByIdQuery,
  useLazyFormularioGetByIdQuery,
  useFormularioGetAllQuery,
  useLazyFormularioGetAllQuery,
  useFormularioGetPagedQuery,
  useLazyFormularioGetPagedQuery,
  useFormularioCountQuery,
  useLazyFormularioCountQuery,
  useFormularioInsertAsyncMutation,
  useFormularioUpdateAsyncMutation,
  useFormularioDeleteAsyncMutation,
  useFormularioGetByIdAsyncQuery,
  useLazyFormularioGetByIdAsyncQuery,
  useFormularioGetAllAsyncQuery,
  useLazyFormularioGetAllAsyncQuery,
  useFormularioGetPagedAsyncQuery,
  useLazyFormularioGetPagedAsyncQuery,
  useFormularioCountAsyncQuery,
  useLazyFormularioCountAsyncQuery,
  useGrupoModificadoresInsertMutation,
  useGrupoModificadoresGetAllQuery,
  useLazyGrupoModificadoresGetAllQuery,
  useGrupoModificadoresGetByIdQuery,
  useLazyGrupoModificadoresGetByIdQuery,
  useGrupoModificadoresUpdateMutation,
  useGrupoModificadoresDeleteMutation,
  useGrupoModificadoresGetAllWithPaginationQuery,
  useLazyGrupoModificadoresGetAllWithPaginationQuery,
  useGrupoModificadoresCountQuery,
  useLazyGrupoModificadoresCountQuery,
  useGrupoModificadoresInsertAsyncMutation,
  useGrupoModificadoresGetAllAsyncQuery,
  useLazyGrupoModificadoresGetAllAsyncQuery,
  useGrupoModificadoresGetByIdAsyncQuery,
  useLazyGrupoModificadoresGetByIdAsyncQuery,
  useGrupoModificadoresUpdateAsyncMutation,
  useGrupoModificadoresDeleteAsyncMutation,
  useGrupoModificadoresGetAllWithPaginationAsyncQuery,
  useLazyGrupoModificadoresGetAllWithPaginationAsyncQuery,
  useGrupoModificadoresCountAsyncQuery,
  useLazyGrupoModificadoresCountAsyncQuery,
  useMenusInsertMutation,
  useMenusGetAllQuery,
  useLazyMenusGetAllQuery,
  useMenusGetByIdQuery,
  useLazyMenusGetByIdQuery,
  useMenusUpdateMutation,
  useMenusDeleteMutation,
  useMenusGetAllWithPaginationQuery,
  useLazyMenusGetAllWithPaginationQuery,
  useMenusCountQuery,
  useLazyMenusCountQuery,
  useMenusInsertAsyncMutation,
  useMenusGetAllAsyncQuery,
  useLazyMenusGetAllAsyncQuery,
  useMenusGetByIdAsyncQuery,
  useLazyMenusGetByIdAsyncQuery,
  useMenusUpdateAsyncMutation,
  useMenusDeleteAsyncMutation,
  useMenusGetAllWithPaginationAsyncQuery,
  useLazyMenusGetAllWithPaginationAsyncQuery,
  useMenusCountAsyncQuery,
  useLazyMenusCountAsyncQuery,
  useOpcionModificadoresInsertMutation,
  useOpcionModificadoresGetAllQuery,
  useLazyOpcionModificadoresGetAllQuery,
  useOpcionModificadoresGetByIdQuery,
  useLazyOpcionModificadoresGetByIdQuery,
  useOpcionModificadoresUpdateMutation,
  useOpcionModificadoresDeleteMutation,
  useOpcionModificadoresGetAllWithPaginationQuery,
  useLazyOpcionModificadoresGetAllWithPaginationQuery,
  useOpcionModificadoresCountQuery,
  useLazyOpcionModificadoresCountQuery,
  useOpcionModificadoresInsertAsyncMutation,
  useOpcionModificadoresGetAllAsyncQuery,
  useLazyOpcionModificadoresGetAllAsyncQuery,
  useOpcionModificadoresGetByIdAsyncQuery,
  useLazyOpcionModificadoresGetByIdAsyncQuery,
  useOpcionModificadoresUpdateAsyncMutation,
  useOpcionModificadoresDeleteAsyncMutation,
  useOpcionModificadoresGetAllWithPaginationAsyncQuery,
  useLazyOpcionModificadoresGetAllWithPaginationAsyncQuery,
  useOpcionModificadoresCountAsyncQuery,
  useLazyOpcionModificadoresCountAsyncQuery,
  usePreciosInsertMutation,
  usePreciosGetAllQuery,
  useLazyPreciosGetAllQuery,
  usePreciosGetByIdQuery,
  useLazyPreciosGetByIdQuery,
  usePreciosUpdateMutation,
  usePreciosDeleteMutation,
  usePreciosGetAllWithPaginationQuery,
  useLazyPreciosGetAllWithPaginationQuery,
  usePreciosCountQuery,
  useLazyPreciosCountQuery,
  usePreciosInsertAsyncMutation,
  usePreciosGetAllAsyncQuery,
  useLazyPreciosGetAllAsyncQuery,
  usePreciosGetByIdAsyncQuery,
  useLazyPreciosGetByIdAsyncQuery,
  usePreciosUpdateAsyncMutation,
  usePreciosDeleteAsyncMutation,
  usePreciosGetAllWithPaginationAsyncQuery,
  useLazyPreciosGetAllWithPaginationAsyncQuery,
  usePreciosCountAsyncQuery,
  useLazyPreciosCountAsyncQuery,
  useProductosInsertMutation,
  useProductosGetAllQuery,
  useLazyProductosGetAllQuery,
  useProductosGetByIdQuery,
  useLazyProductosGetByIdQuery,
  useProductosUpdateMutation,
  useProductosDeleteMutation,
  useProductosGetAllWithPaginationQuery,
  useLazyProductosGetAllWithPaginationQuery,
  useProductosCountQuery,
  useLazyProductosCountQuery,
  useProductosInsertAsyncMutation,
  useProductosGetAllAsyncQuery,
  useLazyProductosGetAllAsyncQuery,
  useProductosGetByIdAsyncQuery,
  useLazyProductosGetByIdAsyncQuery,
  useProductosUpdateAsyncMutation,
  useProductosDeleteAsyncMutation,
  useProductosGetAllWithPaginationAsyncQuery,
  useLazyProductosGetAllWithPaginationAsyncQuery,
  useProductosCountAsyncQuery,
  useLazyProductosCountAsyncQuery,
  useRolInsertMutation,
  useRolGetAllQuery,
  useLazyRolGetAllQuery,
  useRolGetByIdQuery,
  useLazyRolGetByIdQuery,
  useRolUpdateMutation,
  useRolDeleteMutation,
  useRolGetAllWithPaginationQuery,
  useLazyRolGetAllWithPaginationQuery,
  useRolCountQuery,
  useLazyRolCountQuery,
  useRolInsertAsyncMutation,
  useRolGetAllAsyncQuery,
  useLazyRolGetAllAsyncQuery,
  useRolGetByIdAsyncQuery,
  useLazyRolGetByIdAsyncQuery,
  useRolUpdateAsyncMutation,
  useRolDeleteAsyncMutation,
  useRolGetAllWithPaginationAsyncQuery,
  useLazyRolGetAllWithPaginationAsyncQuery,
  useRolCountAsyncQuery,
  useLazyRolCountAsyncQuery,
  useUsuarioInsertMutation,
  useUsuarioGetAllQuery,
  useLazyUsuarioGetAllQuery,
  useUsuarioGetByIdQuery,
  useLazyUsuarioGetByIdQuery,
  useUsuarioUpdateMutation,
  useUsuarioDeleteMutation,
  useUsuarioGetAllWithPaginationQuery,
  useLazyUsuarioGetAllWithPaginationQuery,
  useUsuarioCountQuery,
  useLazyUsuarioCountQuery,
  useUsuarioInsertAsyncMutation,
  useUsuarioGetAllAsyncQuery,
  useLazyUsuarioGetAllAsyncQuery,
  useUsuarioGetByIdAsyncQuery,
  useLazyUsuarioGetByIdAsyncQuery,
  useUsuarioUpdateAsyncMutation,
  useUsuarioDeleteAsyncMutation,
  useUsuarioGetAllWithPaginationAsyncQuery,
  useLazyUsuarioGetAllWithPaginationAsyncQuery,
  useUsuarioCountAsyncQuery,
  useLazyUsuarioCountAsyncQuery,
  useUsuarioGetByCorreoWithRolesAndCredentialsAsyncQuery,
  useLazyUsuarioGetByCorreoWithRolesAndCredentialsAsyncQuery,
  useUsuarioGetByUserOrEmailWithAuthGraphAsyncQuery,
  useLazyUsuarioGetByUserOrEmailWithAuthGraphAsyncQuery,
  useUsuarioGetRoleNamesAsyncQuery,
  useLazyUsuarioGetRoleNamesAsyncQuery,
  useUsuarioGetAccesoPathsByUsuarioIdAsyncQuery,
  useLazyUsuarioGetAccesoPathsByUsuarioIdAsyncQuery,
  useUsuarioGetPasswordCredentialAsyncQuery,
  useLazyUsuarioGetPasswordCredentialAsyncQuery,
  useUsuarioHasOpenTurnoAsyncQuery,
  useLazyUsuarioHasOpenTurnoAsyncQuery,
  useUsuarioGetPermissionKeysByUsuarioIdAsyncQuery,
  useLazyUsuarioGetPermissionKeysByUsuarioIdAsyncQuery,
  useUsuarioGetPermissionsVersionAsyncQuery,
  useLazyUsuarioGetPermissionsVersionAsyncQuery,
  useVarianteProductosInsertMutation,
  useVarianteProductosGetAllQuery,
  useLazyVarianteProductosGetAllQuery,
  useVarianteProductosGetByIdQuery,
  useLazyVarianteProductosGetByIdQuery,
  useVarianteProductosUpdateMutation,
  useVarianteProductosDeleteMutation,
  useVarianteProductosGetAllWithPaginationQuery,
  useLazyVarianteProductosGetAllWithPaginationQuery,
  useVarianteProductosCountQuery,
  useLazyVarianteProductosCountQuery,
  useVarianteProductosInsertAsyncMutation,
  useVarianteProductosGetAllAsyncQuery,
  useLazyVarianteProductosGetAllAsyncQuery,
  useVarianteProductosGetByIdAsyncQuery,
  useLazyVarianteProductosGetByIdAsyncQuery,
  useVarianteProductosUpdateAsyncMutation,
  useVarianteProductosDeleteAsyncMutation,
  useVarianteProductosGetAllWithPaginationAsyncQuery,
  useLazyVarianteProductosGetAllWithPaginationAsyncQuery,
  useVarianteProductosCountAsyncQuery,
  useLazyVarianteProductosCountAsyncQuery,
} = injectedRtkApi;
