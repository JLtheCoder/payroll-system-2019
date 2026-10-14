import type { RequestHandler } from 'express';
import { AppError } from '../../errors';
import type { ReportService } from '../../services/report/index';

/** Serves a previously generated report, or 404 when it does not exist. */
export const createGetReport =
  (reportService: ReportService): RequestHandler<{ reportId: string }> =>
  async (req, res, next) => {
    try {
      const reportData = await reportService.get(req.params.reportId);

      if (!reportData) {
        throw new AppError('Report does not exist.', 404);
      }

      return res.json({ data: reportData });
    } catch (err) {
      return next(err);
    }
  };
