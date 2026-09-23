// Every piece of markup the site builds from js/content.js, as pure functions
// of that data with no DOM access.
//
// It lives apart from the renderers so two things can use it: the browser, which
// injects it on load, and tools/build-static.mjs, which writes the same strings
// into the HTML files at build time. That is what lets the pages carry their own
// content when a script never runs, without a second copy of the markup that
// could drift out of step with this one.
//
// NOTE: values are interpolated without escaping, matching the note at the top
// of content.js. Never source a field there from user input or an external API.

import { profile, experience, education, researchInterests, projects } from './content.js';
import { playlist, radioIntro } from './playlist.js';
import { FINAL } from './progress.js';

// Korean strings get their own element so the language is declared rather than
// guessed. Without it a screen reader reads Hangul with an English voice, and
// the browser has no reason to reach for the Korean face we bundle.
const ko = text => `<span lang="ko">${text}</span>`;

export const hero = () => `
    <p class="eyebrow-line">${profile.role}</p>
    <h1>${profile.name}</h1>
    <p class="tagline">${profile.tagline}</p>
    <div class="hero-actions">
      <a class="btn" href="${profile.resumeHref}" download>Download résumé</a>
      <a class="btn" href="#contact">Get in touch</a>
    </div>
  `;

export const about = () => `<p>${profile.about}</p>`;

export const experienceList = () => experience.map(job => `
    <li class="timeline-item">
      <time datetime="${job.start}">${job.start}–${job.end}</time>
      <h3>${job.role}, ${job.org}</h3>
      <ul>
        ${job.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
      </ul>
    </li>
  `).join('');

export const educationList = () => education.map(item => `
    <li class="timeline-item">
      <time>${item.period}</time>
      <h3>${item.degree}, ${item.org}${item.orgKorean ? ` ${ko(item.orgKorean)}` : ''}</h3>
      <p>${item.detail}</p>
    </li>
  `).join('');

export const researchList = () => researchInterests.map(item => {
  // An interest with no papers yet is a plain card, not a link to an empty
  // group. Adding one must not take the rest of the page with it.
  const papers = item.reading ?? [];
  if (!papers.length) {
    return `
    <div class="card">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
  `;
  }
  return `
    <a class="card card--link" href="reading.html#${item.id}">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
      <span class="card__cue">${papers.length} ${papers.length === 1 ? 'paper' : 'papers'}</span>
    </a>
  `;
}).join('');

// A project with all four beats written has something to link to. One without
// stays a plain tile, the same way a research interest with no papers does, so
// a half-written page never ships.
// A beat is a string, or an array of them when it needs more than one
// paragraph. Both count as written; an empty array does not.
const filled = v => (Array.isArray(v) ? v.length > 0 && v.every(Boolean) : Boolean(v));
const writtenUp = p => [p.constraint, p.decision, p.rejected, p.measure].every(filled);
export const projectsWithWriteUp = () => projects.filter(writtenUp);

export const projectsList = () => projects.map(project => {
  const body = `
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="tile__tags">
        ${project.tags.map(tag => `<span class="tile__tag">${tag}</span>`).join('')}
      </div>`;

  if (!writtenUp(project)) {
    return `
    <div class="tile">${body}
      <p class="tile__note">The systems are covered by agreements. The reasoning is not.</p>
    </div>
  `;
  }
  return `
    <a class="tile tile--link" href="work.html#${project.id}">${body}
      <span class="tile__cue">How I approached it</span>
    </a>
  `;
}).join('');

// The write-ups themselves. Four beats, in the order a reader needs them: what
// made it hard, what was done, what was turned down, and how anyone would know
// it worked.
const BEATS = [
  ['constraint', 'The constraint'],
  ['decision', 'The decision'],
  ['rejected', 'What I rejected'],
  ['measure', 'How I would know it worked'],
];

export const work = () => {
  const ready = projectsWithWriteUp();
  if (!ready.length) {
    return `
    <p class="reading-meta">Nothing written up yet.</p>
  `;
  }
  return ready.map(p => `
    <div class="work-group" id="${p.id}">
      <h2>${p.title}</h2>
      <p class="reading-group__note">${p.description}</p>
      <div class="tile__tags">
        ${p.tags.map(tag => `<span class="tile__tag">${tag}</span>`).join('')}
      </div>
      ${BEATS.map(([key, label]) => `
      <div class="work-beat">
        <h3>${label}</h3>
        ${[p[key]].flat().map(para => `<p>${para}</p>`).join('')}
      </div>`).join('')}
    </div>
  `).join('');
};

export const contact = () => `
    <p>${profile.lookingFor}</p>
    <p>Based in ${profile.city} ${ko(`(${profile.cityKorean})`)}, ${profile.country}, with a home base in ${profile.homeBase}. The fastest way to reach me is email.</p>
    <div class="hero-actions">
      <a class="btn" href="mailto:${profile.email}">Email me</a>
      <a class="btn" href="${profile.resumeHref}" download>Download résumé</a>
    </div>
  `;

export const reading = () => researchInterests.map(item => {
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

  const position = item.position
    ? `<blockquote class="reading-position">${item.position}</blockquote>`
    : '';

  return `
    <div class="reading-group" id="${item.id}">
      <h2>${item.title}</h2>
      <p class="reading-group__note">${item.description}</p>
      ${position}
      ${list}
    </div>
  `;
}).join('');

export const radioLede = () => radioIntro;

// Deliberately not the same markup radio.js builds. That version wraps each
// track in a button, which does nothing at all without a script to hear it; a
// dead button is worse than a line of text. This is the readable fallback, and
// radio.js replaces it with the interactive version when it runs.
export const radioTracks = () => playlist.map(track => `
      <li>
        <span class="radio-track-title">${track.title}</span>
        <span class="radio-track-artist">${track.artist}</span>
      </li>
    `).join('');

// Each hint is dropped on the page it points at, so nothing self-links. Takes
// the page rather than reading location, so the build tool can ask for any
// page's footer while generating another.
export function footerHints(page) {
  const hints = [];
  if (!page.endsWith('decoder.html')) {
    hints.push('The meters are not decorative. A certain Mr. Morse could read them, and <a href="decoder.html">so can you</a>.');
  }
  if (!page.endsWith('diagnostics.html')) {
    hints.push('Bars sitting still? <a href="diagnostics.html">Check your browser</a>.');
  }
  // Said on the decoder page itself, where someone is already reading bars and
  // the field sits a few centimetres below this line.
  if (page.endsWith('decoder.html')) {
    hints.push('This one names no section.');
  }
  return hints.length ? `<p class="footer-hint">${hints.join(' ')}</p>` : '';
}

// The bar field is a div here and a canvas once a script fills it. Everything
// that matters without JavaScript, the name and the links, is plain markup.
export const footer = page => `
    <div class="footer-signal" data-signal="${FINAL}"></div>
    <p>${profile.name}</p>
    <p>
      <a href="mailto:${profile.email}">Email</a>
      <a href="${profile.links.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
      <a href="${profile.links.github}" target="_blank" rel="noopener">GitHub</a>
      <a href="ethics.html">Ethics</a>
    </p>
    ${footerHints(page)}
  `;
