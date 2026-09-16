const parallaxTargets = [];
let parallaxListenerAttached = false;

function attachParallaxListener() {
  if (parallaxListenerAttached) return;
  parallaxListenerAttached = true;

  let ticking = false;
  function update() {
    const viewportCenter = window.innerHeight / 2;
    for (const target of parallaxTargets) {
      const rect = target.container.getBoundingClientRect();
      const elCenter = rect.top + rect.height / 2;
      const distance = elCenter - viewportCenter;
      const offset = Math.max(-10, Math.min(10, distance * -0.04));
      target.canvas.style.transform = `translateY(${offset.toFixed(2)}px)`;
    }
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  update();
}

export function createWaveform(container, { animated = false, height = 60, parallax = !animated } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'waveform-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rootStyle = getComputedStyle(document.documentElement);
  const pinkColor = rootStyle.getPropertyValue('--color-pink').trim() || '#FF9FD6';
  const lavenderColor = rootStyle.getPropertyValue('--color-lavender').trim() || '#B79CFF';
  const signalColor = rootStyle.getPropertyValue('--color-signal').trim() || '#2FD9C4';
  const barCount = animated ? 28 : 16;
  let barGradient = signalColor;

  function resize() {
    const width = container.clientWidth;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const gradient = ctx.createLinearGradient(0, 0, width, 0);
    gradient.addColorStop(0, pinkColor);
    gradient.addColorStop(0.5, lavenderColor);
    gradient.addColorStop(1, signalColor);
    barGradient = gradient;
  }

  // fraction (0..1) of max bar height for bar i of n, shaped like a DJ
  // meter with a main peak and a smaller secondary bump — the same
  // "signal that stands out" idea as before, now as a bar cluster.
  function barLevel(i, n, t) {
    const x = i / (n - 1);
    const mainPeak = Math.exp(-(((x - 0.62) / 0.14) ** 2));
    const secondaryPeak = 0.35 * Math.exp(-(((x - 0.26) / 0.09) ** 2));
    let level = 0.16 + 0.68 * mainPeak + secondaryPeak;
    if (animated && !reduceMotion) {
      const wobble = 0.14 * Math.sin(t / 260 + i * 0.85) + 0.07 * Math.sin(t / 130 + i * 1.7);
      level = Math.max(0.08, Math.min(1, level + wobble));
    }
    return Math.min(1, level);
  }

  function draw(t) {
    const width = container.clientWidth;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = barGradient;
    ctx.shadowColor = pinkColor;
    ctx.shadowBlur = animated ? 12 : 5;

    const gap = width / barCount;
    const barWidth = gap * 0.55;
    const radius = Math.min(2, barWidth / 2);

    for (let i = 0; i < barCount; i++) {
      const barHeight = Math.max(3, barLevel(i, barCount, t) * height);
      const x = i * gap + (gap - barWidth) / 2;
      const y = height - barHeight;
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, radius);
        ctx.fill();
      } else {
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    }
  }

  resize();
  draw(0);
  window.addEventListener('resize', () => { resize(); draw(0); });

  if (animated && !reduceMotion) {
    function loop(t) {
      draw(t);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  if (parallax && !reduceMotion) {
    parallaxTargets.push({ container, canvas });
    attachParallaxListener();
  }

  return canvas;
}
