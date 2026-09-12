// src/pages/dashboard/DashboardFloorPlan.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/ui/icons/Icon';

interface DashboardFloorPlanProps {
  mesas?: any[];
  areas?: any[];
  pedidosActivos?: any[];
  estadosMesa?: any[];
  onCobrarPedido: (idPedido: number) => void;
  onVerPrecuenta: (idPedido: number) => void;
  onLiberarMesa: (mesa: any) => void;
}

export const DashboardFloorPlan: React.FC<DashboardFloorPlanProps> = ({
  mesas = [],
  areas = [],
  pedidosActivos = [],
  estadosMesa = [],
  onCobrarPedido,
  onVerPrecuenta,
  onLiberarMesa
}) => {
  const navigate = useNavigate();
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);
  const [selectedMesaDetail, setSelectedMesaDetail] = useState<any>(null);

  const safeMesas = Array.isArray(mesas) ? mesas : [];
  const safeAreas = Array.isArray(areas) ? areas : [];
  const safePedidos = Array.isArray(pedidosActivos) ? pedidosActivos : [];
  const safeEstados = Array.isArray(estadosMesa) ? estadosMesa : [];

  const getEstadoInfo = (idEstadoMesa: number) => {
    const estado = safeEstados.find((e: any) => e?.id === idEstadoMesa);
    const desc = estado?.descripcion?.toLowerCase() || '';
    if (desc.includes('disponible')) return { text: 'Disponible', color: 'var(--color-success, #3c8d40)', bg: 'rgba(60,141,64,0.1)', tipo: 'disponible' };
    if (desc.includes('ocupada')) return { text: 'Ocupada', color: 'var(--color-danger, #d64545)', bg: 'rgba(214,69,69,0.1)', tipo: 'ocupada' };
    if (desc.includes('sucia')) return { text: 'Sucia', color: '#ea580c', bg: 'rgba(234,88,12,0.1)', tipo: 'sucia' };
    if (desc.includes('reservada')) return { text: 'Reservada', color: '#d97706', bg: 'rgba(217,119,6,0.1)', tipo: 'reservada' };
    return { text: 'Desconocido', color: '#64748b', bg: '#f1f5f9', tipo: 'desconocido' };
  };

  const filteredMesas = selectedAreaId 
    ? safeMesas.filter(m => m?.idArea === selectedAreaId) 
    : safeMesas;

  // Busca si la mesa tiene un pedido activo
  const getPedidoDeMesa = (idMesa: number) => {
    return safePedidos.find(p => p?.idMesa === idMesa && p?.idEstadoPedido !== 5 && p?.idEstadoPedido !== 6);
  };

  const handleMesaClick = (mesa: any) => {
    if (!mesa) return;
    const estadoInfo = getEstadoInfo(mesa.idEstadoMesa || 1);
    const pedido = getPedidoDeMesa(mesa.id);
    setSelectedMesaDetail({ mesa, estadoInfo, pedido });
  };

  const ocupadasCount = safeMesas.filter(m => getEstadoInfo(m?.idEstadoMesa).tipo === 'ocupada').length;

  return (
    <section className="dash-bento-card">
      <div className="dash-card-header">
        <h2>
          <Icon name="LayoutGrid" />
          <span>Monitor de Salón (Floor Plan)</span>
        </h2>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #64748b)' }}>
          {ocupadasCount} de {safeMesas.length} ocupadas
        </div>
      </div>

      {/* Tabs por Área */}
      <div className="dash-areas-tabs">
        <button
          className={`dash-area-chip ${selectedAreaId === null ? 'active' : ''}`}
          onClick={() => setSelectedAreaId(null)}
        >
          Todas las Áreas ({safeMesas.length})
        </button>
        {safeAreas.map(area => {
          if (!area) return null;
          const count = safeMesas.filter(m => m?.idArea === area.id).length;
          return (
            <button
              key={area.id}
              className={`dash-area-chip ${selectedAreaId === area.id ? 'active' : ''}`}
              onClick={() => setSelectedAreaId(area.id)}
            >
              {area.nombre || area.descripcion || `Área ${area.id}`} ({count})
            </button>
          );
        })}
      </div>

      {/* Grid de Mesas */}
      <div className="dash-tables-grid">
        {filteredMesas.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center', color: 'var(--color-text-muted, #64748b)' }}>
            No hay mesas registradas en esta área
          </div>
        ) : (
          filteredMesas.map(mesa => {
            if (!mesa) return null;
            const estado = getEstadoInfo(mesa.idEstadoMesa || 1);
            const pedido = getPedidoDeMesa(mesa.id);
            const tieneCuenta = !!pedido;

            return (
              <div
                key={mesa.id}
                className={`dash-table-cell ${estado.tipo}`}
                onClick={() => handleMesaClick(mesa)}
                title={`Mesa ${mesa.codigo || mesa.id} - ${estado.text}`}
              >
                <span className="dash-table-code">{mesa.codigo || `M${mesa.id}`}</span>
                <span className="dash-table-pax">
                  <Icon name="User" /> {mesa.asientos || 2} pax
                </span>
                <span 
                  className="dash-table-status-pill"
                  style={{ background: estado.bg, color: estado.color }}
                >
                  {estado.text}
                </span>
                {tieneCuenta && (
                  <div style={{ 
                    position: 'absolute', 
                    top: -5, 
                    right: -5, 
                    background: 'var(--color-primary, #d64545)', 
                    color: '#fff', 
                    borderRadius: '50%', 
                    width: 18, 
                    height: 18, 
                    fontSize: '0.65rem', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 800
                  }}>
                    !
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Popover / Mini Drawer de Acción Rápida de Mesa */}
      {selectedMesaDetail && (
        <div style={{
          marginTop: 12,
          padding: 16,
          borderRadius: 12,
          background: 'var(--color-surface-raised, #f8fafc)',
          border: '1px solid var(--color-border, #e2e8f0)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <strong style={{ fontSize: '1.1rem', color: 'var(--color-text, #0f172a)' }}>
                Mesa {selectedMesaDetail.mesa.codigo || selectedMesaDetail.mesa.id}
              </strong>
              <span 
                className="dash-table-status-pill"
                style={{ 
                  background: selectedMesaDetail.estadoInfo.bg, 
                  color: selectedMesaDetail.estadoInfo.color 
                }}
              >
                {selectedMesaDetail.estadoInfo.text}
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted, #64748b)', marginTop: 2 }}>
              Capacidad: {selectedMesaDetail.mesa.asientos} comensales
              {selectedMesaDetail.pedido && (
                <span> • Orden #{selectedMesaDetail.pedido.id} activa</span>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            {selectedMesaDetail.pedido ? (
              <>
                <button
                  className="dash-btn-action"
                  onClick={() => onVerPrecuenta(selectedMesaDetail.pedido.id)}
                  title="Imprimir o visualizar desglose de pre-cuenta"
                >
                  <Icon name="FileText" />
                  <span>Pre-cuenta</span>
                </button>
                <button
                  className="dash-btn-action primary"
                  onClick={() => onCobrarPedido(selectedMesaDetail.pedido.id)}
                  title="Cobrar orden con división de cuenta"
                >
                  <Icon name="CreditCard" />
                  <span>Cobrar Orden</span>
                </button>
                <button
                  className="dash-btn-action"
                  onClick={() => navigate('/ventas/pos')}
                  title="Abrir comanda en el POS para agregar más platillos"
                >
                  <Icon name="PlusCircle" />
                  <span>Agregar al POS</span>
                </button>
              </>
            ) : selectedMesaDetail.estadoInfo.tipo === 'sucia' ? (
              <button
                className="dash-btn-action primary"
                onClick={() => onLiberarMesa(selectedMesaDetail.mesa)}
              >
                <Icon name="CheckCircle" />
                <span>Marcar como Limpia</span>
              </button>
            ) : (
              <button
                className="dash-btn-action primary"
                onClick={() => navigate('/ventas/pos')}
              >
                <Icon name="PlusCircle" />
                <span>Abrir Comanda POS</span>
              </button>
            )}

            <button
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text-muted, #64748b)',
                cursor: 'pointer',
                padding: 6
              }}
              onClick={() => setSelectedMesaDetail(null)}
              title="Cerrar detalle"
            >
              <Icon name="X" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
