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
    </p>
    <p class="footer-hint">The meters are not decorative. A certain Mr. Morse could read them.</p>
  `;
}

export function renderDividers() {
  document.querySelectorAll('[data-waveform-divider]').forEach(el => {
    createWaveform(el, {
      animated: false,
      height: 90,
      signal: el.dataset.signal,
      reflection: true,
    });
  });
}
