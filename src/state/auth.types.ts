export type AuthSlicePayload = {
  accessToken: string;
  refreshToken: string; // obligatorio en el payload (si no viene, se deja "")
  expiresAt: string; // obligatorio en el payload (si no viene, se usa now ISO)
  usuarioId: number;
  idEmpresa: number;
  correo: string;
  nombreCompleto?: string;
  roles: string[];
};

export function isAuthSlicePayload(x: any): x is AuthSlicePayload {
  return (
    x &&
    typeof x.accessToken === "string" &&
    typeof x.expiresAt === "string" &&
    typeof x.usuarioId === "number" &&
    typeof x.idEmpresa === "number" &&
    typeof x.correo === "string" &&
    Array.isArray(x.roles)
  );
}

/**
 * Convierte la respuesta cruda del backend a AuthSlicePayload.
 *
 * Caso actual:
 * {
 *   data: {
 *     accessToken: string;
 *     expiresAtUtc: string;
 *     refreshToken: string | null;
 *   },
 *   isSuccess: boolean;
 *   message: string;
 *   errors: any[];
 * }
 */
export function toAuthSlicePayload(res: any): AuthSlicePayload | null {
  const token = res?.data?.token;
  const session = res?.data?.session;

  if (!token || typeof token.accessToken !== "string" || !session) {
    console.error(
      "Respuesta inválida del backend (se espera { data: { token, session } }):",
      res
    );
    return null;
  }

  const roles = session.roles;
  const expiresAt: string =
    typeof token.expiresAtUtc === "string"
      ? token.expiresAtUtc
      : new Date().toISOString();

  const payload: AuthSlicePayload = {
    accessToken: token.accessToken,
    refreshToken: token.refreshToken ?? "",
    expiresAt,
    usuarioId: Number(session.usuarioId ?? 0),
    idEmpresa: Number(session.idEmpresa ?? 0),
    correo: String(session.correo ?? ""),
    nombreCompleto: session.nombreCompleto ?? undefined,
    roles,
  };

  return payload;
}