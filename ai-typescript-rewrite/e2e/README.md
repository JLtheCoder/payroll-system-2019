# End-to-end tests (Playwright)

This workspace holds the **browser** end-to-end tests. They launch the real app
in a real browser, drive the UI like a user would (upload a CSV through the form)
and assert on what renders. That is different from the two Vitest layers:

| Layer          | Where                       | What it exercises                 |
| -------------- | --------------------------- | --------------------------------- |
| Unit           | `server/tests/services/`    | pure business logic               |
| Integration    | `server/tests/integration/` | the Express API (via `supertest`) |
| **E2E (here)** | `e2e/tests/`                | **browser + UI + API + database** |

## What Playwright is

[Playwright](https://playwright.dev) is a test runner that automates real
browsers (Chromium, Firefox, WebKit). You write a test that says "go to this
page, click this button, expect this text". The nice parts:

- **Auto-waiting** — assertions like `toBeVisible()` retry until they pass or
  time out, so you rarely write manual sleeps.
- **User-facing locators** — you find elements by role/label/text, the way a user
  sees them, not by brittle CSS selectors.
- **Batteries included** — screenshots, videos, traces, and an interactive UI
  mode for debugging.
- **Manages the app for you** — it can start your server before the tests and
  stop it afterwards (see `webServer` below).

## First-time setup

Download the browser (one time, ~120 MB):

```bash
npm run e2e:install          # from the repo root
```

## Running the tests

```bash
# from the repo root
npm run test:e2e                         # headless, all specs
npm run test:e2e:headed -w @payroll/e2e  # watch it happen in a browser window
npm run test:e2e:ui     -w @payroll/e2e  # interactive "UI mode" (recommended)
```

To make a headed run **slow enough to follow**, set `PW_SLOWMO` (milliseconds of
delay after each action):

```bash
# Windows PowerShell
$env:PW_SLOWMO='700'; npm run test:e2e:headed -w @payroll/e2e
# macOS / Linux
PW_SLOWMO=700 npm run test:e2e:headed -w @payroll/e2e
```

From inside `e2e/`, the Playwright CLI is even more flexible:

```bash
npx playwright test                       # all specs
npx playwright test tests/payroll.spec.ts # a single file
npx playwright test -g "duplicate"        # only tests whose title matches
npx playwright test --debug               # step through with the inspector
npx playwright test --trace on            # record a trace for every test
npx playwright show-report                # open the last HTML report
```

## How the app gets started

You do **not** start the server yourself. `playwright.config.ts` declares a
`webServer`:

```ts
webServer: {
  command: 'npm run e2e:serve', // build client -> reset e2e db -> start API
  cwd: '..',                    // run from the repo root
  url: 'http://localhost:8081',
  reuseExistingServer: false,
  timeout: 120_000,
  env: { DATABASE_URL: 'file:./prisma/e2e.db' },
}
```

Before the first test, Playwright runs `npm run e2e:serve`, which:

1. builds the client (`client/dist`),
2. recreates the dedicated test database `server/prisma/e2e.db`,
3. starts the API, which serves the built SPA **and** the API on port `8081`.

Playwright waits until `http://localhost:8081` is up, runs the tests, then shuts
the server down. Because the app uses its own `e2e.db`, your `dev.db` is never
touched.

> ⚠️ `reuseExistingServer` is `false`, so if a dev server is already using port
> `8081` the run fails. Stop `npm run dev` before running the e2e tests.

## Anatomy of a test

Here is a trimmed version of `tests/payroll.spec.ts`:

```ts
import { expect, test, type Page } from '@playwright/test';

async function uploadCsv(page: Page, csv: string, filename: string) {
  await page.goto('/'); // relative to `use.baseURL`
  await page.setInputFiles('#csv', {
    name: filename,
    mimeType: 'text/csv',
    buffer: Buffer.from(csv),
  });
  await page.getByRole('button', { name: 'Submit' }).click();
}

test('uploads a time report and renders the payroll report', async ({ page }) => {
  await uploadCsv(page, csvForReport('my-report'), 'report.csv');

  const table = page.getByRole('table');
  await expect(table).toBeVisible();
  await expect(table).toContainText('1/11/2016 - 15/11/2016');
  await expect(table).toContainText('$200.00');
});
```

Things to notice:

- **`test('...', async ({ page }) => …)`** — `page` is a fixture Playwright gives
  you: one isolated browser tab per test.
- **`page.goto('/')`** — `use.baseURL` is `http://localhost:8081`, so you use
  relative paths.
- **`setInputFiles`** — uploads a file. Passing `{ name, mimeType, buffer }` lets
  us generate the CSV in code (no fixture file needed).
- **`getByRole(...).click()`** — finds the button a user would see and clicks it.
- **`expect(...).toContainText(...)`** — retries until the text appears or times
  out (default 5s), so you don't need to wait for the network.

## Locators: how to find elements

Prefer locators that match how a user perceives the page. Roughly in order of
preference:

| Locator                     | Finds                                  | Example here                              |
| --------------------------- | -------------------------------------- | ----------------------------------------- |
| `getByRole(role, { name })` | buttons, links, headings, table cells  | `getByRole('button', { name: 'Submit' })` |
| `getByLabel(text)`          | form fields by their `<label>`         | `getByLabel('Report')`                    |
| `getByText(text)`           | visible text                           | `getByText('$200.00')`                    |
| `getByPlaceholder(text)`    | inputs by placeholder                  | —                                         |
| `getByTestId(id)`           | `data-testid` attributes (last resort) | —                                         |

Locators are **lazy**: `getByRole('table')` describes _how_ to find the element
and is re-evaluated on each use. Combine them to scope a search:

```ts
const table = page.getByRole('table');
await expect(table.getByRole('columnheader', { name: 'Amount Paid' })).toBeVisible();
await expect(table).toContainText('$150.00');
```

## Common actions and assertions

```ts
await page.goto('/'); // navigate (relative)
await page.getByRole('link', { name: 'Payroll Report' }).click();
await page.getByLabel('Report').selectOption('43'); // <select>
await page.setInputFiles('#csv', { name, mimeType, buffer });
await page.getByRole('button', { name: 'Submit' }).click();

await expect(page.getByRole('table')).toBeVisible();
await expect(page.getByRole('alert')).toContainText('same report id');
await expect(locator).toHaveCount(2);
await expect(input).toHaveValue('43');
```

## Debugging a failing test

1. Run with `--headed` to watch, or `--debug` to pause and step with the built-in
   inspector (each action waits for you to click "step over").
2. Run `npm run test:e2e:ui -w @payroll/e2e` for **UI mode** — a time-travel UI
   where you can rewind each step and inspect the DOM.
3. Add `await page.pause();` anywhere in a test to stop there (works with
   `--headed`).
4. On failure, Playwright saves artifacts to `test-results/` and an HTML report
   to `playwright-report/`. Open a trace with
   `npx playwright show-trace test-results/<...>/trace.zip`.

## Writing a new test

1. Add a `*.spec.ts` file under `e2e/tests/`.
2. `import { expect, test } from '@playwright/test';`
3. Give each test its own data. Because all tests share one running server and
   database, our tests use a **unique report id per test** (see `uniqueReportId()`
   in `tests/payroll.spec.ts`) instead of relying on order or cleanup.
4. Prefer role/label locators. If a control is hard to target, add a
   `data-testid` to the component and use `getByTestId`.
5. Run it with `npx playwright test -g "your test title"`.

## Configuration highlights

`playwright.config.ts`:

- `testDir: './tests'` — where specs live.
- `workers: 1`, `fullyParallel: false` — the specs share a single server/DB, so
  they run serially.
- `projects: [{ name: 'chromium', … }]` — add Firefox/WebKit here to broaden
  coverage (and `npx playwright install firefox`).
- `trace: 'on-first-retry'`, `retries: process.env.CI ? 1 : 0` — keep CI runs
  resilient and debuggable.

## Gotchas

- **Install the browser first.** Without it you'll get
  "Executable doesn't exist…" — run `npm run e2e:install`.
- **One shared database.** Don't assume a clean DB between tests; use unique ids.
- **Don't run `npm run dev` at the same time** — the e2e run needs port `8081`.
- **`echo`/logging is noisy.** The server logs the expected `409` when a test
  checks duplicate uploads; that's not a failure.
- Playwright is a browser tool — it's slower than Vitest. Keep fast logic in unit
  and integration tests, and reserve e2e for the critical user journeys.
