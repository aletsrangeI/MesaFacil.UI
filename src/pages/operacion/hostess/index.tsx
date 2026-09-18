import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../app/store";
import { useToast } from "../../../components/ui/toast";
import {
  useGetWaitlistQuery,
  useRegistrarWaitlistMutation,
  useSentarWaitlistMutation,
  useCancelarWaitlistMutation,
  useMarcarNoShowWaitlistMutation,
  useGetReservasQuery,
  useCrearReservaMutation,
  useConfirmarReservaMutation,
  useConfirmarLlegadaReservaMutation,
  useCancelarReservaMutation,
  useGetHostessDashboardSummaryQuery,
  type FilaEsperaItemDTO,
  type RegistrarWaitlistDTO,
  type CrearReservaDTO,
} from "../../../services/hostessApi";
import { useMesasGetAllQuery, useAreasGetAllQuery } from "../../../services/generated/api";
import { WaitlistColumn } from "./WaitlistColumn";
import { HostessMesasMap } from "./HostessMesasMap";
import { NuevaEsperaModal } from "./NuevaEsperaModal";
import { ReservasCalendarView } from "./ReservasCalendarView";
import { NuevaReservaModal } from "./NuevaReservaModal";
import {
  Users,
  Clock,
  Calendar,
  Utensils,
  Plus,
  RefreshCw,
  Layers,
} from "lucide-react";
import "./hostess.css";

export default function HostessPage() {
  const { addToast } = useToast();
  const authState = useSelector((state: RootState) => state.auth);
  const activeSucursalId = authState?.idSucursal || 2;

  // Active view tab: 'split' (waitlist + tables) or 'reservas'
  const [activeTab, setActiveTab] = useState<"split" | "reservas">("split");

  // Filter date for reservations (YYYY-MM-DD)
  const [selectedFecha, setSelectedFecha] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );

  // Modal states
  const [isNuevaEsperaOpen, setIsNuevaEsperaOpen] = useState(false);
  const [isNuevaReservaOpen, setIsNuevaReservaOpen] = useState(false);

  // Selected waitlist item to be seated
  const [selectedWaitlistItem, setSelectedWaitlistItem] = useState<FilaEsperaItemDTO | null>(null);
  const [selectedTargetMesaId, setSelectedTargetMesaId] = useState<number | null>(null);

  // Queries
  const {
    data: waitlistData,
    isLoading: isWaitlistLoading,
    refetch: refetchWaitlist,
  } = useGetWaitlistQuery(
    { idSucursal: activeSucursalId, soloActivos: true },
    { pollingInterval: 15000 }
  );

  const {
    data: reservasData,
    isLoading: isReservasLoading,
    refetch: refetchReservas,
  } = useGetReservasQuery(
    { idSucursal: activeSucursalId, fecha: selectedFecha },
    { pollingInterval: 30000 }
  );

  const {
    data: summaryData,
    refetch: refetchSummary,
  } = useGetHostessDashboardSummaryQuery(activeSucursalId, { pollingInterval: 15000 });

  const {
    data: mesasResp,
    refetch: refetchMesas,
  } = useMesasGetAllQuery();

  const {
    data: areasResp,
  } = useAreasGetAllQuery();

  // Mutations
  const [registrarWaitlist] = useRegistrarWaitlistMutation();
  const [sentarWaitlist] = useSentarWaitlistMutation();
  const [cancelarWaitlist] = useCancelarWaitlistMutation();
  const [marcarNoShowWaitlist] = useMarcarNoShowWaitlistMutation();

  const [crearReserva] = useCrearReservaMutation();
  const [confirmarReserva] = useConfirmarReservaMutation();
  const [confirmarLlegadaReserva] = useConfirmarLlegadaReservaMutation();
  const [cancelarReserva] = useCancelarReservaMutation();

  // Derived data
  const rawMesas = (mesasResp as any)?.data || (Array.isArray(mesasResp) ? mesasResp : []);
  const rawAreas = (areasResp as any)?.data || (Array.isArray(areasResp) ? areasResp : []);

  const mesas = useMemo(() => {
    return rawMesas.filter((m: any) => !m.idSucursal || m.idSucursal === activeSucursalId);
  }, [rawMesas, activeSucursalId]);

  const areas = rawAreas;
  const waitlist = waitlistData?.data || [];
  const reservas = reservasData?.data || [];
  const summary = summaryData?.data;

  // Handlers
  const handleRegistrarEspera = async (dto: RegistrarWaitlistDTO) => {
    try {
      const res = await registrarWaitlist(dto).unwrap();
      if (res.isSuccess) {
        addToast({
          message: `¡${dto.nombreCliente} agregado a la fila! Espera est: ~${res.data.tiempoEsperaEstimadoMinutos} min.`,
          variant: "success",
        });
        refetchSummary();
      }
    } catch (err: any) {
      addToast({
        message: err?.data?.message || "Error al registrar en fila de espera.",
        variant: "error",
      });
    }
  };

  const handleQuickSeatWaitlist = async (idMesa: number) => {
    if (!selectedWaitlistItem) return;
    try {
      const res = await sentarWaitlist({
        id: selectedWaitlistItem.id,
        data: { idMesa },
      }).unwrap();

      if (res.isSuccess) {
        const mesa = mesas.find((m: any) => m.id === idMesa);
        addToast({
          message: `¡${selectedWaitlistItem.nombreCliente} sentado en Mesa ${mesa?.numero || mesa?.codigo || idMesa}!`,
          variant: "success",
        });
        setSelectedWaitlistItem(null);
        setSelectedTargetMesaId(null);
        refetchMesas();
        refetchSummary();
      }
    } catch (err: any) {
      addToast({
        message: err?.data?.message || "No fue posible sentar al comensal en esta mesa.",
        variant: "error",
      });
    }
  };

  const handleSentarClick = (item: FilaEsperaItemDTO) => {
    setSelectedWaitlistItem(item);
    addToast({
      message: `Selecciona una mesa disponible en el mapa para sentar a ${item.nombreCliente}`,
      variant: "info",
    });
  };

  const handleCancelarWaitlist = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas cancelar este turno de espera?")) return;
    try {
      await cancelarWaitlist(id).unwrap();
      addToast({ message: "Turno de espera cancelado.", variant: "info" });
      refetchSummary();
    } catch (err: any) {
      addToast({ message: "Error al cancelar espera.", variant: "error" });
    }
  };

  const handleNoShowWaitlist = async (id: number) => {
    try {
      await marcarNoShowWaitlist(id).unwrap();
      addToast({ message: "Turno marcado como No-Show.", variant: "info" });
      refetchSummary();
    } catch (err: any) {
      addToast({ message: "Error al registrar No-Show.", variant: "error" });
    }
  };

  const handleCrearReserva = async (dto: CrearReservaDTO) => {
    try {
      const res = await crearReserva(dto).unwrap();
      if (res.isSuccess) {
        addToast({
          message: `¡Reservación para ${dto.nombreCliente} confirmada con éxito!`,
          variant: "success",
        });
        refetchSummary();
      }
    } catch (err: any) {
      addToast({
        message: err?.data?.message || "Error al crear reservación.",
        variant: "error",
      });
    }
  };

  const handleConfirmarReserva = async (id: number) => {
    try {
      await confirmarReserva(id).unwrap();
      addToast({ message: "Reservación confirmada.", variant: "success" });
      refetchSummary();
    } catch (err: any) {
      addToast({ message: "Error al confirmar reservación.", variant: "error" });
    }
  };

  const handleLlegadaReserva = async (id: number) => {
    try {
      await confirmarLlegadaReserva({ id }).unwrap();
      addToast({
        message: "Llegada confirmada. Mesa ocupada.",
        variant: "success",
      });
      refetchMesas();
      refetchSummary();
    } catch (err: any) {
      addToast({ message: "Error al registrar llegada.", variant: "error" });
    }
  };

  const handleCancelarReserva = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas cancelar esta reservación?")) return;
    try {
      await cancelarReserva(id).unwrap();
      addToast({ message: "Reservación cancelada.", variant: "info" });
      refetchSummary();
    } catch (err: any) {
      addToast({ message: "Error al cancelar reservación.", variant: "error" });
    }
  };

  return (
    <div className="hostess-container">
      {/* Header */}
      <div className="hostess-header">
        <div className="hostess-title-group">
          <h1>
            <Users size={26} className="text-blue-600" />
            Hostess Station & Fila Digital
          </h1>
          <p>
            Gestión inteligente de asignación de mesas, fila de espera y reservaciones en tiempo real.
          </p>
        </div>

        <div className="hostess-header-actions">
          <button
            type="button"
            onClick={() => {
              refetchWaitlist();
              refetchReservas();
              refetchMesas();
              refetchSummary();
            }}
            title="Refrescar datos"
            style={{
              padding: "0.55rem 0.85rem",
              borderRadius: "0.5rem",
              border: "1px solid #cbd5e1",
              background: "#ffffff",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          >
            <RefreshCw size={15} />
            Refrescar
          </button>

          <button
            type="button"
            onClick={() => setIsNuevaEsperaOpen(true)}
            style={{
              padding: "0.55rem 1rem",
              borderRadius: "0.5rem",
              border: "none",
              background: "#2563eb",
              color: "#ffffff",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              fontSize: "0.875rem",
              fontWeight: 700,
            }}
          >
            <Plus size={16} />
            Nuevo en Espera
          </button>
        </div>
      </div>

      {/* KPI Bar */}
      <div className="hostess-kpi-bar">
        <div className="hostess-kpi-card">
          <div className="hostess-kpi-icon kpi-waitlist">
            <Users size={22} />
          </div>
          <div className="hostess-kpi-info">
            <span className="hostess-kpi-val">{summary?.totalEnEspera ?? waitlist.length}</span>
            <span className="hostess-kpi-label">En Fila de Espera</span>
          </div>
        </div>

        <div className="hostess-kpi-card">
          <div className="hostess-kpi-icon kpi-avg-time">
            <Clock size={22} />
          </div>
          <div className="hostess-kpi-info">
            <span className="hostess-kpi-val">~{summary?.tiempoPromedioEsperaMinutos ?? 15} min</span>
            <span className="hostess-kpi-label">Tiempo Espera Est.</span>
          </div>
        </div>

        <div className="hostess-kpi-card">
          <div className="hostess-kpi-icon kpi-reservations">
            <Calendar size={22} />
          </div>
          <div className="hostess-kpi-info">
            <span className="hostess-kpi-val">
              {summary?.reservasHoyConfirmadas ?? 0} / {summary?.reservasHoyTotal ?? 0}
            </span>
            <span className="hostess-kpi-label">Reservas Hoy</span>
          </div>
        </div>

        <div className="hostess-kpi-card">
          <div className="hostess-kpi-icon kpi-tables-avail">
            <Utensils size={22} />
          </div>
          <div className="hostess-kpi-info">
            <span className="hostess-kpi-val">{summary?.mesasDisponibles ?? 0}</span>
            <span className="hostess-kpi-label">Mesas Disponibles</span>
          </div>
        </div>

        <div className="hostess-kpi-card">
          <div className="hostess-kpi-icon kpi-tables-soon">
            <Clock size={22} />
          </div>
          <div className="hostess-kpi-info">
            <span className="hostess-kpi-val">
              {(summary?.mesasPidiendoCuenta ?? 0) + (summary?.mesasLimpieza ?? 0)}
            </span>
            <span className="hostess-kpi-label">Por Liberar Pronto</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="hostess-tabs">
        <button
          type="button"
          className={`hostess-tab-btn ${activeTab === "split" ? "active" : ""}`}
          onClick={() => setActiveTab("split")}
        >
          <Layers size={16} />
          Fila de Espera & Mapa en Vivo
        </button>
        <button
          type="button"
          className={`hostess-tab-btn ${activeTab === "reservas" ? "active" : ""}`}
          onClick={() => setActiveTab("reservas")}
        >
          <Calendar size={16} />
          Libro de Reservaciones ({reservas.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "split" ? (
        <div className="hostess-split-layout">
          <WaitlistColumn
            waitlist={waitlist}
            isLoading={isWaitlistLoading}
            selectedItem={selectedWaitlistItem}
            onSelectItem={setSelectedWaitlistItem}
            onSentar={handleSentarClick}
            onCancelar={handleCancelarWaitlist}
            onNoShow={handleNoShowWaitlist}
            onOpenNuevo={() => setIsNuevaEsperaOpen(true)}
          />

          <HostessMesasMap
            mesas={mesas}
            areas={areas}
            selectedTargetMesaId={selectedTargetMesaId}
            onSelectTargetMesa={setSelectedTargetMesaId}
            targetWaitlistItem={selectedWaitlistItem}
            onQuickSeat={handleQuickSeatWaitlist}
            onRefetch={refetchMesas}
          />
        </div>
      ) : (
        <ReservasCalendarView
          reservas={reservas}
          fecha={selectedFecha}
          onChangeFecha={setSelectedFecha}
          isLoading={isReservasLoading}
          onConfirmar={handleConfirmarReserva}
          onLlegada={handleLlegadaReserva}
          onCancelar={handleCancelarReserva}
          onOpenNuevaReserva={() => setIsNuevaReservaOpen(true)}
        />
      )}

      {/* Modals */}
      <NuevaEsperaModal
        isOpen={isNuevaEsperaOpen}
        onClose={() => setIsNuevaEsperaOpen(false)}
        idSucursal={activeSucursalId}
        onRegistrar={handleRegistrarEspera}
      />

      <NuevaReservaModal
        isOpen={isNuevaReservaOpen}
        onClose={() => setIsNuevaReservaOpen(false)}
        idSucursal={activeSucursalId}
        mesas={mesas}
        onCrear={handleCrearReserva}
      />
    </div>
  );
}
