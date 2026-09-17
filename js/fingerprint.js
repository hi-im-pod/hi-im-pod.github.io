import { renderFooter, renderDividers } from './shared.js';
import { createWaveform } from './waveform.js';

// Everything here is read from the browser itself. No request leaves the page,
// and the location panel a server would be needed for is deliberately absent.

const FONTS = [
  'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Comic Sans MS',
  'Impact', 'Trebuchet MS', 'Verdana', 'Tahoma', 'Lucida Console', 'Cambria',
  'Segoe UI', 'Calibri', 'Consolas', 'Helvetica Neue', 'Menlo', 'Optima',
];

function installedFonts() {
  const probe = document.createElement('span');
  probe.textContent = 'mmmmmmmmmmlli';
  probe.style.cssText = 'position:absolute;left:-9999px;top:-9999px;font-size:72px;white-space:nowrap';
  document.body.appendChild(probe);

  const baselines = {};
  for (const generic of ['monospace', 'sans-serif', 'serif']) {
    probe.style.fontFamily = generic;
    baselines[generic] = probe.offsetWidth;
  }

  const present = FONTS.filter(name => {
    for (const generic of ['monospace', 'sans-serif', 'serif']) {
      probe.style.fontFamily = `"${name}",${generic}`;
      if (probe.offsetWidth !== baselines[generic]) return true;
    }
    return false;
  });

  probe.remove();
  return present;
}

function gpu() {
  try {
    const gl = document.createElement('canvas').getContext('webgl')
      || document.createElement('canvas').getContext('experimental-webgl');
    if (!gl) return null;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    if (!ext) return gl.getParameter(gl.RENDERER) || null;
    return gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) || null;
  } catch {
    return null;
  }
}

function platform() {
  const ua = navigator.userAgent;
  const os = /Windows NT 10/.test(ua) ? 'Windows'
    : /Mac OS X/.test(ua) ? 'macOS'
    : /Android/.test(ua) ? 'Android'
    : /iPhone|iPad/.test(ua) ? 'iOS'
    : /Linux/.test(ua) ? 'Linux' : 'an operating system it did not name';
  const browser = /Edg\//.test(ua) ? 'Edge'
    : /OPR\//.test(ua) ? 'Opera'
    : /Firefox\//.test(ua) ? 'Firefox'
    : /Chrome\//.test(ua) ? 'Chrome'
    : /Safari\//.test(ua) ? 'Safari' : 'an unnamed browser';
  return { os, browser };
}

// A short code standing in for everything above, rendered in the same Morse
// the rest of the site uses. Letters only, so the decoder can read it.
function signature(parts) {
  let hash = 2166136261;
  for (const ch of parts.join('␟')) {
    hash ^= ch.charCodeAt(0);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  let out = '';
  for (let i = 0; i < 5; i++) {
    out += String.fromCharCode(65 + (hash % 26));
    hash = Math.floor(hash / 26) + 7919;
  }
  return out;
}

function panel(id, value, prose) {
  return `
    <div class="fp-panel">
      <h2>${id}</h2>
      <p class="fp-value">${value}</p>
      <p class="fp-prose">${prose}</p>
    </div>
  `;
}

async function build() {
  const root = document.getElementById('fp-content');
  const { os, browser } = platform();

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'not reported';
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const screenText = `${screen.width}×${screen.height} at ${window.devicePixelRatio || 1}x, ${screen.colorDepth}-bit colour`;
  const renderer = gpu();
  const fonts = installedFonts();
  const langs = navigator.languages?.length ? navigator.languages.join(', ') : (navigator.language || 'not reported');
  const cores = navigator.hardwareConcurrency;
  const memory = navigator.deviceMemory;
  const touch = navigator.maxTouchPoints || 0;
  const scheme = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const motion = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'reduced motion' : 'full motion';
  const dnt = navigator.doNotTrack === '1' || window.doNotTrack === '1' ? 'sending Do Not Track' : 'not sending Do Not Track';

  let quota = null;
  try {
    if (navigator.storage?.estimate) {
      const est = await navigator.storage.estimate();
      if (est.quota) quota = `${(est.quota / 1e9).toFixed(1)} GB`;
    }
  } catch { /* not offered */ }

  const panels = [];

  panels.push(panel('When you arrived',
    `${now} · ${tz}`,
    'Your device named its own timezone before the page finished loading, without being asked. ' +
    'A timezone plus a visit time narrows down where in the world you are and when you are awake. ' +
    'It is sent by every page you open.'));

  panels.push(panel('What you are reading on',
    `${browser} on ${os} · ${screenText}`,
    'Browser, operating system, screen size and colour depth all arrive unprompted. ' +
    'None of these identify you on their own. The point of fingerprinting is that they are ' +
    'combined, and the combination narrows fast.'));

  if (renderer) {
    panels.push(panel('What renders this page',
      String(renderer),
      'This string comes from your graphics hardware through WebGL, and it needs no permission. ' +
      'It suggests the make, the generation, and roughly the cost of your machine. ' +
      'It is one of the strongest single signals available to a page.'));
  }

  if (fonts.length) {
    panels.push(panel('What you carry',
      fonts.join(' · '),
      `Of ${FONTS.length} typefaces this page checked for, your device has these. Fonts accumulate ` +
      'with the software you install, so the set tends to say something about what you use a computer for. ' +
      'Checking costs nothing but measuring the width of some text.'));
  }

  panels.push(panel('What you speak', langs,
    'Your language preferences ride along in the header of every request your browser makes, ' +
    'in order. The order matters: a second and third language says more than the first one does.'));

  const hardware = [
    cores ? `${cores} logical cores` : null,
    memory ? `about ${memory} GB of memory` : null,
    touch ? `${touch} touch points` : 'no touch input',
  ].filter(Boolean).join(' · ');
  panels.push(panel('What your machine has', hardware,
    'Rough hardware shape, offered without a prompt. Useful to a site for deciding how much work ' +
    'to hand your device, and equally useful for telling one visitor apart from another.'));

  panels.push(panel('What you allow',
    `${navigator.cookieEnabled ? 'Cookies enabled' : 'Cookies blocked'} · ${scheme} mode · ${motion}` +
    (quota ? ` · ${quota} of storage offered` : '') + ` · ${dnt}`,
    'Your interface preferences are readable, which is a small thing that is also a stable thing. ' +
    (quota ? `Your browser would let this page write ${quota} to your disk. This page wrote nothing. ` : '') +
    'Do Not Track is advisory, and most sites ignore it, which is why it tells a site more about you than it protects.'));

  const code = signature([tz, screenText, renderer ?? '', fonts.join(), langs, String(cores), String(memory), scheme]);
  panels.push(`
    <div class="fp-panel">
      <h2>All of it, as one code</h2>
      <p class="fp-value fp-code">${code}</p>
      <div class="divider fp-signature" data-signature></div>
      <p class="fp-prose">Those bars are the same code, written the same way as the rest of this site.
        You can check it on the <a href="decoder.html">decoder</a>. It is derived from the values above and
        nothing else, it is computed in your browser, and it is not sent anywhere or written down.
        Change your window size and it changes. That instability is the honest part: a real
        fingerprinting service uses signals chosen to stay still.</p>
    </div>
  `);

  root.innerHTML = panels.join('');

  const sig = root.querySelector('[data-signature]');
  if (sig) createWaveform(sig, { animated: true, parallax: false, height: 90, signal: code, reflection: true });
}

function init() {
  renderFooter();
  renderDividers();
  build();
}

document.addEventListener('DOMContentLoaded', init);
