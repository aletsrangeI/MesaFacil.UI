import React from "react";
import { Users, Clock, MessageSquare, CheckCircle2, UserX, XCircle, Plus } from "lucide-react";
import type { FilaEsperaItemDTO } from "../../../services/hostessApi";

interface WaitlistColumnProps {
  waitlist: FilaEsperaItemDTO[];
  isLoading: boolean;
  selectedItem: FilaEsperaItemDTO | null;
  onSelectItem: (item: FilaEsperaItemDTO | null) => void;
  onSentar: (item: FilaEsperaItemDTO) => void;
  onCancelar: (id: number) => void;
  onNoShow: (id: number) => void;
  onOpenNuevo: () => void;
}

export const WaitlistColumn: React.FC<WaitlistColumnProps> = ({
  waitlist,
  isLoading,
  selectedItem,
  onSelectItem,
  onSentar,
  onCancelar,
  onNoShow,
  onOpenNuevo,
}) => {
  const activeItems = waitlist.filter((w) => w.estado === "EnEspera");

  return (
    <div className="waitlist-column">
      <div className="waitlist-col-header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <h3 className="waitlist-col-title">
            <Clock size={18} className="text-blue-600" />
            Fila de Espera
          </h3>
          <span className="waitlist-badge-count">{activeItems.length}</span>
        </div>
        <button
          type="button"
          onClick={onOpenNuevo}
          className="btn-primary"
          style={{
            padding: "0.35rem 0.75rem",
            fontSize: "0.8125rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
            borderRadius: "0.5rem",
            background: "#2563eb",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          <Plus size={16} />
          Nuevo
        </button>
      </div>

      <div className="waitlist-list">
        {isLoading ? (
          <div style={{ padding: "2rem", textAlign: "center", color: "#64748b" }}>
            Cargando fila de espera...
          </div>
        ) : activeItems.length === 0 ? (
          <div className="waitlist-empty">
            <Users size={36} />
            <p style={{ fontWeight: 600, margin: "0 0 0.25rem 0" }}>No hay clientes en espera</p>
            <p style={{ fontSize: "0.8125rem", margin: 0 }}>
              Registra un comensal para asignarle turno y notificarlo vía WhatsApp.
            </p>
          </div>
        ) : (
          activeItems.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            const comensales = item.comensales || (item as any).numeroPersonas || 2;
            const telefono = item.telefono || (item as any).telefonoCliente;
            const minutosEst = item.tiempoEsperaEstimadoMinutos ?? (item as any).minutosEstimados ?? 15;
            const urlWhatsApp = item.urlWhatsApp || (item as any).enlaceWhatsApp;
            const isExceeded = item.minutosTranscurridos > minutosEst;

            return (
              <div
                key={item.id}
                className={`waitlist-card ${isSelected ? "selected-for-seating" : ""}`}
                onClick={() => onSelectItem(isSelected ? null : item)}
                style={{ cursor: "pointer" }}
              >
                <div className="waitlist-card-header">
                  <div>
                    <h4 className="waitlist-client-name">{item.nombreCliente}</h4>
                    <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>
                      {telefono ? telefono : "Sin teléfono"}
                    </div>
                  </div>
                  <span className="waitlist-party-size">
                    <Users size={13} />
                    {comensales} {comensales === 1 ? "pers." : "pers."}
                  </span>
                </div>

                <div className="waitlist-meta">
                  <span className={`waitlist-time-badge ${isExceeded ? "time-warning" : ""}`}>
                    <Clock size={12} />
                    Espera: {item.minutosTranscurridos} min (Est. ~{minutosEst} min)
                  </span>
                  {item.zonaPreferencia && (
                    <span className="waitlist-zone-tag">
                      {item.zonaPreferencia}
                    </span>
                  )}
                </div>

                {item.notas && (
                  <div className="waitlist-notes">
                    <strong>Nota:</strong> {item.notas}
                  </div>
                )}

                <div className="waitlist-card-actions" onClick={(e) => e.stopPropagation()}>
                  <div>
                    {urlWhatsApp ? (
                      <a
                        href={urlWhatsApp}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          color: "#059669",
                          textDecoration: "none",
                          background: "#ecfdf5",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.375rem",
                          border: "1px solid #a7f3d0",
                        }}
                        title="Enviar WhatsApp de Mesa Lista"
                      >
                        <MessageSquare size={13} />
                        WhatsApp
                      </a>
                    ) : null}
                  </div>

                  <div className="waitlist-btn-group">
                    <button
                      type="button"
                      onClick={() => onSentar(item)}
                      title="Sentar comensal en mesa"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.25rem",
                        padding: "0.3rem 0.6rem",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        background: "#10b981",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                      }}
                    >
                      <CheckCircle2 size={13} />
                      Sentar
                    </button>
                    <button
                      type="button"
                      onClick={() => onNoShow(item.id)}
                      title="Marcar No-Show"
                      style={{
                        padding: "0.3rem 0.45rem",
                        fontSize: "0.75rem",
                        background: "#f1f5f9",
                        color: "#64748b",
                        border: "1px solid #cbd5e1",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                      }}
                    >
                      <UserX size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onCancelar(item.id)}
                      title="Cancelar espera"
                      style={{
                        padding: "0.3rem 0.45rem",
                        fontSize: "0.75rem",
                        background: "#fef2f2",
                        color: "#ef4444",
                        border: "1px solid #fecaca",
                        borderRadius: "0.375rem",
                        cursor: "pointer",
                      }}
                    >
                      <XCircle size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
