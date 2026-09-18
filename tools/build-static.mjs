// Writes the site's content into the HTML files as real markup, from the same
// templates the browser uses.
//
//   node tools/build-static.mjs          rewrite the generated regions
//   node tools/build-static.mjs --check  fail if any is stale (no writes)
//
// Run it after editing js/content.js.
//
// Why the pages are not left empty for JavaScript to fill: <noscript> only
// fires when scripting is disabled, not when a script is blocked or fails. A
// content blocker that stops one file leaves scripting enabled, so the noscript
// fallback stays hidden and the page renders as an empty shell. Measured before
// this existed, index.html came to 68 characters in that state. Link unfurlers
// and crawlers that do not run scripts saw the same 68 characters.
//
// The site still needs no build step to serve. This only rewrites committed
// markup between marker comments, and js/templates.js is the single source both
// this and the browser read, so the two cannot describe different content.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as t from '../js/templates.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const check = process.argv.includes('--check');

// Which generated regions each page carries. The key is the marker name, which
// is also the id of the element it fills.
const PAGES = {
  'index.html': {
    'hero-content': t.hero,
    'about-content': t.about,
    'experience-list': t.experienceList,
    'education-list': t.educationList,
    'research-list': t.researchList,
    'projects-list': t.projectsList,
    'contact-content': t.contact,
    'radio-intro': t.radioLede,
    'radio-list': t.radioTracks,
    'site-footer': () => t.footer('index.html'),
  },
  'reading.html': {
    'reading-content': t.reading,
    'site-footer': () => t.footer('reading.html'),
  },
  'decoder.html': { 'site-footer': () => t.footer('decoder.html') },
  'arrival.html': { 'site-footer': () => t.footer('arrival.html') },
  'ethics.html': { 'site-footer': () => t.footer('ethics.html') },
};

let stale = 0;
let written = 0;

for (const [page, regions] of Object.entries(PAGES)) {
  const path = join(root, page);
  const original = readFileSync(path, 'utf8');
  // Each file's line endings are preserved: git reports the whole file as
  // changed otherwise, and the real edit disappears into the noise.
  const eol = original.includes('\r\n') ? '\r\n' : '\n';
  let next = original;

  for (const [name, html] of Object.entries(regions)) {
    const start = `<!-- gen:${name} -->`;
    const end = `<!-- /gen:${name} -->`;
    const from = next.indexOf(start);
    const to = next.indexOf(end);
    if (from < 0 || to < 0) {
      console.error(`${page}: no markers for ${name}. Expected ${start} ... ${end}`);
      process.exitCode = 1;
      continue;
    }
    const body = html().replace(/\r?\n/g, eol);
    next = next.slice(0, from + start.length) + body + next.slice(to);
  }

  if (next === original) {
    console.log(`unchanged  ${page}`);
    continue;
  }
  if (check) {
    console.error(`STALE      ${page}`);
    stale++;
    continue;
  }
  writeFileSync(path, next);
  console.log(`updated    ${page}`);
  written++;
}

if (check) {
  console.log(stale
    ? `\n${stale} file(s) out of date. Run: node tools/build-static.mjs`
    : '\ngenerated markup is up to date');
  if (stale) process.exitCode = 1;
} else if (!written) {
  console.log('\nnothing to do');
}
