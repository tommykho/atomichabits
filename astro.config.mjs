import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/site.config.js';

// Static build. Cloudflare Pages deploys /functions (relay) alongside dist/; Vercel uses /api; GitHub Pages
// builds under BASE_PATH and points PUBLIC_RELAY_URL at a relay hosted elsewhere.
export default defineConfig({
  site: process.env.SITE_URL || SITE.url,
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: { inlineStylesheets: 'never' },
  vite: {
    // Keep scripts as external files so the CSP can forbid inline scripts.
    build: { assetsInlineLimit: 0 },
    worker: { format: 'es' },
    optimizeDeps: { exclude: ['kokoro-js', '@huggingface/transformers'] },
  },
});
