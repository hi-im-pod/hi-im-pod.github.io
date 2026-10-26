import { test, expect, mockYouTube } from '../helpers.js';

test('radio playback, playlist, volume, contour clock, and bar controls', async ({ page }) => {
  await mockYouTube(page);
  const apiRequests = [];
  page.on('request', req => { if (req.url().includes('/iframe_api')) apiRequests.push(req.url()); });
  await page.goto('/index.html#radio');
  expect(apiRequests).toHaveLength(0);
  await page.locator('[data-track="0"]').click();
  await expect(page.locator('#radio-toggle')).toHaveText('Pause');
  await expect.poll(() => page.evaluate(() => window.__radio.envelopeSeconds)).toBeGreaterThan(0);
  expect(await page.evaluate(() => ({ queued: window.__radio.queued, volume: window.__youtubeTest.volume, loop: window.__youtubeTest.loop })))
    .toEqual({ queued: 4, volume: 70, loop: true });
  await expect.poll(() => page.evaluate(() => Math.abs(window.__radio.currentTime - window.__radio.contourTime))).toBeLessThan(0.5);

  // The deployed player has reported -1 while its clock advances.
  await page.evaluate(() => { window.__youtubeTest.reportedState = -1; });
  await expect.poll(() => page.evaluate(() => window.__radio.currentTime)).toBeGreaterThan(1);
  await expect(page.locator('#radio-toggle')).toHaveText('Pause');
  await page.locator('#radio-toggle').click();
  await expect(page.locator('#radio-toggle')).toHaveText('Play');
  const paused = await page.evaluate(() => window.__radio.currentTime);
  await page.locator('#radio-lock').click();
  await expect(page.locator('#radio-lock')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#radio-lock-note')).toBeVisible();
  expect(await page.evaluate(() => window.__radio.currentTime)).toBe(paused);
  await page.locator('#radio-lock').click();
  await expect(page.locator('#radio-lock')).toHaveAttribute('aria-pressed', 'false');
  await expect(page.locator('#radio-lock-note')).toBeHidden();
  await page.locator('#radio-volume').fill('15');
  expect(await page.evaluate(() => window.__youtubeTest.volume)).toBe(15);
  await page.locator('#radio-toggle').click();
  await expect(page.locator('#radio-toggle')).toHaveText('Pause');

  for (const [control, index] of [['#radio-next', 1], ['#radio-prev', 0], ['#radio-prev', 3], ['#radio-next', 0], ['[data-track="2"]', 2]]) {
    await page.locator(control).click();
    await expect(page.locator(`[data-track="${index}"]`)).toHaveAttribute('aria-current', 'true');
    expect(await page.evaluate(() => window.__radio.index)).toBe(index);
  }
  await page.evaluate(() => window.__youtubeTest.finish());
  await expect(page.locator('[data-track="3"]')).toHaveAttribute('aria-current', 'true');
  await page.evaluate(() => window.__youtubeTest.finish());
  await expect(page.locator('[data-track="0"]')).toHaveAttribute('aria-current', 'true');
  expect(apiRequests).toHaveLength(1);
});

test('blocked YouTube API reports a useful error', async ({ page }) => {
  await page.route('https://www.youtube.com/iframe_api', route => route.abort());
  await page.goto('/index.html#radio');
  await page.locator('[data-track="0"]').click();
  await expect(page.locator('#radio-status')).toContainText('The YouTube player could not be loaded.');
  await expect(page.locator('#radio-controls')).toBeHidden();
});
