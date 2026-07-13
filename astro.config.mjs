import { defineConfig, passthroughImageService } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://dropgain.app',
  base: '/',
  output: 'static',
  integrations: [sitemap()],
  image: {
    service: passthroughImageService(),
  },
});
