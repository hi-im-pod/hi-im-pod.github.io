// Downloads the webfonts this site uses and writes a local @font-face sheet,
// so no request goes to Google when someone opens a page.
//
//   node tools/fetch-fonts.mjs
//
// Re-run only to change weights or pick up a font revision. The output
// (assets/fonts/ and css/fonts.css) is committed, so a normal build needs
// nothing and the site stays a pile of static files.

import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'assets', 'fonts');

const SPEC = 'family=Archivo:wght@400;600;700'
  + '&family=IBM+Plex+Mono:wght@400;500'
  + '&family=IBM+Plex+Sans:wght@400;500;600'
  // 400 for body copy, 700 to match the h3 weight in base.css. Those are the
  // only two weights Korean text is set at, and every extra weight is another
  // full set of chunks.
  + '&family=IBM+Plex+Sans+KR:wght@400;700';

// Only the ranges this site's text actually needs. Latin-ext covers the
// accents in "résumé"; the Cyrillic, Greek and Vietnamese subsets Google
// also serves would be dead weight.
const WANTED_SUBSETS = ['latin', 'latin-ext'];

// Google ships the Korean face as ~94 chunks per weight, split by
// unicode-range, and labels none of them. Downloading all of them would cost
// several megabytes to render eight syllables, so keep only the chunks that
// cover Hangul this site actually renders. Re-run this script after adding
// Korean text and the needed chunks come down with it.
const KOREAN_FAMILY = 'IBM Plex Sans KR';

function hangulInSource() {
  const files = [join(root, 'js', 'content.js')]
    .concat(readdirSync(root).filter(f => f.endsWith('.html')).map(f => join(root, f)));
  const found = new Set();
  for (const f of files) {
    for (const ch of readFileSync(f, 'utf8')) {
      const cp = ch.codePointAt(0);
      // Hangul syllables, plus the Jamo blocks in case a name uses them.
      if ((cp >= 0xac00 && cp <= 0xd7a3) || (cp >= 0x1100 && cp <= 0x11ff)
        || (cp >= 0x3130 && cp <= 0x318f)) found.add(cp);
    }
  }
  return found;
}

// "U+ac00-ac01, U+ff03" -> does it contain any of `points`?
function rangeCovers(spec, points) {
  for (const part of spec.split(',')) {
    const t = part.trim();
    const one = /^U\+([0-9a-fA-F]+)$/.exec(t);
    const span = /^U\+([0-9a-fA-F]+)-([0-9a-fA-F]+)$/.exec(t);
    const lo = one ? parseInt(one[1], 16) : span ? parseInt(span[1], 16) : null;
    const hi = one ? lo : span ? parseInt(span[2], 16) : null;
    if (lo === null) continue;
    for (const p of points) if (p >= lo && p <= hi) return true;
  }
  return false;
}

// Needs `pip install fonttools brotli`. Failing here is better than silently
// shipping the unsubsetted chunks, which are an order of magnitude larger.
function subsetInPlace(path, unicodes) {
  execFileSync('python', [
    '-m', 'fontTools.subset', path,
    `--unicodes=${unicodes.replace(/U\+/g, '')}`,
    '--flavor=woff2',
    '--layout-features=',
    `--output-file=${path}`,
  ], { stdio: ['ignore', 'ignore', 'inherit'] });
}

const korean = hangulInSource();
console.log(`Hangul characters found in source: ${korean.size}`
  + (korean.size ? ` (${[...korean].map(c => String.fromCodePoint(c)).join('')})` : ''));

// A modern UA, otherwise Google serves ttf instead of woff2.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
  + '(KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

const css = await (await fetch(`https://fonts.googleapis.com/css2?${SPEC}&display=swap`, {
  headers: { 'User-Agent': UA },
})).text();

// Google labels the Latin @font-face blocks with a /* subset */ comment above
// them. The Korean chunks get no comment, so the label is optional here and
// those blocks are selected by unicode-range instead.
const blocks = [];
const re = /(?:\/\*\s*([\w-]+)\s*\*\/\s*)?(@font-face\s*\{[^}]+\})/g;
let m;
while ((m = re.exec(css)) !== null) blocks.push({ subset: m[1], block: m[2] });

mkdirSync(outDir, { recursive: true });

const kept = [];
let bytes = 0;

for (const { subset, block } of blocks) {
  const family = /font-family:\s*'([^']+)'/.exec(block)?.[1];
  const weight = /font-weight:\s*(\d+)/.exec(block)?.[1];
  const style = /font-style:\s*(\w+)/.exec(block)?.[1] ?? 'normal';
  const url = /url\((https:[^)]+\.woff2)\)/.exec(block)?.[1];
  const range = /unicode-range:\s*([^;]+);/.exec(block)?.[1];
  if (!family || !weight || !url) continue;

  const isKorean = family === KOREAN_FAMILY;
  const wanted = isKorean
    ? range && rangeCovers(range, korean)
    : WANTED_SUBSETS.includes(subset);
  if (!wanted) continue;

  // Latin files are named for their subset; Korean ones for the chunk number
  // Google gives them, which is the only thing distinguishing them.
  const tag = isKorean ? `c${/\.(\d+)\.woff2$/.exec(url)?.[1] ?? '0'}` : subset;
  const file = `${family.toLowerCase().replace(/\s+/g, '-')}-${weight}-${tag}.woff2`;
  const path = join(outDir, file);
  const data = Buffer.from(await (await fetch(url, { headers: { 'User-Agent': UA } })).arrayBuffer());
  writeFileSync(path, data);

  // A Korean chunk arrives holding a few hundred syllables, of which this site
  // uses one or two. Cutting each chunk to the glyphs actually rendered took
  // the Korean payload from 109 KB to 16 KB, so it is worth the
  // fontTools dependency on this generator; the output is committed and the
  // site itself still builds from nothing.
  let finalRange = range;
  if (isKorean) {
    finalRange = [...korean].filter(cp => rangeCovers(range, [cp]))
      .map(cp => `U+${cp.toString(16)}`).join(', ');
    subsetInPlace(path, finalRange);
  }

  const size = statSync(path).size;
  bytes += size;
  console.log(`  ${(size / 1024).toFixed(1).padStart(6)} KB  ${file}`);

  kept.push({ family, weight, style, file, range: finalRange });
}

const sheet = `/* Generated by tools/fetch-fonts.mjs. Do not edit by hand.
   Self-hosted so that opening a page sends no request to Google.
   Archivo and IBM Plex are both under the SIL Open Font License 1.1;
   see assets/fonts/README.txt. */

${kept.map(f => `@font-face {
  font-family: '${f.family}';
  font-style: ${f.style};
  font-weight: ${f.weight};
  font-display: swap;
  src: url('../assets/fonts/${f.file}') format('woff2');${f.range ? `
  unicode-range: ${f.range};` : ''}
}`).join('\n\n')}
`;

writeFileSync(join(root, 'css', 'fonts.css'), sheet);

writeFileSync(join(outDir, 'README.txt'),
  `Fonts used by this site, self-hosted so that no request goes to a third party.

Archivo
  Copyright (c) Omnibus-Type
  SIL Open Font License 1.1
  https://fonts.google.com/specimen/Archivo

IBM Plex Sans, IBM Plex Mono and IBM Plex Sans KR
  Copyright (c) IBM Corp.
  SIL Open Font License 1.1
  https://github.com/IBM/plex

Only the Korean chunks covering Hangul this site renders are included, not the
whole Korean face. Adding Korean text means re-running tools/fetch-fonts.mjs.

The SIL Open Font License 1.1 is at https://openfontlicense.org.
Files here were fetched by tools/fetch-fonts.mjs and are unmodified.
`);

console.log(`\n${kept.length} files, ${(bytes / 1024).toFixed(0)} KB total`);
console.log('wrote css/fonts.css and assets/fonts/README.txt');
