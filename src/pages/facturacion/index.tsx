import { useMemo, useState, type CSSProperties } from 'react';
import {
  Calendar,
  Download,
  FileText,
  Gauge,
  Mail,
  Receipt,
  RefreshCw,
  Search,
  XCircle,
} from 'lucide-react';
import Container from '../../components/ui/layout/Container';
import { useToast } from '../../components/ui/toast';
import { Modal } from '../../components/modal/Modal';
import {
  useGetFacturasQuery,
  useGetBolsaTimbresQuery,
  useCancelarFacturaMutation,
  useEnviarCorreoMutation,
  descargarXmlFactura,
  descargarPdfFactura,
  MOTIVOS_CANCELACION_SAT,
  type FacturaVentaItem,
  type MotivoCancelacionSat,
} from '../../services/facturacionApi';

function BolsaTimbresWidget() {
  const { data, isLoading, refetch, isFetching } = useGetBolsaTimbresQuery();
  const bolsa = data?.data;

  const disponibles = bolsa?.timbresDisponibles ?? 0;
  const semaforo: 'green' | 'yellow' | 'red' =
    disponibles <= 0 ? 'red' : disponibles < 20 ? 'yellow' : 'green';

  const colores = {
    green: { bg: 'rgba(60, 141, 64, 0.08)', border: 'rgba(60, 141, 64, 0.25)', text: '#2f7233' },
    yellow: { bg: 'rgba(226, 167, 46, 0.1)', border: 'rgba(226, 167, 46, 0.3)', text: '#a56a10' },
    red: { bg: 'rgba(214, 69, 69, 0.08)', border: 'rgba(214, 69, 69, 0.3)', text: '#b93c3c' },
  }[semaforo];

  return (
    <div
      style={{
        padding: 18,
        borderRadius: 14,
        background: colores.bg,
        border: `1px solid ${colores.border}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        minWidth: 260,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: colores.text, fontSize: 13, fontWeight: 700 }}>
          <Gauge size={18} />
          Bolsa de Timbres
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          title="Actualizar saldo"
          style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: colores.text }}
        >
          <RefreshCw size={14} style={{ animation: isFetching ? 'spin 1s linear infinite' : 'none' }} />
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: '2rem', fontWeight: 800, color: colores.text }}>
          {isLoading ? '…' : disponibles}
        </span>
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>timbres disponibles</span>
      </div>

      <div style={{ display: 'flex', gap: 4 }}>
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: semaforo === 'green' ? '#3C8D40' : 'rgba(60,141,64,0.25)',
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: semaforo === 'yellow' ? '#E2A72E' : 'rgba(226,167,46,0.25)',
          }}
        />
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: semaforo === 'red' ? '#D64545' : 'rgba(214,69,69,0.25)',
          }}
        />
      </div>

      {semaforo !== 'green' && (
        <div style={{ fontSize: 12, color: colores.text, fontWeight: 600, marginTop: 2 }}>
          {semaforo === 'red'
            ? 'Sin timbres disponibles. Recarga un paquete para seguir facturando.'
            : 'Saldo bajo (< 20). Considera recargar un paquete de timbres.'}
        </div>
      )}

      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
        {bolsa?.timbresConsumidos ?? 0} timbres consumidos históricamente
      </div>
    </div>
  );
}

function estadoBadgeColor(estado: string) {
  if (estado === 'Cancelado') return { bg: 'rgba(214, 69, 69, 0.1)', color: '#b93c3c' };
  if (estado === 'Pendiente') return { bg: 'rgba(226, 167, 46, 0.12)', color: '#a56a10' };
  return { bg: 'rgba(60, 141, 64, 0.1)', color: '#2f7233' };
}

export default function FacturacionPage() {
  const hoy = useMemo(() => new Date().toISOString().split('T')[0], []);
  const inicioMes = useMemo(() => `${hoy.slice(0, 7)}-01`, [hoy]);

  const [fechaInicio, setFechaInicio] = useState(inicioMes);
  const [fechaFin, setFechaFin] = useState(hoy);
  const [rfc, setRfc] = useState('');
  const [facturaCancelar, setFacturaCancelar] = useState<FacturaVentaItem | null>(null);
  const [motivoSat, setMotivoSat] = useState<MotivoCancelacionSat>('02');

  const { addToast } = useToast();

  const { data, isLoading, isFetching, refetch } = useGetFacturasQuery({
    fechaInicio: fechaInicio ? `${fechaInicio}T00:00:00Z` : undefined,
    fechaFin: fechaFin ? `${fechaFin}T23:59:59Z` : undefined,
    rfc: rfc || undefined,
  });

  const [cancelarFactura, { isLoading: isCancelando }] = useCancelarFacturaMutation();
  const [enviarCorreo] = useEnviarCorreoMutation();

  const facturas = data?.data || [];

  const handleDescargarXml = async (f: FacturaVentaItem) => {
    try {
      await descargarXmlFactura(f.id, f.folio);
    } catch {
      addToast({ message: 'No se pudo descargar el XML', variant: 'error' });
    }
  };

  const handleDescargarPdf = async (f: FacturaVentaItem) => {
    try {
      await descargarPdfFactura(f.id, f.folio);
    } catch {
      addToast({ message: 'No se pudo descargar el PDF', variant: 'error' });
    }
  };

  const handleEnviarCorreo = async (f: FacturaVentaItem) => {
    try {
      const res = await enviarCorreo({ id: f.id }).unwrap();
      addToast({
        message: res?.isSuccess ? 'Factura enviada por correo' : res?.message || 'No se pudo enviar el correo',
        variant: res?.isSuccess ? 'success' : 'error',
      });
    } catch {
      addToast({ message: 'Error de conexión al enviar el correo', variant: 'error' });
    }
  };

  const handleConfirmarCancelacion = async () => {
    if (!facturaCancelar) return;
    try {
      const res = await cancelarFactura({ id: facturaCancelar.id, motivoSat }).unwrap();
      addToast({
        message: res?.isSuccess ? 'Factura cancelada ante el SAT' : res?.message || 'No se pudo cancelar la factura',
        variant: res?.isSuccess ? 'success' : 'error',
      });
      setFacturaCancelar(null);
    } catch {
      addToast({ message: 'Error de conexión al cancelar la factura', variant: 'error' });
    }
  };

  return (
    <Container as="div" maxWidth="xl" style={{ padding: '24px 32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ margin: '0 0 6px 0', fontSize: '1.6rem', fontWeight: 700, color: 'var(--color-text)' }}>
            Facturación CFDI
          </h1>
          <p style={{ margin: 0, fontSize: 14, color: 'var(--color-text-muted)' }}>
            Facturas emitidas a comensales, cancelación ante el SAT y control de la bolsa de timbres.
          </p>
        </div>

        <BolsaTimbresWidget />
      </div>

      {/* Filtros */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          padding: 16,
          borderRadius: 14,
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          marginBottom: 20,
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={18} color="var(--color-text-muted)" />
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 13 }}
          />
          <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>a</span>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 13 }}
          />
        </div>

        <div style={{ position: 'relative', minWidth: 220 }}>
          <Search size={16} color="var(--color-text-muted)" style={{ position: 'absolute', left: 10, top: 10 }} />
          <input
            type="text"
            placeholder="Filtrar por RFC..."
            value={rfc}
            onChange={(e) => setRfc(e.target.value.toUpperCase())}
            style={{ padding: '8px 12px 8px 32px', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: 13, width: '100%', boxSizing: 'border-box' }}
          />
        </div>

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '8px 16px',
            borderRadius: 10,
            border: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            cursor: isFetching ? 'not-allowed' : 'pointer',
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--color-text)',
            marginLeft: 'auto',
          }}
        >
          <RefreshCw size={15} style={{ animation: isFetching ? 'spin 1s linear infinite' : 'none' }} />
          Actualizar
        </button>
      </div>

      {/* Tabla */}
      <div style={{ background: 'var(--color-surface)', borderRadius: 14, border: '1px solid var(--color-border)', overflow: 'hidden', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 13, minWidth: 860 }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Folio / Fecha</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Receptor (RFC)</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Uso CFDI</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'right' }}>Total</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)' }}>Estado</th>
              <th style={{ padding: '14px 16px', fontWeight: 600, color: 'var(--color-text-muted)', textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--color-text-muted)' }}>
                  Cargando facturas...
                </td>
              </tr>
            ) : facturas.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '50px 20px', color: 'var(--color-text-muted)' }}>
                  <Receipt size={36} opacity={0.3} style={{ marginBottom: 10 }} />
                  <p style={{ margin: '4px 0', fontSize: 15, fontWeight: 600, color: 'var(--color-text)' }}>
                    Sin facturas en el rango seleccionado
                  </p>
                </td>
              </tr>
            ) : (
              facturas.map((f) => {
                const badge = estadoBadgeColor(f.estadoFiscal);
                const fecha = new Date(f.fechaTimbrado);
                return (
                  <tr key={f.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--color-text)' }}>Folio {f.folio}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>
                        {fecha.toLocaleDateString()} · {fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-text)' }}>{f.rfcReceptor}</div>
                      <div style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{f.nombreReceptor}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text-muted)' }}>{f.usoCfdi}</td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: 'var(--color-text)' }}>
                      ${f.total.toFixed(2)}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600, background: badge.bg, color: badge.color }}>
                        {f.estadoFiscal}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button title="Descargar XML" onClick={() => handleDescargarXml(f)} style={iconBtnStyle}>
                          <FileText size={16} />
                        </button>
                        <button title="Descargar PDF" onClick={() => handleDescargarPdf(f)} style={iconBtnStyle}>
                          <Download size={16} />
                        </button>
                        <button title="Enviar por correo" onClick={() => handleEnviarCorreo(f)} style={iconBtnStyle}>
                          <Mail size={16} />
                        </button>
                        {f.estadoFiscal !== 'Cancelado' && (
                          <button
                            title="Cancelar ante el SAT"
                            onClick={() => {
                              setMotivoSat('02');
                              setFacturaCancelar(f);
                            }}
                            style={{ ...iconBtnStyle, color: '#b93c3c', borderColor: 'rgba(214,69,69,0.3)' }}
                          >
                            <XCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!facturaCancelar}
        onClose={() => setFacturaCancelar(null)}
        title="Cancelar Factura ante el SAT"
        description={facturaCancelar ? `Folio ${facturaCancelar.folio} · ${facturaCancelar.rfcReceptor}` : ''}
        size="sm"
        footer={
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <button onClick={() => setFacturaCancelar(null)} style={{ padding: '10px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'transparent', cursor: 'pointer' }}>
              Cerrar
            </button>
            <button
              onClick={handleConfirmarCancelacion}
              disabled={isCancelando}
              style={{
                padding: '10px 16px',
                borderRadius: 8,
                border: 'none',
                background: 'var(--color-danger)',
                color: '#fff',
                fontWeight: 600,
                cursor: isCancelando ? 'not-allowed' : 'pointer',
                opacity: isCancelando ? 0.6 : 1,
              }}
            >
              {isCancelando ? 'Cancelando...' : 'Confirmar Cancelación'}
            </button>
          </div>
        }
      >
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500, fontSize: 14 }}>Motivo de Cancelación SAT</label>
        <select
          value={motivoSat}
          onChange={(e) => setMotivoSat(e.target.value as MotivoCancelacionSat)}
          style={{ width: '100%', boxSizing: 'border-box', padding: 12, borderRadius: 10, border: '1px solid var(--color-border)' }}
        >
          {MOTIVOS_CANCELACION_SAT.map((m) => (
            <option key={m.clave} value={m.clave}>{m.descripcion}</option>
          ))}
        </select>
      </Modal>
    </Container>
  );
}

const iconBtnStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 32,
  height: 32,
  borderRadius: 8,
  border: '1px solid var(--color-border)',
  background: 'var(--color-surface)',
  cursor: 'pointer',
  color: 'var(--color-text)',
};
