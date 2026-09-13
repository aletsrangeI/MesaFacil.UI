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
  const [status, setStatus] = useState<NetworkStatus>(() =>
    typeof navigator !== "undefined" && navigator.onLine === false
      ? "offline"
      : "online"
  );

  const inFlightRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let intervalId: number | undefined;

    const checkBackend = async () => {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        if (!cancelled) setStatus("offline");
        return;
      }

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
          setStatus(res.ok ? "online" : "local");
        }
      } catch {
        if (!cancelled) setStatus("local");
      } finally {
        window.clearTimeout(timeoutId);
        inFlightRef.current = false;
      }
    };

    const handleOnline = () => {
      // Recupera conexión de red: verifica de inmediato si el backend responde.
      checkBackend();
    };
    const handleOffline = () => {
      setStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Chequeo inicial + ping periódico.
    checkBackend();
    intervalId = window.setInterval(checkBackend, PING_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      if (intervalId) window.clearInterval(intervalId);
    };
  }, []);

  return status;
}
