import { defineConfig, passthroughImageService } from 'astro/config';

export default defineConfig({
  site: 'https://dropgain.app',
  base: '/',
  output: 'static',
  image: {
    service: passthroughImageService(),
  },
});
