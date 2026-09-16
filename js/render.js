import { createWaveform } from './waveform.js';
import { initNav } from './nav.js';

// --- section renderers ---


// --- init ---
function init() {
  document.querySelectorAll('[data-waveform-divider]').forEach(el => {
    createWaveform(el, { animated: false, height: 32 });
  });

  const heroWaveformEl = document.querySelector('[data-waveform-hero]');
  if (heroWaveformEl) {
    createWaveform(heroWaveformEl, { animated: true, height: 120 });
  }

  initNav();
}

document.addEventListener('DOMContentLoaded', init);
