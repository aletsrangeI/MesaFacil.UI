import React, { useState } from 'react';
import { Modal } from '../../../components/modal/Modal';
import { Button } from '../../../components/ui/button/Button';
import { useEntregarPedidoMutation, type DeliveryQueueItem } from '../../../services/deliveryApi';
import { useToast } from '../../../components/ui/toast';
import { Banknote, CreditCard, CheckCircle2 } from 'lucide-react';

interface CobroEntregaModalProps {
  pedido: DeliveryQueueItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CobroEntregaModal: React.FC<CobroEntregaModalProps> = ({ pedido, isOpen, onClose }) => {
  const [entregar, { isLoading }] = useEntregarPedidoMutation();
  const { addToast } = useToast();
  const [metodoPago, setMetodoPago] = useState<number>(1); // 1 = Efectivo, 2 = Tarjeta

  if (!pedido) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await entregar({
        id: pedido.idPedido,
        idMetodoDePago: metodoPago,
      }).unwrap();

      if (res.isSuccess) {
        addToast({
          message: `Pedido ${pedido.folio} cobrado y entregado exitosamente.`,
          variant: 'success',
        });
        onClose();
      }
    } catch (err: any) {
      addToast({
        message: err?.data?.message || 'Error al procesar la entrega y cobro.',
        variant: 'error',
      });
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={`Cobro y Entrega - ${pedido.folio}`}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{
          padding: 16,
          borderRadius: 10,
          background: 'var(--color-surface, #f9fafb)',
          border: '1px solid var(--color-border, #e5e7eb)',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: 13, color: 'var(--color-text-muted, #64748b)' }}>
            Monto a Cobrar ({pedido.tipoPedido})
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--color-text, #111827)', marginTop: 4 }}>
            ${pedido.total.toFixed(2)}
          </div>
          {pedido.clienteNombre && (
            <div style={{ fontSize: 12, color: 'var(--color-text-muted, #64748b)', marginTop: 4 }}>
              Cliente: {pedido.clienteNombre}
            </div>
          )}
        </div>

        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-text, #374151)', display: 'block', marginBottom: 8 }}>
            Selecciona el Método de Pago recibido:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button
              type="button"
              onClick={() => setMetodoPago(1)}
              style={{
                padding: '14px',
                borderRadius: 10,
                border: metodoPago === 1 ? '2px solid #059669' : '1px solid var(--color-border, #e5e7eb)',
                background: metodoPago === 1 ? 'rgba(5, 150, 105, 0.08)' : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                fontWeight: 600,
                color: metodoPago === 1 ? '#059669' : 'var(--color-text, #374151)',
                transition: 'all 0.15s ease'
              }}
            >
              <Banknote size={24} />
              <span>Efectivo</span>
              <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--color-text-muted, #6b7280)' }}>
                Ingresa al cajón físico
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMetodoPago(2)}
              style={{
                padding: '14px',
                borderRadius: 10,
                border: metodoPago === 2 ? '2px solid #2563eb' : '1px solid var(--color-border, #e5e7eb)',
                background: metodoPago === 2 ? 'rgba(37, 99, 235, 0.08)' : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
                fontWeight: 600,
                color: metodoPago === 2 ? '#2563eb' : 'var(--color-text, #374151)',
                transition: 'all 0.15s ease'
              }}
            >
              <CreditCard size={24} />
              <span>Tarjeta / TPV</span>
              <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--color-text-muted, #6b7280)' }}>
                Voucher de terminal
              </span>
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
          <Button variant="secondary" type="button" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            leftIcon={<CheckCircle2 size={16} />}
            style={{ background: '#059669', borderColor: '#059669', color: '#fff' }}
          >
            {isLoading ? 'Registrando...' : 'Confirmar Cobro y Entrega'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
