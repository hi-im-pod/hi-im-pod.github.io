import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/live',
  workers: 1,
  timeout: 180_000,
  forbidOnly: !!process.env.CI,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.LIVE_BASE_URL || 'https://hi-im-pod.github.io',
    browserName: 'chromium',
    channel: process.env.PLAYWRIGHT_CHANNEL || undefined,
    viewport: { width: 1440, height: 900 },
    launchOptions: { args: ['--mute-audio'] },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
