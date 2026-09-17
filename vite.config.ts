import { defineConfig, loadEnv } from 'vite' // Importa loadEnv
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Carga las variables de entorno del archivo .env correspondiente al modo
  // process.cwd() es el directorio actual
  // '' como prefijo carga todas las variables, no solo las que empiezan con VITE_
  const env = loadEnv(mode, process.cwd(), '');

  // Asigna la URL de la API desde la variable de entorno
  const VITE_API_URL = env.VITE_API_URL || 'http://localhost:5286'; // Un fallback por si acaso

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Redirige todas las peticiones que empiezan con /api
        '/api': {
          target: VITE_API_URL, // Usa la variable de entorno
          changeOrigin: true, // Necesario para evitar problemas de CORS/host
          secure: false,      // Útil si tu API de desarrollo usa un certificado self-signed
        },
        // Proxy para SignalR Hubs (WebSockets y long polling)
        '/hubs': {
          target: VITE_API_URL,
          changeOrigin: true,
          ws: true,
          secure: false,
        }
      }
    },
    build: {
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks(id) {
            const normalizedId = id.replace(/\\/g, '/');
            if (normalizedId.includes('/node_modules/')) {
              if (
                normalizedId.includes('/react/') ||
                normalizedId.includes('/react-dom/') ||
                normalizedId.includes('/react-router/') ||
                normalizedId.includes('/react-router-dom/') ||
                normalizedId.includes('/scheduler/') ||
                normalizedId.includes('/@reduxjs/toolkit/') ||
                normalizedId.includes('/react-redux/')
              ) {
                return 'vendor-framework';
              }
              if (normalizedId.includes('/@microsoft/signalr/')) {
                return 'vendor-signalr';
              }
              if (normalizedId.includes('/lucide-react/')) {
                return 'vendor-icons';
              }
              if (normalizedId.includes('/formik/') || normalizedId.includes('/yup/')) {
                return 'vendor-forms';
              }
              if (normalizedId.includes('/@tanstack/react-table/')) {
                return 'vendor-table';
              }
              if (normalizedId.includes('/qrcode/')) {
                return 'vendor-qrcode';
              }
            }
          }
        }
      }
    }
  }
})