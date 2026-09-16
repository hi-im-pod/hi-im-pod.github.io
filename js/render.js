import { createWaveform } from './waveform.js';
import { initNav } from './nav.js';
import { profile } from './content.js';

// --- section renderers ---

function renderHero() {
  const container = document.getElementById('hero-content');
  container.innerHTML = `
    <p class="eyebrow-line">${profile.role}</p>
    <h1>${profile.name}</h1>
    <p class="tagline">${profile.tagline}</p>
    <div class="hero-actions">
      <a class="btn" href="${profile.resumeHref}" download>Download résumé</a>
      <a class="btn" href="#contact">Get in touch</a>
    </div>
  `;
}

function renderAbout() {
  document.getElementById('about-content').innerHTML = `<p>${profile.about}</p>`;
}

// --- init ---
function init() {
  renderHero();
  renderAbout();

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
