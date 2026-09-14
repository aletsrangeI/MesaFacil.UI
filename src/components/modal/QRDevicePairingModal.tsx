import React, { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Modal } from "./Modal";

export interface QRDevicePairingModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Spec 019 §4.5 — Emparejamiento Zero-Config por Código QR.
 *
 * Genera un QR apuntando a window.location.origin (el servidor donde está
 * publicada la app en este momento: VPS, cloud, o en Fase 2 el Edge Node local).
 * Embebe el token de sesión mínimo en pair_auth para que el dispositivo
 * que escanea quede autenticado inmediatamente sin login manual.
 *
 * Fase 2 (Edge Node - Backlog):
 *   El QR también incluirá edge_url con la IP LAN del Edge Node para que
 *   el dispositivo pueda hacer failover automático cuando el internet caiga.
 */
export const QRDevicePairingModal: React.FC<QRDevicePairingModalProps> = ({
  open,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [destino, setDestino] = useState<"pos" | "comandero">("pos");

  const buildPairingUrl = (): string => {
    // La URL base es siempre el origin actual del servidor donde corre la app.
    // En desarrollo: http://100.110.215.58:8081
    // En producción: https://app.mesafacil.mx
    // En Fase 2 (Edge Node local): http://192.168.x.x:7071 (automatico)
    const baseUrl = window.location.origin;
    const basePath =
      destino === "comandero" ? "/operacion/comandero" : "/ventas/pos";

    const rawAuth = localStorage.getItem("mf_auth");
    if (rawAuth) {
      try {
        const parsed = JSON.parse(rawAuth);
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
          accesos: [
            "/",
            "/ventas/pos",
            "/operacion/comandero",
            "/mesas",
            "/pedidos",
            "/delivery",
          ],
        };
        const encoded = btoa(
          unescape(encodeURIComponent(JSON.stringify(minAuth)))
        );
        return `${baseUrl}${basePath}?pair_auth=${encodeURIComponent(encoded)}`;
      } catch {
        // fall through
      }
    }
    return `${baseUrl}${basePath}`;
  };

  const resolvedUrl = buildPairingUrl();

  useEffect(() => {
    if (!open || !resolvedUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setError(null);
    QRCode.toCanvas(canvas, resolvedUrl, {
      width: 220,
      margin: 1,
      errorCorrectionLevel: "L",
      color: { dark: "#1F1F1F", light: "#FFFFFF" },
    }).catch((err) => {
      setError(
        `No se pudo generar el código QR: ${err?.message || "datos exceden límite"}`
      );
    });
  }, [open, resolvedUrl]);

  const tabStyle = (active: boolean): React.CSSProperties => ({
    padding: "6px 14px",
    borderRadius: "6px",
    border: active ? "2px solid #3b82f6" : "1px solid #d1d5db",
    background: active ? "#eff6ff" : "#ffffff",
    fontWeight: active ? 600 : 400,
    color: active ? "#1d4ed8" : "#374151",
    cursor: "pointer",
    fontSize: "0.82rem",
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Emparejar dispositivo"
      description="Escanea este código desde un smartphone o tablet para iniciar sesión automáticamente y comenzar a operar."
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
        {/* Selector de destino */}
        <div style={{ display: "flex", gap: "8px", width: "100%", justifyContent: "center" }}>
          <button
            type="button"
            onClick={() => setDestino("pos")}
            style={tabStyle(destino === "pos")}
          >
            Punto de Venta (POS)
          </button>
          <button
            type="button"
            onClick={() => setDestino("comandero")}
            style={tabStyle(destino === "comandero")}
          >
            Comandero Móvil
          </button>
        </div>

        {/* QR Canvas */}
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
            fontSize: "0.72rem",
            color: "var(--color-text-muted, #6B7280)",
            wordBreak: "break-all",
            textAlign: "center",
            maxWidth: "100%",
            maxHeight: "44px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontFamily: "monospace",
          }}
        >
          {resolvedUrl}
        </code>
      </div>
    </Modal>
  );
};

export default QRDevicePairingModal;
