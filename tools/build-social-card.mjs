// Renders the image a link preview shows, using the site's own type, palette
// and bar field, so a shared link looks like the page it points at.
//
//   node tools/build-social-card.mjs
//
// Needs playwright available (npx playwright install chromium) and the site
// served locally, by default on port 8788. Run it only when the name, the
// tagline or the palette changes; the PNG is committed and nothing at runtime
// depends on this script.
//
// 1200x630 is the size LinkedIn, Slack and X all read, and the one they crop
// least. Text sits inside the middle 80% because several of them crop the
// edges at some sizes.

import { writeFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { chromium } from 'playwright';
import { profile } from '../js/content.js';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BASE = process.argv[2] ?? 'http://localhost:8788';
const out = join(root, 'assets', 'social-card.png');

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="css/fonts.css">
<link rel="stylesheet" href="css/tokens.css">
<style>
  html, body { margin: 0; padding: 0; width: 1200px; height: 630px; overflow: hidden; }
  body {
    background: var(--color-ink);
    color: var(--color-text-primary);
    font-family: var(--font-body);
    display: flex; flex-direction: column; justify-content: center;
    padding: 0 7rem;
    box-sizing: border-box;
    position: relative;
  }
  /* The same aurora the hero sits in. */
  body::before {
    content: ''; position: absolute; inset: -10%; z-index: 0; opacity: 0.5; filter: blur(10px);
    background-image:
      radial-gradient(38rem 26rem at 12% 18%, var(--color-pink-glow), transparent 60%),
      radial-gradient(34rem 24rem at 88% 12%, var(--color-signal-glow), transparent 60%);
  }
  .field { position: relative; z-index: 1; margin-bottom: 2.5rem; }
  .role {
    position: relative; z-index: 1;
    font-family: var(--font-mono); color: var(--color-pink); font-size: 1.35rem; margin: 0 0 0.75rem;
  }
  h1 {
    position: relative; z-index: 1;
    font-family: var(--font-display); font-weight: 700; font-size: 5.2rem; line-height: 1; margin: 0 0 1.25rem;
    background: linear-gradient(100deg, var(--color-pink) 0%, var(--color-lavender) 45%, var(--color-signal) 100%);
    -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
  }
  .tagline {
    position: relative; z-index: 1;
    font-size: 1.6rem; color: var(--color-text-muted); margin: 0; max-width: 46rem;
  }
  canvas { filter: drop-shadow(0 0 7px var(--color-pink-glow)); }
</style></head>
<body>
  <div class="field" id="field"></div>
  <p class="role">${profile.role}</p>
  <h1>${profile.name}</h1>
  <p class="tagline">${profile.tagline}</p>
  <script type="module">
    import { createWaveform } from './js/waveform.js';
    // Not animated: a still frame sits every bar at the top of its band, which
    // is the most legible the message ever is.
    createWaveform(document.getElementById('field'), {
      animated: false, parallax: false, height: 150, signal: 'GARRETT ENNIS', reflection: true,
    });
    window.__ready = true;
  </script>
</body></html>`;

// Served from the site's own origin rather than handed to setContent. A page
// built that way has no origin, so its module import of waveform.js is blocked
// and nothing draws. The scratch file is removed either way.
const scratch = join(root, '.social-card.html');
writeFileSync(scratch, html);

const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
  await page.goto(`${BASE}/.social-card.html`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__ready === true, { timeout: 15000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  mkdirSync(join(root, 'assets'), { recursive: true });
  var buf = await page.screenshot({ type: 'png' });
  writeFileSync(out, buf);
} finally {
  await browser.close();
  unlinkSync(scratch);
}

console.log(`wrote assets/social-card.png, ${(buf.length / 1024).toFixed(0)} KB, 1200x630`);
