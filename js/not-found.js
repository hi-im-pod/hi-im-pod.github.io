import { renderNav, renderFooter } from './shared.js';

function init() {
  renderNav('404.html');
  renderFooter();
}

document.addEventListener('DOMContentLoaded', init);
