// src/pages/HomePage.tsx
import { useState } from "react";
import Container from "../components/ui/layout/Container";
import { Button } from "../components/ui/button";
import Icon from "../components/ui/icons/Icon";
import { usePedidosGetAllAsyncQuery } from "../services/generated/api";
import { PaymentModal } from "./operacion/pos/PaymentModal";
import { CorteCajaModal } from "./operacion/pos/CorteCajaModal";

export default function HomePage() {
  const { data: pedidosData, isLoading, refetch } = usePedidosGetAllAsyncQuery(undefined, { pollingInterval: 10000 });
  const [selectedPedidoToPay, setSelectedPedidoToPay] = useState<number | null>(null);
  const [showCorteModal, setShowCorteModal] = useState(false);

  // Estados de pedido: 1=Registrado, 2=En Preparacion, 3=Listo, 4=Entregado, 5=Cerrado, 6=Cancelado
  const pedidos = pedidosData?.data || [];
  
  // "Por pagar": pedidos activos que no están ni cerrados ni cancelados (o podrías filtrarlo a solo 'Entregados')
  const pedidosPorPagar = pedidos.filter((p: any) => p.idEstadoPedido !== 5 && p.idEstadoPedido !== 6);
  
  // "Tickets Cobrados": pedidos cerrados (5)
  const ticketsCobrados = pedidos.filter((p: any) => p.idEstadoPedido === 5);

  return (
    <Container as="main" maxWidth="xl" style={{ display: "grid", gap: 24, paddingTop: 24, paddingBottom: 48 }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-h1)' }}>Dashboard Operativo</h1>
          <p style={{ color: 'var(--color-text-muted)', margin: 0 }}>Resumen del día y accesos rápidos</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button variant="secondary" onClick={() => setShowCorteModal(true)}>
            <Icon name="Coins" /> Corte de Caja
          </Button>
          <Button variant="primary" onClick={refetch}>
            <Icon name="RefreshCw" /> Actualizar
          </Button>
        </div>
      </header>

      {/* Grid estilo BentoBox */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 'var(--space-6, 24px)',
        alignItems: 'start'
      }}>
        
        {/* Bento: Pedidos por Pagar */}
        <section style={{
          background: 'var(--color-bg, #FFFFFF)',
          borderRadius: 'var(--radius-lg, 20px)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-border)',
          padding: 'var(--space-6, 24px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4, 16px)',
          gridColumn: 'span 2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'var(--color-warning-bg)', padding: 12, borderRadius: 12, color: 'var(--color-secondary)' }}>
              <Icon name="BellRing" />
            </div>
            <h2 style={{ margin: 0, fontSize: 20 }}>Pedidos Activos / Por Pagar</h2>
          </div>
          
          {isLoading ? (
            <p>Cargando pedidos...</p>
          ) : pedidosPorPagar.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No hay pedidos pendientes de cobro. (Se encontraron {pedidos.length} totales en la respuesta del API)</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-4, 16px)' }}>
              {pedidosPorPagar.map((pedido: any) => (
                <div key={pedido.id} style={{
                  padding: 'var(--space-4, 16px)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-md, 12px)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--space-2, 8px)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                    <span>Orden #{pedido.id}</span>
                    <span style={{ color: 'var(--color-primary)' }}>Mesa {pedido.idMesa}</span>
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--color-text-muted)' }}>
                    Personas: {pedido.personas || 1} <br/>
                    Apertura: {pedido.abiertoEn ? new Date(pedido.abiertoEn).toLocaleTimeString() : 'N/A'}
                  </div>
                  <Button 
                    variant="primary" 
                    style={{ marginTop: 8 }}
                    onClick={() => setSelectedPedidoToPay(pedido.id)}
                  >
                    Generar Cobro
                  </Button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Bento: Tickets Cobrados (Reporte Rápido) */}
        <section style={{
          background: 'var(--color-bg, #FFFFFF)',
          borderRadius: 'var(--radius-lg, 20px)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--color-border)',
          padding: 'var(--space-6, 24px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4, 16px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: 'var(--color-success-bg)', padding: 12, borderRadius: 12, color: 'var(--color-success)' }}>
              <Icon name="CheckCircle" />
            </div>
            <h2 style={{ margin: 0, fontSize: 20 }}>Tickets Cobrados Hoy</h2>
          </div>
          
          {isLoading ? (
            <p>Cargando historial...</p>
          ) : ticketsCobrados.length === 0 ? (
            <p style={{ color: 'var(--color-text-muted)' }}>No se han cobrado tickets aún.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3, 12px)' }}>
              {ticketsCobrados.map((ticket: any) => (
                <div key={ticket.id} style={{
                  padding: 'var(--space-3, 12px)',
                  background: 'rgba(0,0,0,0.02)',
                  borderRadius: 'var(--radius-md, 12px)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <strong style={{ display: 'block' }}>Ticket #{ticket.id}</strong>
                    <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>Mesa {ticket.idMesa}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: 'var(--color-success)', fontWeight: 'bold' }}>Cerrado</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Reutilizamos el Modal de Pago del POS */}
      {selectedPedidoToPay && (
        <PaymentModal
          isOpen={true}
          idPedido={selectedPedidoToPay}
          onClose={() => setSelectedPedidoToPay(null)}
          onPaymentSuccess={() => {
            setSelectedPedidoToPay(null);
            refetch();
          }}
        />
      )}

      {/* Modal de Corte de Caja y Arqueo */}
      <CorteCajaModal
        isOpen={showCorteModal}
        onClose={() => setShowCorteModal(false)}
        onCorteSuccess={refetch}
      />

    </Container>
  );
}
