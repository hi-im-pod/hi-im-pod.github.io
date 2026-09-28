import { renderNav, renderFooter } from './shared.js';
import { resume } from './templates.js';

// No renderDividers: the page has no divider field. Every divider on the site
// spells its own word, and a résumé is not a place to hide a new one.
function renderResume() {
  const container = document.getElementById('resume-content');
  if (container) container.innerHTML = resume();
}

function init() {
  // Chrome first, as on the other pages, so a failure while rendering the
  // résumé still leaves a usable page.
  renderNav('resume.html');
  renderFooter();
  renderResume();
}

document.addEventListener('DOMContentLoaded', init);
