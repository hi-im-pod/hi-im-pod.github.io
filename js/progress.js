// Tracks which of the site's hidden messages have been decoded during this
// visit. Deliberately in memory only: no localStorage, no cookie, nothing on
// disk. Reload the page and it is gone, which is the point. The site makes a
// claim about storing nothing, and this is the one place it would have been
// tempting to make an exception.
//
// It is a game, not a lock. Every message also sits in a data-signal attribute
// for anyone who opens the DOM.

// The seven fields on the main page each name the section below them. They are
// a way to check your reading, not a puzzle: you already know the answer before
// you start, which is what makes them useful for practice.
export const TARGETS = [
  'GARRETT ENNIS',
  'ABOUT',
  'EXPERIENCE',
  'EDUCATION',
  'RESEARCH',
  'PROJECTS',
  'CONTACT',
];

// This one is the puzzle. It names no section, sits in the footer of every
// page, and is the only message that opens anything. Reading the seven first
// is a reasonable way to learn the alphabet, but it is not required.
export const FINAL = 'I SEE YOU';

const found = new Set();
let finalSolved = false;

export function solved() {
  return new Set(found);
}

export function record(text) {
  const word = String(text).trim().toUpperCase().replace(/\s+/g, ' ');
  if (word === FINAL) {
    if (finalSolved) return false;
    finalSolved = true;
    return true;
  }
  if (!TARGETS.includes(word) || found.has(word)) return false;
  found.add(word);
  return true;
}

export function allFound() {
  return found.size === TARGETS.length;
}

export function finalFound() {
  return finalSolved;
}
