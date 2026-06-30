export function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const dot = document.createElement('div');
  const ring = document.createElement('div');

  dot.id = 'cursor-dot';
  ring.id = 'cursor-ring';

  Object.assign(dot.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'var(--accent, #b0dce8)',
    boxShadow: '0 0 10px 2px rgb(176 220 232 / 60%)',
    pointerEvents: 'none',
    zIndex: '99999',
    transform: 'translate(-50%, -50%)',
    willChange: 'transform',
    transition: reduced ? 'none' : 'width 0.2s ease, height 0.2s ease, opacity 0.2s ease',
    opacity: '0',
  });

  Object.assign(ring.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: '1.5px solid rgb(176 220 232 / 55%)',
    pointerEvents: 'none',
    zIndex: '99998',
    transform: 'translate(-50%, -50%)',
    willChange: 'transform',
    transition: reduced ? 'none' : 'width 0.2s ease, height 0.2s ease, border-color 0.2s ease, opacity 0.2s ease',
    opacity: '0',
  });

  document.body.appendChild(dot);
  document.body.appendChild(ring);
  document.documentElement.classList.add('custom-cursor');

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let visible = false;

  const LERP = reduced ? 1 : 0.12;
  const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, [tabindex]:not([tabindex="-1"])';

  document.addEventListener('mouseover', (e) => {
    const hovering = !!e.target.closest(INTERACTIVE);
    if (hovering) {
      ring.style.width = '52px';
      ring.style.height = '52px';
      ring.style.borderColor = 'rgb(176 220 232 / 80%)';
      dot.style.width = '6px';
      dot.style.height = '6px';
    } else {
      ring.style.width = '36px';
      ring.style.height = '36px';
      ring.style.borderColor = 'rgb(176 220 232 / 55%)';
      dot.style.width = '8px';
      dot.style.height = '8px';
    }
  });

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!visible) {
      ringX = mouseX;
      ringY = mouseY;
      dot.style.opacity = '1';
      ring.style.opacity = reduced ? '0' : '1';
      visible = true;
    }

    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;

    if (reduced) {
      ring.style.left = `${mouseX}px`;
      ring.style.top = `${mouseY}px`;
    }
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
    visible = false;
  });

  document.addEventListener('mouseenter', () => {
    if (visible) {
      dot.style.opacity = '1';
      ring.style.opacity = reduced ? '0' : '1';
    }
  });

  if (!reduced) {
    function tick() {
      ringX += (mouseX - ringX) * LERP;
      ringY += (mouseY - ringY) * LERP;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
}
