import React from "react";
import { Calendar, Plus, CheckCircle2, UserCheck, XCircle, Clock, Users } from "lucide-react";
import type { ReservaMesaDTO } from "../../../services/hostessApi";

interface ReservasCalendarViewProps {
  reservas: ReservaMesaDTO[];
  fecha: string;
  onChangeFecha: (fecha: string) => void;
  isLoading: boolean;
  onConfirmar: (id: number) => void;
  onLlegada: (id: number) => void;
  onCancelar: (id: number) => void;
  onOpenNuevaReserva: () => void;
}

export const ReservasCalendarView: React.FC<ReservasCalendarViewProps> = ({
  reservas,
  fecha,
  onChangeFecha,
  isLoading,
  onConfirmar,
  onLlegada,
  onCancelar,
  onOpenNuevaReserva,
}) => {
  const getBadgeClass = (estado: string) => {
    switch (estado) {
      case "Pendiente": return "badge-status badge-status-pendiente";
      case "Confirmada": return "badge-status badge-status-confirmada";
      case "Sentada": return "badge-status badge-status-sentada";
      case "Cancelada": return "badge-status badge-status-cancelada";
      default: return "badge-status badge-status-noshow";
    }
  };

  const formatHora = (fechaIso: string) => {
    try {
      const d = new Date(fechaIso);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
      return fechaIso;
    }
  };

  return (
    <div className="reservas-container">
      <div className="reservas-filter-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Calendar size={20} className="text-purple-600" />
          <label style={{ fontSize: "0.875rem", fontWeight: 700, color: "#334155" }}>
            Fecha de Reservaciones:
          </label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => onChangeFecha(e.target.value)}
            style={{
              padding: "0.4rem 0.75rem",
              borderRadius: "0.5rem",
              border: "1px solid #cbd5e1",
              fontSize: "0.875rem",
              fontWeight: 600,
            }}
          />
        </div>

        <button
          type="button"
          onClick={onOpenNuevaReserva}
          style={{
            padding: "0.5rem 1rem",
            fontSize: "0.875rem",
            fontWeight: 700,
            background: "#9333ea",
            color: "#ffffff",
            border: "none",
            borderRadius: "0.5rem",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <Plus size={16} />
          Nueva Reservación
        </button>
      </div>

      <div className="reservas-table-wrapper">
        <table className="reservas-table">
          <thead>
            <tr>
              <th>Hora</th>
              <th>Cliente</th>
              <th>Comensales</th>
              <th>Mesa</th>
              <th>Estado</th>
              <th>Depósito</th>
              <th>Notas</th>
              <th style={{ textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "2.5rem", color: "#64748b" }}>
                  Cargando reservaciones...
                </td>
              </tr>
            ) : reservas.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "3rem", color: "#94a3b8" }}>
                  No hay reservaciones registradas para el {fecha}.
                </td>
              </tr>
            ) : (
              reservas.map((res) => {
                const estado = res.estado || res.estadoReserva || "Confirmada";
                const comensales = res.comensales || res.numeroPersonas || 2;
                const contacto = res.telefono || res.telefonoCliente || res.correo || "Sin contacto";
                const deposito = res.depositoGarantia || res.anticipoPagado || 0;

                return (
                <tr key={res.id}>
                  <td>
                    <span style={{ fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                      <Clock size={14} className="text-purple-600" />
                      {formatHora(res.fechaHoraReserva)}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: "#0f172a" }}>{res.nombreCliente}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      {contacto}
                    </div>
                  </td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem", fontWeight: 600 }}>
                      <Users size={14} />
                      {comensales} pers.
                    </span>
                  </td>
                  <td>
                    {res.codigoMesa ? (
                      <span
                        style={{
                          background: "#ede9fe",
                          color: "#6d28d9",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "0.375rem",
                          fontWeight: 700,
                          fontSize: "0.75rem",
                        }}
                      >
                        {res.codigoMesa}
                      </span>
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: "0.8125rem" }}>Por asignar</span>
                    )}
                  </td>
                  <td>
                    <span className={getBadgeClass(estado)}>
                      {estado}
                    </span>
                  </td>
                  <td>
                    {deposito > 0 ? (
                      <span className="badge-deposit-paid">
                        ${deposito.toFixed(2)} {res.depositoPagado ? "✓ Pagado" : "Pendiente"}
                      </span>
                    ) : (
                      <span className="badge-deposit-none">Sin depósito</span>
                    )}
                  </td>
                  <td style={{ maxWidth: "200px", fontSize: "0.8125rem", color: "#475569" }}>
                    {res.notas || "—"}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "0.35rem" }}>
                      {estado === "Pendiente" && (
                        <button
                          type="button"
                          onClick={() => onConfirmar(res.id)}
                          title="Confirmar reservación"
                          style={{
                            padding: "0.35rem 0.6rem",
                            fontSize: "0.75rem",
                            fontWeight: 600,
                            background: "#dbeafe",
                            color: "#1e40af",
                            border: "none",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <CheckCircle2 size={13} />
                          Confirmar
                        </button>
                      )}

                      {(res.estado === "Pendiente" || res.estado === "Confirmada") && (
                        <button
                          type="button"
                          onClick={() => onLlegada(res.id)}
                          title="Marcar llegada y sentar"
                          style={{
                            padding: "0.35rem 0.6rem",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            background: "#10b981",
                            color: "#ffffff",
                            border: "none",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.25rem",
                          }}
                        >
                          <UserCheck size={13} />
                          Llegada
                        </button>
                      )}

                      {res.estado !== "Sentada" && res.estado !== "Cancelada" && (
                        <button
                          type="button"
                          onClick={() => onCancelar(res.id)}
                          title="Cancelar reservación"
                          style={{
                            padding: "0.35rem 0.5rem",
                            fontSize: "0.75rem",
                            background: "#fee2e2",
                            color: "#b91c1c",
                            border: "none",
                            borderRadius: "0.375rem",
                            cursor: "pointer",
                          }}
                        >
                          <XCircle size={13} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
        </table>
      </div>
    </div>
  );
};
