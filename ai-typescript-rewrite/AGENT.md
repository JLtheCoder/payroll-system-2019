# AGENT.md

Guidance for AI coding agents (and humans) working in `ai-typescript-rewrite/`.

This is an npm **workspaces** monorepo containing a TypeScript rewrite of the
2019 payroll system. The original JavaScript lives one directory up in
`../2019-hand-written` and is **reference only** — do not edit it.

## Project shape

One install and one lockfile at the repo root; dependencies are hoisted to the
root `node_modules`.

| Workspace | Package           | Path      | Stack                                                   |
| --------- | ----------------- | --------- | ------------------------------------------------------- |
| API       | `@payroll/server` | `server/` | Express 5, Prisma 7, SQLite/Postgres, ESM via `tsx`     |
| Frontend  | `@payroll/client` | `client/` | React 19, Vite 8, react-router 7, Tailwind CSS 4, axios |
| E2E       | `@payroll/e2e`    | `e2e/`    | Playwright (Chromium) browser tests                     |

## Commands

Run from the repository root unless noted.

```bash
npm install             # install every workspace (single lockfile)
npm run dev             # API (:8081) + Vite dev server (:5173) together
npm run dev:server      # API only, watch mode (tsx)
npm run dev:client      # Vite dev server only
npm run typecheck       # tsc --noEmit in every workspace
npm test                # Vitest unit + integration (server + client)
npm run test:integration  # server API integration tests only
npm run test:e2e        # Playwright browser e2e (run `npm run e2e:install` once)
npm run e2e:install     # download the Playwright Chromium browser
npm run build           # typecheck the API, then build the client
npm start               # run the API from source (tsx src/app.ts)
npm run db:migrate      # create + apply migrations (dev)
npm run db:deploy       # apply committed migrations (e.g. after cloning)
npm run db:studio       # open Prisma Studio
npm run format          # Prettier --write .
npm run format:check    # Prettier --check .
npm run lint            # ESLint
npm run lint:fix        # ESLint --fix
```

Scope a command to one workspace with `-w`, e.g. `npm test -w @payroll/server`.
Add dependencies to the workspace that uses them:
`npm install <pkg> -w @payroll/client`.

## Architecture (server) — all under `server/src/`

Strict layer order — do not skip layers:

```
routes/         HTTP routing, logging, error handler
  controllers/    HTTP shaping, status codes, delegates to services
    services/       business logic (payroll maths, report generation)
      data/access/      Prisma queries
        data/prisma.ts    shared PrismaClient (driver adapter)
prisma/schema.prisma      data models; prisma/migrations/ = schema history
```

- **Dependency injection:** DB-touching services are factory functions that take
  a `DataAccess` object (e.g. `createSaveUploadId(dataAccess)`). Pure functions
  (`createReport`, `formatPayrollData`, `findPayPeriod`) are exported directly.
- **Errors:** throw `AppError(message, status)` from `server/src/errors.ts`;
  `server/src/routes/errors.ts` serialises it to `{ error, status }`.
- **Domain types:** `server/src/types/domain.ts`. Never leak Prisma types above
  the data-access layer — map query results to domain types there.

## Conventions

- **ESM with extensionless imports.** The server uses
  `module`/`moduleResolution` = `ESNext`/`Bundler`, so relative imports have **no
  extension** (`./foo`, not `./foo.js`). Do not reintroduce `.js` extensions.
- **The server runs from source via `tsx`.** There is **no compile step and no
  `dist/`** for the API — `tsc` is only used for `--noEmit` typechecking, and
  `npm start` runs `tsx src/app.ts`.
- **Functions:** prefer arrow function constants (`export const doThing = () => {}`)
  over `function` declarations, matching the rest of `server/`.
- **Arrow bodies:** use concise bodies where possible — ESLint's
  `arrow-body-style: as-needed` (in `eslint.config.mjs`) enforces
  `() => value` over `() => { return value; }` and auto-fixes it via
  `npm run lint:fix`.
- **Strict TypeScript.** Avoid `any`; prefer `unknown` + narrowing.
- **Dates:** use `date-fns` (moment was removed). **CSV:** `csv-parse/sync`.
- **Tests:** three layers.
  - Unit (`server/tests/services/`) and integration (`server/tests/integration/`)
    run on **Vitest**. Integration boots the real app against an in-memory SQLite
    DB (`server/tests/integration/testDb.ts`).
  - Browser e2e (`e2e/tests/`) runs on **Playwright**; `playwright.config.ts`
    builds the client, resets `server/prisma/e2e.db`, and starts the API.
  - Client component tests are `*.test.tsx` under `client/src`.
    Fixtures are typed `.ts` modules, not JSON.
- **No dev seed:** there is no `prisma db seed`. Test data is created only inside
  the tests, by uploading CSVs through the API.
- **Formatting:** Prettier via the root `.prettierrc.json` (single quotes,
  semicolons, trailing commas, 100 columns, LF). Run `npm run format` before
  finishing; CI should use `npm run format:check`.

## Gotchas

- **Server runtime:** always run the API through `tsx` (`npm run dev` /
  `npm start`). Plain `node` cannot resolve extensionless ESM, so a
  `node dist/app.js`-style deployment is not supported without adding a bundler.
- **Express 5:** a bare `app.get('*')` throws (path-to-regexp v8). The SPA
  fallback is a plain middleware in `server/src/app.ts` instead.
- **Prisma 7:** the client is Rust-free and **requires a driver adapter**
  (`@prisma/adapter-better-sqlite3` here). The datasource URL lives in
  `prisma.config.ts`, not the schema, and Prisma no longer auto-loads `.env`
  (`dotenv/config` is imported in `prisma.config.ts` and `src/data/prisma.ts`).
- **Generated client:** Prisma writes to `server/src/generated/prisma`
  (git-ignored). `npm install` regenerates it via `postinstall`; run
  `npm run db:generate -w @payroll/server` after editing the schema.
- **Schema changes:** edit `server/prisma/schema.prisma`, then run
  `npm run db:migrate -w @payroll/server` (dev) or `npm run db:deploy -w
@payroll/server` (apply committed migrations). Prisma 7 does not auto-run
  `generate` after migrations.
- **E2E tests:** need `npm run e2e:install` once, and port `8081` must be free
  (`reuseExistingServer: false`). They run against `server/prisma/e2e.db`, never
  `dev.db`. Guide: `e2e/README.md`.
- **Tailwind CSS 4:** configured CSS-first. `client/src/index.css` contains
  `@import 'tailwindcss';` and the `@tailwindcss/vite` plugin is registered in
  `client/vite.config.ts`. There is no `tailwind.config.js`; style components
  with utility classes and add design tokens via `@theme` in CSS if needed.

## Adding an endpoint

1. Add the service in `server/src/services/<area>/` and its interface in `types.ts`.
2. Add a controller factory in `server/src/controllers/<area>/`.
3. Register the route in `server/src/routes/api/index.ts`.
4. Add a test under `server/tests/`.

## Never commit

`node_modules/`, `dist/`, `server/prisma/*.db`, `server/src/generated/`, `.env`,
`test-results/`, `playwright-report/`, or per-workspace lockfiles.
