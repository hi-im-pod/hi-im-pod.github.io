// Regenerates the <noscript> fallback in index.html and reading.html from
// js/content.js, which stays the single source of truth.
//
//   node tools/build-noscript.mjs          rewrite the blocks
//   node tools/build-noscript.mjs --check  fail if they are stale (no writes)
//
// Run it after editing js/content.js. The site itself still needs no build
// step: this only rewrites committed markup between the marker comments.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { profile, experience, education, researchInterests, projects } from '../js/content.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const START = '<!-- noscript:start -->';
const END = '<!-- noscript:end -->';

const esc = s => String(s)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;');

const NOTE =
  'This page builds its layout and visuals with JavaScript, which is turned off ' +
  'in your browser. Below is the same information as plain text. Turn JavaScript ' +
  'on for the full version.';

function indexBlock() {
  return `<div class="noscript-content">
      <p class="noscript-note">${esc(NOTE)}</p>

      <h1>${esc(profile.name)}</h1>
      <p>${esc(profile.role)}</p>
      <p>${esc(profile.tagline)}</p>

      <h2>About</h2>
      <p>${esc(profile.about)}</p>

      <h2>Experience</h2>
${experience.map(job => `      <h3>${esc(job.role)}, ${esc(job.org)}</h3>
      <p>${esc(job.start)}&ndash;${esc(job.end)}</p>
      <ul>
${job.bullets.map(b => `        <li>${esc(b)}</li>`).join('\n')}
      </ul>`).join('\n')}

      <h2>Education</h2>
${education.map(e => `      <h3>${esc(e.degree)}, ${esc(e.org)}${e.orgKorean ? ` <span lang="ko">${esc(e.orgKorean)}</span>` : ''}</h3>
      <p>${esc(e.period)}</p>
      <p>${esc(e.detail)}</p>`).join('\n')}

      <h2>Research interests</h2>
${researchInterests.map(item => `      <h3>${esc(item.title)}</h3>
      <p>${esc(item.description)}</p>`).join('\n')}
      <p><a href="reading.html">Reading list for these areas</a></p>

      <h2>Projects</h2>
${projects.map(p => `      <h3>${esc(p.title)}</h3>
      <p>${esc(p.description)}</p>
      <p>${esc(p.tags.join(', '))}${p.illustrative ? '. Illustrative example, not real client work.' : ''}</p>`).join('\n')}

      <h2>Contact</h2>
      <p>${esc(profile.lookingFor)}</p>
      <p>Based in ${esc(profile.city)} <span lang="ko">(${esc(profile.cityKorean)})</span>, ${esc(profile.country)}, with a home base in ${esc(profile.homeBase)}.</p>
      <ul>
        <li>Email: <a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a></li>
        <li>LinkedIn: <a href="${esc(profile.links.linkedin)}">${esc(profile.links.linkedin)}</a></li>
        <li>GitHub: <a href="${esc(profile.links.github)}">${esc(profile.links.github)}</a></li>
        <li><a href="${esc(profile.resumeHref)}">Download r&eacute;sum&eacute;</a></li>
      </ul>
    </div>`;
}

function readingBlock() {
  return `<div class="noscript-content">
      <p class="noscript-note">${esc(NOTE)}</p>

      <h1>Reading</h1>
      <p>Published work behind each research interest. Every entry is peer reviewed, at a conference or in a journal. No preprints.</p>

${researchInterests.map(item => {
    const papers = item.reading ?? [];
    return `      <h2>${esc(item.title)}</h2>
      <p>${esc(item.description)}</p>
${item.position ? `      <blockquote><p>${esc(item.position)}</p></blockquote>\n` : ''}${papers.length
      ? `      <ul>
${papers.map(p => `        <li><a href="${esc(p.url)}">${esc(p.title)}</a><br>${esc(p.authors.replace(/\.$/, ''))}. ${esc(p.venue)}, ${esc(p.year)}.</li>`).join('\n')}
      </ul>`
      : '      <p>Nothing listed yet.</p>'}`;
  }).join('\n\n')}

      <p><a href="index.html">Back to the main page</a></p>
    </div>`;
}

function apply(file, block) {
  const path = join(root, file);
  const html = readFileSync(path, 'utf8');
  const start = html.indexOf(START);
  const end = html.indexOf(END);
  if (start === -1 || end === -1) {
    throw new Error(`${file}: missing ${START} / ${END} markers`);
  }
  // Match the file's own line endings. git's autocrlf and most editors leave
  // CRLF here on Windows; emitting LF regardless made --check report stale
  // every time anything else touched the file.
  const crlf = (html.match(/\r\n/g) || []).length;
  const lf = (html.match(/(^|[^\r])\n/g) || []).length;
  const eol = crlf > lf ? '\r\n' : '\n';
  const body = block.replace(/\r?\n/g, eol);
  const next = html.slice(0, start + START.length) + eol + '      ' + body + eol + '      ' + html.slice(end);
  return { path, file, html, next, changed: next !== html };
}

const targets = [apply('index.html', indexBlock()), apply('reading.html', readingBlock())];

if (process.argv.includes('--check')) {
  const stale = targets.filter(t => t.changed).map(t => t.file);
  if (stale.length) {
    console.error(`noscript block is stale in: ${stale.join(', ')}`);
    console.error('run: node tools/build-noscript.mjs');
    process.exit(1);
  }
  console.log('noscript blocks are up to date');
} else {
  for (const t of targets) {
    writeFileSync(t.path, t.next);
    console.log(`${t.changed ? 'updated' : 'unchanged'}  ${t.file}`);
  }
}
