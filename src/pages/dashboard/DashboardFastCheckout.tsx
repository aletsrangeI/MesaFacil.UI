// src/pages/dashboard/DashboardFastCheckout.tsx
import React from 'react';
import Icon from '../../components/ui/icons/Icon';

interface DashboardFastCheckoutProps {
  pedidosPorCobrar: any[];
  onCobrarPedido: (idPedido: number) => void;
  ventasEfectivo?: number;
  ventasTarjeta?: number;
  ventasTransferencia?: number;
}

export const DashboardFastCheckout: React.FC<DashboardFastCheckoutProps> = ({
  pedidosPorCobrar = [],
  onCobrarPedido,
  ventasEfectivo = 0,
  ventasTarjeta = 0,
  ventasTransferencia = 0
}) => {
  const totalMix = ventasEfectivo + ventasTarjeta + ventasTransferencia;
  const pctEfectivo = totalMix > 0 ? Math.round((ventasEfectivo / totalMix) * 100) : 0;
  const pctTarjeta = totalMix > 0 ? Math.round((ventasTarjeta / totalMix) * 100) : 0;
  const pctTransf = totalMix > 0 ? Math.max(0, 100 - pctEfectivo - pctTarjeta) : 0;

  return (
    <section className="dash-bento-card">
      <div className="dash-card-header">
        <h2>
          <Icon name="CreditCard" />
          <span>Cuentas por Cobrar</span>
        </h2>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #64748b)', fontWeight: 600 }}>
          {pedidosPorCobrar.length} pendientes
        </span>
      </div>

      {pedidosPorCobrar.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--color-text-muted, #64748b)' }}>
          <div style={{ margin: '0 auto 8px', width: 40, height: 40, borderRadius: '50%', background: 'var(--color-success-bg, rgba(60,141,64,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success, #3c8d40)' }}>
            <Icon name="CheckCircle" />
          </div>
          <strong style={{ display: 'block', color: 'var(--color-text, #1e293b)' }}>Al día en cobros</strong>
          <span style={{ fontSize: '0.85rem' }}>No hay cuentas pendientes de liquidación</span>
        </div>
      ) : (
        <div className="dash-orders-list">
          {pedidosPorCobrar.slice(0, 5).map(pedido => {
            return (
              <div key={pedido.id} className="dash-order-item">
                <div className="dash-order-info">
                  <div className="dash-order-mesa">
                    Orden #{pedido.id} • {pedido.idMesa ? `Mesa ${pedido.idMesa}` : 'Para Llevar / Mostrador'}
                  </div>
                  <div className="dash-order-meta">
                    {pedido.personas || 1} personas • Abierto: {pedido.abiertoEn ? new Date(pedido.abiertoEn).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : 'Hoy'}
                  </div>
                </div>

                <button
                  className="dash-btn-pay"
                  onClick={() => onCobrarPedido(pedido.id)}
                  title="Cobrar cuenta y registrar pago"
                >
                  <Icon name="Receipt" />
                  <span>Cobrar</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Mix de Medios de Pago */}
      <div style={{ marginTop: 8, borderTop: '1px solid var(--color-border, #f1f5f9)', paddingTop: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Mix de Cobro (Turno)
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #64748b)' }}>
            ${totalMix.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* Barra tricolor proporcional */}
        <div style={{ width: '100%', height: 8, borderRadius: 4, display: 'flex', overflow: 'hidden', background: '#f1f5f9' }}>
          <div style={{ width: `${pctEfectivo}%`, background: 'var(--color-success, #3c8d40)' }} title={`Efectivo: ${pctEfectivo}%`} />
          <div style={{ width: `${pctTarjeta}%`, background: 'var(--color-info, #3b82f6)' }} title={`Tarjetas: ${pctTarjeta}%`} />
          <div style={{ width: `${pctTransf}%`, background: 'var(--color-secondary, #e2a72e)' }} title={`Transferencia: ${pctTransf}%`} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: 6, color: 'var(--color-text-muted, #64748b)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-success, #3c8d40)' }} />
            Efectivo ({pctEfectivo}%)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-info, #3b82f6)' }} />
            Tarjetas ({pctTarjeta}%)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-secondary, #e2a72e)' }} />
            Transf. ({pctTransf}%)
          </span>
        </div>
      </div>
    </section>
  );
};
