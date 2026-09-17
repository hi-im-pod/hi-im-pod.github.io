// Turns an audio file into the loudness contour the bar fields animate from.
//
//   node tools/build-envelope.mjs <audio file> <output.bin> [--bands 32] [--fps 30]
//
// Why this exists: the radio plays through YouTube's iframe, which is a
// different origin, so the Web Audio API cannot reach its audio to analyse it
// live. Same-origin policy treats sound as content, and rightly so. Instead we
// analyse the track once here and ship only the result.
//
// What ships is a spectrum contour, a few tens of kilobytes of magnitudes, not
// audio. The source file is read from wherever it sits and is never copied into
// the repo.
//
// Needs ffmpeg on PATH for decoding. Everything after that is in this file, so
// the repo takes no dependency to build one of these.

import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';

const [input, output, ...rest] = process.argv.slice(2);
if (!input || !output) {
  console.error('usage: node tools/build-envelope.mjs <audio file> <output.bin> [--bands N] [--fps N]');
  process.exit(1);
}
const opt = (name, fallback) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 ? Number(rest[i + 1]) : fallback;
};

// 24 bands is more resolution than the widest bar field (36 bars) needs once
// interpolated, and 20fps interpolates to 60 without visible stepping. Each
// pair costs bands*fps bytes per second of audio, so 32 at 30fps would be
// 960 B/s, or 230 KB for a four-minute track. This is 480 B/s, about 115 KB.
const BANDS = opt('bands', 24);
const FPS = opt('fps', 20);
const RATE = 22050;        // plenty: the top band we draw is well under 11 kHz
const FFT_SIZE = 2048;     // ~93ms at this rate, the usual analyser trade-off
const DB_FLOOR = -62;      // below this a band reads as silent

// ffmpeg gives us mono 16-bit PCM on stdout. Downmixing is correct here: the
// bars are one row, not a stereo field.
const raw = execFileSync('ffmpeg', [
  '-v', 'error', '-i', input,
  '-f', 's16le', '-acodec', 'pcm_s16le', '-ac', '1', '-ar', String(RATE), '-',
], { maxBuffer: 1 << 30 });

const samples = new Float32Array(raw.length / 2);
for (let i = 0; i < samples.length; i++) samples[i] = raw.readInt16LE(i * 2) / 32768;
const durationMs = Math.round((samples.length / RATE) * 1000);

// Iterative radix-2 Cooley-Tukey, in place. Small enough to keep here rather
// than take a dependency for one function.
function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (-2 * Math.PI) / len;
    const wRe = Math.cos(ang), wIm = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let curRe = 1, curIm = 0;
      for (let k = 0; k < len / 2; k++) {
        const aRe = re[i + k], aIm = im[i + k];
        const bRe = re[i + k + len / 2] * curRe - im[i + k + len / 2] * curIm;
        const bIm = re[i + k + len / 2] * curIm + im[i + k + len / 2] * curRe;
        re[i + k] = aRe + bRe; im[i + k] = aIm + bIm;
        re[i + k + len / 2] = aRe - bRe; im[i + k + len / 2] = aIm - bIm;
        const nextRe = curRe * wRe - curIm * wIm;
        curIm = curRe * wIm + curIm * wRe;
        curRe = nextRe;
      }
    }
  }
}

// Hann, precomputed once rather than per frame.
const window = new Float32Array(FFT_SIZE);
for (let i = 0; i < FFT_SIZE; i++) {
  window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (FFT_SIZE - 1)));
}

// Log-spaced band edges from 40 Hz up. Linear bins would give almost every band
// to the top two octaves, where music has the least to say.
const nyquist = RATE / 2;
const lowHz = 40;
const edges = [];
for (let b = 0; b <= BANDS; b++) {
  const hz = lowHz * Math.pow(nyquist / lowHz, b / BANDS);
  edges.push(Math.min(FFT_SIZE / 2 - 1, Math.max(1, Math.round((hz / nyquist) * (FFT_SIZE / 2)))));
}

const hop = Math.round(RATE / FPS);
const frames = Math.max(1, Math.floor((samples.length - FFT_SIZE) / hop));
const data = new Uint8Array(frames * BANDS);

const re = new Float64Array(FFT_SIZE);
const im = new Float64Array(FFT_SIZE);

for (let f = 0; f < frames; f++) {
  const start = f * hop;
  for (let i = 0; i < FFT_SIZE; i++) {
    re[i] = samples[start + i] * window[i];
    im[i] = 0;
  }
  fft(re, im);

  for (let b = 0; b < BANDS; b++) {
    const from = edges[b];
    const to = Math.max(from + 1, edges[b + 1]);
    let peak = 0;
    for (let k = from; k < to; k++) {
      const mag = Math.hypot(re[k], im[k]) / (FFT_SIZE / 2);
      if (mag > peak) peak = mag;
    }
    const db = 20 * Math.log10(peak + 1e-9);
    const norm = Math.max(0, Math.min(1, (db - DB_FLOOR) / -DB_FLOOR));
    data[f * BANDS + b] = Math.round(norm * 255);
  }
}

// Stretch each band across its own observed range, rather than scaling the
// whole contour by one number.
//
// Absolute magnitude is the wrong thing for a bar to show. Music carries far
// more energy at 45 Hz than at 10 kHz, so on raw magnitudes the low bars clip
// while the high ones never leave the bottom of the column: measured on the
// first track, the top band peaked at 152 of 255 across the entire song, so
// that bar could not reach beyond 9 rows of 15 however loud the cymbals got.
// Normalising per band gives every bar the full column.
//
// This is per band over the whole track, not per frame, so the arrangement
// survives: a quiet intro still sits low everywhere, a drop still fills the
// field. It removes the fixed spectral tilt, not the dynamics.
//
// Percentiles rather than min and max, so one transient does not set the
// ceiling for three minutes of music.
const stretched = [];
for (let b = 0; b < BANDS; b++) {
  const col = new Uint8Array(frames);
  for (let f = 0; f < frames; f++) col[f] = data[f * BANDS + b];
  const sorted = Uint8Array.from(col).sort();
  const lo = sorted[Math.floor(frames * 0.03)];
  const hi = sorted[Math.floor(frames * 0.97)];

  // A band with nothing going on in it is left alone. Stretching one would
  // promote its noise floor to a dancing bar.
  if (hi - lo < 20) continue;

  const scale = 255 / (hi - lo);
  for (let f = 0; f < frames; f++) {
    const i = f * BANDS + b;
    data[i] = Math.max(0, Math.min(255, Math.round((data[i] - lo) * scale)));
  }
  stretched.push(b);
}

// Self-describing, so the manifest carries a path and nothing that could drift
// out of step with the file it points at.
const header = Buffer.alloc(16);
header.write('ENVL', 0, 'ascii');
header.writeUInt8(1, 4);
header.writeUInt8(BANDS, 5);
header.writeUInt8(FPS, 6);
header.writeUInt8(0, 7);
header.writeUInt32LE(frames, 8);
header.writeUInt32LE(durationMs, 12);

writeFileSync(output, Buffer.concat([header, Buffer.from(data)]));

const kb = (16 + data.length) / 1024;
console.log(`${output}`);
console.log(`  ${BANDS} bands x ${frames} frames at ${FPS}fps`);
console.log(`  ${(durationMs / 1000).toFixed(1)}s of audio -> ${kb.toFixed(1)} KB`);
console.log(`  ${stretched.length} of ${BANDS} bands normalised to their own range`
  + `${stretched.length < BANDS ? `, ${BANDS - stretched.length} left alone as too quiet to stretch` : ''}`);
