import React, { useCallback, useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Modal } from "./Modal";

export interface QRDevicePairingModalProps {
  open: boolean;
  onClose: () => void;
}

interface LanIpsResponse {
  ips: string[];
  preferred: string | null;
  uiPort: number;
  apiPort: number;
}

/**
 * Spec 019 §4.5 — Emparejamiento Zero-Config por Código QR.
 *
 * Flujo:
 *  1. Al abrir, consulta GET /api/network/lan-ips para obtener las IPs LAN
 *     del Edge Node (192.168.x.x, 10.x.x.x). Esto excluye Tailscale y nube.
 *  2. Muestra un selector de IP en caso de que haya más de una interfaz.
 *  3. Genera el QR con:
 *       http://<ip-lan>:<uiPort>/<destino>?pair_auth=<token>
 *     de modo que cuando el internet se caiga, el iPhone / tablet pueda seguir
 *     apuntando al Edge Node dentro de la LAN del restaurante.
 *  4. Si el endpoint no responde (modo cloud-only sin Edge local), muestra
 *     un aviso explicativo y genera el QR con window.location.origin como
 *     fallback para demos/pruebas.
 */
export const QRDevicePairingModal: React.FC<QRDevicePairingModalProps> = ({
  open,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [destino, setDestino] = useState<"pos" | "comandero">("pos");

  // Estado de IPs LAN del Edge Node
  const [lanData, setLanData] = useState<LanIpsResponse | null>(null);
  const [selectedIp, setSelectedIp] = useState<string>("");
  const [lanLoading, setLanLoading] = useState(false);
  const [lanError, setLanError] = useState<string | null>(null);

  // IP/host guardada por el usuario (persiste entre sesiones)
  const STORAGE_KEY = "mf_lan_pairing_host";

  // ──────────────────────────────────────────────────────────────
  // 1. Fetch de IPs LAN al abrir el modal
  // ──────────────────────────────────────────────────────────────
  const fetchLanIps = useCallback(async () => {
    setLanLoading(true);
    setLanError(null);
    try {
      const res = await fetch("/api/network/lan-ips");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: LanIpsResponse = await res.json();
      setLanData(data);

      // Prioridad: guardado anterior → preferred del backend → primera IP
      const saved = localStorage.getItem(STORAGE_KEY);
      const initialIp =
        (saved && data.ips.includes(saved) ? saved : null) ??
        data.preferred ??
        data.ips[0] ??
        "";
      setSelectedIp(initialIp);
    } catch {
      setLanError(
        "No se detectaron IPs LAN del servidor. El QR usará la URL actual como fallback."
      );
      // Fallback: usa window.location.hostname
      setSelectedIp(window.location.hostname);
    } finally {
      setLanLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) fetchLanIps();
  }, [open, fetchLanIps]);

  // Persiste la IP seleccionada manualmente
  useEffect(() => {
    if (selectedIp) localStorage.setItem(STORAGE_KEY, selectedIp);
  }, [selectedIp]);

  // ──────────────────────────────────────────────────────────────
  // 2. Construcción de la URL que irá en el QR
  // ──────────────────────────────────────────────────────────────
  const buildPairingUrl = useCallback((): string => {
    const basePath =
      destino === "comandero" ? "/operacion/comandero" : "/ventas/pos";

    // Host base: IP LAN + puerto del UI  (ej. http://192.168.0.73:5173)
    const uiPort = lanData?.uiPort ?? (parseInt(window.location.port) || 80);
    const host = selectedIp || window.location.hostname;
    const protocol = window.location.protocol; // http: en LAN, https: en prod
    const portSuffix =
      (protocol === "https:" && uiPort === 443) ||
      (protocol === "http:" && uiPort === 80)
        ? ""
        : `:${uiPort}`;
    const baseUrl = `${protocol}//${host}${portSuffix}`;

    // Token de sesión mínimo para auto-login
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
  }, [destino, selectedIp, lanData]);

  // ──────────────────────────────────────────────────────────────
  // 3. Renderizado del QR en canvas
  // ──────────────────────────────────────────────────────────────
  const resolvedUrl = buildPairingUrl();

  useEffect(() => {
    if (!open || !resolvedUrl || lanLoading) return;
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
  }, [open, resolvedUrl, lanLoading]);

  // ──────────────────────────────────────────────────────────────
  // Helpers de estilo
  // ──────────────────────────────────────────────────────────────
  const tabStyle = (active: boolean) => ({
    padding: "6px 14px",
    borderRadius: "6px",
    border: active ? "2px solid #3b82f6" : "1px solid #d1d5db",
    background: active ? "#eff6ff" : "#ffffff",
    fontWeight: active ? 600 : 400,
    color: active ? "#1d4ed8" : "#374151",
    cursor: "pointer",
    fontSize: "0.82rem",
  } as React.CSSProperties);

  const isLanIp = (ip: string) =>
    /^192\.168\./.test(ip) || /^10\./.test(ip) || /^172\.(1[6-9]|2\d|3[01])\./.test(ip);

  const lanOk = selectedIp && isLanIp(selectedIp);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Emparejar dispositivo (LAN)"
      description="Escanea este QR desde un smartphone o tablet en la misma red Wi-Fi para comenzar a operar. Cuando el internet se caiga, los dispositivos seguirán comunicándose a través de la red local del restaurante."
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
        {/* ── Selector de destino ── */}
        <div style={{ display: "flex", gap: "8px", width: "100%", justifyContent: "center" }}>
          <button type="button" onClick={() => setDestino("pos")} style={tabStyle(destino === "pos")}>
            Punto de Venta (POS)
          </button>
          <button type="button" onClick={() => setDestino("comandero")} style={tabStyle(destino === "comandero")}>
            Comandero Móvil
          </button>
        </div>

        {/* ── Selector de IP LAN ── */}
        <div style={{ width: "100%" }}>
          <label
            style={{
              fontSize: "0.78rem",
              fontWeight: 600,
              color: "var(--color-text-muted, #6B7280)",
              display: "block",
              marginBottom: 4,
            }}
          >
            IP del Edge Node en la red local:
          </label>

          {lanLoading ? (
            <div style={{ fontSize: "0.82rem", color: "#6B7280" }}>Detectando interfaces de red…</div>
          ) : (
            <div style={{ display: "flex", gap: 6 }}>
              {/* Dropdown con IPs detectadas */}
              {lanData && lanData.ips.length > 1 && (
                <select
                  value={selectedIp}
                  onChange={(e) => setSelectedIp(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "5px 8px",
                    borderRadius: 6,
                    border: "1px solid #d1d5db",
                    fontSize: "0.82rem",
                    background: "#fff",
                  }}
                >
                  {lanData.ips.map((ip) => (
                    <option key={ip} value={ip}>
                      {ip} {ip === lanData.preferred ? "★" : ""}
                    </option>
                  ))}
                </select>
              )}

              {/* Input editable (también muestra la IP única o personalizada) */}
              <input
                type="text"
                value={selectedIp}
                onChange={(e) => setSelectedIp(e.target.value)}
                placeholder="192.168.x.x"
                style={{
                  flex: 1,
                  padding: "5px 8px",
                  borderRadius: 6,
                  border: `1px solid ${lanOk ? "#16a34a" : "#d1d5db"}`,
                  fontSize: "0.82rem",
                  background: "#fff",
                  fontFamily: "monospace",
                }}
              />

              <button
                type="button"
                onClick={fetchLanIps}
                title="Volver a detectar IPs"
                style={{
                  padding: "5px 10px",
                  borderRadius: 6,
                  border: "1px solid #d1d5db",
                  background: "#f9fafb",
                  cursor: "pointer",
                  fontSize: "0.82rem",
                }}
              >
                ↺
              </button>
            </div>
          )}

          {/* Advertencia si la IP no es LAN */}
          {!lanLoading && selectedIp && !lanOk && (
            <p
              style={{
                margin: "6px 0 0",
                fontSize: "0.78rem",
                color: "#b45309",
                background: "#fffbeb",
                border: "1px solid #fde68a",
                borderRadius: 6,
                padding: "5px 8px",
              }}
            >
              ⚠️ La IP <strong>{selectedIp}</strong> no parece ser una dirección LAN privada.
              El dispositivo emparejado solo funcionará sin internet si apunta a una IP local del restaurante (192.168.x.x o 10.x.x.x).
            </p>
          )}

          {lanError && (
            <p style={{ margin: "6px 0 0", fontSize: "0.78rem", color: "#b45309" }}>
              {lanError}
            </p>
          )}
        </div>

        {/* ── Código QR ── */}
        <div
          style={{
            padding: "var(--space-3, 12px)",
            background: "var(--color-surface, #FFFFFF)",
            border: "1px solid var(--color-border, rgba(0,0,0,0.08))",
            borderRadius: "var(--radius-md, 12px)",
          }}
        >
          {lanLoading ? (
            <div style={{ width: 220, height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: "0.82rem" }}>
              Generando QR…
            </div>
          ) : (
            <canvas ref={canvasRef} width={220} height={220} />
          )}
        </div>

        {error && (
          <span style={{ color: "var(--color-danger, #D64545)", fontSize: "0.85rem" }}>
            {error}
          </span>
        )}

        {/* ── Estado y URL ── */}
        {lanOk ? (
          <div style={{ textAlign: "center", fontSize: "0.8rem", color: "#16a34a", fontWeight: 500 }}>
            ✓ Modo LAN — Operación continúa sin internet
          </div>
        ) : (
          <div style={{ textAlign: "center", fontSize: "0.8rem", color: "#6B7280", fontWeight: 500 }}>
            ✓ Incluye credenciales de estación para acceso inmediato
          </div>
        )}

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

