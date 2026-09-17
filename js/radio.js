// The radio. Plays through YouTube's iframe and drives the site's bar fields
// from a precomputed spectrum contour.
//
// Two things shape the design:
//
// Nothing reaches Google until the visitor asks. The API script is injected on
// the first press of play, not on page load, so the privacy claim on the ethics
// page stays literally true for anyone who never touches the radio.
//
// The bars cannot read the audio. A cross-origin iframe's sound is content, and
// the same-origin policy will not hand it over, which is correct: a page that
// could read audio out of a frame could read pictures out of one too. So we
// analyse each track offline and play the contour back in step with the
// player's own clock.

import { setLevelSource, setFreeRange } from './waveform.js';
import { playlist, radioIntro } from './playlist.js';

const API_SRC = 'https://www.youtube.com/iframe_api';

let player = null;          // the YT.Player once it exists
let apiLoading = null;      // promise, so two fast clicks load the script once
let current = -1;
let playing = false;
let volume = 70;

// --- the spectrum contour -------------------------------------------------

const envelopes = new Map();   // url -> {bands, fps, frames, data} or null

async function loadEnvelope(url) {
  if (!url) return null;
  if (envelopes.has(url)) return envelopes.get(url);

  let parsed = null;
  try {
    const buf = await (await fetch(url)).arrayBuffer();
    const head = new DataView(buf);
    const magic = String.fromCharCode(head.getUint8(0), head.getUint8(1), head.getUint8(2), head.getUint8(3));
    if (magic !== 'ENVL') throw new Error('not an envelope file');
    parsed = {
      bands: head.getUint8(5),
      fps: head.getUint8(6),
      frames: head.getUint32(8, true),
      data: new Uint8Array(buf, 16),
    };
  } catch {
    // A missing or malformed contour is not worth breaking playback over. The
    // bars simply go back to their own timing.
    parsed = null;
  }
  envelopes.set(url, parsed);
  return parsed;
}

// Where playback is, without asking the player every frame. getCurrentTime is
// coarse and polling it at 60fps is wasteful, so we anchor to it a few times a
// second and run on the local clock in between.
let anchor = { at: 0, seconds: 0 };
let live = null;

function setAnchor(seconds) {
  anchor = { at: performance.now(), seconds };
}

function elapsed() {
  if (!playing) return anchor.seconds;
  return anchor.seconds + (performance.now() - anchor.at) / 1000;
}

// Smoothed band levels, recomputed once per animation frame rather than once
// per bar: every field on the page asks for levels, and they all want the same
// spectrum stretched across their own width.
let frameStamp = -1;
const smoothed = new Float32Array(64);

function updateBands(t) {
  const env = live;
  const position = elapsed() * env.fps;
  const f0 = Math.min(env.frames - 1, Math.max(0, Math.floor(position)));
  const f1 = Math.min(env.frames - 1, f0 + 1);
  const mix = position - f0;

  for (let b = 0; b < env.bands; b++) {
    const a = env.data[f0 * env.bands + b];
    const c = env.data[f1 * env.bands + b];
    // A contrast curve on top of the per-band normalisation in the builder.
    // Normalising gives every bar the whole column; this is what makes it
    // actually travel, by deepening the troughs while leaving the peaks where
    // they are. Without it a dense mix keeps every band busy enough that bars
    // hover in the upper half and never visibly drop between hits.
    const target = ((a + (c - a) * mix) / 255) ** 1.7;

    // Rise almost immediately, fall away more slowly. This is what makes a
    // meter read as a meter rather than as a graph: the peak stays legible for
    // a moment after the transient that caused it.
    smoothed[b] = target > smoothed[b]
      ? smoothed[b] + (target - smoothed[b]) * 0.55
      : smoothed[b] + (target - smoothed[b]) * 0.18;
  }
  frameStamp = t;
}

function level(i, barCount, t) {
  if (!playing || !live) return null;
  if (t !== frameStamp) updateBands(t);

  // Stretch the spectrum across however many bars this field has, low
  // frequencies on the left, so every field on the page moves together.
  const p = barCount > 1 ? i / (barCount - 1) : 0;
  const x = p * (live.bands - 1);
  const b0 = Math.floor(x);
  const b1 = Math.min(live.bands - 1, b0 + 1);
  return smoothed[b0] + (smoothed[b1] - smoothed[b0]) * (x - b0);
}

// --- the YouTube player ---------------------------------------------------

function loadApi() {
  if (window.YT?.Player) return Promise.resolve();
  if (apiLoading) return apiLoading;

  apiLoading = new Promise((resolve, reject) => {
    // The API calls this global when it is ready. There is no other hook.
    window.onYouTubeIframeAPIReady = resolve;
    const s = document.createElement('script');
    s.src = API_SRC;
    s.onerror = () => reject(new Error('the YouTube player could not be loaded'));
    document.head.appendChild(s);
  });
  return apiLoading;
}

function createPlayer(index) {
  return new Promise(resolve => {
    player = new window.YT.Player('radio-player', {
      videoId: playlist[index].id,
      // The privacy-enhanced domain. It is a reduction, not a fix: it defers
      // cookies until playback, but Google is still handed the visitor's
      // address and user agent either way. The ethics page says so plainly
      // rather than treating this as a solution.
      host: 'https://www.youtube-nocookie.com',
      playerVars: { playsinline: 1, rel: 0, modestbranding: 1 },
      events: {
        onReady: () => {
          player.setVolume(volume);
          player.playVideo();
          resolve();
        },
        onStateChange: e => {
          const YT = window.YT.PlayerState;
          playing = e.data === YT.PLAYING;
          if (playing) setAnchor(player.getCurrentTime());
          else if (player.getCurrentTime) setAnchor(player.getCurrentTime());
          if (e.data === YT.ENDED) skip(1);
          paint();
        },
        onError: () => {
          status('That track would not play. Trying the next one.');
          skip(1);
        },
      },
    });
  });
}

// Re-anchor a few times a second. Between these the local clock carries the
// contour, which is what keeps it smooth across a 60fps redraw.
function startTracking() {
  setInterval(() => {
    if (playing && player?.getCurrentTime) setAnchor(player.getCurrentTime());
  }, 250);
}

// --- playback -------------------------------------------------------------

async function play(index) {
  const track = playlist[index];
  if (!track) return;
  current = index;
  live = null;
  status('Loading the player from YouTube…');

  try {
    await loadApi();
  } catch {
    status('The YouTube player could not be loaded. A blocker or a network rule may be stopping it.');
    return;
  }

  if (!player) {
    await createPlayer(index);
    startTracking();
  } else {
    player.loadVideoById(track.id);
  }

  document.getElementById('radio-stage').hidden = false;
  document.getElementById('radio-controls').hidden = false;
  status('');
  live = await loadEnvelope(track.envelope);
  paint();
}

function toggle() {
  if (!player) return play(current < 0 ? 0 : current);
  if (playing) player.pauseVideo();
  else player.playVideo();
}

function skip(by) {
  const next = (current + by + playlist.length) % playlist.length;
  play(next);
}

// --- rendering ------------------------------------------------------------

function status(text) {
  const el = document.getElementById('radio-status');
  el.textContent = text;
  el.hidden = !text;
}

// Alongside window.__activeWaveforms, for diagnostics.html and for checking
// that the contour and the video actually agree on how long the track is. A
// visualiser built from a different master than the one playing drifts further
// out of step the longer it runs, and nothing on screen would say why.
function publishState() {
  window.__radio = {
    playing,
    track: playlist[current]?.title ?? null,
    videoSeconds: player?.getDuration?.() ?? null,
    envelopeSeconds: live ? live.frames / live.fps : null,
  };
}

function paint() {
  publishState();
  document.querySelectorAll('#radio-list li').forEach((li, i) => {
    li.classList.toggle('is-current', i === current);
    const btn = li.querySelector('button');
    btn.setAttribute('aria-current', i === current ? 'true' : 'false');
  });

  const toggleBtn = document.getElementById('radio-toggle');
  toggleBtn.textContent = playing ? 'Pause' : 'Play';
  toggleBtn.setAttribute('aria-label', playing ? 'Pause' : 'Play');

  const now = document.getElementById('radio-now');
  const track = playlist[current];
  now.textContent = track ? `${track.title} — ${track.artist}` : '';
}

export function initRadio() {
  const root = document.getElementById('radio');
  if (!root || !playlist.length) return;

  document.getElementById('radio-intro').textContent = radioIntro;

  document.getElementById('radio-list').innerHTML = playlist.map((t, i) => `
    <li>
      <button type="button" data-track="${i}">
        <span class="radio-track-title">${t.title}</span>
        <span class="radio-track-artist">${t.artist}</span>
      </button>
    </li>
  `).join('');

  root.querySelectorAll('[data-track]').forEach(btn => {
    btn.addEventListener('click', () => play(Number(btn.dataset.track)));
  });

  document.getElementById('radio-toggle').addEventListener('click', toggle);
  document.getElementById('radio-prev').addEventListener('click', () => skip(-1));
  document.getElementById('radio-next').addEventListener('click', () => skip(1));

  // Held in memory like everything else here, so it is locked again on the next
  // page and on reload. Nothing about a visit is written down.
  let unlocked = false;
  const lock = document.getElementById('radio-lock');
  lock.addEventListener('click', () => {
    unlocked = !unlocked;
    setFreeRange(unlocked);
    lock.textContent = unlocked ? 'Lock bars' : 'Unlock bars';
    lock.setAttribute('aria-pressed', String(unlocked));
    document.getElementById('radio-lock-note').hidden = !unlocked;
  });

  const vol = document.getElementById('radio-volume');
  vol.value = volume;
  vol.addEventListener('input', () => {
    volume = Number(vol.value);
    player?.setVolume(volume);
  });

  setLevelSource(level);
  paint();
}
