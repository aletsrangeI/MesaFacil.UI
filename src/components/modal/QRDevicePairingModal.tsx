import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Modal } from "./Modal";

export interface QRDevicePairingModalProps {
  open: boolean;
  onClose: () => void;
  /**
   * URL local a la que otros dispositivos de la sucursal deben conectarse
   * (ej. "http://192.168.1.50:5286"). Si no se provee, se infiere desde
   * `window.location.origin`.
   */
  pairingUrl?: string;
}

/**
 * Modal que muestra un código QR con la URL local del servidor/estación
 * para facilitar el emparejamiento de otros dispositivos (tablets, terminales
 * de cocina, etc.) dentro de la misma red local. El QR se genera 100% en el
 * cliente (canvas), sin llamadas a servicios externos, por lo que funciona
 * también en modo local/offline.
 */
export const QRDevicePairingModal: React.FC<QRDevicePairingModalProps> = ({
  open,
  onClose,
  pairingUrl,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [destino, setDestino] = useState<"pos" | "comandero">("pos");

  const buildResolvedUrl = () => {
    if (pairingUrl) return pairingUrl;
    if (typeof window === "undefined") return "";

    const basePath = destino === "comandero" ? "/operacion/comandero" : "/ventas/pos";
    const rawAuth = localStorage.getItem("mf_auth");
    if (rawAuth) {
      try {
        const parsed = JSON.parse(rawAuth);
        // Empacar únicamente los campos esenciales para mantener el QR compacto y legible
        const minAuth = {
          accessToken: parsed.accessToken,
          refreshToken: parsed.refreshToken,
          expiresAt: parsed.expiresAt,
          usuarioId: parsed.usuarioId,
          idEmpresa: parsed.idEmpresa,
          idEstacion: parsed.idEstacion,
          correo: parsed.correo,
          nombreCompleto: parsed.nombreCompleto,
          roles: parsed.roles || ["waiter"],
          accesos: ["/", "/ventas/pos", "/operacion/comandero", "/mesas", "/pedidos", "/delivery"],
        };
        const encoded = btoa(unescape(encodeURIComponent(JSON.stringify(minAuth))));
        return `${window.location.origin}${basePath}?pair_auth=${encodeURIComponent(encoded)}`;
      } catch {
        return `${window.location.origin}${basePath}`;
      }
    }
    return `${window.location.origin}${basePath}`;
  };

  const resolvedUrl = buildResolvedUrl();

  useEffect(() => {
    if (!open || !resolvedUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setError(null);
    QRCode.toCanvas(canvas, resolvedUrl, {
      width: 220,
      margin: 1,
      errorCorrectionLevel: "L",
      color: {
        dark: "#1F1F1F",
        light: "#FFFFFF",
      },
    }).catch((err) => {
      setError(`No se pudo generar el código QR: ${err?.message || "datos exceden límite"}`);
    });
  }, [open, resolvedUrl]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Emparejar dispositivo (LAN)"
      description="Escanea este código desde un smartphone o tablet en la misma red Wi-Fi para iniciar sesión automáticamente y comenzar a operar."
      size="sm"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-3, 12px)",
        }}
      >
        <div style={{ display: "flex", gap: "8px", width: "100%", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => setDestino("pos")}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              border: destino === "pos" ? "2px solid #3b82f6" : "1px solid #d1d5db",
              background: destino === "pos" ? "#eff6ff" : "#ffffff",
              fontWeight: destino === "pos" ? 600 : 400,
              color: destino === "pos" ? "#1d4ed8" : "#374151",
              cursor: "pointer",
              fontSize: "0.82rem"
            }}
          >
            Punto de Venta (POS)
          </button>
          <button
            type="button"
            onClick={() => setDestino("comandero")}
            style={{
              padding: "6px 14px",
              borderRadius: "6px",
              border: destino === "comandero" ? "2px solid #3b82f6" : "1px solid #d1d5db",
              background: destino === "comandero" ? "#eff6ff" : "#ffffff",
              fontWeight: destino === "comandero" ? 600 : 400,
              color: destino === "comandero" ? "#1d4ed8" : "#374151",
              cursor: "pointer",
              fontSize: "0.82rem"
            }}
          >
            Comandero Móvil
          </button>
        </div>

        <div
          style={{
            padding: "var(--space-3, 12px)",
            background: "var(--color-surface, #FFFFFF)",
            border: "1px solid var(--color-border, rgba(0,0,0,0.08))",
            borderRadius: "var(--radius-md, 12px)",
          }}
        >
          <canvas ref={canvasRef} width={220} height={220} />
        </div>

        {error && (
          <span style={{ color: "var(--color-danger, #D64545)", fontSize: "0.85rem" }}>
            {error}
          </span>
        )}

        <div style={{ textAlign: "center", fontSize: "0.8rem", color: "#16a34a", fontWeight: 500 }}>
          ✓ Incluye credenciales de estación para acceso inmediato
        </div>

        <code
          style={{
            fontSize: "0.75rem",
            color: "var(--color-text-muted, #6B7280)",
            wordBreak: "break-all",
            textAlign: "center",
            maxWidth: "100%",
            maxHeight: "44px",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {resolvedUrl}
        </code>
      </div>
    </Modal>
  );
};

export default QRDevicePairingModal;
