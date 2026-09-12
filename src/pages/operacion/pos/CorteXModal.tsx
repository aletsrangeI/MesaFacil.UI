import { useRef } from 'react';
import { useGetResumenCorteQuery } from './CorteCajaModal';
import { DollarSign, CreditCard, X, Printer, Activity, Bike } from 'lucide-react';

interface CorteXModalProps {
  isOpen: boolean;
  onClose: () => void;
  idSucursal?: number;
  idTurno?: number;
}

export function CorteXModal({ isOpen, onClose, idSucursal = 1, idTurno }: CorteXModalProps) {
  const { data: resumenData, isLoading } = useGetResumenCorteQuery({ idSucursal, idTurno }, { skip: !isOpen });
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const resumen = resumenData?.data;
  const fechaActual = new Date();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="pos-modal-overlay">
      <div
        className="pos-modal-content"
        style={{
          width: '95%',
          maxWidth: 540,
          padding: 0,
          overflow: 'hidden',
          borderRadius: 20,
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '90vh'
        }}
      >
        {/* Header */}
        <div
          className="no-print"
          style={{
            padding: '18px 24px',
            borderBottom: '1px solid var(--color-border, rgba(0,0,0,0.12))',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--color-surface, #FAFAFA)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--color-text, #1F1F1F)' }}>
                Arqueo en Vivo (Corte X)
              </h2>
              <span
                style={{
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 700,
                  background: '#2563eb',
                  color: '#FFFFFF'
                }}
              >
                PROVISIONAL
              </span>
            </div>
            <span style={{ fontSize: 12, color: 'var(--color-text-muted, #6B7280)' }}>
              {resumen?.idTurno ? `Turno activo #${resumen.idTurno}` : 'Sin turno activo'} • No cierra el turno
            </span>
          </div>

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

        {/* Contenido scrollable */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {isLoading || !resumen ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-muted)' }}>
              Consultando corte X en vivo...
            </div>
          ) : (
            <>
              {/* Aviso Informativo */}
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 12,
                  background: 'rgba(37, 99, 235, 0.06)',
                  border: '1px solid rgba(37, 99, 235, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  color: '#1d4ed8',
                  fontSize: 13
                }}
              >
                <Activity size={18} />
                <span>
                  El <b>Corte X</b> es un arqueo de supervisión a mitad de jornada. Tu turno permanece abierto y los cobros continúan activos.
                </span>
              </div>

              {/* Grilla de Totales Acumulados */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ padding: 14, borderRadius: 12, background: 'rgba(0,0,0,0.02)', border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 4 }}>
                    <DollarSign size={16} /> Ventas Acumuladas
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)' }}>
                    ${resumen.totalVentas.toFixed(2)}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                    {resumen.cantidadCuentasPagadas} cuentas cobradas
                  </div>
                </div>

                <div style={{ padding: 14, borderRadius: 12, background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2563eb', fontSize: 13, marginBottom: 4 }}>
                    <CreditCard size={16} /> Vouchers Tarjeta
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1d4ed8' }}>
                    ${(resumen.totalTarjeta + resumen.totalPropinasTarjeta).toFixed(2)}
                  </div>
                  <div style={{ fontSize: 11, color: '#60a5fa', marginTop: 2 }}>
                    Ventas: ${resumen.totalTarjeta.toFixed(2)} • Propinas: ${resumen.totalPropinasTarjeta.toFixed(2)}
                  </div>
                </div>

                {/* Plataformas de Delivery */}
                <div style={{ padding: 14, borderRadius: 12, background: 'rgba(147, 51, 234, 0.05)', border: '1px solid rgba(147, 51, 234, 0.2)', gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#9333ea', fontSize: 13 }}>
                      <Bike size={16} /> Plataformas Delivery (Uber Eats / Rappi / Didi)
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#7e22ce', background: 'rgba(147, 51, 234, 0.1)', padding: '2px 8px', borderRadius: 6 }}>
                      Cobro en App • No afecta cajón físico
                    </span>
                  </div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#7e22ce', marginTop: 4 }}>
                    ${(resumen.totalPlataformas ?? 0).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Efectivo en Cajón */}
              <div
                style={{
                  background: 'rgba(0,0,0,0.02)',
                  borderRadius: 14,
                  padding: 16,
                  border: '1px solid var(--color-border)'
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: 'var(--color-text)' }}>
                  Efectivo Físico que debe haber en Cajón
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 6 }}>
                  <span>(+) Fondo Inicial de Turno</span>
                  <span>+${resumen.cajaInicial.toFixed(2)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 6 }}>
                  <span>(+) Cobros en Efectivo</span>
                  <span>+${resumen.totalEfectivo.toFixed(2)}</span>
                </div>

                {resumen.totalIngresos > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#059669', marginBottom: 6 }}>
                    <span>(+) Entradas de Caja</span>
                    <span>+${resumen.totalIngresos.toFixed(2)}</span>
                  </div>
                )}

                {resumen.totalEgresos > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#dc2626', marginBottom: 6 }}>
                    <span>(-) Salidas / Egresos de Caja</span>
                    <span>-${resumen.totalEgresos.toFixed(2)}</span>
                  </div>
                )}

                {(resumen.totalPlataformas ?? 0) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#9333ea', fontStyle: 'italic', marginBottom: 6 }}>
                    <span>Plataformas Delivery (Uber / Rappi / Didi)</span>
                    <span>${(resumen.totalPlataformas ?? 0).toFixed(2)} (En App)</span>
                  </div>
                )}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 700,
                    fontSize: '1.2rem',
                    borderTop: '1px dashed var(--color-border)',
                    paddingTop: 10,
                    marginTop: 8
                  }}
                >
                  <span>Efectivo Esperado Ahora:</span>
                  <span style={{ color: 'var(--color-primary, #D64545)' }}>
                    ${resumen.cajaEsperada.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Plantilla térmica oculta para impresión */}
              <div style={{ display: 'none' }}>
                <div
                  ref={printRef}
                  id="thermal-ticket-cortex"
                  style={{
                    padding: 20,
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: 13,
                    lineHeight: 1.4
                  }}
                >
                  <div style={{ textAlign: 'center', marginBottom: 10 }}>
                    <div style={{ fontWeight: 'bold', fontSize: 15 }}>MESAFACIL RESTAURANTE</div>
                    <div style={{ fontSize: 13, fontWeight: 'bold' }}>CORTE X (ARQUEO EN VIVO)</div>
                    <div style={{ fontSize: 11 }}>Turno #{resumen.idTurno || '-'} • Sucursal #{idSucursal}</div>
                    <div style={{ fontSize: 11 }}>{fechaActual.toLocaleDateString()} {fechaActual.toLocaleTimeString()}</div>
                  </div>
                  <div style={{ borderBottom: '1px dashed #000', margin: '8px 0' }} />
                  <div>Ventas Totales: ${resumen.totalVentas.toFixed(2)}</div>
                  <div>Ventas Efectivo: ${resumen.totalEfectivo.toFixed(2)}</div>
                  <div>Ventas Tarjeta: ${resumen.totalTarjeta.toFixed(2)}</div>
                  <div>Propinas Tarjeta: ${resumen.totalPropinasTarjeta.toFixed(2)}</div>
                  {(resumen.totalPlataformas ?? 0) > 0 && (
                    <div>Plataformas (Uber/Rappi/Didi): ${(resumen.totalPlataformas ?? 0).toFixed(2)}</div>
                  )}
                  <div style={{ borderBottom: '1px dashed #000', margin: '8px 0' }} />
                  <div>(+) Fondo Inicial: ${resumen.cajaInicial.toFixed(2)}</div>
                  <div>(+) Entradas: ${resumen.totalIngresos.toFixed(2)}</div>
                  <div>(-) Salidas: ${resumen.totalEgresos.toFixed(2)}</div>
                  <div style={{ fontWeight: 'bold', fontSize: 14, marginTop: 4 }}>
                    EFECTIVO ESPERADO: ${resumen.cajaEsperada.toFixed(2)}
                  </div>
                  <div style={{ borderBottom: '1px dashed #000', margin: '8px 0' }} />
                  <div style={{ textAlign: 'center', fontSize: 10, marginTop: 8 }}>
                    *** DOCUMENTO PROVISIONAL - NO CIERRA TURNO ***
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div
          className="no-print"
          style={{
            padding: '16px 24px',
            borderTop: '1px solid var(--color-border, rgba(0,0,0,0.12))',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--color-surface, #FAFAFA)'
          }}
        >
          <button
            onClick={handlePrint}
            disabled={isLoading || !resumen}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: '#FFFFFF',
              cursor: isLoading || !resumen ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: 13,
              color: 'var(--color-text)'
            }}
          >
            <Printer size={16} /> Imprimir Comprobante Corte X
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--color-primary, #D64545)',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13
            }}
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}
