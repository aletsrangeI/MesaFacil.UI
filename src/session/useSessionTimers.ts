import { useEffect, useRef } from "react";
import { logout } from "../state/authSlice";
import { useAppDispatch, useAppSelector } from "../app/hooks";

const SKEW_MS = 10_000; // 10s de margen

export function useSessionTimers() {
  const dispatch = useAppDispatch();
  const expiresAt = useAppSelector((s) => s.auth.expiresAt);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // limpia timer anterior
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (!expiresAt) return; // si no mandas expiración, no programamos nada

    const exp = Date.parse(expiresAt);
    if (Number.isNaN(exp)) return;

    const ms = Math.max(0, exp - Date.now() - SKEW_MS);
    timerRef.current = window.setTimeout(() => {
      dispatch(logout());
      // TIP: podrías redirigir a /login aquí si quieres forzar navegación global
    }, ms);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [expiresAt, dispatch]);
}
