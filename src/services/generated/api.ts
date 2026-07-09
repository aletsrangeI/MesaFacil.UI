import { emptySplitApi as api } from "../baseApi";
export const addTagTypes = [
  "Auth",
  "Catalogos",
  "CatCredencial",
  "Empresa",
  "FormField",
  "Formulario",
  "Rol",
  "Usuario",
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
export type ResponseOfint = {
  data?: number;
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
} = injectedRtkApi;
