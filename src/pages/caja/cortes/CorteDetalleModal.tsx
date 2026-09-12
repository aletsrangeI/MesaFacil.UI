import type { CorteCajaHistorialItem } from '../../../services/corteCajaApi';
import { DollarSign, CreditCard, Coins, CheckCircle2, AlertCircle, X, Printer, User, Clock, Building } from 'lucide-react';

interface CorteDetalleModalProps {
  isOpen: boolean;
  onClose: () => void;
  corte: CorteCajaHistorialItem | null;
  onOpenTicket: (corte: CorteCajaHistorialItem) => void;
}

export function CorteDetalleModal({ isOpen, onClose, corte, onOpenTicket }: CorteDetalleModalProps) {
  if (!isOpen || !corte) return null;

  const fInicio = new Date(corte.fechaInicio);
  const fFin = new Date(corte.fechaFin);
  const esCuadrado = Math.abs(corte.diferencia) < 0.01;
  const esFaltante = corte.diferencia < -0.01;

  return (
    <div className="pos-modal-overlay">
      <div
        className="pos-modal-content"
        style={{
          width: '95%',
          maxWidth: 640,
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
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--color-border, rgba(0,0,0,0.12))',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--color-surface, #FAFAFA)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', color: 'var(--color-text, #1F1F1F)' }}>
                Detalle del Corte #{corte.id}
              </h2>
              <span
                style={{
                  padding: '3px 10px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  background: esCuadrado
                    ? 'rgba(16, 185, 129, 0.1)'
                    : esFaltante
                    ? 'rgba(239, 68, 68, 0.1)'
                    : 'rgba(59, 130, 246, 0.1)',
                  color: esCuadrado ? '#059669' : esFaltante ? '#dc2626' : '#2563eb'
                }}
              >
                {esCuadrado ? 'Caja Cuadrada' : esFaltante ? 'Faltante de Efectivo' : 'Sobrante de Efectivo'}
              </span>
            </div>
            <span style={{ fontSize: 13, color: 'var(--color-text-muted, #6B7280)' }}>
              Turno #{corte.idTurno || '-'} • {corte.cantidadCuentasPagadas} cuentas cobradas
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
            <X size={22} />
          </button>
        </div>

        {/* Body scrollable */}
        <div style={{ padding: '20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Metadata del Turno */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
              gap: 12,
              padding: 14,
              borderRadius: 12,
              background: 'rgba(0,0,0,0.02)',
              border: '1px solid var(--color-border, rgba(0,0,0,0.08))'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <User size={16} color="var(--color-text-muted)" />
              <div>
                <span style={{ display: 'block', fontSize: 11, color: 'var(--color-text-muted)' }}>Cajero</span>
                <b>{corte.nombreCajero}</b>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <Building size={16} color="var(--color-text-muted)" />
              <div>
                <span style={{ display: 'block', fontSize: 11, color: 'var(--color-text-muted)' }}>Sucursal</span>
                <b>{corte.nombreSucursal}</b>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <Clock size={16} color="var(--color-text-muted)" />
              <div>
                <span style={{ display: 'block', fontSize: 11, color: 'var(--color-text-muted)' }}>Periodo</span>
                <b>
                  {fInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                  {fFin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </b>
              </div>
            </div>
          </div>

          {/* Grilla de Métricas de Venta */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <div style={{ padding: 14, borderRadius: 12, background: 'rgba(0,0,0,0.02)', border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-text-muted)', fontSize: 13, marginBottom: 4 }}>
                <DollarSign size={16} /> Total Ventas
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)' }}>
                ${corte.totalVentas.toFixed(2)}
              </div>
            </div>

            <div style={{ padding: 14, borderRadius: 12, background: 'rgba(59, 130, 246, 0.05)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#2563eb', fontSize: 13, marginBottom: 4 }}>
                <CreditCard size={16} /> Tarjeta (Venta + Propina)
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#1d4ed8' }}>
                ${(corte.totalTarjeta + corte.totalPropinasTarjeta).toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: '#60a5fa', marginTop: 2 }}>
                Ventas: ${corte.totalTarjeta.toFixed(2)} • Propinas: ${corte.totalPropinasTarjeta.toFixed(2)}
              </div>
            </div>

            <div style={{ padding: 14, borderRadius: 12, background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669', fontSize: 13, marginBottom: 4 }}>
                <Coins size={16} /> Ventas en Efectivo
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#047857' }}>
                ${corte.totalEfectivo.toFixed(2)}
              </div>
            </div>

            <div style={{ padding: 14, borderRadius: 12, background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#d97706', fontSize: 13, marginBottom: 4 }}>
                <DollarSign size={16} /> Propinas Acumuladas
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#b45309' }}>
                ${corte.totalPropinas.toFixed(2)}
              </div>
              <div style={{ fontSize: 11, color: '#d97706', marginTop: 2 }}>
                Tarjeta: ${corte.totalPropinasTarjeta.toFixed(2)} (A liquidar al personal)
              </div>
            </div>
          </div>

          {/* Arqueo de Efectivo */}
          <div
            style={{
              background: 'rgba(0,0,0,0.02)',
              borderRadius: 14,
              padding: 16,
              border: '1px solid var(--color-border)'
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 10, color: 'var(--color-text)' }}>
              Conciliación de Efectivo en Cajón
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 6 }}>
              <span>(+) Fondo Inicial de Caja</span>
              <span>+${corte.cajaInicial.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--color-text-muted)', marginBottom: 6 }}>
              <span>(+) Ventas en Efectivo</span>
              <span>+${corte.totalEfectivo.toFixed(2)}</span>
            </div>
            {corte.totalIngresos > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#059669', marginBottom: 6 }}>
                <span>(+) Entradas / Ingresos Manuales</span>
                <span>+${corte.totalIngresos.toFixed(2)}</span>
              </div>
            )}
            {corte.totalEgresos > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#dc2626', marginBottom: 6 }}>
                <span>(-) Salidas / Egresos Manuales</span>
                <span>-${corte.totalEgresos.toFixed(2)}</span>
              </div>
            )}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 700,
                fontSize: '1rem',
                borderTop: '1px dashed var(--color-border)',
                paddingTop: 8,
                marginTop: 6
              }}
            >
              <span>Efectivo Esperado en Cajón:</span>
              <span style={{ color: 'var(--color-primary, #D64545)' }}>${corte.cajaEsperada.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1rem', marginTop: 4 }}>
              <span>Efectivo Físico Contado (Declarado):</span>
              <span>${corte.declarado.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: 700,
                fontSize: '1.1rem',
                borderTop: '1px solid var(--color-border)',
                paddingTop: 8,
                marginTop: 8,
                color: esCuadrado ? '#059669' : esFaltante ? '#dc2626' : '#2563eb'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {esCuadrado ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>Diferencia:</span>
              </div>
              <span>
                {esCuadrado
                  ? '$0.00 (Exacto)'
                  : esFaltante
                  ? `-$${Math.abs(corte.diferencia).toFixed(2)} (Faltante)`
                  : `+$${corte.diferencia.toFixed(2)} (Sobrante)`}
              </span>
            </div>
          </div>

          {/* Observaciones */}
          {corte.observaciones && (
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 4 }}>
                Observaciones registradas por el cajero:
              </label>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: 'var(--color-surface, #F9FAFB)',
                  border: '1px solid var(--color-border)',
                  fontSize: 13,
                  color: 'var(--color-text)'
                }}
              >
                {corte.observaciones}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
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
            onClick={() => onOpenTicket(corte)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              background: '#FFFFFF',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13,
              color: 'var(--color-text)'
            }}
          >
            <Printer size={16} /> Reimprimir Ticket
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '8px 18px',
              borderRadius: 8,
              border: 'none',
              background: 'var(--color-primary, #D64545)',
              color: '#FFFFFF',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 13
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
