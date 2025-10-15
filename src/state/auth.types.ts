export type AuthSlicePayload = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
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
  const data = res?.data;

  if (!data || typeof data.accessToken !== "string") {
    console.error("Respuesta inválida del backend:", res);
    return null;
  }

  const payload: AuthSlicePayload = {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken ?? "",
    expiresAt: data.expiresAtUtc ?? new Date().toISOString(),
    usuarioId: 0, // ⚠️ tu backend aún no lo devuelve
    idEmpresa: 0, // ⚠️ tu backend aún no lo devuelve
    correo: "",   // ⚠️ tu backend aún no lo devuelve
    nombreCompleto: "",
    roles: [],    // ⚠️ tu backend aún no lo devuelve
  };

  return payload;
}
