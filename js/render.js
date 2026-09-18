import { createWaveform } from './waveform.js';
import { initNav } from './nav.js';
import { renderFooter, renderDividers } from './shared.js';
import { initRadio } from './radio.js';
import * as t from './templates.js';

// The radio is not part of the page until someone asks for it by name on the
// decoder. Decoder progress lives in memory and dies on navigation, by design,
// so the key cannot be a stored flag: it travels in the URL instead, which is
// the one channel that survives the trip without anything being written down.
//
// Taken out of the DOM rather than hidden, because a divider with no width
// would build a zero-pixel canvas and the nav would keep a link to nothing.
// Like arrival.html, this is a game and not a lock: the markup ships either
// way and anyone reading the source can see how it opens.
function gateRadio() {
  if (location.hash === '#radio') {
    // The browser tried to scroll here before this ran and found nothing.
    requestAnimationFrame(() => {
      document.getElementById('radio')?.scrollIntoView({ block: 'start' });
    });
    return true;
  }

  document.getElementById('radio')?.remove();
  document.getElementById('radio-controls')?.remove();
  document.querySelector('[data-signal="RADIO"]')?.remove();
  document.querySelector('a[href="#radio"]')?.remove();
  return false;
}

// The same strings tools/build-static.mjs writes into the HTML. Re-applying
// them costs nothing when the markup is already there, and it keeps one code
// path for both: if content.js changes without the generator being re-run, the
// browser still shows the current data.
const SECTIONS = {
  'hero-content': t.hero,
  'about-content': t.about,
  'experience-list': t.experienceList,
  'education-list': t.educationList,
  'research-list': t.researchList,
  'projects-list': t.projectsList,
  'contact-content': t.contact,
};

function renderSections() {
  for (const [id, html] of Object.entries(SECTIONS)) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html();
  }
}

// --- init ---
function init() {
  renderSections();
  renderFooter();
  const radio = gateRadio();
  renderDividers();
  if (radio) initRadio();

  const heroWaveformEl = document.querySelector('[data-waveform-hero]');
  if (heroWaveformEl) {
    createWaveform(heroWaveformEl, {
      animated: true,
      height: 170,
      signal: heroWaveformEl.dataset.signal,
      reflection: true,
    });
  }

  initNav();
}

document.addEventListener('DOMContentLoaded', init);
