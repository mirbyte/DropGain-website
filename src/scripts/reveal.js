function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (prefersReducedMotion()) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );

  elements.forEach((el) => observer.observe(el));
}

function initHeroParallax() {
  const frame = document.querySelector('[data-hero-frame]');
  if (!frame || prefersReducedMotion()) return;

  let rafId = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  function onMove(e) {
    const rect = frame.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    targetX = ((e.clientX - cx) / rect.width) * 4;
    targetY = ((e.clientY - cy) / rect.height) * 3;
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function onLeave() {
    targetX = 0;
    targetY = 0;
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  function tick() {
    currentX += (targetX - currentX) * 0.055;
    currentY += (targetY - currentY) * 0.055;
    frame.style.transform = `perspective(1200px) rotateY(${currentX}deg) rotateX(${-currentY}deg)`;

    if (Math.abs(targetX - currentX) > 0.01 || Math.abs(targetY - currentY) > 0.01) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = 0;
    }
  }

  frame.addEventListener('mousemove', onMove);
  frame.addEventListener('mouseleave', onLeave);

  return () => {
    frame.removeEventListener('mousemove', onMove);
    frame.removeEventListener('mouseleave', onLeave);
    cancelAnimationFrame(rafId);
  };
}

function initKenBurns() {
  const img = document.querySelector('[data-hero-img]');
  if (!img || prefersReducedMotion()) return;

  const target = img instanceof HTMLImageElement ? img : img.querySelector('img');
  target?.classList.add('ken-burns-active');
}

export function initMotion() {
  if (prefersReducedMotion()) {
    document.documentElement.classList.add('reduce-motion');
  }

  initReveal();
  initKenBurns();
  return initHeroParallax();
}
