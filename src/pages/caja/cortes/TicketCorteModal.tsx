import { useRef } from 'react';
import type { CorteCajaHistorialItem } from '../../../services/corteCajaApi';
import { Printer, X } from 'lucide-react';

interface TicketCorteModalProps {
  isOpen: boolean;
  onClose: () => void;
  corte: CorteCajaHistorialItem | null;
}

export function TicketCorteModal({ isOpen, onClose, corte }: TicketCorteModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !corte) return null;

  const handlePrint = () => {
    window.print();
  };

  const fInicio = new Date(corte.fechaInicio);
  const fFin = new Date(corte.fechaFin);

  return (
    <div className="pos-modal-overlay">
      <div
        className="pos-modal-content"
        style={{
          width: '95%',
          maxWidth: 420,
          padding: 0,
          overflow: 'hidden',
          borderRadius: 16,
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        {/* Header no imprimible */}
        <div
          className="no-print"
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border, rgba(0,0,0,0.12))',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--color-surface, #FAFAFA)'
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 15 }}>Ticket de Corte de Caja</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={handlePrint}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                background: 'var(--color-primary, #D64545)',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer'
              }}
            >
              <Printer size={15} /> Imprimir
            </button>
            <button
              onClick={onClose}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--color-text-muted, #6B7280)'
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Contenido del Ticket Térmico */}
        <div style={{ padding: '24px 20px', overflowY: 'auto', background: '#F9FAFB' }}>
          <div
            ref={printRef}
            id="thermal-ticket-corte"
            style={{
              background: '#FFFFFF',
              padding: '24px 18px',
              borderRadius: 8,
              border: '1px dashed #D1D5DB',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 13,
              color: '#111827',
              lineHeight: 1.4,
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
            }}
          >
            {/* Cabecera */}
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase' }}>
                MESAFACIL RESTAURANTE
              </div>
              <div style={{ fontSize: 12 }}>{corte.nombreSucursal}</div>
              <div style={{ margin: '8px 0', borderBottom: '1px dashed #000000' }} />
              <div style={{ fontSize: 14, fontWeight: 'bold' }}>CORTE DE CAJA (CORTE Z)</div>
              <div style={{ fontSize: 12 }}>Folio #{corte.id} • Turno #{corte.idTurno || '-'}</div>
            </div>

            {/* Datos Operativos */}
            <div style={{ fontSize: 11, marginBottom: 10 }}>
              <div><b>Cajero:</b> {corte.nombreCajero}</div>
              <div><b>Apertura:</b> {fInicio.toLocaleDateString()} {fInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div><b>Cierre:</b> {fFin.toLocaleDateString()} {fFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div><b>Cuentas Cobradas:</b> {corte.cantidadCuentasPagadas}</div>
            </div>

            <div style={{ margin: '8px 0', borderBottom: '1px dashed #000000' }} />

            {/* Desglose de Ventas */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase' }}>Ventas por Método</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Ventas Efectivo:</span>
                <span>${corte.totalEfectivo.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Ventas Tarjeta:</span>
                <span>${corte.totalTarjeta.toFixed(2)}</span>
              </div>
              {corte.totalOtros > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Otros Métodos:</span>
                  <span>${corte.totalOtros.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: 4, borderTop: '1px dotted #9CA3AF', paddingTop: 2 }}>
                <span>TOTAL VENTAS:</span>
                <span>${corte.totalVentas.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ margin: '8px 0', borderBottom: '1px dashed #000000' }} />

            {/* Propinas */}
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase' }}>Propinas</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Propina Tarjeta:</span>
                <span>${corte.totalPropinasTarjeta.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Propina Efectivo:</span>
                <span>${corte.totalPropinasEfectivo.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: 4, borderTop: '1px dotted #9CA3AF', paddingTop: 2 }}>
                <span>TOTAL PROPINAS:</span>
                <span>${corte.totalPropinas.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ margin: '8px 0', borderBottom: '1px dashed #000000' }} />

            {/* Arqueo de Efectivo Físico */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase' }}>Arqueo de Efectivo</div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>(+) Fondo Inicial:</span>
                <span>${corte.cajaInicial.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>(+) Ventas Efectivo:</span>
                <span>${corte.totalEfectivo.toFixed(2)}</span>
              </div>
              {corte.totalIngresos > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>(+) Entradas de Caja:</span>
                  <span>${corte.totalIngresos.toFixed(2)}</span>
                </div>
              )}
              {corte.totalEgresos > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>(-) Salidas / Egresos:</span>
                  <span>${corte.totalEgresos.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: 4, borderTop: '1px solid #000000', paddingTop: 4 }}>
                <span>EFECTIVO ESPERADO:</span>
                <span>${corte.cajaEsperada.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: 2 }}>
                <span>EFECTIVO CONTADO:</span>
                <span>${corte.declarado.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: 4, fontSize: 14 }}>
                <span>DIFERENCIA:</span>
                <span>
                  {Math.abs(corte.diferencia) < 0.01
                    ? '$0.00 (CUADRADA)'
                    : corte.diferencia < 0
                    ? `-$${Math.abs(corte.diferencia).toFixed(2)} (FALTANTE)`
                    : `+$${corte.diferencia.toFixed(2)} (SOBRANTE)`}
                </span>
              </div>
            </div>

            {corte.observaciones && (
              <div style={{ fontSize: 11, marginBottom: 14, background: '#F3F4F6', padding: 6, borderRadius: 4 }}>
                <b>Notas:</b> {corte.observaciones}
              </div>
            )}

            <div style={{ margin: '14px 0', borderBottom: '1px dashed #000000' }} />

            {/* Firmas */}
            <div style={{ marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, textAlign: 'center', fontSize: 11 }}>
              <div>
                <div style={{ borderBottom: '1px solid #000000', marginBottom: 4, height: 28 }} />
                <span>Firma Cajero</span>
              </div>
              <div>
                <div style={{ borderBottom: '1px solid #000000', marginBottom: 4, height: 28 }} />
                <span>Firma Supervisor</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
