import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { configDefaults } from 'vitest/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import removeConsole from 'vite-plugin-remove-console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = process.env.NODE_ENV !== 'production';

// SSL cert paths (used only in dev)
const keyPath = path.resolve(__dirname, '../../backend/cert/key.pem');
const certPath = path.resolve(__dirname, '../../backend/cert/cert.pem');

export default defineConfig({
  base: '/savorly-frontend/',
  plugins: [
    react(),
    removeConsole(), // Strips console.* in production
    ...(isDev
      ? [
          nodePolyfills({
            protocol: true,
            buffer: true,
            crypto: true,
            events: true,
          }),
        ]
      : []),
  ],

  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@contexts': path.resolve(__dirname, 'src/contexts'),
      '@services': path.resolve(__dirname, 'src/services'),
    },
  },

  optimizeDeps: {
    // Only necessary if you're accidentally importing server-side deps in frontend
    exclude: ['bcryptjs', 'mysql2'],
  },

  server: {
    ...(isDev && {
      https: {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      },
    }),
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'https://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/uploads': {
        target: 'https://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    exclude: [...configDefaults.exclude, 'node_modules'],
  },
});
