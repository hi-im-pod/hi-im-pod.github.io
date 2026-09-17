// Pieces both pages need. Kept here so the footer and the divider settings
// cannot drift apart between index.html and reading.html.
import { profile } from './content.js';
import { createWaveform } from './waveform.js';

export function renderFooter() {
  document.getElementById('site-footer').innerHTML = `
    <p>${profile.name}</p>
    <p>
      <a href="mailto:${profile.email}">Email</a>
      <a href="${profile.links.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
      <a href="${profile.links.github}" target="_blank" rel="noopener">GitHub</a>
      <a href="ethics.html">Ethics</a>
    </p>
    ${footerHints()}
  `;
}

// Each hint is dropped on the page it points at, so nothing self-links.
function footerHints() {
  const path = location.pathname;
  const hints = [];

  if (!path.endsWith('decoder.html')) {
    hints.push('The meters are not decorative. A certain Mr. Morse could read them, and <a href="decoder.html">so can you</a>.');
  }
  if (!path.endsWith('diagnostics.html')) {
    hints.push('Bars sitting still? <a href="diagnostics.html">Check your browser</a>.');
  }

  return hints.length ? `<p class="footer-hint">${hints.join(' ')}</p>` : '';
}

export function renderDividers() {
  document.querySelectorAll('[data-waveform-divider]').forEach(el => {
    createWaveform(el, {
      animated: true,
      // `parallax` defaults to !animated, so it has to be set back on here.
      parallax: true,
      height: 90,
      signal: el.dataset.signal,
      reflection: true,
    });
  });
}
