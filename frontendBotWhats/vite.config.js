import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    allowedHosts: ['botwhatsapp-latest.onrender.com'],
    host: '0.0.0.0', // Permite o acesso de fora do container
    port: 5173, // A porta que você deseja expor
  }
});
