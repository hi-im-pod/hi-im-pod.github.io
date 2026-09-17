const MORSE = {
  A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.',
  H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.',
  O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-',
  V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
};

// Three clearly separated height tiers. Every column is populated, so the
// field reads as a solid meter; the message lives in the tiers, not in gaps.
const REST_LEVEL = 0.12;
const DOT_LEVEL = 0.44;
const DASH_LEVEL = 0.95;

// Morse, read left to right: a mid-height column is a dot, a full-height one
// a dash, and a stub column is the rest between letters.
function morseLevels(text) {
  const levels = [];
  text.toUpperCase().split(/\s+/).filter(Boolean).forEach((word, wordIndex) => {
    if (wordIndex > 0) levels.push(REST_LEVEL, REST_LEVEL);
    [...word].forEach((char, charIndex) => {
      const code = MORSE[char];
      if (!code) return;
      if (charIndex > 0) levels.push(REST_LEVEL);
      for (const symbol of code) {
        levels.push(symbol === '-' ? DASH_LEVEL : DOT_LEVEL);
      }
    });
  });
  return levels;
}

// Deterministic pseudo-random in 0..1, so layouts stay stable across reloads.
function noise(seed) {
  const n = Math.sin(seed) * 43758.5453;
  return n - Math.floor(n);
}

// Deterministic per-bar variation so an encoded pattern still reads as a
// meter rather than a barcode. Small enough to keep dots and dashes apart.
function barJitter(i) {
  return (noise(i * 12.9898) - 0.5) * 0.08;
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
  const encodedLevels = signal ? morseLevels(signal) : null;
  const barCount = encodedLevels ? encodedLevels.length : (animated ? 28 : 16);
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
    buildBed();
  }

  // fraction (0..1) of max bar height for bar i of n. With a signal to
  // encode, the shape is that message in Morse; otherwise it falls back to
  // a DJ meter with a main peak and a smaller secondary bump.
  function barLevel(i, n, t) {
    let level;
    let isRest = false;

    if (encodedLevels) {
      level = encodedLevels[i];
      isRest = level === REST_LEVEL;
      if (!isRest) level += barJitter(i);
    } else {
      const x = i / (n - 1);
      const mainPeak = Math.exp(-(((x - 0.62) / 0.14) ** 2));
      const secondaryPeak = 0.35 * Math.exp(-(((x - 0.26) / 0.09) ** 2));
      level = 0.16 + 0.68 * mainPeak + secondaryPeak;
    }

    // Encoded columns never move. Their height is the message, and the
    // decoder page tells readers a dot is 3 to 4 segments and a dash 7 to 8.
    // Wobbling the height pushed dots up into dash range and turned
    // EXPERIENCE into EXPEWIENCE. Motion comes from the sweep instead.
    if (animated && !reduceMotion && !isRest && !encodedLevels) {
      const wobble = 0.14 * Math.sin(t / 260 + i * 0.85)
        + 0.07 * Math.sin(t / 130 + i * 1.7);
      level += wobble;
    }

    return Math.max(0.04, Math.min(1, level));
  }

  // LED-style columns: every slot is filled top to bottom with dim unlit
  // segments, and the level decides how many light up. Keeps the field solid
  // the way a real visualiser is, while the lit height still carries Morse.
  function draw(t) {
    const { width, fieldHeight, pitch, segRows, reflectRows } = geom;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(bed, 0, 0, width, height);
    ctx.fillStyle = barGradient;

    for (let i = 0; i < barCount; i++) {
      const x = i * pitch + (pitch - geom.barWidth) / 2;
      const litRows = Math.max(1, Math.round(barLevel(i, barCount, t) * segRows));

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

  // A band of extra brightness travelling left to right. It lights columns
  // that are already drawn rather than changing their height, so the encoded
  // message stays exactly as the decoder page describes it.
  const SWEEP_WIDTH = 0.13;
  function drawSweep(t) {
    const { fieldHeight, pitch, segRows } = geom;
    const head = ((t / 2600) % 1.5) - 0.25;

    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = barGradient;

    for (let i = 0; i < barCount; i++) {
      const position = barCount > 1 ? i / (barCount - 1) : 0;
      const distance = Math.abs(position - head);
      if (distance > SWEEP_WIDTH) continue;

      ctx.globalAlpha = 0.6 * (1 - distance / SWEEP_WIDTH) ** 2;
      const x = i * pitch + (pitch - geom.barWidth) / 2;
      const litRows = Math.max(1, Math.round(barLevel(i, barCount, 0) * segRows));
      for (let row = 0; row < litRows; row++) {
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
