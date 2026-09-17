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
    ${onDecoderPage() ? '' : `
    <p class="footer-hint">The meters are not decorative. A certain Mr. Morse could read them,
      and <a href="decoder.html">so can you</a>.</p>`}
  `;
}

// The hint links to the decoder, so it would point at itself there.
function onDecoderPage() {
  return location.pathname.endsWith('decoder.html');
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
