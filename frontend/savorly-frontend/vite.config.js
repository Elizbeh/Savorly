import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { configDefaults } from 'vitest/config';
import path from 'path';
import { fileURLToPath } from 'url';
import removeConsole from 'vite-plugin-remove-console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  /* dev = '/' | prod = '/savorly-frontend/' */
  base: isProd ? '/savorly-frontend/' : '/',

  build: {
    outDir: 'dist',
  },

  plugins: [
    react(),
    removeConsole(),
    ...(!isProd
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
    exclude: ['bcryptjs', 'mysql2'],
  },

  server: {
    port: 5174,
    watch: {
      usePolling: true,
    },
  },

  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    exclude: [...configDefaults.exclude, 'node_modules'],
  },
});

