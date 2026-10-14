// Prisma 7 no longer loads `.env` automatically, so we do it here for the CLI.
import 'dotenv/config';
import { defineConfig } from 'prisma/config';

// Defaults to a local SQLite file so the project runs with zero configuration.
const databaseUrl = process.env.DATABASE_URL ?? 'file:./prisma/dev.db';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
});
