import { defineConfig, devices } from '@playwright/test';

const PORT = 8081;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests',
  // One worker: the tests share a single running server/database.
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    // Set PW_SLOWMO=700 (ms) to slow down headed runs so you can watch.
    launchOptions: {
      slowMo: process.env.PW_SLOWMO ? Number(process.env.PW_SLOWMO) : 0,
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Builds the client, resets a dedicated e2e SQLite DB, then starts the API,
    // which serves the built SPA and the API on one port. See the root
    // `e2e:serve` script.
    command: 'npm run e2e:serve',
    cwd: '..',
    url: baseURL,
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      DATABASE_URL: 'file:./prisma/e2e.db',
    },
  },
});
