import { emptySplitApi } from "./baseApi";

export interface Proveedor {
  id: number;
  idEmpresa: number;
  rfc: string;
  razonSocial: string;
  nombreComercial?: string;
  email?: string;
  telefono?: string;
  contacto?: string;
  direccion?: string;
  regimenFiscal?: string;
  diasCredito: number;
  banco?: string;
  cuentaBancaria?: string;
  isActive: boolean;
  totalCompras: number;
  montoTotalComprado: number;
}

export interface CrearProveedorPayload {
  idEmpresa?: number;
  rfc: string;
  razonSocial: string;
  nombreComercial?: string;
  email?: string;
  telefono?: string;
  contacto?: string;
  direccion?: string;
  regimenFiscal?: string;
  diasCredito?: number;
  banco?: string;
  cuentaBancaria?: string;
}

export interface ActualizarProveedorPayload extends CrearProveedorPayload {
  id: number;
  isActive: boolean;
}

export interface MapeoInsumoProveedor {
  id: number;
  idProveedor: number;
  proveedorNombre?: string;
  descripcionSAT: string;
  claveProdServ: string;
  unidadSAT?: string;
  idInsumo: number;
  insumoCodigo?: string;
  insumoNombre: string;
  unidadMedidaNombre?: string;
  factorConversion: number;
  fechaRegistro: string;
  fechaUltimaCompra?: string;
}

export interface GuardarMapeoPayload {
  idProveedor: number;
  descripcionSAT: string;
  claveProdServ: string;
  unidadSAT?: string;
  idInsumo: number;
  factorConversion: number;
}

export interface CfdiConcepto {
  renglon: number;
  claveProdServ: string;
  noIdentificacion?: string;
  cantidad: number;
  claveUnidad?: string;
  unidad?: string;
  descripcion: string;
  valorUnitario: number;
  importe: number;
  descuento: number;
  tasaIVA: number;
  importeIVA: number;
  tasaIEPS: number;
  importeIEPS: number;
  importeTotal: number;
  idInsumoSugerido?: number;
  insumoNombreSugerido?: string;
  insumoCodigoSugerido?: string;
  unidadMedidaBaseSugerida?: string;
  factorConversionSugerido: number;
  sugeridoPorMapeo: boolean;
  idMapeoExistente?: number;
}

export interface CfdiParseResult {
  uuid?: string;
  serie?: string;
  folio: string;
  fechaEmision: string;
  formaPago?: string;
  metodoPago?: string;
  condicionesDePago?: string;
  moneda: string;
  rfcEmisor: string;
  nombreEmisor: string;
  regimenFiscalEmisor?: string;
  rfcReceptor: string;
  nombreReceptor: string;
  subtotal: number;
  descuento: number;
  totalIVA: number;
  totalIEPS: number;
  total: number;
  proveedorExistenteId?: number;
  proveedorExistenteNombre?: string;
  proveedorExistenteDiasCredito?: number;
  esProveedorNuevo: boolean;
  facturaYaExiste: boolean;
  facturaExistenteId?: number;
  facturaExistenteEstado?: string;
  mensajeValidacion?: string;
  conceptos: CfdiConcepto[];
}

export interface CompraFacturaDetalle {
  id: number;
  idCompraFactura: number;
  idInsumo: number;
  insumoCodigo?: string;
  insumoNombre: string;
  claveProdServ?: string;
  descripcionOriginal?: string;
  unidadSAT?: string;
  cantidad: number;
  idUnidadMedida?: number;
  unidadMedidaNombre?: string;
  factorConversion: number;
  cantidadInsumo: number;
  costoUnitario: number;
  importe: number;
  descuento: number;
  tasaIVA: number;
  importeIVA: number;
  tasaIEPS: number;
  importeIEPS: number;
  importeTotal: number;
}

export interface CompraFactura {
  id: number;
  idEmpresa: number;
  idSucursal: number;
  sucursalNombre: string;
  idAlmacen: number;
  almacenNombre: string;
  idProveedor: number;
  proveedorRFC: string;
  proveedorRazonSocial: string;
  uuid?: string;
  serie?: string;
  folio: string;
  fechaEmision: string;
  fechaRecepcion: string;
  esCredito: boolean;
  diasCredito: number;
  fechaVencimiento?: string;
  subtotal: number;
  totalDescuento: number;
  totalIVA: number;
  totalIEPS: number;
  total: number;
  estado: "Borrador" | "Aplicada" | "Cancelada";
  rutaArchivoXML?: string;
  rutaArchivoPDF?: string;
  observaciones?: string;
  idUsuario?: number;
  usuarioNombre?: string;
  detalles: CompraFacturaDetalle[];
}

export interface CompraItemResumen {
  id: number;
  uuid?: string;
  serie?: string;
  folio: string;
  fechaEmision: string;
  fechaRecepcion: string;
  sucursalNombre: string;
  almacenNombre: string;
  proveedorRFC: string;
  proveedorRazonSocial: string;
  esCredito: boolean;
  diasCredito: number;
  fechaVencimiento?: string;
  total: number;
  estado: string;
  cantidadPartidas: number;
}

export interface RegistrarCompraDetallePayload {
  idInsumo: number;
  claveProdServ?: string;
  descripcionOriginal?: string;
  unidadSAT?: string;
  cantidad: number;
  idUnidadMedida?: number;
  factorConversion: number;
  costoUnitario: number;
  importe?: number;
  descuento?: number;
  tasaIVA: number;
  importeIVA: number;
  tasaIEPS?: number;
  importeIEPS?: number;
  importeTotal: number;
}

export interface RegistrarCompraPayload {
  idEmpresa?: number;
  idSucursal: number;
  idAlmacen: number;
  idProveedor: number;
  proveedorNuevo?: CrearProveedorPayload;
  uuid?: string;
  serie?: string;
  folio: string;
  fechaEmision: string;
  esCredito: boolean;
  diasCredito?: number;
  fechaVencimiento?: string;
  subtotal: number;
  totalDescuento?: number;
  totalIVA: number;
  totalIEPS?: number;
  total: number;
  observaciones?: string;
  aplicarDirecto: boolean;
  guardarMapeos: boolean;
  detalles: RegistrarCompraDetallePayload[];
}

export interface CompraFiltro {
  idSucursal?: number;
  idAlmacen?: number;
  idProveedor?: number;
  estado?: string;
  fechaInicio?: string;
  fechaFin?: string;
  buscar?: string;
}

export interface ResumenKpisCompras {
  totalComprasMes: number;
  totalFacturasMes: number;
  totalCreditoPendiente: number;
  facturasPendientesPago: number;
  facturasAplicadas: number;
  facturasBorrador: number;
}

export const comprasApi = emptySplitApi.injectEndpoints({
  endpoints: (build) => ({
    // Proveedores
    getProveedores: build.query<Proveedor[], { buscar?: string; activo?: boolean; idEmpresa?: number } | void>({
      query: (params) => ({
        url: "/api/Proveedores",
        params: params || {},
      }),
      transformResponse: (response: { data: Proveedor[] }) => response.data || [],
      providesTags: ["Proveedor"],
    }),

    getProveedorPorId: build.query<Proveedor, number>({
      query: (id) => `/api/Proveedores/${id}`,
      transformResponse: (response: { data: Proveedor }) => response.data,
      providesTags: (_res, _err, id) => [{ type: "Proveedor", id }],
    }),

    crearProveedor: build.mutation<Proveedor, CrearProveedorPayload>({
      query: (body) => ({
        url: "/api/Proveedores",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Proveedor"],
    }),

    actualizarProveedor: build.mutation<Proveedor, ActualizarProveedorPayload>({
      query: ({ id, ...body }) => ({
        url: `/api/Proveedores/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Proveedor"],
    }),

    eliminarProveedor: build.mutation<boolean, number>({
      query: (id) => ({
        url: `/api/Proveedores/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Proveedor"],
    }),

    // Mapeos SAT ➔ Insumos
    getMapeosProveedor: build.query<MapeoInsumoProveedor[], number>({
      query: (idProveedor) => `/api/Proveedores/${idProveedor}/Mapeos`,
      transformResponse: (response: { data: MapeoInsumoProveedor[] }) => response.data || [],
      providesTags: ["MapeoInsumo"],
    }),

    guardarMapeo: build.mutation<MapeoInsumoProveedor, { idProveedor: number; payload: GuardarMapeoPayload }>({
      query: ({ idProveedor, payload }) => ({
        url: `/api/Proveedores/${idProveedor}/Mapeos`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["MapeoInsumo"],
    }),

    eliminarMapeo: build.mutation<boolean, { idProveedor: number; idMapeo: number }>({
      query: ({ idProveedor, idMapeo }) => ({
        url: `/api/Proveedores/${idProveedor}/Mapeos/${idMapeo}`,
        method: "DELETE",
      }),
      invalidatesTags: ["MapeoInsumo"],
    }),

    // CFDI XML Parsing
    parseXmlCfdi: build.mutation<CfdiParseResult, { xmlContent: string; nombreArchivo?: string }>({
      query: (body) => ({
        url: "/api/Compras/ParseXml",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: CfdiParseResult }) => response.data,
    }),

    verificarUuid: build.query<boolean, string>({
      query: (uuid) => `/api/Compras/VerificarUUID/${uuid}`,
      transformResponse: (response: { data: boolean }) => Boolean(response.data),
    }),

    // Facturas y Compras
    getCompras: build.query<CompraItemResumen[], CompraFiltro | void>({
      query: (params) => ({
        url: "/api/Compras",
        params: params || {},
      }),
      transformResponse: (response: { data: CompraItemResumen[] }) => response.data || [],
      providesTags: ["CompraFactura"],
    }),

    getCompraPorId: build.query<CompraFactura, number>({
      query: (id) => `/api/Compras/${id}`,
      transformResponse: (response: { data: CompraFactura }) => response.data,
      providesTags: (_res, _err, id) => [{ type: "CompraFactura", id }],
    }),

    getKpisCompras: build.query<ResumenKpisCompras, { idSucursal?: number } | void>({
      query: (params) => ({
        url: "/api/Compras/Kpis",
        params: params || {},
      }),
      transformResponse: (response: { data: ResumenKpisCompras }) => response.data,
      providesTags: ["CompraFactura"],
    }),

    registrarCompra: build.mutation<CompraFactura, RegistrarCompraPayload>({
      query: (body) => ({
        url: "/api/Compras",
        method: "POST",
        body,
      }),
      invalidatesTags: ["CompraFactura", "Proveedor", "MapeoInsumo", "Insumo", "InventarioExistencia", "KardexMovimiento"],
    }),

    aplicarCompra: build.mutation<CompraFactura, number>({
      query: (id) => ({
        url: `/api/Compras/${id}/Aplicar`,
        method: "POST",
      }),
      invalidatesTags: ["CompraFactura", "Insumo", "InventarioExistencia", "KardexMovimiento", "MapeoInsumo"],
    }),

    cancelarCompra: build.mutation<boolean, { id: number; motivo?: string }>({
      query: ({ id, motivo }) => ({
        url: `/api/Compras/${id}/Cancelar`,
        method: "POST",
        body: { motivo },
      }),
      invalidatesTags: ["CompraFactura", "Insumo", "InventarioExistencia", "KardexMovimiento"],
    }),

    getRegimenesFiscales: build.query<Array<{ id: number; codigo: string; descripcion: string; nombreCompleto: string }>, void>({
      query: () => "/api/catalogos/regimenes-fiscales/GetAllAsync",
      transformResponse: (response: any) => {
        const rawList = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
          ? response
          : [];

        return rawList
          .filter((item: any) => item.isActive !== false)
          .map((item: any) => {
            const codigo = item.codigo || item.descripcion?.substring(0, 3) || "";
            const desc = item.descripcion || "";
            return {
              id: item.id,
              codigo,
              descripcion: desc,
              nombreCompleto: `${codigo} - ${desc}`,
            };
          });
      },
    }),
  }),
});

export const {
  useGetProveedoresQuery,
  useGetProveedorPorIdQuery,
  useCrearProveedorMutation,
  useActualizarProveedorMutation,
  useEliminarProveedorMutation,
  useGetMapeosProveedorQuery,
  useGuardarMapeoMutation,
  useEliminarMapeoMutation,
  useParseXmlCfdiMutation,
  useLazyVerificarUuidQuery,
  useGetComprasQuery,
  useGetCompraPorIdQuery,
  useGetKpisComprasQuery,
  useRegistrarCompraMutation,
  useAplicarCompraMutation,
  useCancelarCompraMutation,
  useGetRegimenesFiscalesQuery,
} = comprasApi;
