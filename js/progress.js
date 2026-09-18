// Tracks which of the site's hidden messages have been decoded during this
// visit. Deliberately in memory only: no localStorage, no cookie, nothing on
// disk. Reload the page and it is gone, which is the point. The site makes a
// claim about storing nothing, and this is the one place it would have been
// tempting to make an exception.
//
// It is a game, not a lock. Every message also sits in a data-signal attribute
// for anyone who opens the DOM.

// The seven fields on the main page, in the order they appear.
//
// Only the header says what you would expect. The rest used to spell the
// heading they sit above, which meant the answer was written underneath in
// plain English and reading one confirmed something you already knew. Each now
// names its section sideways instead: a synonym, or the word that trade would
// use. Nothing gives them away from position alone.
export const TARGETS = [
  'GARRETT ENNIS',
  'WHOAMI',      // About
  'UPTIME',      // Experience
  'TUTELAGE',    // Education
  'INQUIRY',     // Research
  'ARTIFACTS',   // Projects
  'HANDSHAKE',   // Contact
];

// This one is the puzzle. It names no section, sits in the footer of every
// page, and is the only message that opens anything. Reading the seven first
// is a reasonable way to learn the alphabet, but it is not required.
export const FINAL = 'I SEE YOU';

// Names a section the front page does not build until it is asked for. Unlike
// the two above it is not hidden anywhere to be found: the decoder page says
// the word outright, so the work is encoding it rather than spotting it.
export const HIDDEN_SECTION = 'RADIO';

const found = new Set();
let finalSolved = false;
let sectionSolved = false;

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
  if (word === HIDDEN_SECTION) {
    if (sectionSolved) return false;
    sectionSolved = true;
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

export function sectionFound() {
  return sectionSolved;
}
