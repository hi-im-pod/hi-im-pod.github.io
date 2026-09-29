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
    // In <head>, and written here only. The browser does not re-apply it:
    // crawlers read the static file, and nothing on the page reads it back.
    'person-jsonld': t.personJsonLd,
    'site-nav': () => t.nav('index.html'),
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
    'site-nav': () => t.nav('reading.html'),
    'reading-content': t.reading,
    'site-footer': () => t.footer('reading.html'),
  },
  'work.html': {
    'site-nav': () => t.nav('work.html'),
    'work-content': t.work,
    'site-footer': () => t.footer('work.html'),
  },
  'resume.html': {
    'site-nav': () => t.nav('resume.html'),
    'resume-content': t.resume,
    'site-footer': () => t.footer('resume.html'),
  },
  '404.html': {
    'site-nav': () => t.nav('404.html'),
    'site-footer': () => t.footer('404.html'),
  },
  'decoder.html': {
    'site-nav': () => t.nav('decoder.html'),
    'site-footer': () => t.footer('decoder.html'),
  },
  'arrival.html': {
    'site-nav': () => t.nav('arrival.html'),
    'site-footer': () => t.footer('arrival.html'),
  },
  'ethics.html': {
    'site-nav': () => t.nav('ethics.html'),
    'site-footer': () => t.footer('ethics.html'),
  },
};

let stale = 0;
let written = 0;
let broken = 0;
let unsafe = 0;

// esc() stops a value from becoming markup, but it leaves a URL's scheme alone,
// so a javascript: link in content.js would reach the page intact. Every href
// and src the templates write must be https, mailto, or a path on this site
// (no scheme at all). Anything else fails the build and the page is not
// written. Mixed case and leading spaces still count, because browsers strip
// the spaces and ignore the case.
const SAFE_URL = /^(?:https:|mailto:|[^:]*$)/i;
const unsafeUrls = html =>
  [...html.matchAll(/\b(?:href|src)="([^"]*)"/g)].map(m => m[1]).filter(url => !SAFE_URL.test(url));

for (const [page, regions] of Object.entries(PAGES)) {
  let badLinks = 0;
  let missing = 0;
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
      missing++;
      continue;
    }
    const body = html().replace(/\r?\n/g, eol);
    for (const url of unsafeUrls(body)) {
      console.error(`UNSAFE     ${page} ${name}: link scheme not allowed: ${url}`);
      badLinks++;
    }
    next = next.slice(0, from + start.length) + body + next.slice(to);
  }

  if (badLinks) {
    unsafe += badLinks;
    continue;
  }

  // Reported before the unchanged/stale check, and never as "unchanged". A page
  // whose markers are gone produces bytes identical to the ones already on disk,
  // so it looked untouched and the run still summarised as up to date while
  // exiting non-zero. A missing marker is the exact failure this tool exists to
  // name, so it cannot be the one thing the summary stays quiet about.
  if (missing) {
    console.error(`BROKEN     ${page}: ${missing} region(s) have no markers, nothing written for them`);
    broken += missing;
    continue;
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

const problems = [];
if (broken) problems.push(`${broken} region(s) have no markers`);
if (unsafe) problems.push(`${unsafe} link(s) with a scheme other than https: or mailto:, nothing written for those pages`);
if (stale) problems.push(`${stale} file(s) out of date, run: node tools/build-static.mjs`);

if (problems.length) {
  console.error(`\n${problems.join('\n')}`);
  process.exitCode = 1;
} else if (check) {
  console.log('\ngenerated markup is up to date');
} else if (!written) {
  console.log('\nnothing to do');
}
