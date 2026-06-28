function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function waveformEnvelope(nx, phase, bandOffset) {
  const slow = Math.sin(nx * Math.PI * 2.4 + phase * 0.22 + bandOffset) * 0.5 + 0.5;
  const detail = Math.sin(nx * Math.PI * 6.2 + phase * 0.35 + bandOffset * 1.6) * 0.5 + 0.5;
  return 0.18 + 0.82 * slow * (0.55 + detail * 0.45);
}

function waveformSample(nx, phase, bandOffset, carrierFreq) {
  const t = nx * Math.PI * carrierFreq + phase + bandOffset;
  const sine = Math.sin(t);
  const tri = (2 / Math.PI) * Math.asin(sine);
  const body =
    sine * 0.2 +
    tri * 0.62 +
    Math.sin(t * 3.4 + phase * 0.45) * 0.1 +
    Math.sin(t * 6.2 + bandOffset) * 0.08;

  const hit = Math.sin(nx * Math.PI * 17 + phase * 1.6 + bandOffset * 1.9);
  const transient =
    hit > 0.9 ? Math.pow((hit - 0.9) / 0.1, 1.6) * Math.sign(Math.sin(t * 4.9)) * 0.38 : 0;

  return body + transient;
}

function drawWaveform(ctx, w, h, midY, phase, bandOffset, band) {
  const { amplitude, carrierFreq, opacity, fillOpacity, rgb } = band;
  const step = Math.max(2, Math.floor(w / 520));
  const points = [];

  for (let x = 0; x <= w; x += step) {
    const nx = x / w;
    const envelope = waveformEnvelope(nx, phase, bandOffset);
    const sample = waveformSample(nx, phase, bandOffset, carrierFreq);
    const offset = sample * h * amplitude * envelope;
    points.push({ x, top: midY - offset, bottom: midY + offset });
  }

  ctx.beginPath();
  ctx.moveTo(points[0].x, midY);
  for (const point of points) ctx.lineTo(point.x, point.top);
  for (let i = points.length - 1; i >= 0; i--) ctx.lineTo(points[i].x, points[i].bottom);
  ctx.closePath();
  ctx.fillStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${fillOpacity})`;
  ctx.fill();

  ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  points.forEach((point, i) => {
    if (i === 0) ctx.moveTo(point.x, point.top);
    else ctx.lineTo(point.x, point.top);
  });
  ctx.stroke();

  ctx.strokeStyle = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${opacity * 0.45})`;
  ctx.beginPath();
  ctx.moveTo(0, midY);
  ctx.lineTo(w, midY);
  ctx.stroke();
}

function initWaveBackground(canvas) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  let rafId = 0;
  let phase = 0;
  const reduced = prefersReducedMotion();

  const bands = [
    {
      y: 0.26,
      amplitude: 0.05,
      carrierFreq: 30,
      opacity: 0.075,
      fillOpacity: 0.022,
      rgb: [176, 220, 232],
    },
    {
      y: 0.54,
      amplitude: 0.038,
      carrierFreq: 38,
      opacity: 0.055,
      fillOpacity: 0.016,
      rgb: [176, 220, 232],
    },
    {
      y: 0.8,
      amplitude: 0.032,
      carrierFreq: 24,
      opacity: 0.045,
      fillOpacity: 0.013,
      rgb: [135, 214, 163],
    },
  ];

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    ctx.clearRect(0, 0, w, h);

    bands.forEach((band, i) => {
      drawWaveform(ctx, w, h, h * band.y, phase, i * 1.7, band);
    });

    if (!reduced) {
      phase += 0.01;
      rafId = requestAnimationFrame(draw);
    }
  }

  resize();
  draw();
  window.addEventListener('resize', resize);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('resize', resize);
  };
}

function initMeterBars(root) {
  if (prefersReducedMotion()) return () => {};

  const rows = root.querySelectorAll('.meter-row');
  const meters = Array.from(rows).map((row, i) => {
    const bar = row.querySelector('[data-meter-bar]');
    const valueEl = row.querySelector('.meter-value');
    const bases = [
      { width: 0.72, value: -7.6, signed: false },
      { width: 0.58, value: -1.0, signed: false },
      { width: 0.85, value: 1.2, signed: true },
    ][i] ?? { width: 0.6, value: 0, signed: false };

    return {
      bar,
      valueEl,
      baseWidth: bases.width,
      baseValue: bases.value,
      signed: bases.signed,
      phase: i * 1.4,
      speed: 0.65 + i * 0.12,
      valueScale: i === 2 ? 1.8 : 2.4,
      lastDisplayed: valueEl?.textContent ?? '',
    };
  });

  let rafId = 0;
  let t = 0;
  let lastTime = 0;

  function tick(now) {
    const dt = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 0;
    lastTime = now;
    t += dt;

    meters.forEach((meter) => {
      if (!meter.bar) return;

      const wobble =
        Math.sin(t * meter.speed + meter.phase) * 0.04 +
        Math.sin(t * meter.speed * 0.45 + meter.phase * 1.2) * 0.015;
      const fraction = Math.min(1, Math.max(0.12, meter.baseWidth + wobble));

      meter.bar.style.transform = `scaleX(${fraction})`;

      if (meter.valueEl) {
        const value = meter.baseValue + wobble * meter.valueScale;
        const v = value.toFixed(1);
        if (v !== meter.lastDisplayed) {
          meter.lastDisplayed = v;
          meter.valueEl.textContent = meter.signed && value >= 0 ? `+${v}` : v;
        }
      }
    });
    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(rafId);
}

export function initAudioViz() {
  const cleanups = [];

  const bgCanvas = document.querySelector('[data-wave-bg]');
  if (bgCanvas instanceof HTMLCanvasElement) {
    cleanups.push(initWaveBackground(bgCanvas));
  }

  if (prefersReducedMotion()) {
    return () => cleanups.forEach((fn) => fn());
  }

  document.querySelectorAll('[data-meter-card]').forEach((card) => {
    cleanups.push(initMeterBars(card));
  });

  return () => cleanups.forEach((fn) => fn());
}
