import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // Прод: https://grom.kosov.online (Caddy file_server, /var/lib/grom/dist).
  // base='/' — сайт живёт на поддомене, без префикса пути.
  site: 'https://grom.kosov.online',
  base: '/',
  output: 'static',
  integrations: [tailwind({ applyBaseStyles: true })],
  server: { port: 4321, host: '0.0.0.0' },
});
