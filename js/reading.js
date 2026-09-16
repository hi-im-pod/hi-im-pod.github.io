import { renderFooter, renderDividers } from './shared.js';
import { researchInterests } from './content.js';

function renderReading() {
  const container = document.getElementById('reading-content');
  container.innerHTML = researchInterests.map(item => `
    <div class="reading-group" id="${item.id}">
      <h2>${item.title}</h2>
      <p class="reading-group__note">${item.description}</p>
      <ul class="reading-list">
        ${item.reading.map(paper => `
          <li>
            <a href="${paper.url}" target="_blank" rel="noopener">${paper.title}</a>
            <span class="reading-meta">${paper.authors.replace(/\.$/, '')}. ${paper.venue}, ${paper.year}.</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

function init() {
  renderReading();
  renderFooter();
  renderDividers();
}

document.addEventListener('DOMContentLoaded', init);
