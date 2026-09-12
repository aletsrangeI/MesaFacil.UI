import React, { useState, useMemo } from 'react';
import { Modal } from '../../../components/modal/Modal';
import { Button } from '../../../components/ui/button/Button';
import { useRebotarPedidoMutation, type DeliveryQueueItem } from '../../../services/deliveryApi';
import { useCatalogosGetAllQuery } from '../../../services/generated/api';
import { useToast } from '../../../components/ui/toast';
import { AlertTriangle } from 'lucide-react';

interface ReboteModalProps {
  pedido: DeliveryQueueItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const MOTIVOS_COMUNES_FALLBACK = [
  'Cliente canceló en app / llamada',
  'Dirección incorrecta / Fuera de zona',
  'Cliente ausente en domicilio',
  'Pedido equivocado / Producto en mal estado',
  'Repartidor accidentado / no disponible',
  'Otro motivo',
];

export const ReboteModal: React.FC<ReboteModalProps> = ({ pedido, isOpen, onClose }) => {
  const [rebotar, { isLoading }] = useRebotarPedidoMutation();
  const { addToast } = useToast();
  const { data: motivosRes } = useCatalogosGetAllQuery({ catalog: 'motivos-cancelacion-pedido' });

  const motivos = useMemo(() => {
    const list = Array.isArray((motivosRes as any)?.data)
      ? (motivosRes as any).data.map((x: any) => x.descripcion)
      : [];
    return list.length > 0 ? list : MOTIVOS_COMUNES_FALLBACK;
  }, [motivosRes]);

  const [motivoSelect, setMotivoSelect] = useState(MOTIVOS_COMUNES_FALLBACK[0]);
  const [detalle, setDetalle] = useState('');

  if (!pedido) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const motivoFinal = motivoSelect === 'Otro motivo' ? detalle : `${motivoSelect}${detalle ? `: ${detalle}` : ''}`;

    if (!motivoFinal.trim()) {
      addToast({ message: 'Por favor indica el motivo del rebote o anulación.', variant: 'error' });
      return;
    }

    try {
      const res = await rebotar({
        id: pedido.idPedido,
        motivo: motivoFinal,
      }).unwrap();

      if (res.isSuccess) {
        addToast({
          message: `Pedido ${pedido.folio} registrado como rebotado/cancelado.`,
          variant: 'success',
        });
        onClose();
      }
    } catch (err: any) {
      addToast({
        message: err?.data?.message || 'Error al procesar la incidencia.',
        variant: 'error',
      });
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={`Reportar Incidencia / Rebote - ${pedido.folio}`}>
      <form onSubmit={handleSubmit} className="delivery-form">
        <div className="delivery-alert-box">
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Importante:</strong> Al confirmar el rebote, el pedido se marcará como <strong>Cancelado</strong>. 
            Si fue pedido de plataforma (Uber/Rappi) o cuenta por cobrar, se anulará la orden sin alterar el dinero en efectivo de la gaveta de caja.
          </div>
        </div>

        <div className="delivery-form-group">
          <label className="delivery-form-label">
            Motivo de Incidencia / Rechazo
          </label>
          <select
            value={motivoSelect}
            onChange={(e) => setMotivoSelect(e.target.value)}
            className="delivery-form-select focus-red"
          >
            {motivos.map((m: string) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="delivery-form-group">
          <label className="delivery-form-label">
            Detalle adicional / Observaciones
          </label>
          <textarea
            rows={3}
            placeholder="Describe qué ocurrió con el pedido o cliente..."
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            className="delivery-form-textarea focus-red"
            required={motivoSelect === 'Otro motivo'}
          />
        </div>

        <div className="delivery-modal-actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Regresar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            style={{ background: '#d64545', borderColor: '#d64545', color: '#fff' }}
          >
            {isLoading ? 'Cancelando...' : 'Confirmar Rebote / Anulación'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
