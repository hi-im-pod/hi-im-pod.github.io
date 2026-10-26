import { test, expect, mockYouTube } from '../helpers.js';

for (const placement of ['pre-roll', 'mid-song']) {
  for (const clock of ['moving', 'frozen']) {
    test(`${placement}: bars resync after an ad with a ${clock} clock and no state event`, async ({ page }) => {
      await mockYouTube(page, placement === 'pre-roll' ? { preRoll: clock } : {});
      await page.goto('/index.html#radio');
      await page.locator('[data-track="0"]').click();
      await expect.poll(() => page.evaluate(() => window.__radio.envelopeSeconds)).toBeGreaterThan(0);

      if (placement === 'mid-song') {
        await expect(page.locator('#radio-toggle')).toHaveText('Pause');
        await page.evaluate(() => window.__youtubeTest.seekTo(90));
        await expect.poll(() => page.evaluate(() => window.__radio.contourTime)).toBeGreaterThanOrEqual(90);
        await page.evaluate(mode => window.__youtubeTest.beginAd(mode, 90), clock);
      }

      const resumeAt = placement === 'pre-roll' ? 0 : 90;
      // Give the 250 ms tracker several ticks before ending even a frozen ad.
      await expect.poll(() => page.evaluate(() => performance.now() - window.__youtubeTest.ad.started)).toBeGreaterThan(1000);
      if (clock === 'moving') {
        // An ad clock far from the song makes a retained offset observable.
        await expect.poll(() => page.evaluate(() => window.__radio.currentTime)).toBeGreaterThan(21);
        await expect.poll(() => page.evaluate(() => window.__radio.contourTime)).toBeGreaterThan(20);
        await expect.poll(() => page.evaluate(() => window.__radio.contourTime)).toBeLessThan(30);
      } else {
        await expect.poll(() => page.evaluate(() => window.__radio.playing)).toBe(false);
        expect(await page.evaluate(() => window.__radio.currentTime)).toBe(resumeAt);
      }

      await page.evaluate(() => window.__youtubeTest.endAd());
      await expect(async () => {
        const state = await page.evaluate(() => ({
          playing: window.__radio.playing,
          time: window.__radio.currentTime,
          contour: window.__radio.contourTime,
          playerState: window.__radio.playerState,
          index: window.__radio.index,
        }));
        expect(state.playing).toBe(true);
        expect(state.playerState).toBe(-1);
        expect(state.index).toBe(0);
        expect(state.time).toBeGreaterThan(resumeAt);
        expect(state.contour).not.toBeNull();
        expect(Math.abs(state.time - state.contour)).toBeLessThan(0.15);
      }).toPass({ timeout: 1500, intervals: [100] });

      // Recovery must persist as music advances, not just match at one instant.
      await expect.poll(() => page.evaluate(() => window.__radio.currentTime)).toBeGreaterThan(resumeAt + 2);
      const drift = await page.evaluate(() => Math.abs(window.__radio.currentTime - window.__radio.contourTime));
      expect(drift).toBeLessThan(0.15);
      await expect(page.locator('#radio-toggle')).toHaveText('Pause');
      await expect(page.locator('[data-track="0"]')).toHaveAttribute('aria-current', 'true');
    });
  }
}
