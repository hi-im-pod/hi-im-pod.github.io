import { test, expect } from '@playwright/test';

async function waitForSong(page) {
  await expect(async () => {
    const frame = page.frames().find(f => f.url().includes('youtube-nocookie.com/embed'));
    expect(frame, 'YouTube iframe loaded').toBeTruthy();
    const skip = frame.getByRole('button', { name: /^skip$|skip ad|skip ads/i }).first();
    if (await skip.isVisible()) await skip.click({ timeout: 2000 });
    expect(await frame.locator('.ad-showing').count(), 'Wait for the song after any pre-roll').toBe(0);
    const state = await page.evaluate(() => ({ playing: window.__radio?.playing, time: window.__radio?.currentTime }));
    expect(state.playing).toBe(true);
    expect(state.time).toBeGreaterThan(2);
  }).toPass({ timeout: 90_000, intervals: [2000] });
}

test('live YouTube song plays and responds to radio controls', async ({ page, baseURL }) => {
  const errors = [];
  const external = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', req => {
    if (new URL(req.url()).origin !== new URL(baseURL).origin) external.push(req.url());
  });
  await page.goto('/index.html#radio');
  await expect(page.locator('#radio-list button')).toHaveCount(4);
  expect(external, 'No external requests before Play').toEqual([]);
  await page.locator('[data-track="0"]').click();
  await waitForSong(page);
  await expect.poll(() => page.evaluate(() => window.__radio.envelopeSeconds)).toBeGreaterThan(0);
  await expect.poll(() => page.evaluate(() => Math.abs(window.__radio.currentTime - window.__radio.contourTime))).toBeLessThan(0.5);
  await page.locator('#radio-toggle').click();
  await expect.poll(() => page.evaluate(() => window.__radio.playing)).toBe(false);
  await expect.poll(() => page.evaluate(() => window.__radio.playerState)).toBe(2);
  await page.locator('#radio-toggle').click();
  await waitForSong(page);
  await page.locator('#radio-next').click();
  await expect.poll(() => page.evaluate(() => window.__radio.index)).toBe(1);
  await page.locator('#radio-prev').click();
  await expect.poll(() => page.evaluate(() => window.__radio.index)).toBe(0);
  await page.locator('#radio-volume').fill('15');
  await expect(page.locator('#radio-volume')).toHaveValue('15');
  await page.locator('#radio-lock').click();
  await expect(page.locator('#radio-lock')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#radio-lock-note')).toBeVisible();
  await page.locator('#radio-lock').click();
  await expect(page.locator('#radio-lock-note')).toBeHidden();
  expect(errors, 'Uncaught JavaScript errors').toEqual([]);
});
