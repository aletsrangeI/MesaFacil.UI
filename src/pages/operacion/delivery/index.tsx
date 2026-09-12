import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  useGetDeliveryQueueQuery,
  useEntregarPedidoMutation,
  useMarcarListoPedidoMutation,
  type DeliveryQueueItem,
} from '../../../services/deliveryApi';
import { useSucursalesGetAllQuery } from '../../../services/generated/api';
import Container from '../../../components/ui/layout/Container';
import { Button } from '../../../components/ui/button/Button';
import { DespachoModal } from './DespachoModal';
import { ReboteModal } from './ReboteModal';
import { CobroEntregaModal } from './CobroEntregaModal';
import { useToast } from '../../../components/ui/toast';
import * as signalR from '@microsoft/signalr';
import {
  PackageCheck,
  Bike,
  ChefHat,
  Clock,
  RefreshCw,
  ShoppingBag,
  CheckCircle2,
  Phone,
  MapPin,
  User,
  ChevronDown,
  ChevronUp,
  Kanban,
  FileText,
} from 'lucide-react';
import './delivery.css';

export default function DeliveryPage() {
  const { addToast } = useToast();
  const [selectedSucursal, setSelectedSucursal] = useState<number | undefined>(undefined);
  const [filtroCanal, setFiltroCanal] = useState<string>('Todos');

  // Modales
  const [pedidoADespachar, setPedidoADespachar] = useState<DeliveryQueueItem | null>(null);
  const [pedidoARebotar, setPedidoARebotar] = useState<DeliveryQueueItem | null>(null);
  const [pedidoACobrar, setPedidoACobrar] = useState<DeliveryQueueItem | null>(null);

  // Expansión de ítems
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});

  // Sucursales
  const { data: sucursalesData } = useSucursalesGetAllQuery();
  const sucursales = Array.isArray(sucursalesData?.data) ? sucursalesData.data : [];

  // Consulta de cola
  const {
    data: queueData,
    isLoading,
    refetch,
  } = useGetDeliveryQueueQuery({ idSucursal: selectedSucursal });

  const pedidos = useMemo(() => queueData?.data || [], [queueData]);

  // Mutación de entrega rápida y marcado listo
  const [entregarPedido, { isLoading: isEntregando }] = useEntregarPedidoMutation();
  const [marcarListo, { isLoading: isMarcandoListo }] = useMarcarListoPedidoMutation();

  // Conexión SignalR para reactividad en tiempo real con KdsHub
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('/hubs/kds', { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        connection.on('OrderReadyForDispatch', () => {
          refetch();
          addToast({ message: '¡Nuevo pedido listo para despacho!', variant: 'info' });
        });
        connection.on('OrderDispatched', () => refetch());
        connection.on('OrderDelivered', () => refetch());
        connection.on('OrderRejected', () => refetch());
        connection.on('ReceiveNewTicket', () => refetch());
      })
      .catch(() => {
        // Fallback silencioso si no SignalR
      });

    return () => {
      connection.stop();
    };
  }, [refetch, addToast]);

  const toggleExpand = (id: number) => {
    setExpandedOrders((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEntregar = async (pedido: DeliveryQueueItem) => {
    // Si el pedido no está pagado (ej. Mostrador/Para Llevar o Delivery Propio Por Cobrar),
    // abrir el modal de selección de método de pago
    if (!pedido.estaPagado) {
      setPedidoACobrar(pedido);
      return;
    }

    try {
      const res = await entregarPedido(pedido.idPedido).unwrap();
      if (res.isSuccess) {
        addToast({
          message: `Pedido ${pedido.folio} entregado exitosamente.`,
          variant: 'success',
        });
      }
    } catch (err: any) {
      addToast({
        message: err?.data?.message || 'Error al confirmar la entrega.',
        variant: 'error',
      });
    }
  };

  const handleMarcarListo = async (pedido: DeliveryQueueItem) => {
    try {
      const res = await marcarListo(pedido.idPedido).unwrap();
      if (res.isSuccess) {
        addToast({
          message: `Pedido ${pedido.folio} listo para despacho en mostrador.`,
          variant: 'success',
        });
      }
    } catch (err: any) {
      addToast({
        message: err?.data?.message || 'Error al marcar el pedido como listo.',
        variant: 'error',
      });
    }
  };

  // Filtrado por canal
  const pedidosFiltrados = useMemo(() => {
    if (filtroCanal === 'Todos') return pedidos;
    if (filtroCanal === 'Para Llevar') {
      return pedidos.filter((p) => p.tipoPedido.toLowerCase().includes('llevar'));
    }
    return pedidos.filter(
      (p) => p.canalOrigen.toLowerCase() === filtroCanal.toLowerCase()
    );
  }, [pedidos, filtroCanal]);

  // Clasificación por columnas
  const columnaCocina = useMemo(
    () => pedidosFiltrados.filter((p) => p.idEstadoPedido === 1 || p.idEstadoPedido === 2),
    [pedidosFiltrados]
  );
  const columnaListos = useMemo(
    () => pedidosFiltrados.filter((p) => p.idEstadoPedido === 3),
    [pedidosFiltrados]
  );
  const columnaEnCamino = useMemo(
    () => pedidosFiltrados.filter((p) => p.idEstadoPedido === 4),
    [pedidosFiltrados]
  );
  const columnaEntregados = useMemo(
    () => pedidosFiltrados.filter((p) => p.idEstadoPedido >= 5),
    [pedidosFiltrados]
  );

  const getCanalBadge = (canal: string, tipo: string) => {
    const isLlevar = tipo.toLowerCase().includes('llevar');
    if (isLlevar) {
      return <span className="canal-badge llevar">🛍️ Para Llevar</span>;
    }
    switch (canal.toLowerCase()) {
      case 'uber eats':
        return <span className="canal-badge uber">🟢 Uber Eats</span>;
      case 'rappi':
        return <span className="canal-badge rappi">🟠 Rappi</span>;
      case 'didi food':
        return <span className="canal-badge didi">🔴 Didi Food</span>;
      default:
        return <span className="canal-badge propio">🛵 Delivery Propio</span>;
    }
  };

  const renderPedidoCard = (pedido: DeliveryQueueItem, columna: 'cocina' | 'listo' | 'camino' | 'entregado') => {
    const isExpanded = !!expandedOrders[pedido.idPedido];
    const isLlevar = pedido.tipoPedido.toLowerCase().includes('llevar');

    return (
      <div key={pedido.idPedido} className="delivery-card">
        {/* Encabezado */}
        <div className="delivery-card-top">
          <div>
            <span className="delivery-card-folio">{pedido.folio}</span>
            {pedido.idExterno && (
              <span className="delivery-card-external-id">({pedido.idExterno})</span>
            )}
            <div>{getCanalBadge(pedido.canalOrigen, pedido.tipoPedido)}</div>
          </div>
          <div className="delivery-card-pricing">
            <span className="delivery-card-amount">${pedido.total.toFixed(2)}</span>
            <span
              className={`delivery-card-pay-status ${
                pedido.estaPagado ? 'pagado' : 'pendiente'
              }`}
            >
              {pedido.estaPagado ? '✓ Pagado' : 'Por Cobrar'}
            </span>
          </div>
        </div>

        {/* Datos de cliente / repartidor */}
        <div className="delivery-card-info">
          {pedido.clienteNombre && (
            <div className="delivery-info-row customer">
              <User size={13} />
              <span>{pedido.clienteNombre}</span>
            </div>
          )}
          {pedido.clienteTelefono && (
            <div className="delivery-info-row">
              <Phone size={13} />
              <span>{pedido.clienteTelefono}</span>
            </div>
          )}
          {pedido.direccionEntrega && (
            <div className="delivery-info-row">
              <MapPin size={13} />
              <span>{pedido.direccionEntrega}</span>
            </div>
          )}
          {pedido.nombreRepartidor && (
            <div className="delivery-info-row carrier">
              <Bike size={13} />
              <span>Repartidor: {pedido.nombreRepartidor}</span>
            </div>
          )}
        </div>

        {/* Ítems del pedido (desplegable) */}
        <div className="delivery-items-toggle">
          <button
            type="button"
            onClick={() => toggleExpand(pedido.idPedido)}
            className="delivery-items-btn"
          >
            <span>{pedido.items.length} producto(s)</span>
            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {isExpanded && (
            <div className="delivery-items-list">
              {pedido.items.map((it) => (
                <div key={it.idDetalle} className="delivery-item-line">
                  <div className="delivery-item-name">
                    <strong>{it.cantidad}x</strong> {it.productoNombre}
                    {it.varianteNombre ? ` (${it.varianteNombre})` : ''}
                    {it.modificadores?.length > 0 && (
                      <span className="delivery-item-mods">
                        + {it.modificadores.join(', ')}
                      </span>
                    )}
                  </div>
                  <span className="delivery-item-price">
                    ${(it.cantidad * it.precioUnitario).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Acciones según columna */}
        <div className="delivery-card-footer">
          <span className="delivery-timer">
            <Clock size={12} /> {pedido.minutosEnEstado} min
          </span>

          <div className="delivery-card-actions">
            {columna === 'cocina' && (
              <button
                type="button"
                className="delivery-btn-action btn-listo"
                onClick={() => handleMarcarListo(pedido)}
                disabled={isMarcandoListo}
              >
                <CheckCircle2 size={13} /> Listo para Despacho
              </button>
            )}

            {columna === 'listo' && (
              <>
                <button
                  type="button"
                  className="delivery-btn-action btn-rebote"
                  onClick={() => setPedidoARebotar(pedido)}
                >
                  Incidencia
                </button>
                {isLlevar ? (
                  <button
                    type="button"
                    className="delivery-btn-action btn-entregar"
                    onClick={() => handleEntregar(pedido)}
                    disabled={isEntregando}
                  >
                    <CheckCircle2 size={14} /> Entregar
                  </button>
                ) : (
                  <button
                    type="button"
                    className="delivery-btn-action btn-despachar"
                    onClick={() => setPedidoADespachar(pedido)}
                  >
                    <Bike size={14} /> Despachar
                  </button>
                )}
              </>
            )}

            {columna === 'camino' && (
              <>
                <button
                  type="button"
                  className="delivery-btn-action btn-rebote"
                  onClick={() => setPedidoARebotar(pedido)}
                >
                  Rebote
                </button>
                <button
                  type="button"
                  className="delivery-btn-action btn-entregar"
                  onClick={() => handleEntregar(pedido)}
                  disabled={isEntregando}
                >
                  <CheckCircle2 size={14} /> Entregado
                </button>
              </>
            )}

            {columna === 'entregado' && (
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={14} /> Entregado
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Container className="delivery-container">
      {/* Pestañas de Navegación */}
      <nav className="delivery-nav-tabs">
        <div className="delivery-tab-btn active">
          <Kanban size={16} /> Tablero en Vivo
        </div>
        <Link to="/delivery/historial" className="delivery-tab-btn">
          <FileText size={16} /> Historial & Auditoría
        </Link>
      </nav>

      {/* Encabezado y Filtros */}
      <div className="delivery-header">
        <div className="delivery-header-title">
          <div>
            <h1>
              <PackageCheck size={24} style={{ color: '#d97706' }} />
              Despacho en Mostrador & Delivery
            </h1>
            <p>
              Control de órdenes sin mesa, entrega a comensales y despacho de repartidores
            </p>
          </div>
        </div>

        <div className="delivery-header-actions">
          {sucursales.length > 0 && (
            <select
              value={selectedSucursal || ''}
              onChange={(e) => setSelectedSucursal(e.target.value ? Number(e.target.value) : undefined)}
              className="delivery-select-branch"
            >
              <option value="">Todas las Sucursales</option>
              {sucursales.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nombre}
                </option>
              ))}
            </select>
          )}

          <Button
            variant="secondary"
            onClick={() => refetch()}
            disabled={isLoading}
            leftIcon={<RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />}
          >
            Actualizar
          </Button>
        </div>
      </div>

      {/* Barra de Filtros por Canal */}
      <div className="delivery-channel-bar">
        {['Todos', 'Para Llevar', 'Delivery Propio', 'Uber Eats', 'Rappi', 'Didi Food'].map((c) => (
          <button
            key={c}
            onClick={() => setFiltroCanal(c)}
            className={`delivery-filter-btn ${filtroCanal === c ? 'active' : ''}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Tablero Kanban de 4 Columnas */}
      <div className="delivery-kanban-grid">
        {/* Columna 1: En Cocina */}
        <div className="delivery-column col-cocina">
          <div className="delivery-column-header">
            <div className="delivery-column-title">
              <ChefHat size={16} style={{ color: '#d97706' }} />
              En Cocina (KDS)
            </div>
            <span className="delivery-column-count">
              {columnaCocina.length}
            </span>
          </div>
          <div className="delivery-column-cards">
            {columnaCocina.length === 0 ? (
              <div className="delivery-empty-column">
                Sin pedidos en cocina
              </div>
            ) : (
              columnaCocina.map((p) => renderPedidoCard(p, 'cocina'))
            )}
          </div>
        </div>

        {/* Columna 2: Listos en Mostrador */}
        <div className="delivery-column col-listo">
          <div className="delivery-column-header">
            <div className="delivery-column-title">
              <ShoppingBag size={16} style={{ color: '#059669' }} />
              Listos para Despacho
            </div>
            <span className="delivery-column-count">
              {columnaListos.length}
            </span>
          </div>
          <div className="delivery-column-cards">
            {columnaListos.length === 0 ? (
              <div className="delivery-empty-column">
                Sin pedidos en mostrador
              </div>
            ) : (
              columnaListos.map((p) => renderPedidoCard(p, 'listo'))
            )}
          </div>
        </div>

        {/* Columna 3: En Camino */}
        <div className="delivery-column col-camino">
          <div className="delivery-column-header">
            <div className="delivery-column-title">
              <Bike size={16} style={{ color: '#2563eb' }} />
              En Camino (Delivery)
            </div>
            <span className="delivery-column-count">
              {columnaEnCamino.length}
            </span>
          </div>
          <div className="delivery-column-cards">
            {columnaEnCamino.length === 0 ? (
              <div className="delivery-empty-column">
                Sin pedidos en ruta
              </div>
            ) : (
              columnaEnCamino.map((p) => renderPedidoCard(p, 'camino'))
            )}
          </div>
        </div>

        {/* Columna 4: Entregados Recientes */}
        <div className="delivery-column col-entregado">
          <div className="delivery-column-header">
            <div className="delivery-column-title">
              <CheckCircle2 size={16} style={{ color: '#64748b' }} />
              Entregados Hoy
            </div>
            <span className="delivery-column-count">
              {columnaEntregados.length}
            </span>
          </div>
          <div className="delivery-column-cards">
            {columnaEntregados.length === 0 ? (
              <div className="delivery-empty-column">
                Sin entregas registradas hoy
              </div>
            ) : (
              columnaEntregados.map((p) => renderPedidoCard(p, 'entregado'))
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      <DespachoModal
        pedido={pedidoADespachar}
        isOpen={!!pedidoADespachar}
        onClose={() => setPedidoADespachar(null)}
      />

      <ReboteModal
        pedido={pedidoARebotar}
        isOpen={!!pedidoARebotar}
        onClose={() => setPedidoARebotar(null)}
      />

      <CobroEntregaModal
        pedido={pedidoACobrar}
        isOpen={!!pedidoACobrar}
        onClose={() => setPedidoACobrar(null)}
      />
    </Container>
  );
}

