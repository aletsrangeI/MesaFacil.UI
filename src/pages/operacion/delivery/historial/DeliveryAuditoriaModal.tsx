import React from 'react';
import { Modal } from '../../../../components/modal/Modal';
import { Button } from '../../../../components/ui/button/Button';
import type { DeliveryHistorialItem } from '../../../../services/deliveryApi';
import {
  Clock,
  User,
  Phone,
  MapPin,
  Bike,
  AlertTriangle,
} from 'lucide-react';

interface DeliveryAuditoriaModalProps {
  pedido: DeliveryHistorialItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DeliveryAuditoriaModal: React.FC<DeliveryAuditoriaModalProps> = ({
  pedido,
  isOpen,
  onClose,
}) => {
  if (!pedido) return null;

  const isCancelado = pedido.idEstadoPedido === 6 || !!pedido.motivoCancelacion;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={`Auditoría de Pedido ${pedido.folio}`}
      size="lg"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Cabecera resumen */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '1rem',
            gap: '0.75rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.125rem', fontWeight: 700, fontFamily: 'monospace', color: '#0f172a' }}>
                {pedido.folio}
              </span>
              {pedido.idExterno && (
                <span style={{ fontSize: '0.8125rem', fontFamily: 'monospace', color: '#64748b' }}>
                  ({pedido.idExterno})
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '4px' }}>
              <span className={`canal-badge ${pedido.canalOrigen.toLowerCase().replace(/\s+/g, '')}`}>
                {pedido.canalOrigen}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                • Tipo: <strong>{pedido.tipoPedido}</strong>
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
              ${pedido.total.toFixed(2)}
            </div>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                padding: '2px 6px',
                borderRadius: '4px',
                backgroundColor: pedido.estaPagado ? '#dcfce7' : '#fef3c7',
                color: pedido.estaPagado ? '#15803d' : '#b45309',
              }}
            >
              {pedido.estaPagado ? '✓ Pagado' : 'Por Cobrar'}
            </span>
          </div>
        </div>

        {/* Motivo de Incidencia / Rebote (Si aplica) */}
        {isCancelado && (
          <div className="delivery-alert-box">
            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Incidencia / Rebote Reportado:</strong>
              <div style={{ marginTop: '2px', fontSize: '0.8125rem' }}>
                {pedido.motivoCancelacion || 'Pedido cancelado sin motivo especificado.'}
              </div>
            </div>
          </div>
        )}

        {/* Datos de Entrega y Repartidor */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '0.75rem',
          }}
        >
          <div className="delivery-info-box">
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>
              DATOS DEL CLIENTE
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b' }}>
                <User size={14} style={{ color: '#94a3b8' }} />
                <strong>{pedido.clienteNombre || 'Sin nombre registrado'}</strong>
              </div>
              {pedido.clienteTelefono && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                  <Phone size={14} style={{ color: '#94a3b8' }} />
                  <span>{pedido.clienteTelefono}</span>
                </div>
              )}
              {pedido.direccionEntrega && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#64748b' }}>
                  <MapPin size={14} style={{ color: '#94a3b8', marginTop: '2px', flexShrink: 0 }} />
                  <span>{pedido.direccionEntrega}</span>
                </div>
              )}
            </div>
          </div>

          <div className="delivery-info-box">
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>
              LOGÍSTICA Y TIEMPOS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b' }}>
                <Bike size={14} style={{ color: '#3b82f6' }} />
                <span>Repartidor: <strong>{pedido.nombreRepartidor || 'No asignado'}</strong></span>
              </div>
              {pedido.telefonoRepartidor && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                  <Phone size={14} style={{ color: '#94a3b8' }} />
                  <span>{pedido.telefonoRepartidor}</span>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                <Clock size={14} style={{ color: '#94a3b8' }} />
                <span>Tiempo Total de Ciclo: <strong>{pedido.minutosTotales ? `${pedido.minutosTotales} min` : 'En curso'}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Desglose de Productos */}
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
            Productos del Pedido ({pedido.items.length})
          </h3>
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #f1f5f9',
              borderRadius: '8px',
              padding: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {pedido.items.map((it) => (
              <div
                key={it.idDetalle}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  fontSize: '0.8125rem',
                  borderBottom: '1px solid #f1f5f9',
                  paddingBottom: '0.35rem',
                }}
              >
                <div>
                  <strong style={{ color: '#0f172a' }}>{it.cantidad}x</strong> {it.productoNombre}
                  {it.varianteNombre && (
                    <span style={{ color: '#64748b' }}> ({it.varianteNombre})</span>
                  )}
                  {it.modificadores?.length > 0 && (
                    <div style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                      + {it.modificadores.join(', ')}
                    </div>
                  )}
                </div>
                <div style={{ fontFamily: 'monospace', fontWeight: 600, color: '#334155' }}>
                  ${(it.cantidad * it.precioUnitario).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline / Cronología de Eventos de Auditoría */}
        <div>
          <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.75rem' }}>
            Cronología de Eventos (Auditoría)
          </h3>
          {pedido.eventos.length === 0 ? (
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontStyle: 'italic' }}>
              No hay eventos registrados para este pedido.
            </div>
          ) : (
            <div className="delivery-timeline">
              {pedido.eventos.map((ev) => {
                const isErr = ev.tipoEvento.includes('Rebotado') || ev.tipoEvento.includes('Cancelado');
                const isSucc = ev.tipoEvento.includes('Entregado');
                const isWarn = ev.tipoEvento.includes('Listo');

                const dotClass = isErr ? 'danger' : isSucc ? 'success' : isWarn ? 'amber' : '';

                return (
                  <div key={ev.id} className="delivery-timeline-item">
                    <div className={`delivery-timeline-dot ${dotClass}`} />
                    <div className="delivery-timeline-title">{ev.descripcion}</div>
                    <div className="delivery-timeline-meta">
                      {new Date(ev.createdAt).toLocaleString([], {
                        dateStyle: 'short',
                        timeStyle: 'medium',
                      })}{' '}
                      • Responsable: <strong>{ev.createdBy || 'Sistema'}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
