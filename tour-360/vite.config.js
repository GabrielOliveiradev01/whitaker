import { defineConfig } from 'vite';

export default defineConfig({
  // Não herdar o postcss.config.js (Tailwind) da landing page na pasta acima.
  css: { postcss: {} },
  server: { host: true },
});
