import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import toIco from 'to-ico';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const svg = readFileSync(join(publicDir, 'favicon.svg'));

const outputs = [
  { size: 48, name: 'favicon-48.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'favicon-192.png' },
];

for (const { size, name } of outputs) {
  await sharp(svg).resize(size, size).png().toFile(join(publicDir, name));
}

const icoSizes = [16, 32, 48];
const icoBuffers = await Promise.all(
  icoSizes.map((size) => sharp(svg).resize(size, size).png().toBuffer()),
);
writeFileSync(join(publicDir, 'favicon.ico'), await toIco(icoBuffers));

console.log('Generated favicon.ico and PNG favicons in public/');
