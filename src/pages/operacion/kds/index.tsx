import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { emptySplitApi as api } from "../../../services/baseApi";
import { Check, Clock, AlertTriangle, ChefHat } from "lucide-react";
import * as signalR from "@microsoft/signalr";
import "./kds.css";

// Inject the custom endpoint for the KDS
const kdsApi = api.injectEndpoints({
  endpoints: (build) => ({
    getKdsBoard: build.query<any, void>({
      query: () => '/api/TicketsCocina/GetKdsBoard',
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
    })
  })
});
const { useGetKdsBoardQuery, useChangeTicketStatusMutation, useChangeItemStatusMutation } = kdsApi;

const KdsPage = () => {
  const dispatch = useDispatch();
  // Fetch from the custom KDS endpoint
  const { data: boardRes, isLoading } = useGetKdsBoardQuery();
  const [changeTicketStatus] = useChangeTicketStatusMutation();
  const [changeItemStatus] = useChangeItemStatusMutation();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 10000);
    
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5286/hubs/kds")
      .withAutomaticReconnect()
      .build();

    connection.on("ReceiveNewTicket", (ticketId) => {
      console.log("Nuevo ticket recibido via SignalR:", ticketId);
      dispatch(api.util.invalidateTags(["TicketCocina", "TicketDetalle"]));
    });

    connection.start()
      .then(() => console.log("Conectado a KDS SignalR Hub"))
      .catch(err => console.error("Error conectando a SignalR: ", err));

    return () => {
      clearInterval(timer);
      connection.stop();
    };
  }, [dispatch]);

  const tickets = boardRes?.data || [];

  if (isLoading) {
    return <div className="kds-loading">Cargando tickets de cocina...</div>;
  }

  const getStatusColor = (estado: number) => {
    switch(estado) {
      case 1: return "var(--pending-color)";
      case 2: return "var(--preparing-color)";
      case 3: return "var(--ready-color)";
      default: return "var(--border-color)";
    }
  };

  const getStatusText = (estado: number) => {
    switch(estado) {
      case 1: return "Pendiente";
      case 2: return "Preparando";
      case 3: return "Listo";
      default: return "Desconocido";
    }
  };

  return (
    <div className="kds-container">
      <header className="kds-header">
        <h1>Kitchen Display System (KDS)</h1>
        <div className="kds-clock">
          <Clock size={20} />
          {currentTime.toLocaleTimeString()}
        </div>
      </header>

      <div className="kds-board">
        {tickets.length === 0 ? (
          <div className="kds-empty">
            <h2>No hay pedidos pendientes</h2>
            <p>La cocina está al día. ¡Buen trabajo!</p>
          </div>
        ) : (
          tickets.map((ticket: any) => (
            <div key={ticket.id} className="kds-ticket" style={{ borderTop: `4px solid ${getStatusColor(ticket.idEstadoTicketCocina)}` }}>
              <div className="ticket-header">
                <span className="ticket-number">#{ticket.id}</span>
                <span className="ticket-table">Pedido: {ticket.idPedido}</span>
                <span className="ticket-time" style={{ color: getStatusColor(ticket.idEstadoTicketCocina) }}>
                  {getStatusText(ticket.idEstadoTicketCocina)}
                </span>
              </div>
              
              <div className="ticket-body">
                <ul className="ticket-items">
                  {ticket.detalles?.map((detalle: any) => (
                    <li key={detalle.id} 
                        className="ticket-item" 
                        onClick={() => changeItemStatus({ id: detalle.id, status: detalle.idEstadoItemKDS === 3 ? 1 : 3 })}
                        style={{ 
                        textDecoration: detalle.idEstadoItemKDS === 3 ? 'line-through' : 'none',
                        opacity: detalle.idEstadoItemKDS === 3 ? 0.6 : 1
                    }}>
                      <div className="item-main">
                        <span className="item-qty">{detalle.cantidad}x</span>
                        <span className="item-name">{detalle.productoNombre}</span>
                      </div>
                      
                      {/* Render modifiers */}
                      {detalle.modificadores?.length > 0 && (
                        <ul className="item-modifiers">
                          {detalle.modificadores.map((mod: string, idx: number) => (
                            <li key={idx}>+ {mod}</li>
                          ))}
                        </ul>
                      )}

                      {/* Render notes */}
                      {detalle.notas && (
                        <div className="item-notes">
                          <AlertTriangle size={12} /> {detalle.notas}
                        </div>
                      )}
                    </li>
                  ))}
                  {(!ticket.detalles || ticket.detalles.length === 0) && (
                    <li className="ticket-item">
                      <span className="item-name" style={{ fontStyle: 'italic', opacity: 0.5 }}>Sin detalles</span>
                    </li>
                  )}
                </ul>
              </div>

              <div className="ticket-footer">
                {ticket.idEstadoTicketCocina === 1 && (
                  <button className="btn-prepare" 
                          style={{ backgroundColor: 'var(--preparing-color)' }}
                          onClick={() => changeTicketStatus({ id: ticket.id, status: 2 })}>
                    <ChefHat size={18} />
                    Preparar
                  </button>
                )}
                {ticket.idEstadoTicketCocina === 2 && (
                  <button className="btn-complete" 
                          style={{ backgroundColor: 'var(--ready-color)' }}
                          onClick={() => changeTicketStatus({ id: ticket.id, status: 3 })}>
                    <Check size={18} />
                    Terminar
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default KdsPage;
