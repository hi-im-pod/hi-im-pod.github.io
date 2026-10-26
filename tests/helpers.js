import { test as base, expect } from '@playwright/test';

export const test = base.extend({
  page: async ({ page, baseURL }, use) => {
    const errors = [];
    const external = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/*', route => {
      const url = route.request().url();
      if (new URL(url).origin === new URL(baseURL).origin) return route.continue();
      external.push(url);
      return route.abort();
    });
    await use(page);
    expect(errors, 'Uncaught JavaScript errors').toEqual([]);
    expect(external, 'Unexpected external requests').toEqual([]);
  },
});
export { expect };

// Keep the test alphabet independent of the decoder so a mapping regression fails.
const codes = '.- -... -.-. -.. . ..-. --. .... .. .--- -.- .-.. -- -. --- .--. --.- .-. ... - ..- ...- .-- -..- -.-- --..'.split(' ');
export function encode(text) {
  return text.split(' ').map(word => [...word].map(c => codes[c.charCodeAt(0) - 65]).join(' ')).join('  ');
}

export async function enterMessage(page, text, buttons = false) {
  await page.locator('#clear').click();
  const code = encode(text);
  if (buttons) {
    for (const char of code) {
      await page.locator(`[data-add="${char === '.' ? 'dot' : char === '-' ? 'dash' : 'break'}"]`).click();
    }
  } else {
    // Focus must leave Clear: the decoder reserves keyboard events on buttons.
    await page.locator('h1').click();
    await page.keyboard.type(code);
  }
  await expect(page.locator('#output')).toHaveText(text);
}

export async function mockYouTube(page) {
  await page.route('https://www.youtube.com/iframe_api', route => route.fulfill({
    contentType: 'text/javascript',
    body: `(${installPlayer.toString()})();`,
  }));
}

function installPlayer() {
  class Player {
    constructor(id, options) {
      this.options = options;
      this.state = -1;
      this.position = 0;
      this.started = performance.now();
      this.index = 0;
      this.ids = [];
      window.__youtubeTest = this;
      setTimeout(() => options.events.onReady(), 0);
    }
    emit() { this.options.events.onStateChange({ data: this.state }); }
    getCurrentTime() { return this.position + (this.state === 1 ? (performance.now() - this.started) / 1000 : 0); }
    getPlayerState() { return this.reportedState ?? this.state; }
    getDuration() { return 1800; }
    getPlaylist() { return this.ids; }
    getPlaylistIndex() { return this.index; }
    loadPlaylist({ playlist, index }) { this.ids = playlist; this.playVideoAt(index); }
    setLoop(value) { this.loop = value; }
    setVolume(value) { this.volume = value; }
    playVideoAt(index) { this.index = index; this.position = 0; this.started = performance.now(); this.state = 1; this.emit(); }
    pauseVideo() { this.position = this.getCurrentTime(); this.state = 2; this.emit(); }
    playVideo() { this.started = performance.now(); this.state = 1; this.emit(); }
    seekTo(seconds) { this.position = seconds; this.started = performance.now(); this.emit(); }
    finish() { this.playVideoAt((this.index + 1) % this.ids.length); }
  }
  window.YT = { Player };
  window.onYouTubeIframeAPIReady();
}
