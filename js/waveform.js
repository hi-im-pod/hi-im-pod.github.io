export function createWaveform(container, { animated = false, height = 60 } = {}) {
  const canvas = document.createElement('canvas');
  canvas.className = 'waveform-canvas';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const spikeX = 0.62;

  function resize() {
    const width = container.clientWidth;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function draw(t) {
    const width = container.clientWidth;
    ctx.clearRect(0, 0, width, height);
    const signalColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-signal').trim() || '#2FD9C4';
    ctx.strokeStyle = signalColor;
    ctx.lineWidth = 2;
    ctx.beginPath();

    const midY = height / 2;
    const wobble = animated && !reduceMotion ? Math.sin(t / 900) * 2 : 0;
    const spikeHeight = animated && !reduceMotion
      ? height * 0.32 + Math.sin(t / 400) * height * 0.08
      : height * 0.32;

    for (let x = 0; x <= width; x += 2) {
      const progress = x / width;
      let y = midY + wobble * Math.sin(progress * 6);
      const distFromSpike = Math.abs(progress - spikeX);
      if (distFromSpike < 0.02) {
        const spikeT = 1 - distFromSpike / 0.02;
        y -= spikeHeight * spikeT;
      }
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
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

  return canvas;
}
