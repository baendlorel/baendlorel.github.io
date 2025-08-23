import path from 'node:path';
import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import replace from '@rollup/plugin-replace';

// https://vite.dev/config/
export default defineConfig({
  define: {
    __IS_DEV__: String(process.env.NODE_ENV !== 'production'),
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
    },
  },
  plugins: [
    svelte(),
    replace({
      preventAssignment: true,
      __UPDATED_AT__: Date.now().toString(),
    }),
  ],
  server: {
    proxy: {},
  },
});
