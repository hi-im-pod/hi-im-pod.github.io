import { renderFooter, renderDividers } from './shared.js';
import { researchInterests } from './content.js';

function renderReading() {
  const container = document.getElementById('reading-content');
  container.innerHTML = researchInterests.map(item => {
    const papers = item.reading ?? [];
    const list = papers.length
      ? `<ul class="reading-list">
        ${papers.map(paper => `
          <li>
            <a href="${paper.url}" target="_blank" rel="noopener">${paper.title}</a>
            <span class="reading-meta">${paper.authors.replace(/\.$/, '')}. ${paper.venue}, ${paper.year}.</span>
          </li>
        `).join('')}
      </ul>`
      : '<p class="reading-meta">Nothing listed yet.</p>';

    return `
    <div class="reading-group" id="${item.id}">
      <h2>${item.title}</h2>
      <p class="reading-group__note">${item.description}</p>
      ${list}
    </div>
  `;
  }).join('');
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
