import React, { useState } from "react";
import { X, Users, Phone, Check } from "lucide-react";
import type { RegistrarWaitlistDTO } from "../../../services/hostessApi";

interface NuevaEsperaModalProps {
  isOpen: boolean;
  onClose: () => void;
  idSucursal: number;
  onRegistrar: (dto: RegistrarWaitlistDTO) => Promise<void>;
}

export const NuevaEsperaModal: React.FC<NuevaEsperaModalProps> = ({
  isOpen,
  onClose,
  idSucursal,
  onRegistrar,
}) => {
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [comensales, setComensales] = useState(2);
  const [zonaPreferencia, setZonaPreferencia] = useState("Cualquiera");
  const [notas, setNotas] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    setIsSubmitting(true);
    try {
      await onRegistrar({
        idSucursal,
        nombreCliente: nombre.trim(),
        telefono: telefono.trim() || undefined,
        telefonoCliente: telefono.trim() || undefined,
        comensales,
        numeroPersonas: comensales,
        zonaPreferencia: zonaPreferencia === "Cualquiera" ? undefined : zonaPreferencia,
        notas: notas.trim() || undefined,
      });
      // Reset form
      setNombre("");
      setTelefono("");
      setComensales(2);
      setZonaPreferencia("Cualquiera");
      setNotas("");
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const quickCounts = [1, 2, 3, 4, 5, 6, 8, 10];
  const quickZones = ["Cualquiera", "Interior", "Terraza", "Barra", "VIP"];

  return (
    <div className="hostess-modal-overlay" onClick={onClose}>
      <div className="hostess-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="hostess-modal-header">
          <h3>
            <Users size={20} style={{ display: "inline", verticalAlign: "middle", marginRight: "6px" }} />
            Registrar en Fila de Espera
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
                Nombre del Cliente / Grupo *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ej. Familia Gómez o Carlos Ruiz"
                required
                style={{
                  width: "100%",
                  padding: "0.625rem 0.75rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #cbd5e1",
                  fontSize: "0.9375rem",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Número de Comensales ({comensales} personas)
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

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Teléfono / WhatsApp (10 dígitos para aviso)
              </label>
              <div style={{ position: "relative" }}>
                <Phone
                  size={16}
                  style={{ position: "absolute", left: "10px", top: "12px", color: "#94a3b8" }}
                />
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="55 1234 5678"
                  style={{
                    width: "100%",
                    padding: "0.625rem 0.75rem 0.625rem 2.25rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.9375rem",
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Preferencia de Zona
              </label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {quickZones.map((zone) => (
                  <button
                    key={zone}
                    type="button"
                    className={`hostess-area-chip ${zonaPreferencia === zone ? "active" : ""}`}
                    onClick={() => setZonaPreferencia(zone)}
                  >
                    {zone}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, marginBottom: "0.35rem" }}>
                Notas / Peticiones Especiales
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Ej. Requiere periquera, silla de ruedas, celebración de cumpleaños..."
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
                background: "#2563eb",
                color: "#ffffff",
                cursor: "pointer",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
              }}
            >
              <Check size={16} />
              {isSubmitting ? "Registrando..." : "Agregar a Fila"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
