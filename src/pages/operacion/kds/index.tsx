import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { emptySplitApi as api } from "../../../services/baseApi";
import { useCatalogosGetAllQuery, useEstacionesCocinaGetAllAsyncQuery } from "../../../services/generated/api";
import { selectUserProfile } from "../../../state/authSlice";
import { 
  Check, 
  Clock, 
  AlertTriangle, 
  ChefHat, 
  Volume2, 
  Settings, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  Layers,
  MapPin,
  CookingPot,
  Flame,
  Sparkles,
  RefreshCw,
  History,
  ListOrdered
} from "lucide-react";
import * as signalR from "@microsoft/signalr";
import "./kds.css";

// Inject custom endpoints for KDS
const kdsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getKdsBoard: build.query<any, number | void>({
      query: (idEstacion) => ({
        url: '/api/TicketsCocina/GetKdsBoard',
        params: idEstacion ? { idEstacion } : undefined
      }),
      providesTags: ['TicketCocina', 'TicketDetalle']
    }),
    getKdsHistory: build.query<any, number | void>({
      query: (idEstacion) => ({
        url: '/api/TicketsCocina/GetKdsHistory',
        params: idEstacion ? { idEstacion } : undefined
      }),
      providesTags: ['TicketCocina', 'TicketDetalle']
    }),
    changeTicketStatus: build.mutation<void, { id: number, status: number }>({
      query: ({ id, status }) => ({
        url: `/api/TicketsCocina/ChangeTicketStatus/${id}/${status}`,
        method: 'PUT'
      }),
      invalidatesTags: ['TicketCocina', 'TicketDetalle']
    }),
    changeItemStatus: build.mutation<void, { id: number, status: number }>({
      query: ({ id, status }) => ({
        url: `/api/TicketsCocina/ChangeItemStatus/${id}/${status}`,
        method: 'PUT'
      }),
      invalidatesTags: ['TicketDetalle']
    }),
    recuperarTicket: build.mutation<void, number>({
      query: (id) => ({
        url: `/api/TicketsCocina/RecuperarTicket/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['TicketCocina', 'TicketDetalle']
    }),
    updateEstacionRushConfig: build.mutation<void, { idEstacion: number, minutosAmbar: number, minutosRojo: number }>({
      query: ({ idEstacion, minutosAmbar, minutosRojo }) => ({
        url: `/api/TicketsCocina/UpdateEstacionRushConfig/${idEstacion}?minutosAmbar=${minutosAmbar}&minutosRojo=${minutosRojo}`,
        method: 'PUT'
      }),
      invalidatesTags: ['EstacionCocina']
    })
  })
});

const { 
  useGetKdsBoardQuery, 
  useGetKdsHistoryQuery,
  useChangeTicketStatusMutation, 
  useChangeItemStatusMutation,
  useRecuperarTicketMutation,
  useUpdateEstacionRushConfigMutation
} = kdsApi;

// Web Audio API Chime Synthesizer
const playChime = () => {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
    osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.12); // A5
    gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.4);
  } catch (e) {
    console.error("No se pudo reproducir audio:", e);
  }
};

const isCriticalNote = (text?: string) => {
  if (!text) return false;
  const lower = text.toLowerCase();
  return lower.includes("sin") || lower.includes("no") || lower.includes("alerg") || lower.includes("extra") || lower.includes("grave");
};

const KdsPage = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectUserProfile);

  const getInitialEstacion = () => {
    const saved = localStorage.getItem("kds_selected_estacion");
    if (saved !== null) return Number(saved);
    if (profile?.idEstacion) return profile.idEstacion;
    return 0;
  };

  const [selectedEstacion, setSelectedEstacionState] = useState<number>(getInitialEstacion);
  const [activeTab, setActiveTab] = useState<'activos' | 'historial'>('activos');
  const [density, setDensity] = useState<'normal' | 'compacta' | 'ultradensa'>('normal');
  const [showRushModal, setShowRushModal] = useState<boolean>(false);
  const [minutosAmbar, setMinutosAmbar] = useState<number>(5);
  const [minutosRojo, setMinutosRojo] = useState<number>(10);

  const setSelectedEstacion = (val: number) => {
    setSelectedEstacionState(val);
    localStorage.setItem("kds_selected_estacion", String(val));
  };

  // Queries
  const { data: boardRes, isLoading: isLoadingBoard } = useGetKdsBoardQuery(selectedEstacion);
  const { data: historyRes, isLoading: isLoadingHistory } = useGetKdsHistoryQuery(selectedEstacion);
  const { data: estacionesRes } = useEstacionesCocinaGetAllAsyncQuery();
  const { data: ticketStatesRes } = useCatalogosGetAllQuery({ catalog: 'estados-ticket-cocina' });
  const { data: itemStatesRes } = useCatalogosGetAllQuery({ catalog: 'estados-item-kds' });

  // Mutations
  const [changeTicketStatus] = useChangeTicketStatusMutation();
  const [changeItemStatus] = useChangeItemStatusMutation();
  const [recuperarTicket] = useRecuperarTicketMutation();
  const [updateEstacionRushConfig] = useUpdateEstacionRushConfigMutation();

  const estaciones = Array.isArray((estacionesRes as any)?.data) ? (estacionesRes as any).data : [];
  const ticketStates = Array.isArray((ticketStatesRes as any)?.data) ? (ticketStatesRes as any).data : [];
  const itemStates = Array.isArray((itemStatesRes as any)?.data) ? (itemStatesRes as any).data : [];

  useEffect(() => {
    if (selectedEstacion > 0) {
      const currentStationObj = estaciones.find((e: any) => e.id === selectedEstacion);
      if (currentStationObj) {
        setMinutosAmbar(currentStationObj.minutosAmbar || 5);
        setMinutosRojo(currentStationObj.minutosRojo || 10);
      }
    }
  }, [selectedEstacion, estaciones]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5286/hubs/kds")
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNewTicket", (ticketId) => {
      console.log("Nuevo ticket recibido via SignalR:", ticketId);
      playChime();
      dispatch(api.util.invalidateTags(["TicketCocina", "TicketDetalle"]));
    });

    connection.onreconnected(() => {
      console.log("SignalR reconectado. Refrescando datos del KDS...");
      dispatch(api.util.invalidateTags(["TicketCocina", "TicketDetalle"]));
    });

    const empresaId = profile?.idEmpresa || 1;

    connection.start()
      .then(() => {
        console.log(`Conectado a KDS SignalR Hub (Empresa #${empresaId})`);
        if (selectedEstacion > 0) {
          connection.invoke("JoinStationGroup", selectedEstacion);
        } else {
          connection.invoke("JoinExpoGroup");
        }
      })
      .catch(err => console.error("Error conectando a SignalR: ", err));

    return () => {
      clearInterval(timer);
      connection.stop();
    };
  }, [dispatch, selectedEstacion, profile]);

  const activeTickets = boardRes?.data || [];
  const historyTickets = historyRes?.data || [];
  const tickets = activeTab === 'activos' ? activeTickets : historyTickets;

  const getElapsedMinutes = (createdAt: string) => {
    if (!createdAt) return 0;
    const diffMs = currentTime.getTime() - new Date(createdAt).getTime();
    return Math.max(0, Math.floor(diffMs / 60000));
  };

  // Contador de tickets en estado RUSH para el badge del header
  const rushCount = activeTickets.filter((t: any) => getElapsedMinutes(t.createdAt) >= minutosRojo).length;

  if (isLoadingBoard || isLoadingHistory) {
    return <div className="kds-loading">Cargando tickets de cocina...</div>;
  }

  const getStatusColor = (estado: number) => {
    switch(estado) {
      case 1: return "var(--color-border)";
      case 2: return "var(--color-secondary)";
      case 3: return "var(--color-success)";
      default: return "var(--color-border)";
    }
  };

  const getStatusText = (estado: number, isTicket: boolean = true) => {
    const states = isTicket ? ticketStates : itemStates;
    const stateObj = states.find((s: any) => s.id === estado);
    return stateObj ? stateObj.descripcion : "Desconocido";
  };

  const handleSaveRushConfig = async () => {
    if (selectedEstacion > 0) {
      await updateEstacionRushConfig({
        idEstacion: selectedEstacion,
        minutosAmbar,
        minutosRojo
      }).unwrap();
    }
    setShowRushModal(false);
  };

  const renderTicketCard = (ticket: any, isHistory: boolean = false) => {
    const mins = getElapsedMinutes(ticket.createdAt);
    let timerColor = "var(--color-success)"; // Verde (< minutosAmbar)
    let isRush = false;

    if (mins >= minutosRojo) {
      timerColor = "var(--color-primary)"; // Rojo (>= minutosRojo)
      isRush = true;
    } else if (mins >= minutosAmbar) {
      timerColor = "var(--color-secondary)"; // Amarillo (minutosAmbar - minutosRojo)
    }

    // Verificar si todos los ítems individuales están en estado Listo (3) o Cancelados
    const allItemsReady = ticket.detalles?.length > 0 && ticket.detalles.every((d: any) => d.idEstadoItemKDS === 3 || d.isCancelado);

    return (
      <div 
        key={ticket.id} 
        className={`kds-ticket density-${density}`} 
        style={{ 
          borderTop: `4px solid ${isRush && !isHistory ? 'var(--color-primary)' : getStatusColor(ticket.idEstadoTicketCocina)}`,
          padding: density === 'ultradensa' ? '8px' : density === 'compacta' ? '12px' : '16px'
        }}
      >
        <div className="ticket-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '6px' }}>
          {/* Fila 1: Ticket # + Estado */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span className="ticket-number" style={{ fontSize: density === 'ultradensa' ? '13px' : '15px' }}>
              Ticket #{ticket.id} <span style={{ fontSize: '12px', fontWeight: 'normal', color: 'var(--color-text-muted)' }}>(Ped #{ticket.idPedido})</span>
            </span>
            <span style={{ color: getStatusColor(ticket.idEstadoTicketCocina), fontSize: '11px', fontWeight: 600 }}>
              {getStatusText(ticket.idEstadoTicketCocina, true)}
            </span>
          </div>

          {/* Fila 2: Mesa + Timer (nunca comparten espacio con el badge) */}
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '60%' }}>
              {ticket.mesaNombre
                ? <><MapPin size={11} color="var(--color-secondary)" /> {ticket.mesaNombre}</>
                : <span style={{ opacity: 0.5 }}>Sin mesa</span>
              }
            </span>
            {/* Temporizador semaforizado — fijo a la derecha */}
            {!isHistory && (
              <span style={{
                color: timerColor,
                fontWeight: 'bold',
                fontSize: '11px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                flexShrink: 0,
                backgroundColor: isRush ? 'rgba(214, 69, 69, 0.15)' : 'var(--color-surface-raised)',
                padding: '2px 6px',
                borderRadius: 'var(--radius-sm)',
                border: `1px solid ${isRush ? 'rgba(214, 69, 69, 0.4)' : 'var(--color-border)'}`
              }}>
                <Clock size={11} /> {mins}m {isRush && <Flame size={11} color="var(--color-primary)" />}
              </span>
            )}
          </div>

          {/* Fila 3: Badge de estación — ocupa TODO el ancho disponible, no comparte fila con nada */}
          {ticket.estacionNombre && (
            <span
              className="badge-estacion"
              title={ticket.estacionNombre}
              style={{ maxWidth: '100%', alignSelf: 'flex-start' }}
            >
              <CookingPot size={11} />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {ticket.estacionNombre}
              </span>
            </span>
          )}
        </div>
        
        <div className="ticket-body" style={{ marginTop: density === 'ultradensa' ? '4px' : '10px' }}>
          <ul className="ticket-items" style={{ display: 'flex', flexDirection: 'column', gap: density === 'ultradensa' ? '4px' : '8px' }}>
            {ticket.detalles?.map((detalle: any) => {
              const hasCriticalNote = isCriticalNote(detalle.notas);
              const isItemDone = detalle.idEstadoItemKDS === 3;

              return (
                <li 
                  key={detalle.id} 
                  className="ticket-item" 
                  onClick={() => !isHistory && !detalle.isCancelado && changeItemStatus({ id: detalle.id, status: isItemDone ? 1 : 3 })}
                  style={{ 
                    textDecoration: (isItemDone || detalle.isCancelado) ? 'line-through' : 'none',
                    opacity: (isItemDone || detalle.isCancelado) ? 0.6 : 1,
                    backgroundColor: detalle.isCancelado ? 'rgba(214, 69, 69, 0.15)' : 'var(--color-surface-raised)',
                    padding: detalle.isCancelado ? '4px 6px' : '4px 8px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: density === 'ultradensa' ? '12px' : '14px'
                }}>
                  <div className="item-main" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="item-qty" style={{ fontWeight: 'bold' }}>{detalle.cantidad}x</span>
                    <span className="item-name" style={{ color: detalle.isCancelado ? 'var(--color-primary)' : 'var(--color-text)' }}>
                      {detalle.productoNombre}
                    </span>
                    {detalle.isCancelado && (
                      <span style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--color-primary)', marginLeft: 'auto', backgroundColor: 'rgba(214, 69, 69, 0.2)', padding: '2px 6px', borderRadius: 'var(--radius-sm)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <AlertTriangle size={10} color="var(--color-primary)" /> CANCELADO
                      </span>
                    )}
                  </div>
                  
                  {/* Render modificadores */}
                  {density !== 'ultradensa' && detalle.modificadores?.length > 0 && (
                    <ul className="item-modifiers" style={{ fontSize: '12px', paddingLeft: '16px', color: 'var(--color-text-muted)' }}>
                      {detalle.modificadores.map((mod: string, idx: number) => (
                        <li key={idx}>+ {mod}</li>
                      ))}
                    </ul>
                  )}

                  {/* REGLA NO NEGOCIABLE: Notas críticas NUNCA se ocultan */}
                  {detalle.notas && (density !== 'ultradensa' || hasCriticalNote) && (
                    <div 
                      className="item-notes" 
                      style={{ 
                        fontSize: '11px', 
                        color: hasCriticalNote ? 'var(--color-primary)' : 'var(--color-secondary)',
                        fontWeight: hasCriticalNote ? 'bold' : 'normal',
                        backgroundColor: hasCriticalNote ? 'rgba(214, 69, 69, 0.15)' : 'transparent',
                        padding: hasCriticalNote ? '2px 4px' : '0',
                        borderRadius: 'var(--radius-sm)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        marginTop: '2px'
                      }}
                    >
                      <AlertTriangle size={12} /> {detalle.notas}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <div className="ticket-footer" style={{ marginTop: '12px' }}>
          {!isHistory ? (
            <>
              {ticket.idEstadoTicketCocina === 1 && (
                <button 
                  className="btn-prepare"
                  onClick={() => changeTicketStatus({ id: ticket.id, status: 2 })}
                >
                  <ChefHat size={16} /> Preparar
                </button>
              )}
              {ticket.idEstadoTicketCocina === 2 && (
                <button 
                  className={`btn-complete ${allItemsReady ? 'btn-complete-suggested' : ''}`}
                  onClick={() => changeTicketStatus({ id: ticket.id, status: 3 })}
                >
                  <Check size={16} /> {allItemsReady ? "Terminar (Listo)" : "Terminar"}
                </button>
              )}
            </>
          ) : (
            <button 
              className="btn-recover"
              onClick={() => recuperarTicket(ticket.id)}
            >
              <RotateCcw size={16} /> Recuperar Ticket
            </button>
          )}
        </div>
      </div>
    );
  };

  // Group tickets by Order ID for Expo Mode (selectedEstacion === 0)
  const orderGroupsMap = selectedEstacion === 0 
    ? tickets.reduce((acc: any, t: any) => {
        if (!acc[t.idPedido]) acc[t.idPedido] = [];
        acc[t.idPedido].push(t);
        return acc;
      }, {})
    : null;

  return (
    <div className="kds-container" data-theme="kds-dark">
      {/* Header KDS */}
      <header className="kds-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '20px', margin: 0 }}>Kitchen Display System</h1>
          
          <select 
            value={selectedEstacion} 
            onChange={(e) => setSelectedEstacion(Number(e.target.value))}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface-raised)',
              color: 'var(--color-text)',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer'
            }}
          >
            <option value={0}>Todas las Estaciones (Modo Expo / Coordinación)</option>
            {estaciones.map((e: any) => (
              <option key={e.id} value={e.id}>{e.nombre || e.descripcion}</option>
            ))}
          </select>

          {/* Botón Cambiar Estación */}
          <button 
            type="button"
            onClick={() => setSelectedEstacion(0)}
            title="Ver Modo Expo / Cambiar estación"
            style={{ padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)', fontSize: '12px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <RefreshCw size={14} /> Cambiar Estación
          </button>

          {/* Header RUSH Counter Badge */}
          {rushCount > 0 && (
            <span style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-inverse)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '12px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '4px', boxShadow: 'var(--shadow-sm)' }}>
              <Flame size={14} /> RUSH ({rushCount})
            </span>
          )}
        </div>

        {/* Tab de Navegación: Activos vs Historial */}
        <div style={{ display: 'flex', backgroundColor: 'var(--color-surface-raised)', padding: '2px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
          <button
            onClick={() => setActiveTab('activos')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: activeTab === 'activos' ? 'var(--color-surface)' : 'transparent',
              color: activeTab === 'activos' ? 'var(--color-text)' : 'var(--color-text-muted)',
              fontWeight: 'bold',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ListOrdered size={14} /> Activos ({activeTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('historial')}
            style={{
              padding: '6px 14px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              backgroundColor: activeTab === 'historial' ? 'var(--color-surface)' : 'transparent',
              color: activeTab === 'historial' ? 'var(--color-text)' : 'var(--color-text-muted)',
              fontWeight: 'bold',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <History size={14} /> Historial ({historyTickets.length})
          </button>
        </div>

        {/* Controles de Densidad & Config RUSH */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto' }}>
          <div style={{ display: 'flex', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            <button
              onClick={() => setDensity('normal')}
              title="Vista Normal"
              style={{ padding: '6px 8px', backgroundColor: density === 'normal' ? 'var(--color-info)' : 'var(--color-surface-raised)', color: density === 'normal' ? 'var(--color-text-inverse)' : 'var(--color-text-muted)', border: 'none', cursor: 'pointer' }}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setDensity('compacta')}
              title="Vista Compacta"
              style={{ padding: '6px 8px', backgroundColor: density === 'compacta' ? 'var(--color-info)' : 'var(--color-surface-raised)', color: density === 'compacta' ? 'var(--color-text-inverse)' : 'var(--color-text-muted)', border: 'none', cursor: 'pointer' }}
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setDensity('ultradensa')}
              title="Vista Ultra-densa"
              style={{ padding: '6px 8px', backgroundColor: density === 'ultradensa' ? 'var(--color-info)' : 'var(--color-surface-raised)', color: density === 'ultradensa' ? 'var(--color-text-inverse)' : 'var(--color-text-muted)', border: 'none', cursor: 'pointer' }}
            >
              <Layers size={16} />
            </button>
          </div>

          {selectedEstacion > 0 && (
            <button 
              onClick={() => setShowRushModal(true)}
              title="Configurar Umbrales de Tiempo RUSH"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)', fontSize: '12px', cursor: 'pointer' }}
            >
              <Settings size={14} /> RUSH
            </button>
          )}

          <button 
            type="button"
            onClick={playChime}
            title="Probar sonido de notificación"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)', fontSize: '12px', cursor: 'pointer' }}
          >
            <Volume2 size={14} />
          </button>

          <div className="kds-clock" style={{ fontSize: '14px', fontWeight: 'bold' }}>
            <Clock size={16} />
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      </header>

      {/* Tablero KDS */}
      <div className="kds-board" style={{ marginTop: '16px' }}>
        {tickets.length === 0 ? (
          <div className="kds-empty">
            <h2>{activeTab === 'activos' ? "No hay pedidos pendientes" : "No hay tickets en el historial reciente"}</h2>
            <p>{activeTab === 'activos' ? "La cocina está al día. ¡Buen trabajo!" : "Los tickets completados aparecerán aquí para posibles recuperaciones."}</p>
          </div>
        ) : selectedEstacion === 0 && activeTab === 'activos' ? (
          // Modo Expo (Todas las estaciones)
          Object.entries(orderGroupsMap).map(([idPedido, orderTickets]: [string, any]) => {
            const totalTickets = orderTickets.length;
            const readyTickets = orderTickets.filter((t: any) => t.idEstadoTicketCocina === 3).length;
            const isOrderFullyReady = totalTickets > 0 && readyTickets === totalTickets;
            const sample = orderTickets[0];

            return (
              <div 
                key={idPedido} 
                style={{
                  gridColumn: '1 / -1',
                  border: isOrderFullyReady ? '2px solid var(--color-success)' : '1px solid var(--color-border)',
                  backgroundColor: isOrderFullyReady ? 'rgba(60, 141, 64, 0.15)' : 'var(--color-surface)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '16px',
                  marginBottom: '16px',
                  boxShadow: 'var(--shadow-md)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--color-border)', paddingBottom: '8px' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text)' }}>
                      <MapPin size={16} color="var(--color-secondary)" /> Mesa: {sample.mesaNombre || 'Mostrador/Para Llevar'} {sample.areaNombre ? `(${sample.areaNombre})` : ''}
                      <span style={{ fontSize: '14px', fontWeight: 'normal', color: 'var(--color-text-muted)' }}>[Pedido #{idPedido}]</span>
                    </h2>
                  </div>
                  <div>
                    {isOrderFullyReady ? (
                      <span style={{ backgroundColor: 'var(--color-success)', color: 'var(--color-text-inverse)', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <Sparkles size={18} /> ¡ORDEN COMPLETA PARA SERVIR!
                      </span>
                    ) : (
                      <span style={{ backgroundColor: 'rgba(233, 185, 73, 0.15)', color: 'var(--color-secondary)', padding: '6px 12px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px', border: '1px solid rgba(233, 185, 73, 0.3)' }}>
                        <Clock size={14} /> Progreso: {readyTickets} / {totalTickets} Estaciones Listas
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: density === 'ultradensa' ? 'repeat(auto-fill, minmax(200px, 1fr))' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {orderTickets.map((ticket: any) => renderTicketCard(ticket, false))}
                </div>
              </div>
            );
          })
        ) : (
          // Modo Estación Individual / Modo Historial
          <div style={{ display: 'grid', gridTemplateColumns: density === 'ultradensa' ? 'repeat(auto-fill, minmax(200px, 1fr))' : 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px', width: '100%' }}>
            {tickets.map((ticket: any) => renderTicketCard(ticket, activeTab === 'historial'))}
          </div>
        )}
      </div>

      {/* Modal de Configuración RUSH */}
      {showRushModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '24px', width: '380px', boxShadow: 'var(--shadow-lg)', color: 'var(--color-text)' }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Settings size={18} /> Umbrales de Tiempo RUSH
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              Configura los minutos esperados para la estación seleccionada:
            </p>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px', color: 'var(--color-secondary)' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-secondary)' }} /> Minutos para Advertencia (Ámbar):
              </label>
              <input 
                type="number" 
                min={1} 
                max={60} 
                value={minutosAmbar} 
                onChange={(e) => setMinutosAmbar(Number(e.target.value))}
                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)' }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 'bold', marginBottom: '4px', color: 'var(--color-primary)' }}>
                <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--color-primary)' }} /> Minutos para RUSH (Rojo):
              </label>
              <input 
                type="number" 
                min={1} 
                max={120} 
                value={minutosRojo} 
                onChange={(e) => setMinutosRojo(Number(e.target.value))}
                style={{ width: '100%', padding: '8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button 
                onClick={() => setShowRushModal(false)}
                style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-raised)', color: 'var(--color-text)', cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveRushConfig}
                style={{ padding: '8px 16px', borderRadius: 'var(--radius-sm)', border: 'none', backgroundColor: 'var(--color-info)', color: 'var(--color-text-inverse)', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KdsPage;
