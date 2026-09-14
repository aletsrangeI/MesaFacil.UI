import { Rocket } from "lucide-react";

/**
 * Barra flotante inferior con contador de ítems, total y botón "MANDAR A COCINA" (spec 025).
 */
export function ComanderoStickyBar({
  itemCount,
  total,
  isSending,
  disabled,
  onEnviar,
}: {
  itemCount: number;
  total: number;
  isSending: boolean;
  disabled: boolean;
  onEnviar: () => void;
}) {
  return (
    <div className="comandero-sticky-bar">
      <div className="comandero-sticky-count">
        <span className="comandero-sticky-count-badge">{itemCount} ítem{itemCount === 1 ? "" : "s"}</span>
        <span className="comandero-sticky-total">${total.toFixed(2)}</span>
      </div>
      <button
        type="button"
        className="comandero-sticky-btn-enviar"
        disabled={disabled || isSending}
        onClick={onEnviar}
      >
        <Rocket size={20} />
        {isSending ? "Enviando..." : "MANDAR A COCINA"}
      </button>
    </div>
  );
}
