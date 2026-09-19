import React, { useState } from "react";
import { X, Calendar, Phone, Mail, Check } from "lucide-react";
import type { CrearReservaDTO } from "../../../services/hostessApi";

interface NuevaReservaModalProps {
  isOpen: boolean;
  onClose: () => void;
  idSucursal: number;
  mesas: any[];
  onCrear: (dto: CrearReservaDTO) => Promise<void>;
}

export const NuevaReservaModal: React.FC<NuevaReservaModalProps> = ({
  isOpen,
  onClose,
  idSucursal,
  mesas,
  onCrear,
}) => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [comensales, setComensales] = useState(2);
  
  // Default to today at 20:00 or 2 hours from now
  const getDefaultDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 2, 0, 0, 0);
    const tzOffset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const [fechaHora, setFechaHora] = useState(getDefaultDateTime());
  const [idMesaAsignada, setIdMesaAsignada] = useState<number | undefined>(undefined);
  const [depositoGarantia, setDepositoGarantia] = useState<number>(0);
  const [depositoPagado, setDepositoPagado] = useState(false);
  const [notas, setNotas] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim() || !fechaHora) return;

    setIsSubmitting(true);
    try {
      await onCrear({
        idSucursal,
        nombreCliente: nombre.trim(),
        telefono: telefono.trim() || undefined,
        telefonoCliente: telefono.trim() || undefined,
        correo: correo.trim() || undefined,
        comensales,
        numeroPersonas: comensales,
        fechaHoraReserva: new Date(fechaHora).toISOString(),
        idMesaAsignada: idMesaAsignada || undefined,
        idMesa: idMesaAsignada || undefined,
        depositoGarantia: depositoGarantia > 0 ? depositoGarantia : undefined,
        anticipoPagado: depositoGarantia > 0 ? depositoGarantia : undefined,
        depositoPagado: depositoGarantia > 0 ? depositoPagado : undefined,
        notas: notas.trim() || undefined,
      });

      // Reset
      setNombre("");
      setTelefono("");
      setCorreo("");
      setComensales(2);
      setDepositoGarantia(0);
      setDepositoPagado(false);
      setNotas("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickCounts = [1, 2, 3, 4, 5, 6, 8, 10, 12];

  return (
    <div className="hostess-modal-overlay" onClick={onClose}>
      <div className="hostess-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="hostess-modal-header">
          <h3>
            <Calendar size={20} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
            Nueva Reservación
          </h3>
          <button
            type="button"
            onClick={onClose}
            style={{ border: "none", background: "none", cursor: "pointer", color: "#64748b" }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="hostess-modal-body">
            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Nombre del Cliente *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Sofía Martínez"
                required
                style={{
                  width: "100%",
                  padding: "0.55rem 0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.875rem",
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Teléfono (WhatsApp)
                </label>
                <div style={{ position: "relative" }}>
                  <Phone size={15} style={{ position: "absolute", left: "10px", top: "10px", color: "#94a3b8" }} />
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="55 1234 5678"
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem 0.55rem 2rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Correo Electrónico
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={{ position: "absolute", left: "10px", top: "10px", color: "#94a3b8" }} />
                  <input
                    type="email"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="cliente@ejemplo.com"
                    style={{
                      width: "100%",
                      padding: "0.55rem 0.75rem 0.55rem 2rem",
                      borderRadius: "0.5rem",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Fecha y Hora *
                </label>
                <input
                  type="datetime-local"
                  value={fechaHora}
                  onChange={(e) => setFechaHora(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.875rem",
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Mesa Sugerida (Opcional)
                </label>
                <select
                  value={idMesaAsignada || ""}
                  onChange={(e) => setIdMesaAsignada(e.target.value ? Number(e.target.value) : undefined)}
                  style={{
                    width: "100%",
                    padding: "0.55rem 0.75rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.875rem",
                    background: "#fff",
                  }}
                >
                  <option value="">Por asignar al llegar</option>
                  {mesas.map((m) => (
                    <option key={m.id} value={m.id}>
                      M-{m.numero || m.codigo || m.id} (Cap: {m.capacidad || 4}p)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Número de Personas ({comensales} personas)
              </label>
              <div className="guest-counter-group">
                {quickCounts.map((count) => (
                  <button
                    key={count}
                    type="button"
                    className={`guest-count-btn ${comensales === count ? "active" : ""}`}
                    onClick={() => setComensales(count)}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid #e2e8f0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", alignItems: "center" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.25rem" }}>
                    Depósito en Garantía ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={depositoGarantia || ""}
                    onChange={(e) => setDepositoGarantia(Number(e.target.value))}
                    placeholder="0.00"
                    style={{
                      width: "100%",
                      padding: "0.45rem 0.5rem",
                      borderRadius: "0.375rem",
                      border: "1px solid #cbd5e1",
                      fontSize: "0.875rem",
                    }}
                  />
                </div>

                {depositoGarantia > 0 && (
                  <div style={{ paddingTop: "1.2rem" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", fontWeight: 600, cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={depositoPagado}
                        onChange={(e) => setDepositoPagado(e.target.checked)}
                      />
                      Depósito ya recibido
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Notas / Peticiones del Cliente
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Ej. Aniversario, mesa tranquila cerca de la ventana..."
                rows={2}
                style={{
                  width: "100%",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.875rem",
                }}
              />
            </div>
          </div>

          <div className="hostess-modal-footer">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid #cbd5e1",
                background: "#ffffff",
                color: "#475569",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !nombre.trim()}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: "0.5rem",
                border: "none",
                background: "#9333ea",
                color: "#ffffff",
                cursor: "pointer",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <Check size={16} />
              {isSubmitting ? "Guardando..." : "Crear Reservación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
