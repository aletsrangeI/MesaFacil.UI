// src/pages/dashboard/DashboardKdsPulse.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../components/ui/icons/Icon';

interface DashboardKdsPulseProps {
  ticketsKds: any[];
  pedidosActivos: any[];
  topPlatillos?: { nombre: string; cantidad: number }[];
}

export const DashboardKdsPulse: React.FC<DashboardKdsPulseProps> = ({
  ticketsKds = [],
  pedidosActivos = [],
  topPlatillos = []
}) => {
  // Solo tickets activos (no completados)
  const ticketsActivos = ticketsKds.filter(t => t.idEstadoTicketCocina !== 3);

  const getTiempoEspera = (fechaCreacion?: string) => {
    if (!fechaCreacion) return { mins: 5, colorClass: 'green' };
    const diffMs = Date.now() - new Date(fechaCreacion).getTime();
    const mins = Math.max(1, Math.floor(diffMs / 60000));
    let colorClass = 'green';
    if (mins > 10) colorClass = 'yellow';
    if (mins > 15) colorClass = 'red';
    return { mins, colorClass };
  };

  return (
    <section className="dash-bento-card">
      <div className="dash-card-header">
        <h2>
          <Icon name="Flame" />
          <span>Pulso de Cocina (KDS)</span>
        </h2>
        <Link 
          to="/ventas/kds" 
          style={{ 
            fontSize: '0.8rem', 
            color: 'var(--color-primary, #d64545)', 
            fontWeight: 700, 
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 4
          }}
        >
          <span>Abrir KDS</span>
          <Icon name="ArrowRight" />
        </Link>
      </div>

      {ticketsActivos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--color-text-muted, #64748b)' }}>
          <div style={{ margin: '0 auto 8px', width: 40, height: 40, borderRadius: '50%', background: 'var(--color-success-bg, rgba(60,141,64,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-success, #3c8d40)' }}>
            <Icon name="CheckCircle" />
          </div>
          <strong style={{ display: 'block', color: 'var(--color-text, #1e293b)' }}>Cocina al día</strong>
          <span style={{ fontSize: '0.85rem' }}>No hay comandas pendientes en preparación</span>
        </div>
      ) : (
        <div className="dash-kds-list">
          {ticketsActivos.slice(0, 4).map(ticket => {
            const tiempo = getTiempoEspera(ticket.fechaCreacion);
            const pedido = pedidosActivos.find(p => p.id === ticket.idPedido);
            const esUrgente = tiempo.mins > 12;

            return (
              <div 
                key={ticket.id} 
                className={`dash-kds-ticket ${esUrgente ? 'urgente' : ''}`}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <strong style={{ fontSize: '0.9rem', color: 'var(--color-text, #0f172a)' }}>
                      Ticket #{ticket.id}
                    </strong>
                    {pedido && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #64748b)' }}>
                        • Mesa {pedido.idMesa || 'Barra'}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted, #64748b)', marginTop: 2 }}>
                    Estación: {ticket.estacion?.nombre || `Estación ${ticket.idEstacion}`}
                  </div>
                </div>

                <div className={`dash-kds-time ${tiempo.colorClass}`}>
                  ⏱️ {tiempo.mins} min
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mini Sección: Top Favoritos del Día */}
      {topPlatillos.length > 0 && (
        <div style={{ marginTop: 8, borderTop: '1px solid var(--color-border, #f1f5f9)', paddingTop: 12 }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
            Platillos Más Pedidos Hoy
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {topPlatillos.slice(0, 3).map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                <span style={{ color: 'var(--color-text, #1e293b)', fontWeight: 600 }}>{idx + 1}. {item.nombre}</span>
                <span style={{ color: 'var(--color-text-muted, #64748b)', fontWeight: 700 }}>{item.cantidad} ordenados</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
