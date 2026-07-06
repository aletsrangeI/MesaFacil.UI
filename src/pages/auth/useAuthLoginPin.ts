import { useNavigate } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";
import {
  useAuthLoginWithPinMutation,
  useLazyAuthMeQuery,
  useUsuarioGetAllQuery,
  type UsuarioDto,
} from "../../services/generated/api";
import { useAppDispatch } from "../../app/hooks";
import { setAuthResponse, setFromAuthMe } from "../../state/authSlice";

export function useAuthLoginPin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Query para traer la cuadrícula de empleados activos
  const { data: usersResp, isLoading: isLoadingUsers, isError: isUsersError } = useUsuarioGetAllQuery();
  const [authLoginWithPin, { isLoading: isSubmitting }] = useAuthLoginWithPinMutation();
  const [triggerMe] = useLazyAuthMeQuery();

  const usuarios = usersResp?.data || [];

  // Estados de selección de usuario e ingreso de PIN
  const [selectedUser, setSelectedUser] = useState<UsuarioDto | null>(null);
  const [pin, setPin] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  // Estados de seguridad (Rate Limiting en Frontend)
  const [attempts, setAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Manejo del contador de bloqueo de 30 segundos
  useEffect(() => {
    if (!blockedUntil) return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, Math.round((blockedUntil - Date.now()) / 1000));
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        setBlockedUntil(null);
        setAttempts(0);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [blockedUntil]);

  const selectUser = useCallback((user: UsuarioDto | null) => {
    setSelectedUser(user);
    setPin("");
    setServerError(null);
    // Al cambiar de usuario, limpiamos los intentos específicos de la sesión anterior
    setAttempts(0);
    setBlockedUntil(null);
  }, []);

  const appendPinDigit = useCallback((digit: string) => {
    if (blockedUntil) return;
    setServerError(null);
    setPin((prev) => {
      if (prev.length >= 6) return prev; // Límite de 6 dígitos según la guía
      return prev + digit;
    });
  }, [blockedUntil]);

  const removePinDigit = useCallback(() => {
    if (blockedUntil) return;
    setPin((prev) => prev.slice(0, -1));
  }, [blockedUntil]);

  const clearPin = useCallback(() => {
    if (blockedUntil) return;
    setPin("");
  }, [blockedUntil]);

  const pickNextPath = (accesos?: string[]) => {
    const list = Array.isArray(accesos) ? accesos : [];
    const real = list.find((p) => p && !p.startsWith("/perm/"));
    return real || "/";
  };

  const handleLogin = useCallback(async () => {
    if (blockedUntil) return;
    setServerError(null);
    const cleanPin = pin.trim();

    if (!selectedUser?.id) {
      setServerError("Selecciona un usuario de la lista.");
      return;
    }
    if (!cleanPin) {
      setServerError("El PIN de acceso es requerido.");
      return;
    }

    try {
      const apiResp = await authLoginWithPin({
        pinLoginRequest: {
          usuarioId: selectedUser.id,
          pin: cleanPin,
          userOrEmail: null,
        },
      }).unwrap();

      if (!apiResp?.isSuccess || !apiResp.data) {
        throw new Error(apiResp?.message || "Error de autenticación por PIN.");
      }

      const { token, session } = apiResp.data;

      dispatch(
        setAuthResponse({
          accessToken: token.accessToken,
          refreshToken: token.refreshToken ?? undefined,
          expiresAt: token.expiresAtUtc ?? undefined,
          usuarioId: session.usuarioId,
          idEmpresa: session.idEmpresa,
          correo: session.correo,
          nombreCompleto: session.nombreCompleto ?? undefined,
          roles: session.roles ?? [],
          accesos: session.accesos ?? [],
          permsVersion: session.permsVersion ?? null,
        })
      );

      // Limpiar intentos al tener éxito
      setAttempts(0);
      setBlockedUntil(null);

      try {
        const me = await triggerMe().unwrap();
        const d = me?.data;
        if (d) {
          dispatch(
            setFromAuthMe({
              usuarioId: d.usuarioId,
              idEmpresa: d.idEmpresa,
              correo: d.correo ?? "",
              nombre: d.nombre,
              roles: d.roles,
              permissions: d.permissions ?? [],
              accesos: d.accesos ?? [],
              permsVersion: d.permsVersion ?? null,
              permissionsChanged: Boolean(d.permissionsChanged),
            })
          );
        }
      } catch {
        // Ignorar fallo de /me
      }

      const next = pickNextPath(session.accesos);
      navigate(next, { replace: true });
    } catch (err) {
      const apiError = err as { data?: { message?: string; title?: string }; error?: string; message?: string };
      const msg =
        apiError?.data?.message ||
        apiError?.data?.title ||
        apiError?.error ||
        (apiError?.message ?? "PIN incorrecto.");

      // Incrementar intentos fallidos
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);

      if (nextAttempts >= 3) {
        const lockDuration = Date.now() + 30000; // Bloqueo de 30 segundos
        setBlockedUntil(lockDuration);
        setSecondsLeft(30);
        setServerError("PIN incorrecto. Has excedido los intentos. Teclado bloqueado por 30 segundos.");
      } else {
        setServerError(`${msg} Intentos restantes: ${3 - nextAttempts}`);
      }

      setPin("");
    }
  }, [selectedUser, pin, attempts, blockedUntil, authLoginWithPin, triggerMe, dispatch, navigate]);

  return {
    usuarios,
    isLoadingUsers,
    isUsersError,
    selectedUser,
    selectUser,
    pin,
    serverError,
    setServerError,
    appendPinDigit,
    removePinDigit,
    clearPin,
    handleLogin,
    isLoading: isSubmitting,
    isBlocked: !!blockedUntil,
    secondsLeft,
  };
}
