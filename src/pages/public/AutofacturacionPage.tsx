import { useState, type CSSProperties, type ReactNode } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Download, FileText, Receipt, ShieldAlert } from 'lucide-react';
import {
  useValidarTicketQuery,
  useGenerarFacturaAutofacturaMutation,
  descargarXmlFactura,
  descargarPdfFactura,
} from '../../services/facturacionApi';
import {
  DatosFiscalesForm,
  datosFiscalesCompletos,
  DATOS_FISCALES_VACIOS,
  type DatosFiscalesReceptor,
} from '../../components/facturacion/DatosFiscalesForm';

/**
 * Portal Público de Autofacturación (spec 020). Standalone, mobile-first, sin
 * sidebar/layout autenticado — a diferencia del resto de la app, esta página no
 * pasa por `PrivateRoute` ni `AppLayout` (ver AppRouter.tsx). Se accede escaneando
 * el QR del ticket térmico (`/facturar/:ticketId`) o vía `/facturar?ticket=...`.
 */
export default function AutofacturacionPage() {
  const params = useParams<{ ticketId?: string }>();
  const [searchParams] = useSearchParams();
  const ticketGuid = params.ticketId || searchParams.get('ticket') || '';

  const { data, isLoading, isError } = useValidarTicketQuery(ticketGuid, { skip: !ticketGuid });
  const [generarFactura, { isLoading: isGenerando }] = useGenerarFacturaAutofacturaMutation();

  const [datos, setDatos] = useState<DatosFiscalesReceptor>(DATOS_FISCALES_VACIOS);
  const [resultado, setResultado] = useState<{ id: number; uuid: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const ticket = data?.data;
  const puedeFacturar = !!ticket && !ticket.yaFacturado && ticket.vigente;

  const handleSubmit = async () => {
    setError(null);
    if (!datosFiscalesCompletos(datos)) {
      setError('Completa RFC, Razón Social, Régimen Fiscal, Código Postal y Uso de CFDI.');
      return;
    }
    try {
      const res = await generarFactura({ ticketGuid, ...datos }).unwrap();
      if (res?.isSuccess) {
        setResultado(res.data);
      } else {
        setError(res?.message || 'No se pudo generar la factura.');
      }
    } catch {
      setError('Error de conexión. Intenta nuevamente en unos segundos.');
    }
  };

  return (
    <div style={wrapperStyle}>
      <div style={cardStyle}>
        <header style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
            <Receipt size={32} color="var(--color-primary, #D64545)" />
          </div>
          <h1 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--color-text, #1F1F1F)' }}>Facturación de tu Consumo</h1>
          <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--color-text-muted, #6B7280)' }}>
            Captura tus datos fiscales y genera tu factura CFDI en segundos.
          </p>
        </header>

        {!ticketGuid && (
          <Mensaje icono={<ShieldAlert size={28} color="var(--color-danger, #D64545)" />} titulo="Ticket no especificado" texto="Escanea nuevamente el código QR de tu ticket o solicita el enlace en caja." />
        )}

        {ticketGuid && isLoading && (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--color-text-muted)' }}>Validando ticket...</div>
        )}

        {ticketGuid && !isLoading && (isError || !ticket) && (
          <Mensaje icono={<ShieldAlert size={28} color="var(--color-danger, #D64545)" />} titulo="Ticket no encontrado" texto="No pudimos validar este ticket. Verifica el código o pide ayuda al personal del restaurante." />
        )}

        {ticket && ticket.yaFacturado && (
          <Mensaje icono={<CheckCircle2 size={28} color="var(--color-success, #3C8D40)" />} titulo="Este ticket ya fue facturado" texto="Si necesitas reenviar tu factura, contacta al restaurante con tu folio de venta." />
        )}

        {ticket && !ticket.yaFacturado && !ticket.vigente && (
          <Mensaje icono={<ShieldAlert size={28} color="var(--color-warning, #E2A72E)" />} titulo="Vigencia de facturación vencida" texto="El periodo para facturar este ticket ya concluyó. Solicita apoyo directamente en el restaurante." />
        )}

        {puedeFacturar && !resultado && (
          <>
            <div style={ticketInfoStyle}>
              {ticket!.fechaPedido && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-muted)' }}>
                  <span>Fecha</span>
                  <span>{new Date(ticket!.fechaPedido).toLocaleDateString()}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', marginTop: 6 }}>
                <span>Total a Facturar</span>
                <span>${ticket!.total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ marginTop: 18 }}>
              <DatosFiscalesForm value={datos} onChange={setDatos} showEmail />
            </div>

            {error && (
              <div style={{ marginTop: 12, padding: 10, borderRadius: 10, background: 'var(--color-danger-bg, rgba(214,69,69,0.12))', color: 'var(--color-danger, #D64545)', fontSize: 13 }}>
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={isGenerando}
              style={{
                width: '100%',
                marginTop: 18,
                padding: '14px',
                border: 'none',
                borderRadius: 'var(--radius-md, 12px)',
                background: 'var(--color-primary, #D64545)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: isGenerando ? 'not-allowed' : 'pointer',
                opacity: isGenerando ? 0.7 : 1,
              }}
            >
              {isGenerando ? 'Generando factura...' : 'Generar Factura'}
            </button>
          </>
        )}

        {resultado && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <CheckCircle2 size={40} color="var(--color-success, #3C8D40)" style={{ marginBottom: 10 }} />
            <h2 style={{ margin: '0 0 6px', fontSize: '1.1rem', color: 'var(--color-text)' }}>¡Factura generada!</h2>
            <p style={{ margin: '0 0 16px', fontSize: 13, color: 'var(--color-text-muted)' }}>
              UUID: {resultado.uuid}
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={() => descargarXmlFactura(resultado.id)}
                style={downloadBtnStyle}
              >
                <FileText size={16} /> Descargar XML
              </button>
              <button
                onClick={() => descargarPdfFactura(resultado.id)}
                style={{ ...downloadBtnStyle, background: 'var(--color-primary, #D64545)', color: '#fff', borderColor: 'var(--color-primary, #D64545)' }}
              >
                <Download size={16} /> Descargar PDF
              </button>
            </div>
            <p style={{ marginTop: 16, fontSize: 12, color: 'var(--color-text-muted)' }}>
              También enviamos una copia a tu correo si lo proporcionaste.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Mensaje({ icono, titulo, texto }: { icono: ReactNode; titulo: string; texto: string }) {
  return (
    <div style={{ textAlign: 'center', padding: '20px 10px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>{icono}</div>
      <h2 style={{ margin: '0 0 6px', fontSize: '1.05rem', color: 'var(--color-text, #1F1F1F)' }}>{titulo}</h2>
      <p style={{ margin: 0, fontSize: 13, color: 'var(--color-text-muted, #6B7280)' }}>{texto}</p>
    </div>
  );
}

const wrapperStyle: CSSProperties = {
  minHeight: '100dvh',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '24px 16px',
  background: 'var(--color-bg, #F9F9F9)',
  boxSizing: 'border-box',
};

const cardStyle: CSSProperties = {
  width: '100%',
  maxWidth: 480,
  background: 'var(--color-surface, #FFFFFF)',
  borderRadius: 'var(--radius-lg, 20px)',
  boxShadow: 'var(--shadow-lg, 0 12px 28px rgba(0,0,0,0.1))',
  padding: '24px 20px',
  boxSizing: 'border-box',
};

const ticketInfoStyle: CSSProperties = {
  padding: 14,
  borderRadius: 'var(--radius-md, 12px)',
  background: 'var(--color-surface-raised, #F4F6F8)',
  border: '1px solid var(--color-border, rgba(0,0,0,0.08))',
};

const downloadBtnStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  padding: '10px 16px',
  borderRadius: 10,
  border: '1px solid var(--color-border, rgba(0,0,0,0.12))',
  background: 'var(--color-surface, #FFFFFF)',
  color: 'var(--color-text, #1F1F1F)',
  fontWeight: 600,
  cursor: 'pointer',
};
