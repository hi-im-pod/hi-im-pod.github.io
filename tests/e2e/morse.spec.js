import { test, expect, enterMessage } from '../helpers.js';
import { TARGETS } from '../../js/progress.js';

test('Morse fields stay above their sections, including with reduced motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const pairs = [
    ['WHOAMI', 'about'], ['ARTIFACTS', 'projects'], ['UPTIME', 'experience'],
    ['TUTELAGE', 'education'], ['INQUIRY', 'research'], ['HANDSHAKE', 'contact'],
  ];
  for (const [signal, section] of pairs) {
    const field = page.locator(`[data-signal="${signal}"]`);
    await expect(field).toHaveCount(1);
    expect(await field.evaluate(el => el.nextElementSibling?.id)).toBe(section);
    await field.scrollIntoViewIfNeeded();
    await expect(field.locator('canvas')).toBeVisible();
    expect(await field.locator('canvas').evaluate(el => el.width > 0 && el.height > 0)).toBe(true);
  }
  expect(await page.locator('[data-signal]:not(.footer-signal)').evaluateAll(els => els.map(el => el.dataset.signal))).toEqual(TARGETS);
  await expect(page.locator('.footer-signal canvas')).toHaveCount(1);
});

test('decoder supports buttons, keyboard, editing, and invalid input', async ({ page }) => {
  await page.goto('/decoder.html');
  await enterMessage(page, 'SOS', true);
  await page.locator('#undo').click();
  await expect(page.locator('#output')).toHaveText('SOI');
  await page.locator('#clear').click();
  await expect(page.locator('#strip')).toHaveText('Nothing read yet.');
  await enterMessage(page, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  await enterMessage(page, 'I SEE YOU');
  await page.keyboard.press('Backspace');
  await expect(page.locator('#output')).toHaveText('I SEE YOI');
  await page.locator('#clear').click();
  await page.locator('h1').click();
  await page.keyboard.type('......');
  await expect(page.locator('#output')).toHaveText('[......?]');
  await expect(page.locator('#hint-unknown')).toBeVisible();
  await page.locator('#clear').click();
  await expect(page.locator('#hint-unknown')).toBeHidden();
});

test('all seven solutions, duplicate handling, footer reward, and reset', async ({ page }) => {
  await page.goto('/decoder.html');
  await expect(page.locator('#progress-reward')).toBeHidden();
  await expect(page.locator('#checklist-done')).toBeHidden();
  for (const [index, message] of TARGETS.entries()) {
    await enterMessage(page, message);
    await expect(page.locator('#progress-count')).toHaveText(`${index + 1} of 7`);
  }
  await expect(page.locator('#progress-list li.is-found')).toHaveCount(7);
  await expect(page.locator('#checklist-done')).toBeVisible();
  await enterMessage(page, TARGETS[0]);
  await expect(page.locator('#progress-count')).toHaveText('7 of 7');
  await enterMessage(page, 'I SEE YOU');
  await page.locator('#progress-reward a').click();
  await expect(page).toHaveURL(/\/arrival\.html$/);
  await page.goto('/decoder.html');
  await expect(page.locator('#progress-count')).toHaveText('0 of 7');
  await enterMessage(page, 'RADIO');
  await page.reload();
  await expect(page.locator('#radio-reward')).toBeHidden();
  await expect(page.locator('#progress-reward')).toBeHidden();
});

test('RADIO solution opens the hidden section without contacting YouTube', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#radio')).toHaveCount(0);
  await expect(page.locator('#radio-controls')).toHaveCount(0);
  await page.goto('/decoder.html');
  await expect(page.locator('#radio-reward')).toBeHidden();
  await enterMessage(page, 'RADIO', true);
  await page.locator('#radio-reward a').click();
  await expect(page).toHaveURL(/index\.html#radio$/);
  await expect(page.locator('#radio-list button')).toHaveCount(4);
  expect(await page.locator('[data-signal="RADIO"]').evaluate(el => el.nextElementSibling?.id)).toBe('radio');
  await expect(page.locator('#radio-controls')).toBeHidden();
  await page.goto('/decoder.html');
  await page.goto('/');
  await expect(page.locator('#radio')).toHaveCount(0);
});
