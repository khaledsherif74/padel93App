import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev: the browser talks to Vite, Vite forwards /api to the backend (no CORS needed).
// Production: serve the build and /api from the same origin, or set CORS_ORIGINS on the backend.
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': process.env.VITE_API_TARGET ?? 'http://localhost:3000' } },
});
