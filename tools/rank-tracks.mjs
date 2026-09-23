// Ranks the radio's tracks by how much dead air each one has, and says whether
// js/playlist.js is in that order.
//
//   node tools/rank-tracks.mjs
//
// The bars are the reason the radio exists, so the running order is chosen to
// put the liveliest material where a visitor is most likely to be watching.
// Dead air is the share of a track that sits under half its own average level:
// seconds where the field barely moves and there is nothing to look at.
//
// Measured from the committed contours, so it needs no audio and runs in a
// second. Run it after adding a track, then reorder the list to match.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { playlist } from '../js/playlist.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function measure(file) {
  const buf = readFileSync(join(root, file));
  if (buf.toString('ascii', 0, 4) !== 'ENVL') throw new Error(`${file} is not a contour`);
  const bands = buf.readUInt8(5);
  const fps = buf.readUInt8(6);
  const frames = buf.readUInt32LE(8);
  const data = buf.subarray(16);

  const level = new Float64Array(frames);
  for (let f = 0; f < frames; f++) {
    let sum = 0;
    for (let b = 0; b < bands; b++) sum += data[f * bands + b];
    level[f] = sum / bands;
  }
  const mean = level.reduce((a, c) => a + c, 0) / frames;

  // How often the spectrum moves hard from one frame to the next, which is
  // what a viewer reads as the bars reacting rather than idling.
  let busy = 0;
  for (let f = 1; f < frames; f++) {
    let d = 0;
    for (let b = 0; b < bands; b++) d += Math.abs(data[f * bands + b] - data[(f - 1) * bands + b]);
    if (d / bands > 22) busy++;
  }

  return {
    seconds: frames / fps,
    still: level.filter(v => v < mean * 0.45).length / fps,
    changes: busy / (frames / fps),
  };
}

const rows = playlist.map((track, i) => ({ i, track, ...measure(track.envelope) }));

console.log('current order:\n');
console.log('  #  track                              length   still  change');
console.log('  ' + '-'.repeat(62));
for (const r of rows) {
  console.log(`  ${r.i}  ${r.track.title.slice(0, 33).padEnd(34)}`
    + `${r.seconds.toFixed(0).padStart(5)}s`
    + `${r.still.toFixed(0).padStart(7)}s`
    + `${r.changes.toFixed(1).padStart(8)}/s`);
}

const wanted = [...rows].sort((a, b) => a.still - b.still);
const already = wanted.every((r, n) => r.i === n);

console.log(`\ntotal running time: ${Math.round(rows.reduce((a, r) => a + r.seconds, 0) / 60)} minutes`);

if (already) {
  console.log('\nthe list is in order: least dead air first.');
} else {
  console.log('\nout of order. Least dead air first would be:\n');
  wanted.forEach((r, n) => console.log(`  ${n}  ${r.track.title}   (${r.still.toFixed(0)}s still)`));
  console.log('\nReorder js/playlist.js to match, then run tools/build-static.mjs.');
  process.exitCode = 1;
}
