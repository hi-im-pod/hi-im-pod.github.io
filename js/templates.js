// Every piece of markup the site builds from js/content.js, as pure functions
// of that data with no DOM access.
//
// It lives apart from the renderers so two things can use it: the browser, which
// injects it on load, and tools/build-static.mjs, which writes the same strings
// into the HTML files at build time. That is what lets the pages carry their own
// content when a script never runs, without a second copy of the markup that
// could drift out of step with this one.
//
// Every value from the data files reaches the page through esc(), in text and
// in attributes alike. The only markup that is not escaped is the markup
// written in this file: the tags around each value, ko(), and the links in
// footerHints(). No field in content.js or playlist.js carries markup. One that
// ever needs a link or emphasis gets it from a template here, the way the
// footer hints do, so the data files stay plain text throughout.

import { profile, experience, education, researchInterests, projects } from './content.js';
import { playlist, radioIntro } from './playlist.js';
import { FINAL } from './progress.js';

// All five characters, not only the ones that matter in text, so the same call
// is safe inside a quoted attribute of either kind. A plain value then cannot
// close its own tag or attribute, whatever it contains. It does not vet a URL's
// scheme: a javascript: href would still escape cleanly and still run, so
// links in content.js are checked by whoever adds them.
const ENTITIES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = value => String(value).replace(/[&<>"']/g, ch => ENTITIES[ch]);

// Korean strings get their own element so the language is declared rather than
// guessed. Without it a screen reader reads Hangul with an English voice, and
// the browser has no reason to reach for the Korean face we bundle.
// Takes markup, not text: callers escape the value first.
const ko = html => `<span lang="ko">${html}</span>`;

// Keeps each hyphenated word on one line. Browsers break at a hard hyphen, and
// the tagline split "AI-" from "assisted" on the smallest phones. Takes
// markup: callers escape first, and escaping adds no hyphens.
const whole = html => html.replace(/[\w’']+(?:-[\w’']+)+/g, '<span class="whole">$&</span>');

export const hero = () => `
    <p class="eyebrow-line">${esc(profile.role)}</p>
    <h1>${esc(profile.name)}</h1>
    <p class="tagline">${whole(esc(profile.tagline))}</p>
    <div class="hero-actions">
      <a class="btn btn--primary" href="#contact">Get in touch</a>
      <a class="btn" href="resume.html">Résumé</a>
    </div>
  `;

export const about = () => `<p>${esc(profile.about)}</p>`;

export const experienceList = (jobs = experience) => jobs.map(job => `
    <li class="timeline-item">
      <time datetime="${esc(job.start)}">${esc(job.start)}–${esc(job.end)}</time>
      <h3>${esc(job.role)}, ${esc(job.org)}</h3>
      <ul>
        ${job.bullets.map(bullet => `<li>${esc(bullet)}</li>`).join('')}
      </ul>
    </li>
  `).join('');

// The front page's version. Roles that started before EARLIER_THAN fold into
// one line that points at the résumé, so the oldest and least related work
// does not take as much of the page as the current work. resume.html keeps
// every role in full through experienceList().
const EARLIER_THAN = 2021;
export const experienceSummary = () => {
  const recent = experience.filter(job => Number(job.start) >= EARLIER_THAN);
  const earlier = experience.filter(job => Number(job.start) < EARLIER_THAN);
  if (!earlier.length) return experienceList();
  const from = Math.min(...earlier.map(job => Number(job.start)));
  const to = earlier[0].end;
  const roles = earlier.map(job => `${esc(job.role)}, ${esc(job.org)}`).join('; ');
  return experienceList(recent) + `
    <li class="timeline-item timeline-item--earlier">
      <time datetime="${from}">${from}–${esc(to)}</time>
      <h3>Earlier: ${roles}</h3>
      <p><a href="resume.html">Details on the résumé</a></p>
    </li>
  `;
};

export const educationList = () => education.map(item => `
    <li class="timeline-item">
      <time>${esc(item.period)}</time>
      <h3>${esc(item.degree)}, ${esc(item.org)}${item.orgKorean ? ` ${ko(esc(item.orgKorean))}` : ''}</h3>
      <p>${esc(item.detail)}</p>
    </li>
  `).join('');

export const researchList = () => researchInterests.map(item => {
  // An interest with no papers yet is a plain card, not a link to an empty
  // group. Adding one must not take the rest of the page with it.
  const papers = item.reading ?? [];
  if (!papers.length) {
    return `
    <div class="card">
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.description)}</p>
    </div>
  `;
  }
  return `
    <a class="card card--link" href="reading.html#${esc(item.id)}">
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.description)}</p>
      <span class="card__cue">Reading list · ${papers.length} ${papers.length === 1 ? 'paper' : 'papers'}</span>
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
      <h3>${esc(project.title)}</h3>
      <p>${esc(project.description)}</p>
      <div class="tile__tags">
        ${project.tags.map(tag => `<span class="tile__tag">${esc(tag)}</span>`).join('')}
      </div>`;

  if (!writtenUp(project)) {
    return `
    <div class="tile">${body}
      <p class="tile__note">The systems are covered by agreements. The reasoning is not.</p>
    </div>
  `;
  }
  // The label sits above the title so the difference between a tile with a
  // write-up and one without shows before anyone reads to the bottom of either.
  return `
    <a class="tile tile--link" href="work.html#${esc(project.id)}">
      <span class="tile__depth">Full write-up</span>${body}
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
    <div class="work-group" id="${esc(p.id)}">
      <h2>${esc(p.title)}</h2>
      <p class="reading-group__note">${esc(p.description)}</p>
      <div class="tile__tags">
        ${p.tags.map(tag => `<span class="tile__tag">${esc(tag)}</span>`).join('')}
      </div>
      ${BEATS.map(([key, label]) => `
      <div class="work-beat">
        <h3>${label}</h3>
        ${[p[key]].flat().map(para => `<p>${esc(para)}</p>`).join('')}
      </div>`).join('')}
    </div>
  `).join('');
};

// The subject is percent-encoded before esc() sees it. A space or an ampersand
// in a mailto query has to be encoded to survive as part of the subject, and
// esc() only makes the finished URL safe inside the attribute.
const mailto = (address, subject) =>
  esc(`mailto:${address}?subject=${encodeURIComponent(subject)}`);

// Each address carries its own label so a visitor can see which inbox a
// message belongs in before writing it. Shared with resume(), so the two pages
// cannot route the same address to different kinds of mail.
const emailRoutes = () => `
      <div>
        <dt>Research and collaboration (SKKU)</dt>
        <dd><a href="${mailto(profile.email.research, 'Research collaboration')}">${esc(profile.email.research)}</a></dd>
      </div>
      <div>
        <dt>Everything else (personal)</dt>
        <dd><a href="${mailto(profile.email.general, 'Hello from your site')}">${esc(profile.email.general)}</a></dd>
      </div>`;

const place = () => `${esc(profile.city)} ${ko(`(${esc(profile.cityKorean)})`)}, ${esc(profile.country)}`;

export const contact = () => `
    <p>${esc(profile.lookingFor)}</p>
    <p>Based in ${place()}, with a home base in ${esc(profile.homeBase)}. Send research and collaboration email to my SKKU address, and everything else, including recruiting, to my personal one.</p>
    <dl class="contact-routes">${emailRoutes()}
    </dl>
    <div class="hero-actions">
      <a class="btn" href="${esc(profile.resumeHref)}" download>Download résumé (PDF)</a>
      <a class="btn" href="resume.html">Read it as a web page</a>
    </div>
  `;

// The profile links are printed as their addresses rather than as "LinkedIn"
// and "GitHub", because resume.html is also meant to be printed, and a word on
// paper cannot be clicked.
const bareUrl = url => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

// The résumé as a page, from the same data as the front page. The two lists are
// the front page's own templates rather than a résumé version of them, so a
// role added to content.js reaches both at once.
export const resume = () => `
    <header class="resume-head">
      <p class="eyebrow-line">${esc(profile.role)}</p>
      <h1 class="page-title">${esc(profile.name)}</h1>
      <p class="resume-place">${place()}</p>
      <dl class="contact-routes resume-contact">${emailRoutes()}
        <div>
          <dt>LinkedIn</dt>
          <dd><a href="${esc(profile.links.linkedin)}" target="_blank" rel="noopener">${esc(bareUrl(profile.links.linkedin))}</a></dd>
        </div>
        <div>
          <dt>GitHub</dt>
          <dd><a href="${esc(profile.links.github)}" target="_blank" rel="noopener">${esc(bareUrl(profile.links.github))}</a></dd>
        </div>
      </dl>
      <p class="resume-download"><a class="btn" href="${esc(profile.resumeHref)}" download>Download PDF</a></p>
    </header>
    <section class="resume-section">
      <h2>Experience</h2>
      <ol class="timeline">${experienceList()}</ol>
    </section>
    <section class="resume-section">
      <h2>Education</h2>
      <ol class="timeline">${educationList()}</ol>
    </section>
  `;

export const reading = () => researchInterests.map(item => {
  const papers = item.reading ?? [];
  const list = papers.length
    ? `<ul class="reading-list">
        ${papers.map(paper => `
          <li>
            <a href="${esc(paper.url)}" target="_blank" rel="noopener">${esc(paper.title)}</a>
            <span class="reading-meta">${esc(paper.authors.replace(/\.$/, ''))}. ${esc(paper.venue)}, ${esc(paper.year)}.</span>
          </li>
        `).join('')}
      </ul>`
    : '<p class="reading-meta">Nothing listed yet.</p>';

  const position = item.position
    ? `<blockquote class="reading-position">${esc(item.position)}</blockquote>`
    : '';

  return `
    <div class="reading-group" id="${esc(item.id)}">
      <h2>${esc(item.title)}</h2>
      <p class="reading-group__note">${esc(item.description)}</p>
      ${position}
      ${list}
    </div>
  `;
}).join('');

export const radioLede = () => esc(radioIntro);

// Deliberately not the same markup radio.js builds. That version wraps each
// track in a button, which does nothing at all without a script to hear it; a
// dead button is worse than a line of text. This is the readable fallback, and
// radio.js replaces it with the interactive version when it runs.
export const radioTracks = () => playlist.map(track => `
      <li>
        <span class="radio-track-title">${esc(track.title)}</span>
        <span class="radio-track-artist">${esc(track.artist)}</span>
      </li>
    `).join('');

// One list for every page's nav. The copies used to be written into each HTML
// file by hand, and they drifted: reading.html and work.html lost Education,
// and work.html marked Reading as the current page.
//
// Radio is listed on index.html only. Anywhere else the link would have to be
// index.html#radio, which is the key the decoder hands out, so the nav would
// open the radio for anyone who clicked it. On index.html the bare #radio link
// is safe because gateRadio in render.js removes it unless the key is present.
//
// `current` names the pages that mark an item as the one being read. work.html
// is the long form of the projects section, so it marks Projects.
const NAV_ITEMS = [
  { label: 'About', section: 'about' },
  { label: 'Experience', section: 'experience' },
  { label: 'Education', section: 'education' },
  { label: 'Research', section: 'research' },
  { label: 'Reading', href: 'reading.html', current: ['reading.html'] },
  { label: 'Projects', section: 'projects', current: ['work.html'] },
  { label: 'Radio', section: 'radio', only: 'index.html' },
  { label: 'Contact', section: 'contact' },
];

// Takes the page's file name ('index.html', 'work.html') rather than reading
// location, for the same reason footerHints() does. On index.html the section
// links stay bare fragments: js/nav.js only picks up links that start with #,
// and those are the ones it scrolls smoothly and highlights on scroll.
export function nav(page) {
  const home = page === 'index.html';
  const links = NAV_ITEMS
    .filter(item => !item.only || item.only === page)
    .map(item => {
      const href = item.href ?? `${home ? '' : 'index.html'}#${item.section}`;
      const active = item.current?.includes(page) ? ' class="is-active"' : '';
      return `\n      <a href="${esc(href)}"${active}>${esc(item.label)}</a>`;
    })
    .join('');
  return `
    <a href="${home ? '#hero' : 'index.html'}" class="site-nav__brand">${esc(profile.name)}</a>
    <div class="site-nav__links">${links}
    </div>
  `;
}

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

// What a screen reader hears for a bar field. The canvas is hidden from
// assistive tech, so without this the field is silent. The label says a message
// is there and where to learn to read it, and never what it says: reading it is
// the point. The dividers in the static HTML carry the same two strings by hand.
export function signalLabel(page) {
  return page.endsWith('decoder.html')
    ? 'A message in Morse code. This page shows how to read it.'
    : 'A message in Morse code. The decoder page shows how to read it.';
}

// The bar field is a div here and a canvas once a script fills it. Everything
// that matters without JavaScript, the name and the links, is plain markup.
export const footer = page => `
    <div class="footer-signal" data-signal="${esc(FINAL)}" role="img" aria-label="${esc(signalLabel(page))}"></div>
    <p>${esc(profile.name)}</p>
    <p>
      <a href="mailto:${esc(profile.email.general)}">Email</a>
      <a href="${esc(profile.links.linkedin)}" target="_blank" rel="noopener">LinkedIn</a>
      <a href="${esc(profile.links.github)}" target="_blank" rel="noopener">GitHub</a>
      <a href="ethics.html">Ethics</a>
    </p>
    ${footerHints(page)}
  `;

// Structured data for search engines, on index.html only: one Person per site,
// on the page that is about him. Built from the same fields as the page so the
// two cannot disagree. It carries only what the page already shows, which is
// why neither email address is in it.
//
// Schools count as alumniOf once finished, so the expected degree is left out.
// SKKU is here as the lab's university instead, since he is still enrolled.
//
// This is script content, not HTML, so esc() is the wrong tool: entities are
// not decoded inside a script and the JSON would carry them literally. The one
// thing that can break out of a script element is a closing tag, so every <
// goes out as the six characters \u003c, which JSON reads back as the same
// character.
//
// Absolute URLs, because a crawler reads this without the page's address to
// resolve against. They match og:url and the canonical links in each <head>.
const SITE_URL = 'https://hi-im-pod.github.io';

// The Person sits inside a ProfilePage, the type Google reads for a page whose
// subject is one person. knowsAbout is the research interest titles, so a name
// shared with other people is tied to this field of work.
export const personJsonLd = () => {
  const current = experience.find(job => job.end === 'Present');
  const person = {
    '@type': 'Person',
    name: profile.name,
    // Left out, not a thrown build, if no role is marked Present between jobs.
    jobTitle: current?.role,
    affiliation: {
      '@type': 'Organization',
      name: 'SecAI Lab',
      parentOrganization: {
        '@type': 'CollegeOrUniversity',
        name: 'Sungkyunkwan University',
        alternateName: 'SKKU',
      },
    },
    alumniOf: education
      .filter(item => !item.period.includes('expected'))
      .map(item => ({ '@type': 'CollegeOrUniversity', name: item.org })),
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/assets/garrett-400.jpg`,
    sameAs: [profile.links.github, profile.links.linkedin],
    knowsAbout: researchInterests.map(item => item.title),
  };
  const page = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: `${SITE_URL}/`,
    mainEntity: person,
  };
  const json = JSON.stringify(page, null, 2).replace(/</g, '\\u003c');
  return `
  <script type="application/ld+json" id="person-jsonld">
${json.replace(/^/gm, '  ')}
  </script>
  `;
};
