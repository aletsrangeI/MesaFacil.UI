import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import {
  useAuthLoginWithPinMutation,
  useLazyAuthMeQuery,
} from "../../services/generated/api";
import { useAppDispatch } from "../../app/hooks";
import { setAuthResponse, setFromAuthMe } from "../../state/authSlice";

export function useAuthLoginPin() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [authLoginWithPin, { isLoading: isSubmitting }] = useAuthLoginWithPinMutation();
  const [triggerMe] = useLazyAuthMeQuery();

  const [userOrEmail, setUserOrEmail] = useState("");
  const [pin, setPin] = useState("");
  const [serverError, setServerError] = useState<string | null>(null);

  const appendPinDigit = useCallback((digit: string) => {
    setServerError(null);
    setPin((prev) => {
      if (prev.length >= 8) return prev;
      return prev + digit;
    });
  }, []);

  const removePinDigit = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  const clearPin = useCallback(() => {
    setPin("");
  }, []);

  const pickNextPath = (accesos?: string[]) => {
    const list = Array.isArray(accesos) ? accesos : [];
    const real = list.find((p) => p && !p.startsWith("/perm/"));
    return real || "/";
  };

  const handleLogin = useCallback(async () => {
    setServerError(null);
    const email = userOrEmail.trim();
    const cleanPin = pin.trim();

    if (!email) {
      setServerError("El correo electrónico o usuario es requerido.");
      return;
    }
    if (!cleanPin) {
      setServerError("El PIN de acceso es requerido.");
      return;
    }

    try {
      const apiResp = await authLoginWithPin({
        pinLoginRequest: {
          userOrEmail: email,
          pin: cleanPin,
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
        (apiError?.message ?? "No fue posible procesar la autenticación por PIN.");
      setServerError(msg);
      setPin("");
    }
  }, [userOrEmail, pin, authLoginWithPin, triggerMe, dispatch, navigate]);

  return {
    userOrEmail,
    setUserOrEmail,
    pin,
    setPin,
    serverError,
    setServerError,
    appendPinDigit,
    removePinDigit,
    clearPin,
    handleLogin,
    isLoading: isSubmitting,
  };
}
