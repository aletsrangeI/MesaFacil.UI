import React from "react";
import { useNetworkStatus } from "../../../hooks/useNetworkStatus";
import "./network-status-banner.css";

const COPY: Record<"local" | "offline", { icon: string; text: string }> = {
  local: {
    icon: "🟡",
    text: "Trabajando en modo local (sin internet). Las comandas e impresiones continúan normales.",
  },
  offline: {
    icon: "🔴",
    text: "Desconectado de red. Reintentando conexión...",
  },
};

/**
 * Banner discreto y no-bloqueante que informa al usuario cuando la
 * aplicación no está en línea con el backend. No se muestra cuando el
 * estado es "online".
 */
export const NetworkStatusBanner: React.FC = () => {
  const status = useNetworkStatus();

  if (status === "online") return null;

  const { icon, text } = COPY[status];

  return (
    <div
      className={`network-status-banner network-status-banner--${status}`}
      role="status"
      aria-live="polite"
    >
      <span className="network-status-banner__icon" aria-hidden="true">
        {icon}
      </span>
      <span className="network-status-banner__text">{text}</span>
    </div>
  );
};

export default NetworkStatusBanner;
