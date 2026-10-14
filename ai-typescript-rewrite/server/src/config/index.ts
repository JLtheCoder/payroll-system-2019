import { config as loadEnv } from 'dotenv';

// Load `.env` before reading anything from `process.env`.
loadEnv();

export interface AppConfig {
  /** Port the Express server listens on. */
  port: number;
  /** `true` when NODE_ENV is `production`. */
  isProduction: boolean;
}

export const config: AppConfig = {
  port: Number.parseInt(process.env.PORT ?? '8081', 10),
  isProduction: process.env.NODE_ENV === 'production',
};
