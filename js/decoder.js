import { renderFooter, renderDividers } from './shared.js';

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
}

function push(kind) {
  bars.push(kind);
  render();
}

function init() {
  renderFooter();
  renderDividers();

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
