import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const fontsDir = join(publicDir, 'fonts');

function fontDataUri(filename) {
  const bytes = readFileSync(join(fontsDir, filename));
  return `data:font/ttf;base64,${bytes.toString('base64')}`;
}

const orbitron = fontDataUri('Orbitron-Variable.ttf');
const karniv = fontDataUri('KARNIVBL.ttf');

const sharedFontDefs = `<style><![CDATA[
@font-face {
  font-family: 'Orbitron';
  src: url('${orbitron}') format('truetype');
  font-weight: 100 900;
  font-style: normal;
}
@font-face {
  font-family: 'Karnivore Blue';
  src: url('${karniv}') format('truetype');
  font-weight: 400;
  font-style: normal;
}
]]></style>`;

const ogImage = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="DropGain">
  <defs>
    ${sharedFontDefs}
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#181a1d"/>
      <stop offset="100%" stop-color="#1f2327"/>
    </linearGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <path d="M80 480 Q200 420 320 460 T560 440 T800 470 T1120 450" fill="none" stroke="#b0dce8" stroke-width="2" opacity="0.35"/>
  <path d="M80 500 Q250 440 400 490 T700 470 T1000 500 T1120 480" fill="none" stroke="#87d6a3" stroke-width="1.5" opacity="0.25"/>
  <rect x="80" y="80" width="420" height="200" rx="6" fill="#23272b" stroke="#3b4249" stroke-width="1"/>
  <text x="110" y="130" fill="#b0dce8" font-family="Orbitron, sans-serif" font-size="16" font-weight="600" letter-spacing="0.12em">LUFS</text>
  <text x="110" y="175" fill="#f1f5f6" font-family="Orbitron, sans-serif" font-size="40" font-weight="700" letter-spacing="0.04em">-7.6</text>
  <rect x="110" y="188" width="280" height="6" rx="2" fill="#3b4249"/>
  <rect x="110" y="188" width="200" height="6" rx="2" fill="#b0dce8"/>
  <text x="110" y="230" fill="#87d6a3" font-family="Orbitron, sans-serif" font-size="16" font-weight="600" letter-spacing="0.12em">dBTP</text>
  <text x="110" y="265" fill="#f1f5f6" font-family="Orbitron, sans-serif" font-size="30" font-weight="700" letter-spacing="0.04em">-1.0</text>
  <text x="560" y="285" fill="#b0dce8" font-family="Karnivore Blue, Orbitron, sans-serif" font-size="84" font-weight="400" text-anchor="middle" letter-spacing="0.08em" filter="url(#glow)">DROPGAIN</text>
  <text x="560" y="345" fill="#929ba3" font-family="Segoe UI, system-ui, sans-serif" font-size="28" text-anchor="middle">Section loudness prep for DJs</text>
  <text x="560" y="400" fill="#8ec8d6" font-family="Orbitron, sans-serif" font-size="18" font-weight="500" text-anchor="middle" letter-spacing="0.14em">dropgain.app</text>
</svg>
`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" role="img" aria-label="DropGain">
  <defs>
    ${sharedFontDefs}
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="1.2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="32" height="32" rx="4" fill="#181a1d" stroke="#3b4249" stroke-width="1"/>
  <path d="M4 22 L6 14 L8 18 L10 10 L12 16 L14 12 L16 20 L18 8 L20 14 L22 18 L24 12 L26 16 L28 22"
        fill="none" stroke="#6aadb8" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity="0.55"/>
  <text x="16" y="21.5" text-anchor="middle" font-family="Orbitron, sans-serif" font-size="10" font-weight="700" fill="#b0dce8" letter-spacing="0.08em" filter="url(#glow)">DG</text>
</svg>
`;

writeFileSync(join(publicDir, 'og-image.svg'), ogImage);
writeFileSync(join(publicDir, 'favicon.svg'), favicon);

console.log('Built og-image.svg and favicon.svg with embedded brand fonts');
