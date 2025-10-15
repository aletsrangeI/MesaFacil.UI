// src/state/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

/** Estado de autenticación */
export type AuthState = {
  accessToken?: string;   // JWT de acceso (Bearer)
  refreshToken?: string;  // Refresh token
  expiresAt?: string;     // ISO string (UTC) de expiración del access token
  usuarioId?: number;
  idEmpresa?: number;
  correo?: string;
  nombreCompleto?: string;
  roles: string[];
};

const STORAGE_KEY = 'mf_auth';

function loadFromStorage(): Partial<AuthState> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as AuthState;
    // Limpieza básica por si hay valores vacíos
    if (parsed && typeof parsed === 'object') return parsed;
    return {};
  } catch {
    return {};
  }
}

function saveToStorage(state: AuthState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignorar errores de almacenamiento (modo incógnito, quota, etc.)
  }
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignorar
  }
}

function isExpired(expiresAt?: string) {
  if (!expiresAt) return false;
  const exp = Date.parse(expiresAt);
  if (Number.isNaN(exp)) return false;
  // Pequeño skew de 10s para evitar carreras
  return Date.now() + 10_000 >= exp;
}

const initialState: AuthState = {
  roles: [],
  ...loadFromStorage(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Establece tokens (normalmente tras /auth/login o /auth/refresh) */
    setTokens(
      state,
      action: PayloadAction<{ accessToken: string; refreshToken?: string; expiresAt?: string }>
    ) {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken !== undefined) {
        state.refreshToken = action.payload.refreshToken;
      }
      if (action.payload.expiresAt !== undefined) {
        state.expiresAt = action.payload.expiresAt;
      }
      saveToStorage(state);
    },

    /** Establece la sesión de usuario (perfil y roles) */
    setSession(
      state,
      action: PayloadAction<{
        usuarioId: number;
        idEmpresa: number;
        correo: string;
        nombreCompleto?: string;
        roles: string[];
      }>
    ) {
      state.usuarioId = action.payload.usuarioId;
      state.idEmpresa = action.payload.idEmpresa;
      state.correo = action.payload.correo;
      state.nombreCompleto = action.payload.nombreCompleto;
      state.roles = action.payload.roles ?? [];
      saveToStorage(state);
    },

    /** Mezcla tokens + sesión en una sola acción (útil si tu /login ya devuelve todo) */
    setAuthResponse(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        expiresAt: string;
        usuarioId: number;
        idEmpresa: number;
        correo: string;
        nombreCompleto?: string;
        roles: string[];
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.expiresAt = action.payload.expiresAt;
      state.usuarioId = action.payload.usuarioId;
      state.idEmpresa = action.payload.idEmpresa;
      state.correo = action.payload.correo;
      state.nombreCompleto = action.payload.nombreCompleto;
      state.roles = action.payload.roles ?? [];
      saveToStorage(state);
    },

    /** Hidrata desde localStorage (llámalo al bootstrap de la app) */
    hydrateFromStorage(state) {
      const persisted = loadFromStorage();
      Object.assign(state, { roles: [], ...persisted });
    },

    /** Limpia toda la sesión local (útil tras /auth/logout o 401 sin refresh) */
    logout() {
      clearStorage();
      return { roles: [] } as AuthState;
    },

    /** Verifica expiración y, si pasó, limpia accessToken (mantiene refresh para reauth) */
    pruneIfExpired(state) {
      if (isExpired(state.expiresAt)) {
        state.accessToken = undefined;
        state.expiresAt = undefined;
        saveToStorage(state);
      }
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
export const selectHasRole = (role: string) => (s: { auth: AuthState }) =>
  s.auth.roles?.includes(role) ?? false;
