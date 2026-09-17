import { renderFooter, renderDividers } from './shared.js';
import { TARGETS, FINAL, solved, record, allFound, finalFound } from './progress.js';

const MORSE = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
  'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
  'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
  'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..',
};
const FROM_MORSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]));

// Each entry is one bar you have read off the page.
let bars = [];

function decode() {
  const letters = [];
  let current = '';
  for (const bar of bars) {
    if (bar === 'break') {
      letters.push(current);
      current = '';
    } else {
      current += bar === 'dash' ? '-' : '.';
    }
  }
  letters.push(current);

  // An empty group sits between two breaks in a row, which is a word space.
  // Leading and trailing ones are just stray taps, so they come back off.
  return letters
    .map(l => (l === '' ? ' ' : (FROM_MORSE[l] ?? `[${l}?]`)))
    .join('')
    .replace(/ {2,}/g, ' ')
    .replace(/^ +| +$/g, '');
}

function symbolStrip() {
  return bars
    .map(b => (b === 'dash' ? '—' : b === 'dot' ? '•' : '|'))
    .join(' ');
}

// Boxes are drawn with CSS rather than typed as a glyph. The obvious
// character for this, U+25AF, sits outside the latin subsets we bundle, so it
// fell through to whatever the visitor's system happened to offer, and on a
// machine without it that is a tofu box.
function mask(word) {
  return word
    .split('')
    .map(c => (c === ' ' ? '<span class="blank-gap"></span>' : '<span class="blank"></span>'))
    .join('');
}

function renderProgress() {
  const list = document.getElementById('progress-list');
  if (!list) return;
  const have = solved();

  list.innerHTML = TARGETS.map(word => `
    <li class="${have.has(word) ? 'is-found' : ''}">
      <span class="progress-word">${have.has(word) ? word : mask(word)}</span>
    </li>
  `).join('');

  document.getElementById('progress-count').textContent = `${have.size} of ${TARGETS.length}`;
  document.getElementById('checklist-done').hidden = !allFound();

  // The eighth message is shown as a shape until it is read: the number of
  // words and the length of each, which is what a cryptogram gives you.
  const done = finalFound();
  const slot = document.getElementById('final-word');
  slot.innerHTML = done ? FINAL : mask(FINAL);
  slot.parentElement.classList.toggle('is-found', done);
  document.getElementById('progress-reward').hidden = !done;
}

function render() {
  const strip = document.getElementById('strip');
  const out = document.getElementById('output');

  strip.textContent = bars.length ? symbolStrip() : 'Nothing read yet.';
  strip.classList.toggle('is-empty', bars.length === 0);

  const text = decode();
  const unknown = /\[/.test(text);
  out.textContent = bars.length ? text : '—';
  out.classList.toggle('has-unknown', unknown);

  document.getElementById('hint-unknown').hidden = !unknown;

  if (!unknown && record(text)) renderProgress();
}

function push(kind) {
  bars.push(kind);
  render();
}

function init() {
  renderFooter();
  renderDividers();
  renderProgress();

  document.querySelectorAll('[data-add]').forEach(btn => {
    btn.addEventListener('click', () => push(btn.dataset.add));
  });
  document.getElementById('undo').addEventListener('click', () => {
    bars.pop();
    render();
  });
  document.getElementById('clear').addEventListener('click', () => {
    bars = [];
    render();
  });

  // typing works too, for anyone who would rather use a keyboard
  document.addEventListener('keydown', e => {
    if (e.target.matches('button')) return;
    if (e.key === '.') push('dot');
    else if (e.key === '-') push('dash');
    else if (e.key === ' ') { e.preventDefault(); push('break'); }
    else if (e.key === 'Backspace') { bars.pop(); render(); }
    else return;
  });

  render();
}

document.addEventListener('DOMContentLoaded', init);
