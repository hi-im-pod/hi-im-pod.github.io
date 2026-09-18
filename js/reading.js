import { renderFooter, renderDividers } from './shared.js';
import { reading } from './templates.js';

function renderReading() {
  const container = document.getElementById('reading-content');
  if (container) container.innerHTML = reading();
}

// The anchors these links target do not exist until the render above runs, and
// the browser abandons a pending fragment scroll as soon as the visitor
// scrolls. Re-apply it so a deep link from the research cards is deterministic
// rather than a race with load.
function scrollToHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  const target = document.getElementById(id);
  if (target) target.scrollIntoView();
}

function init() {
  // Chrome first, so a failure while rendering the list still leaves a
  // usable page rather than a bare one.
  renderFooter();
  renderDividers();
  renderReading();
  scrollToHash();
}

document.addEventListener('DOMContentLoaded', init);
