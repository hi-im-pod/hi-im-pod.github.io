import { createWaveform } from './waveform.js';
import { initNav } from './nav.js';
import { profile, experience, researchInterests, projects } from './content.js';

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
      <time>${job.start}–${job.end}</time>
      <h3>${job.role} — ${job.org}</h3>
      <ul>
        ${job.bullets.map(bullet => `<li>${bullet}</li>`).join('')}
      </ul>
    </li>
  `).join('');
}

function renderResearch() {
  const list = document.getElementById('research-list');
  list.innerHTML = researchInterests.map(item => `
    <div class="card">
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
  `).join('');
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
      ${project.illustrative ? '<p class="tile__note">Illustrative example — built to demonstrate approach, not real client work.</p>' : ''}
    </div>
  `).join('');
}

// --- init ---
function init() {
  renderHero();
  renderAbout();
  renderExperience();
  renderResearch();
  renderProjects();

  document.querySelectorAll('[data-waveform-divider]').forEach(el => {
    createWaveform(el, { animated: false, height: 32 });
  });

  const heroWaveformEl = document.querySelector('[data-waveform-hero]');
  if (heroWaveformEl) {
    createWaveform(heroWaveformEl, { animated: true, height: 120 });
  }

  initNav();
}

document.addEventListener('DOMContentLoaded', init);
