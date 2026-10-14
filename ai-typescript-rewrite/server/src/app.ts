import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express, { type Express } from 'express';
import { config } from './config/index';
import { prisma } from './data/prisma';
import { createRoutes } from './routes/index';

const dirname = path.dirname(fileURLToPath(import.meta.url));

// The server always runs from source via tsx (`server/src/...`), so the repo
// root is two levels up from here.
const clientDist = path.resolve(dirname, '..', '..', 'client', 'dist');

/** Builds the Express app (exported separately so it can be tested). */
export const createApp = (): Express => {
  const app = express();

  app.use(express.static(clientDist));
  app.use(createRoutes());

  // Single-page-app fallback: serve index.html for any unmatched GET.
  app.use((req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    return res.sendFile(path.join(clientDist, 'index.html'));
  });

  return app;
};

const run = async (): Promise<void> => {
  await prisma.$connect();

  const app = createApp();
  const server = app.listen(config.port, () => {
    console.log(`Server listening on port ${config.port}`);
  });

  const shutdown = async (): Promise<void> => {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
};

run().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
