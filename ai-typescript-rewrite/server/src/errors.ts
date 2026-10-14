/**
 * Error type that carries an HTTP status code so the Express error handler
 * can turn it into a consistent JSON response.
 */
export class AppError extends Error {
  readonly status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = 'AppError';
    this.status = status;
  }
}
