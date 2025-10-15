import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setAuthResponse } from './authSlice';
import { toAuthSlicePayload } from './auth.types';

// IMPORTA el api generado de Auth para poder acceder al endpoint y su matcher
// El archivo generado suele exportar `enhancedApi` por defecto.
// Ajusta la ruta si tu estructura es distinta.

import { enhancedApi as authApi } from '../services/generated/api';

export const authListener = createListenerMiddleware();

authListener.startListening({
  // Cuando el mutation de login termina OK...
  matcher: authApi.endpoints.authLogin.matchFulfilled,
  effect: async (action, { dispatch }) => {
    // `action.payload` es la respuesta del endpoint (tipada como unknown si la spec no define 200)
    const mapped = toAuthSlicePayload(action.payload);
    if (mapped) {
      dispatch(setAuthResponse(mapped));
      // Aquí podrías navegar o hacer side-effects adicionales si quieres
      // e.g., navigate('/') con history externo o una signal
    } else {
      // Si la respuesta no tiene el shape esperado, puedes loguear o notificar
      console.warn('Respuesta de /auth/login no mapeable al AuthSlicePayload', action.payload);
    }
  },
});

export default authListener;
