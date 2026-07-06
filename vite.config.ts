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
          // Opcional: Reescribe la ruta. 
          // Ej: /api/users -> http://.../users (sin /api)
          // rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    }
  }
})