import type { Express } from 'express';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { PrismaClient } from '../../src/generated/prisma/client';

// Point Prisma at an in-memory SQLite database. This MUST run before the Prisma
// client and the app modules are imported, because they read DATABASE_URL at
// load time — hence the dynamic imports inside `createTestContext()`.
process.env.DATABASE_URL = ':memory:';

const here = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(here, '..', '..', 'prisma', 'migrations');

export interface TestContext {
  app: Express;
  prisma: PrismaClient;
}

/** Reads every committed migration, in order, as individual SQL statements. */
const readMigrationStatements = (): string[] => {
  const migrationDirs = readdirSync(migrationsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const statements: string[] = [];

  for (const dir of migrationDirs) {
    const sql = readFileSync(join(migrationsDir, dir, 'migration.sql'), 'utf8');
    const withoutComments = sql
      .split('\n')
      .filter((line) => !line.trim().startsWith('--'))
      .join('\n');

    for (const statement of withoutComments.split(';')) {
      const trimmed = statement.trim();
      if (trimmed.length > 0) {
        statements.push(trimmed);
      }
    }
  }

  return statements;
};

/**
 * Boots the real Express app against a fresh in-memory SQLite database with the
 * schema applied from `prisma/migrations`.
 */
export const createTestContext = async (): Promise<TestContext> => {
  const { prisma } = await import('../../src/data/prisma');
  const { createApp } = await import('../../src/app');

  for (const statement of readMigrationStatements()) {
    await prisma.$executeRawUnsafe(statement);
  }

  return { app: createApp(), prisma };
};

/** Deletes all rows, child tables first (to satisfy foreign keys). */
export const resetDatabase = async (prisma: PrismaClient): Promise<void> => {
  await prisma.reportData.deleteMany();
  await prisma.payrollData.deleteMany();
  await prisma.reportUpload.deleteMany();
};
