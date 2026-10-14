// Prisma 7 requires an explicit driver adapter. This is the single shared
// PrismaClient instance for the process.
import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db';

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });

export const prisma = new PrismaClient({ adapter });
