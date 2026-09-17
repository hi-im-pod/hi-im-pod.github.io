const MORSE = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.',
  H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.',
  O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-',
  V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
};

// Each tier owns a band of the column's height and bounces only inside it, as
// a fraction of the full field. The bands never touch, so a dot at its peak
// stays well below a dash at its floor and the message survives the motion.
// At the 15 rows a 170px field gives: rest 1, dot 4-7, dash 11-15, leaving
// rows 2-3 and rows 8-10 permanently dark as the guard gaps between them.
export const BANDS = {
  rest: { lo: 0.06, hi: 0.06 },
  dot: { lo: 0.27, hi: 0.47 },
  dash: { lo: 0.72, hi: 1.00 },
};

// Morse, read left to right: a mid-height column is a dot, a full-height one
// a dash, and a stub column is the rest between letters.
function morseTiers(text) {
  const tiers = [];
  text.toUpperCase().split(/\s+/).filter(Boolean).forEach((word, wordIndex) => {
    if (wordIndex > 0) tiers.push('rest', 'rest');
    [...word].forEach((char, charIndex) => {
      const code = MORSE[char];
      if (!code) return;
      if (charIndex > 0) tiers.push('rest');
      for (const symbol of code) {
        tiers.push(symbol === '-' ? 'dash' : 'dot');
      }
    });
  });
  return tiers;
}

// Per-bar oscillation in 0..1. The primary sine spans the whole band every
// cycle so a bar actually visits its floor and ceiling; the faster term adds
// texture and pushes it past the ends, where the clamp holds it for a moment
// the way a meter sits on a peak. Per-bar phase keeps neighbours out of step.
function bounce(i, t) {
  const primary = 0.5 + 0.5 * Math.sin(t / 430 + i * 1.31);
  const detail = 0.18 * Math.sin(t / 210 + i * 2.17);
  return Math.max(0, Math.min(1, primary + detail));
}

// When the radio is playing, the bars take their level from the music instead
// of from the sines. The source returns 0..1 per bar, or null when there is
// nothing to play, and the tier bands clamp whatever comes back. That clamp is
// why real audio cannot corrupt a message: any value in 0..1 lands inside its
// own band, so the Morse reads the same whether the input is a sine wave or a
// kick drum.
let levelSource = null;
export function setLevelSource(fn) {
  levelSource = fn;
}

// Deterministic pseudo-random in 0..1, so layouts stay stable across reloads.
function noise(seed) {
  const n = Math.sin(seed) * 43758.5453;
  return n - Math.floor(n);
}

// A few drifting motes in the band around a divider, so the space between
// sections reads as atmosphere rather than a gap.
function addSparkleField(container, count = 7) {
  const field = document.createElement('div');
  field.className = 'sparkle-field';
  field.setAttribute('aria-hidden', 'true');

  for (let i = 0; i < count; i++) {
    const dot = document.createElement('span');
    dot.style.left = `${(6 + noise((i + 1) * 91.17) * 88).toFixed(1)}%`;
    dot.style.top = `${(noise((i + 1) * 57.31) * 100).toFixed(1)}%`;
    dot.style.animationDelay = `${(noise((i + 1) * 13.73) * 5).toFixed(1)}s`;
    field.appendChild(dot);
  }

  container.appendChild(field);
}

// One shared animation loop for every animated bar field, and it only draws
// the ones actually on screen. Without the visibility gate the cost grows with
// the number of dividers; with it, the cost is whatever is in the viewport.
const animatedRegistry = new Map(); // container -> { draw, visible }
let frameRequest = null;
let visibility = null;

function observeVisibility(container) {
  if (!visibility) {
    visibility = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const instance = animatedRegistry.get(entry.target);
        if (instance) instance.visible = entry.isIntersecting;
      }
      syncLoop();
    }, { rootMargin: '120px' });
  }
  visibility.observe(container);
}

function syncLoop() {
  const anyVisible = [...animatedRegistry.values()].some(i => i.visible);
  if (anyVisible && frameRequest === null) {
    frameRequest = requestAnimationFrame(runFrame);
  } else if (!anyVisible && frameRequest !== null) {
    cancelAnimationFrame(frameRequest);
    frameRequest = null;
  }
}

function runFrame(t) {
  let drawn = 0;
  for (const instance of animatedRegistry.values()) {
    if (instance.visible) { instance.draw(t); drawn++; }
  }
  window.__activeWaveforms = drawn;
  frameRequest = drawn > 0 ? requestAnimationFrame(runFrame) : null;
}

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

export function createWaveform(container, { animated = false, height = 60, parallax = !animated, signal = '', reflection = false, segPitch = 8 } = {}) {
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
  const encodedTiers = signal ? morseTiers(signal) : null;
  const barCount = encodedTiers ? encodedTiers.length : (animated ? 28 : 16);
  let barGradient = signalColor;

  // Geometry only changes on resize, so work it out once instead of per frame.
  let geom = null;
  const bed = document.createElement('canvas');
  const bedCtx = bed.getContext('2d');

  function measure(width) {
    const fieldHeight = reflection ? height * 0.72 : height;
    const pitch = width / barCount;
    const barWidth = Math.max(2, pitch * 0.8);
    const segHeight = segPitch * 0.7;
    return {
      width,
      fieldHeight,
      pitch,
      barWidth,
      segHeight,
      segRows: Math.max(3, Math.floor(fieldHeight / segPitch)),
      reflectRows: reflection ? Math.floor((height - fieldHeight) / segPitch) : 0,
      radius: Math.min(1.5, segHeight / 2, barWidth / 2),
    };
  }

  function paintSegment(target, x, y) {
    if (target.roundRect) {
      target.beginPath();
      target.roundRect(x, y, geom.barWidth, geom.segHeight, geom.radius);
      target.fill();
    } else {
      target.fillRect(x, y, geom.barWidth, geom.segHeight);
    }
  }

  // The unlit bed never changes, so render it once and blit it each frame.
  // It is over half the rectangles in a frame, and redrawing it was the
  // single largest cost once every divider started animating.
  function buildBed() {
    bed.width = geom.width * dpr;
    bed.height = height * dpr;
    bedCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bedCtx.clearRect(0, 0, geom.width, height);
    bedCtx.fillStyle = barGradient;
    bedCtx.globalAlpha = 0.09;
    for (let i = 0; i < barCount; i++) {
      const x = i * geom.pitch + (geom.pitch - geom.barWidth) / 2;
      for (let row = 0; row < geom.segRows; row++) {
        paintSegment(bedCtx, x, geom.fieldHeight - (row + 1) * segPitch);
      }
    }
    bedCtx.globalAlpha = 1;
  }

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

    geom = measure(width);
    // Published so diagnostics.html and the Morse verifier can read the real
    // geometry instead of inferring it from pixels, where the reflection below
    // the baseline is easily miscounted as more rows.
    canvas.dataset.segRows = geom.segRows;
    canvas.dataset.fieldHeight = geom.fieldHeight.toFixed(1);
    buildBed();
  }

  // Lit segment count for bar i at time t. Encoded bars are resolved in whole
  // rows rather than as a fraction, because the row count is what a reader
  // counts: rounding a moving fraction is what let a dot's peak land on a
  // dash's floor and turned EXPERIENCE into EXPEWIENCE.
  function barRows(i, t) {
    const { segRows } = geom;

    if (encodedTiers) {
      const band = BANDS[encodedTiers[i]];
      const lo = Math.max(1, Math.round(band.lo * segRows));
      const hi = Math.max(lo, Math.round(band.hi * segRows));
      // Reduced motion and the still first frame sit at the top of the band,
      // where the tiers are furthest apart and easiest to tell apart.
      if (!animated || reduceMotion || hi === lo) return hi;
      const level = levelSource?.(i, barCount, t);
      const u = level == null ? bounce(i, t) : Math.max(0, Math.min(1, level));
      return lo + Math.round((hi - lo) * u);
    }

    // No message to carry: a DJ meter with a main peak and a smaller bump.
    const x = i / (barCount - 1);
    const mainPeak = Math.exp(-(((x - 0.62) / 0.14) ** 2));
    const secondaryPeak = 0.35 * Math.exp(-(((x - 0.26) / 0.09) ** 2));
    let level = 0.16 + 0.68 * mainPeak + secondaryPeak;
    if (animated && !reduceMotion) {
      level += 0.14 * Math.sin(t / 260 + i * 0.85) + 0.07 * Math.sin(t / 130 + i * 1.7);
    }
    return Math.max(1, Math.round(Math.max(0.04, Math.min(1, level)) * segRows));
  }

  // LED-style columns: every slot is filled top to bottom with dim unlit
  // segments, and the level decides how many light up. Keeps the field solid
  // the way a real visualiser is, while the lit height still carries Morse.
  // Each frame's row counts, reused by the sweep so its highlight lands on the
  // bars as they currently stand rather than on where they were at t=0.
  const litPerBar = new Array(barCount).fill(0);

  function draw(t) {
    const { width, fieldHeight, pitch, reflectRows } = geom;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(bed, 0, 0, width, height);
    ctx.fillStyle = barGradient;

    for (let i = 0; i < barCount; i++) {
      const x = i * pitch + (pitch - geom.barWidth) / 2;
      const litRows = barRows(i, t);
      litPerBar[i] = litRows;

      ctx.globalAlpha = 1;
      for (let row = 0; row < litRows; row++) {
        paintSegment(ctx, x, fieldHeight - (row + 1) * segPitch);
      }

      // mirrored reflection, fading as it drops away from the baseline
      for (let row = 0; row < Math.min(litRows, reflectRows); row++) {
        ctx.globalAlpha = 0.28 * (1 - row / reflectRows);
        paintSegment(ctx, x, fieldHeight + row * segPitch + (segPitch - geom.segHeight));
      }
    }

    if (animated && !reduceMotion) drawSweep(t);
    ctx.globalAlpha = 1;
  }

  // A band of extra brightness travelling left to right, on top of the bounce.
  // It re-lights segments that are already drawn, so it adds a second rhythm
  // without touching any column's height.
  const SWEEP_WIDTH = 0.13;
  function drawSweep(t) {
    const { fieldHeight, pitch } = geom;
    const head = ((t / 2600) % 1.5) - 0.25;

    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = barGradient;

    for (let i = 0; i < barCount; i++) {
      const position = barCount > 1 ? i / (barCount - 1) : 0;
      const distance = Math.abs(position - head);
      if (distance > SWEEP_WIDTH) continue;

      ctx.globalAlpha = 0.6 * (1 - distance / SWEEP_WIDTH) ** 2;
      const x = i * pitch + (pitch - geom.barWidth) / 2;
      for (let row = 0; row < litPerBar[i]; row++) {
        paintSegment(ctx, x, fieldHeight - (row + 1) * segPitch);
      }
    }

    ctx.globalCompositeOperation = 'source-over';
  }

  resize();
  draw(0);
  window.addEventListener('resize', () => { resize(); draw(0); });

  if (animated && !reduceMotion) {
    animatedRegistry.set(container, { draw, visible: false });
    observeVisibility(container);
  }

  if (parallax && !reduceMotion) {
    parallaxTargets.push({ container, canvas });
    attachParallaxListener();
    addSparkleField(container);
  }

  return canvas;
}
