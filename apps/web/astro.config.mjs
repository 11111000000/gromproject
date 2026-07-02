import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://11111000000.github.io',
  base: '/gromproject/',
  output: 'static',
  integrations: [tailwind({ applyBaseStyles: true })],
  server: { port: 4321, host: '0.0.0.0' },
});
