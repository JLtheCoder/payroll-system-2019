# Payroll System — TypeScript

A TypeScript rewrite of the [2019 hand-written payroll system](../2019-hand-written),
with modern libraries and tooling. It accepts time-report CSVs, archives the raw
timekeeping data, and generates a biweekly payroll report that can be viewed
without re-uploading.

- **API:** Express 5 + Prisma 7 (SQLite locally, Postgres supported)
- **Frontend:** React 19 + Vite 8 + react-router 7 + Tailwind CSS 4
- **Language:** TypeScript throughout (ESM, strict mode)
- **Tests:** Vitest (unit + integration) · Playwright (browser e2e)
- **Formatting:** Prettier · **Linting:** ESLint

This is an npm **workspaces** monorepo: one install, one lockfile, and shared
dependencies hoisted to the root.

```text
ai-typescript-rewrite/
├── package.json          # workspace root (shared scripts + dev tooling)
├── server/               # @payroll/server — Express + Prisma API
│   ├── src/  tests/  tsconfig.json  vitest.config.ts
│   └── prisma/           # schema.prisma, migrations/, dev.db + e2e.db (git-ignored)
├── client/               # @payroll/client — React + Vite frontend
│   ├── src/  index.html  vite.config.ts
│   └── dist/             # built by `vite build` (git-ignored, served by the API)
└── e2e/                  # @payroll/e2e — Playwright browser tests
    ├── tests/  playwright.config.ts
    └── README.md         # Playwright guide
```

## Requirements

- Node.js **20+** (developed on Node 24)
- npm

## Quick start

```bash
# 1. install every workspace (single install + lockfile; generates Prisma Client)
npm install

# 2. create the local SQLite database (first run only)
npm run db:migrate

# 3. start the API and the Vite dev server together
npm run dev
```

Then open <http://localhost:5173>. The Vite dev server proxies `/api` calls to
the Express server on <http://localhost:8081>.

To run the built app instead:

```bash
npm run build
npm start
```

Open <http://localhost:8081>. The Express API runs from source via `tsx` and
serves the built SPA from `client/dist`.

### Configuration

Copy `server/.env.example` to `server/.env` and adjust as needed:

| Variable       | Purpose                                                                        |
| -------------- | ------------------------------------------------------------------------------ |
| `PORT`         | API port (default `8081`)                                                      |
| `NODE_ENV`     | `production` disables verbose logging                                          |
| `DATABASE_URL` | SQLite file URL (default `file:./prisma/dev.db`), or a Postgres connection URL |

> **Production note:** apply committed migrations with `npm run db:deploy`
> before starting the server. To use Postgres, set `provider = "postgresql"` in
> `server/prisma/schema.prisma` and swap the driver adapter for
> `@prisma/adapter-pg`.

## Scripts

| Command                    | Description                                 |
| -------------------------- | ------------------------------------------- |
| `npm run dev`              | API (`:8081`) + client (`:5173`) together   |
| `npm run dev:server`       | API only, watch mode (`tsx`)                |
| `npm run dev:client`       | Vite dev server only                        |
| `npm run build`            | Typecheck the API, then build the client    |
| `npm start`                | Run the API from source (`tsx src/app.ts`)  |
| `npm run db:migrate`       | Create + apply migrations (dev)             |
| `npm run db:deploy`        | Apply committed migrations                  |
| `npm run db:studio`        | Open Prisma Studio                          |
| `npm test`                 | Vitest unit + integration (server & client) |
| `npm run test:integration` | Only the server API integration tests       |
| `npm run test:e2e`         | Playwright browser end-to-end tests         |
| `npm run e2e:install`      | Download the Playwright Chromium browser    |
| `npm run typecheck`        | `tsc --noEmit` in every workspace           |
| `npm run format`           | Format the repo with Prettier               |
| `npm run format:check`     | Verify formatting (use in CI)               |
| `npm run lint`             | Lint the repo with ESLint                   |
| `npm run lint:fix`         | Lint and auto-fix                           |

Scope any command to a single workspace with `-w`:

```bash
npm run build -w @payroll/server
npm run dev   -w @payroll/client
npm install   some-dep -w @payroll/server
```

## Architecture

The API (`server/src/`) keeps the original layered design:

```
routes  ->  controllers  ->  services  ->  data access  ->  models
```

| Layer           | Responsibility                                                        |
| --------------- | --------------------------------------------------------------------- |
| **Routes**      | HTTP routing, request logging (`morgan`), the error handler           |
| **Controllers** | Request shaping, validation, status codes, delegating to services     |
| **Services**    | Business logic: parsing, normalisation, pay-period maths, aggregation |
| **Data access** | Prisma queries, mapped to domain types                                |
| **Models**      | Prisma schema (`server/prisma/schema.prisma`)                         |

Database-touching services are built with dependency injection
(`createSaveUploadId(dataAccess)`), so they can be unit-tested with a fake data
access object. Pure functions are exported directly.

## API

```
POST /api/payroll/report   upload a time-report CSV (field name: `csv`)
GET  /api/reports           list uploaded reports
GET  /api/report/:reportId  fetch a generated report
```

`POST /api/payroll/report` is a middleware pipeline: `multer` receives the file,
`validateCsvFile` parses it into `res.locals`, and `createReport` generates and
stores the report. Uploading a duplicate report id returns `409`.

Example response:

```json
{
  "data": [
    { "employee_id": 1, "pay_period": "1/11/2016 - 15/11/2016", "amount_paid": 150 },
    { "employee_id": 1, "pay_period": "16/11/2016 - 30/11/2016", "amount_paid": 220 }
  ]
}
```

A ready-to-use example lives at `sample.csv` (report id `43`).

## Database

Prisma models are defined in `server/prisma/schema.prisma` (mapped to the same
snake_case tables/columns as the original):

- **ReportUpload** (`report_upload`) — one row per uploaded report;
  `csv_report_id` is unique so duplicate uploads are rejected.
- **PayrollData** (`payroll_data`) — every parsed timekeeping row, for archival.
- **ReportData** (`report_data`) — the generated report, cached so it can be
  served directly.

`PayrollData` and `ReportData` each belong to a `ReportUpload`. Schema changes
are versioned as SQL under `server/prisma/migrations/`.

## Testing

```bash
npm test                       # unit + integration (server and client)
npm test -w @payroll/server    # server: unit + integration
npm test -w @payroll/client    # client (Vitest + jsdom)
npm run test:integration       # server API integration tests only
npm run test:e2e               # browser end-to-end tests (Playwright)
```

- **Unit** (`server/tests/services/`) — payroll report generation (the same
  scenarios as the 2019 suite, ported from Mocha/Chai/Sinon to Vitest), plus
  pay-period maths, date/value normalisation, and CSV parsing.
- **Integration** (`server/tests/integration/`) — drive the real Express app with
  `supertest` against an **in-memory SQLite database** (schema applied from the
  committed Prisma migrations). Covers upload, duplicate `409`, `404`, `422`, the
  report list, and archival writes.
- **End-to-end** (`e2e/`) — a real browser drives the built UI: open the page,
  upload a CSV through the form, and assert the rendered report. See
  [End-to-end tests (Playwright)](#end-to-end-tests-playwright).

The client has a component test for the report table. There is **no development
seed script** — test data is created only inside the tests, by uploading CSVs
through the real upload endpoint.

## End-to-end tests (Playwright)

The `e2e/` workspace uses [Playwright](https://playwright.dev) to run the app in
a real browser (Chromium) and exercise the whole flow: **upload a time report CSV
through the UI form and check the payroll report that renders**. It is the only
test layer that covers the frontend, the API, and the database together.

```bash
npm run e2e:install   # one-time: download the Chromium browser
npm run test:e2e      # run the browser tests (headless)
npm run test:e2e:ui -w @payroll/e2e    # interactive watch/UI mode
npm run test:e2e:headed -w @payroll/e2e  # watch the browser
```

Playwright manages everything the tests need: it **builds the client**, resets a
dedicated `server/prisma/e2e.db` database, and starts the API (which serves the
built SPA) on <http://localhost:8081>. The specs live in `e2e/tests/`.

New to Playwright? There's a short hands-on guide in
[`e2e/README.md`](./e2e/README.md).

## Code style

Prettier handles formatting across the whole workspace from the root using the
shared `.prettierrc.json` (single quotes, semicolons, trailing commas, 100
columns, LF line endings). ESLint (`eslint.config.mjs`, flat config) handles
code-quality/style rules on top — notably `arrow-body-style: as-needed`, so
`() => { return x; }` is auto-fixed to `() => x`.

```bash
npm run format        # pretty-print
npm run format:check  # verify formatting
npm run lint          # report lint issues
npm run lint:fix      # fix what can be fixed automatically
```

## What I'm particularly proud of

The 2019 version proved the design; this rewrite keeps that layered shape but
makes it type-safe end to end. The `DataAccess` interface means the service
layer's DB calls are fully typed yet still easy to fake in tests, so the
`createReport` tests exercise real logic without touching a database. Domain
types (`PayrollRow`, `ReportRow`, `JobGroup`) are shared across the boundary in
`server/src/types/domain.ts`, which removed a whole class of stringly-typed bugs the
original code was exposed to — for example the report aggregation now sums a
typed `Map<string, ReportRow>` instead of serialising keys through `JSON.parse`.
The same `DataAccess` seam later made swapping Sequelize for **Prisma 7** a
single-layer change — no service, controller, or route code moved.

I also fixed a few latent issues while modernising: the original
`saveReportUpload` returned an `Error` object instead of throwing it (so a
non-unique-id failure silently continued with an undefined id), the report-list
controller returned the `next` function itself instead of calling `next(err)` on
failure, and the client's upload form used `encrypt` instead of `encType`. Dates
now use `date-fns`, CSV parsing uses the synchronous `csv-parse` API, and the
client is a Vite + React 19 SPA styled with Tailwind CSS instead of a Create
React App 2 build on Bootstrap components.

## Differences from the 2019 version

| 2019                             | Now                                            |
| -------------------------------- | ---------------------------------------------- |
| JavaScript, CommonJS             | TypeScript, ESM (extensionless imports)        |
| Express 4                        | Express 5                                      |
| Sequelize 4 ORM                  | Prisma 7 (migrations + generated client)       |
| moment                           | date-fns                                       |
| csv-parse callbacks              | `csv-parse/sync`                               |
| Mocha + Chai + Sinon             | Vitest                                         |
| Create React App 2, React 16     | Vite 8, React 19, react-router 7               |
| reactstrap + Bootstrap 4         | Tailwind CSS 4                                 |
| Class components, service worker | Function components + hooks, no service worker |
| No formatter                     | Prettier                                       |
| Two packages, two lockfiles      | npm workspaces, single lockfile                |
| tsc-compiled server (`dist/`)    | Server runs from source via `tsx`              |

## Known caveats

- **Workspaces:** install and run from the repo root. Dependencies are hoisted to
  the root `node_modules`, so declare a dependency in the workspace that uses it
  (`npm install <pkg> -w @payroll/server`) and never commit per-workspace
  lockfiles.
- **Server runtime:** the API runs from TypeScript via `tsx` (there is no server
  `dist/`). Relative imports are intentionally extensionless, which plain `node`
  cannot resolve — so always start the API through `npm run dev` / `npm start`
  unless you add a bundler.
- Tailwind CSS 4 is configured CSS-first: `client/src/index.css` imports
  `tailwindcss` and the `@tailwindcss/vite` plugin does the rest, so there is no
  `tailwind.config.js`.
- Prisma 7 generates its client into `server/src/generated/prisma` (git-ignored).
  `npm install` regenerates it via a `postinstall` hook; otherwise run
  `npm run db:generate -w @payroll/server`.
- `better-sqlite3` (used by the Prisma SQLite driver adapter) is a native
  dependency; some npm versions may gate its install script.

## Future improvements

- ESLint (e.g. `typescript-eslint` + `eslint-config-prettier`) alongside Prettier.
- Request-level validation for the CSV (beyond the shape guarantees).
- More e2e coverage (e.g. driving the client against the API).

## Original challenge

The full brief is in [`../2019-hand-written/instructions`](../2019-hand-written/instructions).
Job group A is paid $20/hr and job group B $30/hr; pay periods are the 1st–15th
and the 16th–end of each month; the report has one row per employee per pay
period, sorted by employee id then pay period.
