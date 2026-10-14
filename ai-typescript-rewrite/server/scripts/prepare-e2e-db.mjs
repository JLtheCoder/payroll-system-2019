// Prepares a clean end-to-end test database without the destructive
// `prisma migrate reset` command: it deletes the e2e SQLite file, then applies
// the committed migrations to the fresh database.
//
// DATABASE_URL is inherited from the caller (Playwright's webServer env), so
// this always targets `file:./prisma/e2e.db`, never the development database.
import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const serverRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

if (!process.env.DATABASE_URL?.includes('e2e.db')) {
  throw new Error(
    `Refusing to prepare the e2e database: DATABASE_URL must point at e2e.db (got ${process.env.DATABASE_URL ?? 'undefined'}).`,
  );
}

for (const file of ['e2e.db', 'e2e.db-journal']) {
  rmSync(path.join(serverRoot, 'prisma', file), { force: true });
}

execSync('npx prisma migrate deploy', {
  cwd: serverRoot,
  env: process.env,
  stdio: 'inherit',
});
