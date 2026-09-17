import { createWaveform } from './waveform.js';
import { initNav } from './nav.js';
import { renderFooter, renderDividers } from './shared.js';
import { initRadio } from './radio.js';
import { profile, experience, education, researchInterests, projects } from './content.js';

// Korean strings get their own element so the language is declared rather than
// guessed. Without it a screen reader reads Hangul with an English voice, and
// the browser has no reason to reach for the Korean face we bundle.
const ko = text => `<span lang="ko">${text}</span>`;

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

// --- section renderers ---

function renderHero() {
  const container = document.getElementById('hero-content');
  container.innerHTML = `
    <p class="eyebrow-line">${profile.role}</p>
    <h1>${profile.name}</h1>
    <p class="tagline">${profile.tagline}</p>
    <div class="hero-actions">
      <a class="btn" href="${profile.resumeHref}" download>Download résumé</a>
      <a class="btn" href="#contact">Get in touch</a>
    </div>
  `;
}

function renderAbout() {
  document.getElementById('about-content').innerHTML = `<p>${profile.about}</p>`;
}

function renderExperience() {
  const list = document.getElementById('experience-list');
  list.innerHTML = experience.map(job => `
    <li class="timeline-item">
      <time datetime="${job.start}">${job.start}–${job.end}</time>
      <h3>${job.role}, ${job.org}</h3>
      <ul>
        ${job.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
      </ul>
    </li>
  `).join('');
}

function renderEducation() {
  const list = document.getElementById('education-list');
  list.innerHTML = education.map(item => `
    <li class="timeline-item">
      <time>${item.period}</time>
      <h3>${item.degree}, ${item.org}${item.orgKorean ? ` ${ko(item.orgKorean)}` : ''}</h3>
      <p>${item.detail}</p>
    </li>
  `).join('');
}

function renderResearch() {
  const list = document.getElementById('research-list');
  list.innerHTML = researchInterests.map(item => {
    // An interest with no papers yet is a plain card, not a link to an
    // empty group. Adding one must not take the rest of the page with it.
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
}

function renderProjects() {
  const list = document.getElementById('projects-list');
  list.innerHTML = projects.map(project => `
    <div class="tile">
      <h3>${project.title}</h3>
      <p>${project.description}</p>
      <div class="tile__tags">
        ${project.tags.map(tag => `<span class="tile__tag">${tag}</span>`).join('')}
      </div>
      ${project.illustrative ? '<p class="tile__note">Illustrative example, not real client work.</p>' : ''}
    </div>
  `).join('');
}

function renderContact() {
  document.getElementById('contact-content').innerHTML = `
    <p>${profile.lookingFor}</p>
    <p>Based in ${profile.city} ${ko(`(${profile.cityKorean})`)}, ${profile.country}, with a home base in ${profile.homeBase}. The fastest way to reach me is email.</p>
    <div class="hero-actions">
      <a class="btn" href="mailto:${profile.email}">Email me</a>
      <a class="btn" href="${profile.resumeHref}" download>Download résumé</a>
    </div>
  `;
}

// --- init ---
function init() {
  renderHero();
  renderAbout();
  renderExperience();
  renderEducation();
  renderResearch();
  renderProjects();
  renderContact();
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
