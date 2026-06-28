import { defineConfig, passthroughImageService } from 'astro/config';

export default defineConfig({
  site: 'https://mirbyte.github.io',
  base: '/DropGain-website/',
  output: 'static',
  image: {
    service: passthroughImageService(),
  },
});
