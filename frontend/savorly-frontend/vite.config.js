import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { configDefaults } from 'vitest/config';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import removeConsole from 'vite-plugin-remove-console';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';

// ────────────────────────────────────────────────────────────
// Only load the self‑signed cert when we’re running in dev
// ────────────────────────────────────────────────────────────
let httpsConfig = false;
if (!isProd) {
  const keyPath  = path.resolve(__dirname, '../../backend/cert/key.pem');
  const certPath = path.resolve(__dirname, '../../backend/cert/cert.pem');
  httpsConfig = {
    key : fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };
}

export default defineConfig({
  /*  👉  dev  = '/'   |   prod = '/savorly-frontend/'   */
  base: isProd ? '/savorly-frontend/' : '/',

  build: { outDir: 'dist' },

  plugins: [
    react(),
    removeConsole(),
    ...(!isProd
      ? [nodePolyfills({ protocol: true, buffer: true, crypto: true, events: true })]
      : []),
  ],

  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
      '@contexts' : path.resolve(__dirname, 'src/contexts'),
      '@services' : path.resolve(__dirname, 'src/services'),
    },
  },

  optimizeDeps: { exclude: ['bcryptjs', 'mysql2'] },

  server: {
    port: 5174,   
    https : httpsConfig,        // ← only in dev
    watch : { usePolling: true },
    proxy : {
      '/api'    : { target: 'https://localhost:5001', changeOrigin: true, secure: false },
      '/uploads': { target: 'https://localhost:5001', changeOrigin: true, secure: false },
    },
  },

  test: {
    globals     : true,
    environment : 'jsdom',
    setupFiles  : './src/test/setup.js',
    exclude     : [...configDefaults.exclude, 'node_modules'],
  },
});
