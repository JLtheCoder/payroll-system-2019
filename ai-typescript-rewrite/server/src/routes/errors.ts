import type { ErrorRequestHandler } from 'express';
import { AppError } from '../errors';

/** Turns any thrown error into a consistent `{ error, status }` JSON body. */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err instanceof AppError ? err.status : (err?.status ?? 500);

  console.error(err);

  return res.status(status).json({
    error: err?.message ?? 'Internal server error.',
    status,
  });
};
