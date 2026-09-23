import { renderFooter, renderDividers } from './shared.js';
import { work } from './templates.js';

function renderWork() {
  const container = document.getElementById('work-content');
  if (container) container.innerHTML = work();
}

// The anchors these links target do not exist until the render above runs, so
// re-apply the fragment rather than racing the browser's own scroll.
function scrollToHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!id) return;
  document.getElementById(id)?.scrollIntoView();
}

function init() {
  renderFooter();
  renderDividers();
  renderWork();
  scrollToHash();
}

document.addEventListener('DOMContentLoaded', init);
