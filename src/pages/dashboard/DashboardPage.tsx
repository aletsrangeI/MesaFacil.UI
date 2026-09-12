// src/pages/dashboard/DashboardPage.tsx
import { useState, Component, type ErrorInfo, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { selectUserProfile } from "../../state/authSlice";
import { useToast } from "../../components/ui/toast";
import Container from "../../components/ui/layout/Container";
import { 
  usePedidosGetAllAsyncQuery, 
  useMesasGetAllQuery, 
  useAreasGetAllQuery,
  useCatalogosGetAllQuery,
  useMesasUpdateAsyncMutation
} from "../../services/generated/api";
import { useGetResumenCorteQuery } from "../operacion/pos/CorteCajaModal";
import { useGetKdsBoardDashboardQuery } from "../../services/dashboardApi";
import { useSeedRestauranteCompletoMutation } from "../../services/demoApi";

// Componentes del Dashboard Bento
import { DashboardHeader } from "./DashboardHeader";
import { DashboardKpiCards } from "./DashboardKpiCards";
import { DashboardFloorPlan } from "./DashboardFloorPlan";
import { DashboardKdsPulse } from "./DashboardKdsPulse";
import { DashboardFastCheckout } from "./DashboardFastCheckout";
import "./dashboard.css";

// Modales Operativos
import { PaymentModal } from "../operacion/pos/PaymentModal";
import { ThermalTicketModal } from "../operacion/pos/ThermalTicketModal";
import { CorteCajaModal } from "../operacion/pos/CorteCajaModal";
import { CorteXModal } from "../operacion/pos/CorteXModal";
import { MovimientoCajaModal } from "../operacion/pos/MovimientoCajaModal";
import { AperturaTurnoModal } from "../operacion/pos/AperturaTurnoModal";

// ─── Error Boundary Protector ────────────────────────────────────────────────
interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class DashboardErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Dashboard error caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 16, margin: 24 }}>
          <h2 style={{ color: '#be123c', margin: '0 0 8px' }}>Se produjo un error al renderizar el Dashboard</h2>
          <p style={{ color: '#881337', margin: '0 0 16px' }}>{this.state.error?.message || "Error desconocido"}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ padding: '8px 16px', background: '#be123c', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}
          >
            Reintentar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Helper de Extracción Segura de Arrays ──────────────────────────────────
function toArray(data: any): any[] {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

export default function DashboardPage() {
  const profile = useSelector(selectUserProfile);
  const { addToast } = useToast();

  // Queries de Datos con Polling en tiempo real
  const { data: pedidosData, refetch: refetchPedidos } = usePedidosGetAllAsyncQuery(undefined, { pollingInterval: 8000 });
  const { data: mesasData, refetch: refetchMesas } = useMesasGetAllQuery();
  const { data: areasData } = useAreasGetAllQuery();
  const { data: catEstadosMesa } = useCatalogosGetAllQuery({ catalog: 'estados-mesa' });
  const { data: resumenTurnoData, refetch: refetchTurno } = useGetResumenCorteQuery({ idSucursal: 1 }, { pollingInterval: 10000 });
  const { data: kdsBoardData, refetch: refetchKds } = useGetKdsBoardDashboardQuery(undefined, { pollingInterval: 6000 });

  // Mutaciones
  const [seedDemo, { isLoading: isSeedingDemo }] = useSeedRestauranteCompletoMutation();
  const [updateMesa] = useMesasUpdateAsyncMutation();

  // Estados de Modales
  const [selectedPedidoToPay, setSelectedPedidoToPay] = useState<number | null>(null);
  const [selectedPedidoPrecuenta, setSelectedPedidoPrecuenta] = useState<number | null>(null);
  const [showAperturaModal, setShowAperturaModal] = useState(false);
  const [showCorteModal, setShowCorteModal] = useState(false);
  const [showCorteXModal, setShowCorteXModal] = useState(false);
  const [showMovimientoModal, setShowMovimientoModal] = useState(false);

  // Normalización 100% Defensiva de Datos
  const pedidos: any[] = toArray(pedidosData);
  const mesas: any[] = toArray(mesasData);
  const areas: any[] = toArray(areasData);
  const estadosMesa: any[] = toArray(catEstadosMesa);
  const resumenTurno = (resumenTurnoData as any)?.data || resumenTurnoData;
  const ticketsKds: any[] = toArray(kdsBoardData);

  // Pedidos del día por estado (5 = Cerrado/Cobrado, 6 = Cancelado)
  const pedidosCobrados = pedidos.filter((p: any) => p && p.idEstadoPedido === 5);
  const pedidosPorCobrar = pedidos.filter((p: any) => p && p.idEstadoPedido !== 5 && p.idEstadoPedido !== 6);

  // 1. Cálculo de Ventas y Tickets
  const ventasDesdePedidos = pedidosCobrados.reduce((acc: number, curr: any) => {
    const totalPedido = Number(curr?.cuentas?.[0]?.total) || 
      (Array.isArray(curr?.detalles) 
        ? curr.detalles.reduce((dAcc: number, d: any) => dAcc + ((Number(d?.precioUnitario) || 0) * (Number(d?.cantidad) || 1)), 0) 
        : 0);
    return acc + totalPedido;
  }, 0);

  const totalVentas = Number(resumenTurno?.totalVentas || ventasDesdePedidos || 0);
  const totalCuentasCobradas = pedidosCobrados.length;
  const ticketPromedio = totalCuentasCobradas > 0 ? totalVentas / totalCuentasCobradas : 0;

  // 2. Cálculo de Mesas Ocupadas
  const mesasOcupadasCount = mesas.filter((m: any) => {
    if (!m) return false;
    const estado = estadosMesa.find((e: any) => e?.id === m.idEstadoMesa);
    const isOcupada = estado?.descripcion?.toLowerCase()?.includes('ocupada');
    const tienePedidoActivo = pedidosPorCobrar.some((p: any) => p?.idMesa === m.id);
    return isOcupada || tienePedidoActivo;
  }).length;

  // 3. Tiempos KDS
  const ticketsActivos = ticketsKds.filter((t: any) => t && t.idEstadoTicketCocina !== 3);
  const tiempoPromedioKdsMin = ticketsActivos.length > 0
    ? Math.round(
        ticketsActivos.reduce((acc: number, curr: any) => {
          const fecha = curr?.createdAt || curr?.fechaCreacion;
          if (!fecha) return acc + 6;
          const mins = (Date.now() - new Date(fecha).getTime()) / 60000;
          return acc + Math.max(1, isNaN(mins) ? 6 : mins);
        }, 0) / ticketsActivos.length
      )
    : 0;

  // 4. Top Platillos
  const platillosCountMap: { [key: string]: number } = {};
  pedidos.forEach((p: any) => {
    if (Array.isArray(p?.detalles)) {
      p.detalles.forEach((d: any) => {
        if (!d?.cancelado && d?.productoNombre) {
          platillosCountMap[d.productoNombre] = (platillosCountMap[d.productoNombre] || 0) + (Number(d.cantidad) || 1);
        }
      });
    }
  });

  const topPlatillos = Object.entries(platillosCountMap)
    .map(([nombre, cantidad]) => ({ nombre, cantidad }))
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 4);

  // Acción: Cargar Demo
  const handleSeedDemo = async () => {
    try {
      addToast({ message: "Poblando restaurante demo 'Bistró & Brasa La Central'...", variant: "info" });
      const res = await seedDemo({ resetOrders: true }).unwrap();
      if (res?.isSuccess) {
        addToast({ message: res.message || "¡Escenario demo en hora pico cargado con éxito!", variant: "success" });
        refetchPedidos();
        refetchMesas();
        refetchTurno();
        refetchKds();
      } else {
        addToast({ message: res?.message || "Error al cargar demo", variant: "error" });
      }
    } catch (err: any) {
      addToast({ message: err?.data?.message || "Error de conexión al cargar demo", variant: "error" });
    }
  };

  // Acción: Liberar Mesa Sucia
  const handleLiberarMesa = async (mesa: any) => {
    if (!mesa) return;
    try {
      const idEstadoDisponible = estadosMesa.find((e: any) => e?.descripcion?.toLowerCase()?.includes('disponible'))?.id || 1;
      await updateMesa({ mesaDto: { ...mesa, idEstadoMesa: idEstadoDisponible } }).unwrap();
      addToast({ message: `Mesa ${mesa.codigo || mesa.id} marcada como limpia y lista`, variant: "success" });
      refetchMesas();
    } catch {
      addToast({ message: "Error al actualizar estado de la mesa", variant: "error" });
    }
  };

  return (
    <DashboardErrorBoundary>
      <Container as="main" maxWidth="xl" className="dash-container">
        {/* 1. Header Contextual con Quick Actions y Turno Activo */}
        <DashboardHeader
          userName={profile?.nombreCompleto || "Carlos Mendoza"}
          resumenTurno={resumenTurno}
          onOpenApertura={() => setShowAperturaModal(true)}
          onOpenCorteX={() => setShowCorteXModal(true)}
          onOpenMovimiento={() => setShowMovimientoModal(true)}
          onOpenCorteCaja={() => setShowCorteModal(true)}
          onSeedDemo={handleSeedDemo}
          isSeedingDemo={isSeedingDemo}
        />

        {/* 2. Grid Bento de 4 KPIs Clave */}
        <DashboardKpiCards
          totalVentas={totalVentas}
          totalCuentasCobradas={totalCuentasCobradas}
          mesasOcupadas={mesasOcupadasCount}
          totalMesas={mesas.length}
          ticketPromedio={ticketPromedio}
          ticketsKdsActivos={ticketsActivos.length}
          tiempoPromedioKdsMin={tiempoPromedioKdsMin}
        />

        {/* 3. Bento Grid Principal Asimétrico (Floor Plan + Pulso Cocina & Cobros) */}
        <div className="dash-main-grid">
          {/* Columna Izquierda: Monitor de Salón en Vivo */}
          <DashboardFloorPlan
            mesas={mesas}
            areas={areas}
            pedidosActivos={pedidosPorCobrar}
            estadosMesa={estadosMesa}
            onCobrarPedido={(idPedido) => setSelectedPedidoToPay(idPedido)}
            onVerPrecuenta={(idPedido) => setSelectedPedidoPrecuenta(idPedido)}
            onLiberarMesa={handleLiberarMesa}
          />

          {/* Columna Derecha: Pulso de Cocina KDS y Cuentas por Cobrar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6, 24px)' }}>
            <DashboardKdsPulse
              ticketsKds={ticketsKds}
              pedidosActivos={pedidos}
              topPlatillos={topPlatillos}
            />

            <DashboardFastCheckout
              pedidosPorCobrar={pedidosPorCobrar}
              onCobrarPedido={(idPedido) => setSelectedPedidoToPay(idPedido)}
              ventasEfectivo={resumenTurno?.ventasEfectivo || 0}
              ventasTarjeta={resumenTurno?.ventasTarjeta || 0}
              ventasTransferencia={resumenTurno?.ventasTransferencia || 0}
            />
          </div>
        </div>

        {/* ─── Modales Operativos Conectados ────────────────────────────────────── */}

        {/* Modal de Pago con División de Cuenta (Split Bill) */}
        {selectedPedidoToPay && (
          <PaymentModal
            isOpen={true}
            idPedido={selectedPedidoToPay}
            onClose={() => setSelectedPedidoToPay(null)}
            onPaymentSuccess={() => {
              setSelectedPedidoToPay(null);
              refetchPedidos();
              refetchMesas();
              refetchTurno();
            }}
          />
        )}

        {/* Modal de Pre-cuenta Térmica */}
        {selectedPedidoPrecuenta && (
          <ThermalTicketModal
            isOpen={true}
            onClose={() => setSelectedPedidoPrecuenta(null)}
            idPedido={selectedPedidoPrecuenta}
            tipo="pre-cuenta"
          />
        )}

        {/* Modal de Apertura de Turno */}
        <AperturaTurnoModal
          isOpen={showAperturaModal}
          onClose={() => setShowAperturaModal(false)}
          idSucursal={1}
          onTurnoAbierto={() => {
            refetchTurno();
            addToast({ message: "Turno de caja abierto correctamente", variant: "success" });
          }}
        />

        {/* Modal de Arqueo en Vivo (Corte X) */}
        <CorteXModal
          isOpen={showCorteXModal}
          onClose={() => setShowCorteXModal(false)}
          idSucursal={1}
        />

        {/* Modal de Movimiento de Caja (Ingreso / Egreso) */}
        <MovimientoCajaModal
          isOpen={showMovimientoModal}
          onClose={() => setShowMovimientoModal(false)}
          idSucursal={1}
        />

        {/* Modal de Corte Definitivo de Turno */}
        <CorteCajaModal
          isOpen={showCorteModal}
          onClose={() => setShowCorteModal(false)}
          idSucursal={1}
          onCorteSuccess={() => {
            refetchTurno();
            refetchPedidos();
          }}
        />
      </Container>
    </DashboardErrorBoundary>
  );
}
