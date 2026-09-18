import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import { Users, Clock, Check, Utensils } from "lucide-react";
import type { FilaEsperaItemDTO } from "../../../services/hostessApi";

interface HostessMesasMapProps {
  mesas: any[];
  areas: any[];
  selectedTargetMesaId: number | null;
  onSelectTargetMesa: (idMesa: number | null) => void;
  targetWaitlistItem: FilaEsperaItemDTO | null;
  onQuickSeat: (idMesa: number) => void;
  onRefetch: () => void;
}

export const HostessMesasMap: React.FC<HostessMesasMapProps> = ({
  mesas,
  areas,
  selectedTargetMesaId,
  onSelectTargetMesa,
  targetWaitlistItem,
  onQuickSeat,
  onRefetch,
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState<number | null>(null);

  // SignalR real-time synchronization with MesasHub
  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("/hubs/mesas", { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        connection.on("MesaEstadoActualizado", () => {
          onRefetch();
        });
      })
      .catch(() => {
        // Fallback gracefully if SignalR hub is offline or unreachable
      });

    return () => {
      connection.stop();
    };
  }, [onRefetch]);

  const filteredMesas = selectedAreaId
    ? mesas.filter((m) => m.idArea === selectedAreaId)
    : mesas;

  const getMesaStatusInfo = (idEstadoMesa: number) => {
    switch (idEstadoMesa) {
      case 1:
        return {
          label: "Disponible",
          className: "mesa-disponible",
          isAvailable: true,
          badge: "Libre",
          hint: "Lista para sentar",
        };
      case 2:
        return {
          label: "Ocupada",
          className: "mesa-ocupada",
          isAvailable: false,
          badge: "En Servicio",
          hint: null,
        };
      case 3:
        return {
          label: "Reservada",
          className: "mesa-reservada",
          isAvailable: false,
          badge: "Reservada",
          hint: "Reserva agendada",
        };
      case 4:
        return {
          label: "Pidiendo Cuenta",
          className: "mesa-cuenta",
          isAvailable: false,
          badge: "Por Cobrar",
          hint: "~12m para liberar",
        };
      case 5:
        return {
          label: "En Limpieza",
          className: "mesa-limpieza",
          isAvailable: false,
          badge: "Limpieza",
          hint: "~5m para liberar",
        };
      default:
        return {
          label: "Fuera de Servicio",
          className: "mesa-limpieza",
          isAvailable: false,
          badge: "Bloqueada",
          hint: null,
        };
    }
  };

  return (
    <div className="hostess-map-panel">
      <div className="hostess-map-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <h3 className="hostess-map-title">
            <Utensils size={18} className="text-emerald-600" />
            Mapa de Mesas en Vivo
          </h3>
          {targetWaitlistItem && (
            <span
              style={{
                fontSize: "0.8125rem",
                background: "#eff6ff",
                color: "#1d4ed8",
                padding: "0.2rem 0.6rem",
                borderRadius: "9999px",
                fontWeight: 600,
              }}
            >
              Selecciona mesa para: {targetWaitlistItem.nombreCliente} ({targetWaitlistItem.comensales}p)
            </span>
          )}
        </div>

        <div className="hostess-area-chips">
          <button
            type="button"
            className={`hostess-area-chip ${selectedAreaId === null ? "active" : ""}`}
            onClick={() => setSelectedAreaId(null)}
          >
            Todas las áreas ({mesas.length})
          </button>
          {areas.map((a) => (
            <button
              key={a.id}
              type="button"
              className={`hostess-area-chip ${selectedAreaId === a.id ? "active" : ""}`}
              onClick={() => setSelectedAreaId(a.id)}
            >
              {a.nombre}
            </button>
          ))}
        </div>
      </div>

      <div className="hostess-legend">
        <div className="legend-item">
          <span className="legend-dot dot-disponible" />
          <span>Disponible</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-cuenta" />
          <span>Pidiendo Cuenta (~12 min)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-limpieza" />
          <span>En Limpieza (~5 min)</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-ocupada" />
          <span>Ocupada</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot dot-reservada" />
          <span>Reservada</span>
        </div>
      </div>

      <div className="hostess-mesas-grid">
        {filteredMesas.map((mesa) => {
          const status = getMesaStatusInfo(mesa.idEstadoMesa);
          const isTargetSelected = selectedTargetMesaId === mesa.id;
          const isSelectable = targetWaitlistItem && status.isAvailable;

          return (
            <div
              key={mesa.id}
              className={`hostess-mesa-card ${status.className} ${
                isSelectable ? "mesa-selectable" : ""
              } ${isTargetSelected ? "mesa-selected-target" : ""}`}
              onClick={() => {
                if (targetWaitlistItem && status.isAvailable) {
                  onQuickSeat(mesa.id);
                } else {
                  onSelectTargetMesa(isTargetSelected ? null : mesa.id);
                }
              }}
            >
              <div className="mesa-header-row">
                <span className="mesa-codigo">M-{mesa.numero || mesa.codigo || mesa.id}</span>
                <span className="mesa-capacidad">
                  <Users size={12} style={{ display: "inline", verticalAlign: "middle", marginRight: "2px" }} />
                  {mesa.capacidad || 4}p
                </span>
              </div>

              <div>
                <div className="mesa-status-tag">{status.badge}</div>
                {status.hint && (
                  <div className="mesa-timing-hint">
                    <Clock size={10} style={{ display: "inline", marginRight: "3px" }} />
                    {status.hint}
                  </div>
                )}
              </div>

              {isSelectable && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "6px",
                    right: "6px",
                    background: "#2563eb",
                    color: "#fff",
                    borderRadius: "50%",
                    width: "22px",
                    height: "22px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  title="Sentar comensal aquí"
                >
                  <Check size={14} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
