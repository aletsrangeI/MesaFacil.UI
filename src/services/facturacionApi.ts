// src/services/facturacionApi.ts
//
// Endpoints de Facturación CFDI 4.0 (spec 020-facturacion-cfdi-ventas-autofacturacion-timbres).
// Escrito a mano siguiendo el patrón de `movimientoCajaApi.ts` porque `npm run api:gen`
// está roto por un bug preexistente (rutas duplicadas en otros controladores) no
// relacionado con este feature.
//
// NOTA: El backend local (http://localhost:5286) no estuvo disponible durante la
// redacción de este archivo, por lo que los DTOs se modelaron a partir del dominio
// descrito en specs/020-.../spec.md (sección 3 y 4) y de las convenciones ya usadas
// en el resto de la app (wrapper `{ isSuccess, data, message }`, JSON camelCase).
// Si al conectar contra el backend real los nombres de campo difieren, ajustar aquí
// sin tocar los componentes que consumen los hooks.
import { emptySplitApi as api } from './baseApi';

/** Respuesta genérica usada en toda la API */
export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
  message?: string;
}

/** Motivos de cancelación SAT (Anexo 20) */
export type MotivoCancelacionSat = '01' | '02' | '03' | '04';

/** Los 10 regímenes fiscales SAT más comunes (persona física y moral) */
export const REGIMENES_FISCALES_SAT = [
  { clave: '601', descripcion: '601 - General de Ley Personas Morales' },
  { clave: '603', descripcion: '603 - Personas Morales con Fines no Lucrativos' },
  { clave: '605', descripcion: '605 - Sueldos y Salarios e Ingresos Asimilados a Salarios' },
  { clave: '606', descripcion: '606 - Arrendamiento' },
  { clave: '608', descripcion: '608 - Demás ingresos' },
  { clave: '612', descripcion: '612 - Personas Físicas con Actividades Empresariales y Profesionales' },
  { clave: '614', descripcion: '614 - Ingresos por intereses' },
  { clave: '616', descripcion: '616 - Sin obligaciones fiscales' },
  { clave: '621', descripcion: '621 - Incorporación Fiscal' },
  { clave: '626', descripcion: '626 - Régimen Simplificado de Confianza' },
] as const;

/** Los usos de CFDI más comunes para ventas a comensales */
export const USOS_CFDI = [
  { clave: 'G01', descripcion: 'G01 - Adquisición de mercancías' },
  { clave: 'G03', descripcion: 'G03 - Gastos en general' },
  { clave: 'S01', descripcion: 'S01 - Sin efectos fiscales' },
  { clave: 'D10', descripcion: 'D10 - Pagos por servicios educativos' },
  { clave: 'P01', descripcion: 'P01 - Por definir' },
] as const;

export const MOTIVOS_CANCELACION_SAT: { clave: MotivoCancelacionSat; descripcion: string }[] = [
  { clave: '01', descripcion: '01 - Comprobante emitido con errores con relación' },
  { clave: '02', descripcion: '02 - Comprobante emitido con errores sin relación' },
  { clave: '03', descripcion: '03 - No se llevó a cabo la operación' },
  { clave: '04', descripcion: '04 - Operación nominativa relacionada en factura global' },
];

/** Regex SAT para RFC de persona física (13) o moral (12) */
export const RFC_REGEX = /^([A-ZÑ&]{3,4})\d{6}[A-Z0-9]{3}$/i;

export function isRfcValido(rfc: string): boolean {
  if (!rfc) return false;
  const limpio = rfc.trim().toUpperCase();
  if (limpio === 'XAXX010101000' || limpio === 'XEXX010101000') return true;
  return RFC_REGEX.test(limpio) && (limpio.length === 12 || limpio.length === 13);
}

/** Datos fiscales del receptor capturados en POS o en el portal público */
export interface DatosFiscalesReceptor {
  rfcReceptor: string;
  nombreReceptor: string;
  regimenFiscalReceptor: string;
  codigoPostalReceptor: string;
  usoCfdi: string;
  correoReceptor?: string;
}

export interface TimbrarPedidoRequest extends DatosFiscalesReceptor {
  /** Guid del Pedido ya pagado (Pedido.Id es string/Guid) */
  pedidoId: string;
  formaPago?: string;
  metodoPago?: string;
}

export interface FacturaVentaItem {
  id: number;
  empresaId: number;
  sucursalId: number;
  pedidoId: string;
  uuid: string;
  serie: string;
  folio: string;
  fechaTimbrado: string;
  rfcReceptor: string;
  nombreReceptor: string;
  regimenFiscalReceptor: string;
  codigoPostalReceptor: string;
  usoCfdi: string;
  formaPago: string;
  metodoPago: string;
  subtotal: number;
  descuento: number;
  iva: number;
  total: number;
  estadoFiscal: 'Vigente' | 'Cancelado' | 'Pendiente' | string;
  motivoCancelacion?: string | null;
  ticketAutofacturaGuid?: string;
}

export interface TimbrarPedidoResponseData {
  factura: FacturaVentaItem;
  urlXml?: string;
  urlPdf?: string;
}

export interface CancelarFacturaRequest {
  motivoSat: MotivoCancelacionSat;
  folioSustitucion?: string;
}

export interface EnviarCorreoRequest {
  correo?: string;
}

export interface BolsaTimbresConsumo {
  id: number;
  fecha: string;
  tipo: 'Compra' | 'Consumo';
  cantidad: number;
  facturaVentaId?: number;
  descripcion?: string;
}

export interface BolsaTimbresData {
  empresaId: number;
  timbresDisponibles: number;
  timbresConsumidos: number;
  ultimaRecargaFecha?: string;
  historial: BolsaTimbresConsumo[];
}

export interface GetFacturasParams {
  fechaInicio?: string;
  fechaFin?: string;
  rfc?: string;
}

/** === Portal público de autofacturación (sin auth) === */
export interface ValidarTicketData {
  pedidoId: string;
  ticketGuid: string;
  total: number;
  fecha: string;
  folio?: string;
  yaFacturado: boolean;
  vigente: boolean;
  nombreSucursal?: string;
}

export interface GenerarFacturaAutofacturaRequest extends DatosFiscalesReceptor {
  ticketGuid: string;
}

export interface GenerarFacturaAutofacturaData {
  facturaVentaId: number;
  uuid: string;
  urlXml: string;
  urlPdf: string;
}

export const facturacionApi = api.injectEndpoints({
  endpoints: (build) => ({
    // ---- POS / Administración (requiere auth) ----
    timbrarPedido: build.mutation<ApiResponse<TimbrarPedidoResponseData>, TimbrarPedidoRequest>({
      query: (body) => ({
        url: '/api/FacturasVenta/timbrar-pedido',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FacturaVenta', 'BolsaTimbres', 'Pedido'],
    }),

    getFacturas: build.query<ApiResponse<FacturaVentaItem[]>, GetFacturasParams | void>({
      query: (params) => ({
        url: '/api/FacturasVenta',
        params: params ?? undefined,
      }),
      providesTags: ['FacturaVenta'],
    }),

    enviarCorreo: build.mutation<ApiResponse<null>, { id: number } & EnviarCorreoRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/FacturasVenta/${id}/enviar-correo`,
        method: 'POST',
        body,
      }),
    }),

    cancelarFactura: build.mutation<ApiResponse<FacturaVentaItem>, { id: number } & CancelarFacturaRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/FacturasVenta/${id}/cancelar`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['FacturaVenta'],
    }),

    getBolsaTimbres: build.query<ApiResponse<BolsaTimbresData>, void>({
      query: () => ({
        url: '/api/FacturasVenta/bolsa-timbres',
      }),
      providesTags: ['BolsaTimbres'],
    }),

    // ---- Portal público de Autofacturación (sin auth) ----
    validarTicket: build.query<ApiResponse<ValidarTicketData>, string>({
      query: (guid) => ({
        url: `/api/Autofacturacion/validar-ticket/${guid}`,
      }),
    }),

    generarFacturaAutofactura: build.mutation<
      ApiResponse<GenerarFacturaAutofacturaData>,
      GenerarFacturaAutofacturaRequest
    >({
      query: (body) => ({
        url: '/api/Autofacturacion/generar-factura',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useTimbrarPedidoMutation,
  useGetFacturasQuery,
  useEnviarCorreoMutation,
  useCancelarFacturaMutation,
  useGetBolsaTimbresQuery,
  useValidarTicketQuery,
  useLazyValidarTicketQuery,
  useGenerarFacturaAutofacturaMutation,
} = facturacionApi;

/**
 * Descarga un archivo binario (XML/PDF) disparando un `fetch` directo con manejo de
 * blob y un link temporal. No existía un patrón previo de descarga de archivos en el
 * proyecto (tickets térmicos usan `window.print()`, no descarga de blobs), así que se
 * implementa aquí de forma autocontenida, agregando el Bearer token si existe sesión
 * (para las rutas de administración) y funcionando también sin sesión (portal público).
 */
export async function descargarArchivoFactura(url: string, nombreArchivo: string): Promise<void> {
  const headers: HeadersInit = {};
  try {
    const raw = localStorage.getItem('mf_auth');
    if (raw) {
      const { accessToken } = JSON.parse(raw);
      if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;
    }
  } catch {
    // sin sesión activa (ej. portal público de autofacturación): continúa sin header
  }

  const res = await fetch(url, { method: 'GET', headers, credentials: 'include' });
  if (!res.ok) {
    throw new Error(`No se pudo descargar el archivo (HTTP ${res.status})`);
  }
  const blob = await res.blob();
  const objectUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = nombreArchivo;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(objectUrl);
}

export function descargarXmlFactura(facturaId: number, folio?: string) {
  return descargarArchivoFactura(
    `/api/FacturasVenta/${facturaId}/descargar-xml`,
    `factura-${folio || facturaId}.xml`
  );
}

export function descargarPdfFactura(facturaId: number, folio?: string) {
  return descargarArchivoFactura(
    `/api/FacturasVenta/${facturaId}/descargar-pdf`,
    `factura-${folio || facturaId}.pdf`
  );
}
