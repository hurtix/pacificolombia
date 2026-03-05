// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'static', // SSG mode for better Cloudflare Pages compatibility
  adapter: cloudflare({
    mode: 'directory',
    functionPerRoute: false
  }),
  vite: {
    plugins: [tailwindcss()]
  },
  // Configuración para build estático
  build: {
    format: 'directory'
  }
});