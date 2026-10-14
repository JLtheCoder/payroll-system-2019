import { Router } from 'express';
import morgan from 'morgan';
import { apiRouter } from './api/index';
import { errorHandler } from './errors';

/** Builds the root router: request logging, API routes, then error handling. */
export const createRoutes = (): Router => {
  const router = Router();

  router.use(morgan('short'));
  router.use('/api', apiRouter);
  router.use(errorHandler);

  return router;
};
