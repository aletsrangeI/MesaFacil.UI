import { useEffect, useRef, useState } from "react";

export type NetworkStatus = "online" | "local" | "offline";

const HEALTH_CHECK_URL = "/api/health";
const PING_INTERVAL_MS = 15000;
const PING_TIMEOUT_MS = 4000;

/**
 * Combina `navigator.onLine` con un ping ligero y periódico al backend
 * (GET /api/health) para determinar el estado real de conectividad.
 *
 * - "online": hay conexión de red Y el backend respondió OK.
 * - "local": hay conexión de red pero el backend no respondió (modo local
 *   autónomo: comandas e impresiones locales continúan funcionando).
 * - "offline": el navegador reporta que no hay conexión de red.
 *
 * Usa `fetch` directo (no RTK Query) para no acoplar el ping de salud a
 * la caché/reintentos de la capa de datos de la aplicación.
 */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>("online");
  const inFlightRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let intervalId: number | undefined;

    const checkBackend = async () => {
      if (inFlightRef.current) return;
      inFlightRef.current = true;

      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), PING_TIMEOUT_MS);

      try {
        const res = await fetch(HEALTH_CHECK_URL, {
          method: "GET",
          cache: "no-store",
          signal: controller.signal,
        });

        if (!cancelled) {
          if (res.ok) {
            // Si el backend local responde OK:
            // Si el navegador reporta estar sin internet WAN (navigator.onLine === false),
            // estamos en "local" (operación LAN autónoma). De lo contrario, "online".
            const isWanOffline = typeof navigator !== "undefined" && navigator.onLine === false;
            setStatus(isWanOffline ? "local" : "online");
          } else {
            // El backend local respondió con código de error (ej. 500)
            setStatus("local");
          }
        }
      } catch {
        // No se pudo contactar al backend local en la LAN
        if (!cancelled) {
          setStatus("offline");
        }
      } finally {
        window.clearTimeout(timeoutId);
        inFlightRef.current = false;
      }
    };

    const handleNetworkChange = () => {
      // Re-verificar contra el backend inmediatamente ante cualquier cambio de estado
      checkBackend();
    };

    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);

    // Chequeo inicial + ping periódico.
    checkBackend();
    intervalId = window.setInterval(checkBackend, PING_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  return status;
}
