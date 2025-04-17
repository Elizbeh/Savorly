import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      // Optionally enable specific polyfills
      protocol: true,
      buffer: true,
      crypto: true,
      events: true,
    }),
  ],
  optimizeDeps: {
    // Exclude modules that are only for backend use
    exclude: ['bcryptjs', 'mysql2'],
  },
  server: {
    watch: {
      usePolling: true
    },
  },
  proxy: {
    '/api': {
      target: 'http://localhost:5001',
      changeOrigin: true,
      secure: false,
    },
    '/uploads': {
      target: 'http://localhost:5001',
      changeOrigin: true,
      secure: false,
    },
  },
  
});
