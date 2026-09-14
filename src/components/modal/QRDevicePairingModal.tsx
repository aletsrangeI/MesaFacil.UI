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

  const resolvedUrl =
    pairingUrl || (typeof window !== "undefined" ? window.location.origin : "");

  useEffect(() => {
    if (!open || !resolvedUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    setError(null);
    QRCode.toCanvas(canvas, resolvedUrl, {
      width: 220,
      margin: 1,
      color: {
        dark: "#1F1F1F",
        light: "#FFFFFF",
      },
    }).catch(() => {
      setError("No se pudo generar el código QR.");
    });
  }, [open, resolvedUrl]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Emparejar dispositivo"
      description="Escanea este código desde otro dispositivo en la misma red local para conectarlo a esta sucursal."
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

        <code
          style={{
            fontSize: "0.85rem",
            color: "var(--color-text-muted, #6B7280)",
            wordBreak: "break-all",
            textAlign: "center",
          }}
        >
          {resolvedUrl}
        </code>
      </div>
    </Modal>
  );
};

export default QRDevicePairingModal;
