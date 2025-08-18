import path from 'node:path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// https://vite.dev/config/
export default defineConfig({
  define: {
    __IS_DEV__: String(process.env.NODE_ENV !== 'production'),
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  plugins: [svelte()],
  server: {
    proxy: {},
  },
});
