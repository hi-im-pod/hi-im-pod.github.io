// Pieces both pages need. Kept here so the footer and the divider settings
// cannot drift apart between index.html and reading.html.
import { createWaveform } from './waveform.js';
import { footer as footerHtml } from './templates.js';
import { FINAL } from './progress.js';

export function renderFooter() {
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  // The same markup the build tool already wrote into this element. Rewriting
  // it keeps one code path, and matters when content.js has moved on from what
  // was generated.
  footer.innerHTML = footerHtml(location.pathname);

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
