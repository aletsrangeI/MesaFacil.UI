// src/state/authSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

/** Estado de autenticación */
export type AuthState = {
  accessToken?: string;        // JWT de acceso (Bearer)
  refreshToken?: string;       // Refresh token
  expiresAt?: string;          // ISO string (UTC) de expiración
  usuarioId?: number;
  idEmpresa?: number;
  correo?: string;
  nombreCompleto?: string;
  roles: string[];             // Canonizados
  accesos?: string[];          // Paths permitidos
  permsVersion?: string | null;

  // NUEVO: permisos por key (RBAC fino)
  permissions: string[];
  // NUEVO: flag opcional que devuelve /auth/me
  permissionsChanged?: boolean;
};

const STORAGE_KEY = "mf_auth";

/** Normaliza los nombres de roles a una taxonomía única en el FE */
function normalizeRoles(input?: string[]): string[] {
  if (!Array.isArray(input)) return [];
  const map: Record<string, string> = {
    "administrador": "admin",
    "admin": "admin",
    "gerente": "manager",
    "manager": "manager",
    "cajero": "cashier",
    "cashier": "cashier",
    "mesero": "waiter",
    "waiter": "waiter",
    "cocina": "kitchen",
    "kitchen": "kitchen",
    "cook": "kitchen",
    "repartidor": "delivery",
    "delivery": "delivery",
  };
  const out = new Set<string>();
  for (const raw of input) {
    const key = String(raw ?? "").trim().toLowerCase();
    if (!key) continue;
    const canon = map[key];
    if (canon) out.add(canon);
  }
  return Array.from(out);
}

function uniq<T>(arr: T[] = []): T[] {
  return Array.from(new Set(arr));
}

function loadFromStorage(): Partial<AuthState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as AuthState;
    if (parsed && typeof parsed === "object") {
      parsed.roles = normalizeRoles(parsed.roles ?? []);
      parsed.accesos = uniq(["/", ...(parsed.accesos ?? [])]);
      parsed.permissions = uniq(parsed.permissions ?? []);
      return parsed;
    }
    return {};
  } catch {
    return {};
  }
}

function saveToStorage(state: AuthState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}

function isExpired(expiresAt?: string) {
  if (!expiresAt) return false;
  const exp = Date.parse(expiresAt);
  if (Number.isNaN(exp)) return false;
  return Date.now() + 10_000 >= exp; // skew 10s
}

const initialState: AuthState = {
  roles: [],
  permissions: [],          // NUEVO
  ...loadFromStorage(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /** Establece tokens (normalmente tras /auth/login o /auth/refresh) */
    setTokens(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken?: string | null;
        expiresAt?: string;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken !== undefined && action.payload.refreshToken !== null) {
        state.refreshToken = action.payload.refreshToken;
      }
      if (action.payload.expiresAt !== undefined) {
        state.expiresAt = action.payload.expiresAt;
      }
      saveToStorage(state);
    },

    /** Establece la sesión de usuario (perfil, roles, accesos) desde /auth/login */
    setSession(
      state,
      action: PayloadAction<{
        usuarioId: number;
        idEmpresa: number;
        correo: string;
        nombreCompleto?: string;
        roles: string[];
        accesos?: string[];
        permsVersion?: string | null;
      }>
    ) {
      state.usuarioId = action.payload.usuarioId;
      state.idEmpresa = action.payload.idEmpresa;
      state.correo = action.payload.correo;
      state.nombreCompleto = action.payload.nombreCompleto;
      state.roles = normalizeRoles(action.payload.roles);
      state.accesos = uniq(["/", ...(action.payload.accesos ?? [])]);
      state.permsVersion = action.payload.permsVersion ?? null;
      saveToStorage(state);
    },

    /**
     * Mezcla tokens + sesión en una sola acción (si /auth/login ya devuelve todo)
     */
    setAuthResponse(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken?: string | null;
        expiresAt?: string;
        usuarioId: number;
        idEmpresa: number;
        correo: string;
        nombreCompleto?: string;
        roles: string[];
        accesos?: string[];
        permsVersion?: string | null;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken !== undefined && action.payload.refreshToken !== null) {
        state.refreshToken = action.payload.refreshToken;
      }
      if (action.payload.expiresAt !== undefined) {
        state.expiresAt = action.payload.expiresAt;
      }

      state.usuarioId = action.payload.usuarioId;
      state.idEmpresa = action.payload.idEmpresa;
      state.correo = action.payload.correo;
      state.nombreCompleto = action.payload.nombreCompleto;
      state.roles = normalizeRoles(action.payload.roles);
      state.accesos = uniq(["/", ...(action.payload.accesos ?? [])]);
      state.permsVersion = action.payload.permsVersion ?? null;

      // no establecemos permissions aquí porque /login no los trae (los trae /me)
      saveToStorage(state);
    },

    /** Hidrata desde localStorage (llámalo al bootstrap de la app) */
    hydrateFromStorage(state) {
      const persisted = loadFromStorage();
      Object.assign(state, { roles: [], permissions: [], ...persisted });
    },

    /** Limpia toda la sesión local */
    logout() {
      clearStorage();
      return { roles: [], permissions: [] } as AuthState;
    },

    /** Verifica expiración y limpia accessToken si expiró */
    pruneIfExpired(state) {
      if (isExpired(state.expiresAt)) {
        state.accessToken = undefined;
        state.expiresAt = undefined;
        saveToStorage(state);
      }
    },

    // ============ NUEVO: integrar respuesta de /api/auth/me ============

    /**
     * Aplica la respuesta de /api/auth/me
     * - No toca accessToken/refreshToken (solo estado de sesión)
     */
    setFromAuthMe(
      state,
      action: PayloadAction<{
        usuarioId: number;
        idEmpresa: number;
        correo?: string;
        nombre?: string | null;
        sucursalId?: string | null;         // por si lo quieres guardar luego
        turnoAbierto?: boolean;             // idem
        roles: string[];
        permissions: string[];
        accesos: string[];
        permsVersion?: string | null;
        permissionsChanged?: boolean;
      }>
    ) {
      state.usuarioId = action.payload.usuarioId;
      state.idEmpresa = action.payload.idEmpresa;
      state.correo = action.payload.correo;
      state.nombreCompleto = action.payload.nombre ?? state.nombreCompleto;

      state.roles = normalizeRoles(action.payload.roles);
      state.permissions = uniq(action.payload.permissions);
      state.accesos = uniq(["/", ...(action.payload.accesos ?? [])]);

      state.permsVersion = action.payload.permsVersion ?? state.permsVersion ?? null;
      state.permissionsChanged = action.payload.permissionsChanged ?? false;

      saveToStorage(state);
    },

    /**
     * Actualiza solo los permisos (por ejemplo, tras reasignación sin relogueo)
     */
    setPermissions(
      state,
      action: PayloadAction<{
        permissions: string[];
        accesos?: string[];
        permsVersion?: string | null;
      }>
    ) {
      state.permissions = uniq(action.payload.permissions);
      if (action.payload.accesos) {
        state.accesos = uniq(["/", ...action.payload.accesos]);
      }
      if (action.payload.permsVersion !== undefined) {
        state.permsVersion = action.payload.permsVersion;
      }
      saveToStorage(state);
    },
  },
});

export const {
  setTokens,
  setSession,
  setAuthResponse,
  hydrateFromStorage,
  logout,
  pruneIfExpired,
  setFromAuthMe,         // NUEVO
  setPermissions,        // NUEVO
} = authSlice.actions;

export default authSlice.reducer;

/** Selectores de conveniencia */
export const selectAuth = (s: { auth: AuthState }) => s.auth;
export const selectAccessToken = (s: { auth: AuthState }) => s.auth.accessToken;
export const selectRefreshToken = (s: { auth: AuthState }) => s.auth.refreshToken;
export const selectIsAuthenticated = (s: { auth: AuthState }) =>
  Boolean(s.auth.accessToken) && !isExpired(s.auth.expiresAt);

export const selectUserProfile = (s: { auth: AuthState }) => ({
  usuarioId: s.auth.usuarioId,
  idEmpresa: s.auth.idEmpresa,
  correo: s.auth.correo,
  nombreCompleto: s.auth.nombreCompleto,
  roles: s.auth.roles,
});

export const selectRolesCanon = (s: { auth: AuthState }) => s.auth.roles;
export const selectRolesOrGuest = (s: { auth: AuthState }) =>
  (s.auth.roles && s.auth.roles.length > 0) ? s.auth.roles : ["guest"];

export const selectAccesos = (s: { auth: AuthState }) => s.auth.accesos ?? ["/"];
export const selectCanAccess = (path: string) => (s: { auth: AuthState }) => {
  const list = s.auth.accesos ?? ["/"];
  const norm = (p: string) => (p.endsWith("/") && p.length > 1 ? p.slice(0, -1) : p);
  const target = norm(path);
  return list.some(a => norm(a) === target);
};

// ======= NUEVO: selectores de permisos finos (RBAC por Key) =======
export const selectPermissions = (s: { auth: AuthState }) => s.auth.permissions ?? [];

export const selectHasPermission = (perm: string) => (s: { auth: AuthState }) =>
  (s.auth.permissions ?? []).includes(perm);

export const selectHasEveryPermission = (perms: string[]) => (s: { auth: AuthState }) =>
  perms.every(p => (s.auth.permissions ?? []).includes(p));

export const selectHasSomePermission = (perms: string[]) => (s: { auth: AuthState }) =>
  perms.some(p => (s.auth.permissions ?? []).includes(p));
