// Pieces both pages need. Kept here so the footer and the divider settings
// cannot drift apart between index.html and reading.html.
import { profile } from './content.js';
import { createWaveform } from './waveform.js';
import { FINAL } from './progress.js';

export function renderFooter() {
  const footer = document.getElementById('site-footer');
  footer.innerHTML = `
    <div class="footer-signal"></div>
    <p>${profile.name}</p>
    <p>
      <a href="mailto:${profile.email}">Email</a>
      <a href="${profile.links.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
      <a href="${profile.links.github}" target="_blank" rel="noopener">GitHub</a>
      <a href="ethics.html">Ethics</a>
    </p>
    ${footerHints()}
  `;

  // Built here rather than left for renderDividers, so it does not depend on
  // which of the two a page happens to call first. Same geometry as every
  // other field, because the tier bands need all 15 rows.
  createWaveform(footer.querySelector('.footer-signal'), {
    animated: true,
    parallax: false,
    height: 170,
    signal: FINAL,
    reflection: true,
  });
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
  // Said on the decoder page itself, where someone is already reading bars and
  // the field sits a few centimetres below this line.
  if (path.endsWith('decoder.html')) {
    hints.push('This one names no section.');
  }

  return hints.length ? `<p class="footer-hint">${hints.join(' ')}</p>` : '';
}

export function renderDividers() {
  document.querySelectorAll('[data-waveform-divider]').forEach(el => {
    createWaveform(el, {
      animated: true,
      // `parallax` defaults to !animated, so it has to be set back on here.
      parallax: true,
      // Same height as the hero field. Matching them keeps the bar geometry
      // uniform down the page, and 15 rows is what gives each tier room to
      // bounce without crossing into the next one.
      height: 170,
      signal: el.dataset.signal,
      reflection: true,
    });
  });
}
