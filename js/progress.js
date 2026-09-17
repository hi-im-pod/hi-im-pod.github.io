// Tracks which of the site's hidden messages have been decoded during this
// visit. Deliberately in memory only: no localStorage, no cookie, nothing on
// disk. Reload the page and it is gone, which is the point. The site makes a
// claim about storing nothing, and this is the one place it would have been
// tempting to make an exception.
//
// It is a game, not a lock. Every message also sits in a data-signal attribute
// for anyone who opens the DOM.

export const TARGETS = [
  'GARRETT ENNIS',
  'ABOUT',
  'EXPERIENCE',
  'EDUCATION',
  'RESEARCH',
  'PROJECTS',
  'CONTACT',
];

const found = new Set();

export function solved() {
  return new Set(found);
}

export function record(text) {
  const word = String(text).trim().toUpperCase().replace(/\s+/g, ' ');
  if (!TARGETS.includes(word) || found.has(word)) return false;
  found.add(word);
  return true;
}

export function allFound() {
  return found.size === TARGETS.length;
}
