import type { RequestHandler } from 'express';
import type { ReportService } from '../../services/report/index';

/** Serves the list of every uploaded report. */
export const createGetReportList =
  (reportService: ReportService): RequestHandler =>
  async (_req, res, next) => {
    try {
      const reports = await reportService.list();
      return res.json({ data: reports });
    } catch (err) {
      return next(err);
    }
  };
