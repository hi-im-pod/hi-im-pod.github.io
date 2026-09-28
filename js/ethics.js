import { renderNav, renderFooter, renderDividers } from './shared.js';

function init() {
  renderNav('ethics.html');
  renderFooter();
  renderDividers();
}

document.addEventListener('DOMContentLoaded', init);
