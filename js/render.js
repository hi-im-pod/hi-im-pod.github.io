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
      <time datetime="${job.start}">${job.start}–${job.end}</time>
      <h3>${job.role}, ${job.org}</h3>
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
      ${project.illustrative ? '<p class="tile__note">Illustrative example, not real client work.</p>' : ''}
    </div>
  `).join('');
}

function renderContact() {
  document.getElementById('contact-content').innerHTML = `
    <p>Based in ${profile.location}. The fastest way to reach me is email.</p>
    <div class="hero-actions">
      <a class="btn" href="mailto:${profile.email}">Email me</a>
      <a class="btn" href="${profile.resumeHref}" download>Download résumé</a>
    </div>
  `;
}

function renderFooter() {
  document.getElementById('site-footer').innerHTML = `
    <p>${profile.name}</p>
    <p>
      <a href="mailto:${profile.email}">Email</a>
      <a href="${profile.links.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
      <a href="${profile.links.github}" target="_blank" rel="noopener">GitHub</a>
    </p>
  `;
}

// --- init ---
function init() {
  renderHero();
  renderAbout();
  renderExperience();
  renderResearch();
  renderProjects();
  renderContact();
  renderFooter();

  document.querySelectorAll('[data-waveform-divider]').forEach(el => {
    createWaveform(el, { animated: false, height: 40, signal: el.dataset.signal });
  });

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
