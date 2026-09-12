import React, { useState } from 'react';
import { Modal } from '../../../components/modal/Modal';
import { Button } from '../../../components/ui/button/Button';
import { useDespacharPedidoMutation, type DeliveryQueueItem } from '../../../services/deliveryApi';
import { useToast } from '../../../components/ui/toast';
import { Bike, User, Phone, Hash } from 'lucide-react';

interface DespachoModalProps {
  pedido: DeliveryQueueItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DespachoModal: React.FC<DespachoModalProps> = ({ pedido, isOpen, onClose }) => {
  const [despachar, { isLoading }] = useDespacharPedidoMutation();
  const { addToast } = useToast();

  const [nombreRepartidor, setNombreRepartidor] = useState(pedido?.nombreRepartidor || '');
  const [telefonoRepartidor, setTelefonoRepartidor] = useState(pedido?.telefonoRepartidor || '');
  const [idExterno, setIdExterno] = useState(pedido?.idExterno || '');

  React.useEffect(() => {
    if (pedido) {
      setNombreRepartidor(pedido.nombreRepartidor || '');
      setTelefonoRepartidor(pedido.telefonoRepartidor || '');
      setIdExterno(pedido.idExterno || '');
    }
  }, [pedido]);

  if (!pedido) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await despachar({
        id: pedido.idPedido,
        nombreRepartidor: nombreRepartidor.trim() || undefined,
        telefonoRepartidor: telefonoRepartidor.trim() || undefined,
        idExterno: idExterno.trim() || undefined,
      }).unwrap();

      if (res.isSuccess) {
        addToast({
          message: `Pedido ${pedido.folio} despachado en camino.`,
          variant: 'success',
        });
        onClose();
      }
    } catch (err: any) {
      addToast({
        message: err?.data?.message || 'Error al despachar el pedido.',
        variant: 'error',
      });
    }
  };

  const isPlataforma = ['Uber Eats', 'Rappi', 'Didi Food'].includes(pedido.canalOrigen);

  return (
    <Modal open={isOpen} onClose={onClose} title={`Despachar ${pedido.folio} - ${pedido.canalOrigen}`}>
      <form onSubmit={handleSubmit} className="delivery-form">
        <div className="delivery-info-box">
          <div className="delivery-info-box-row">
            <strong>Cliente:</strong>
            <span>{pedido.clienteNombre || 'Sin nombre registrado'}</span>
          </div>
          {pedido.direccionEntrega && (
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
              📍 <strong>{pedido.direccionEntrega}</strong>
            </div>
          )}
        </div>

        <div className="delivery-form-group">
          <label className="delivery-form-label">
            {isPlataforma ? 'Nombre del Repartidor de la App' : 'Nombre del Repartidor Propio'}
          </label>
          <div className="delivery-input-wrapper">
            <User size={16} className="delivery-input-icon" />
            <input
              type="text"
              placeholder={isPlataforma ? 'Ej. Carlos M. (Uber)' : 'Ej. Juan Pérez'}
              value={nombreRepartidor}
              onChange={(e) => setNombreRepartidor(e.target.value)}
              className="delivery-form-input has-icon"
              required={!isPlataforma}
            />
          </div>
        </div>

        {!isPlataforma && (
          <div className="delivery-form-group">
            <label className="delivery-form-label">
              Teléfono del Repartidor (Opcional)
            </label>
            <div className="delivery-input-wrapper">
              <Phone size={16} className="delivery-input-icon" />
              <input
                type="tel"
                placeholder="Ej. 55 1234 5678"
                value={telefonoRepartidor}
                onChange={(e) => setTelefonoRepartidor(e.target.value)}
                className="delivery-form-input has-icon"
              />
            </div>
          </div>
        )}

        {isPlataforma && (
          <div className="delivery-form-group">
            <label className="delivery-form-label">
              ID / Código del Pedido en Plataforma
            </label>
            <div className="delivery-input-wrapper">
              <Hash size={16} className="delivery-input-icon" />
              <input
                type="text"
                placeholder="Ej. #UE-84920"
                value={idExterno}
                onChange={(e) => setIdExterno(e.target.value)}
                className="delivery-form-input has-icon"
              />
            </div>
          </div>
        )}

        <div className="delivery-modal-actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={isLoading} leftIcon={<Bike size={16} />}>
            {isLoading ? 'Despachando...' : 'Confirmar Salida (En Camino)'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
