import type { RequestHandler } from 'express';
import { AppError } from '../../errors';
import type { PayrollService } from '../../services/payroll/index';
import type { RawPayrollRow } from '../../types/domain';

/** Values the CSV middleware stashes for the downstream report controller. */
export interface PayrollUploadLocals {
  reportId: string;
  payrollData: RawPayrollRow[];
}

export type PayrollUploadHandler = RequestHandler<
  Record<string, string>,
  unknown,
  unknown,
  unknown,
  PayrollUploadLocals
>;

/**
 * Validates the uploaded file and parses it into `res.locals` for the next
 * middleware. Responds with 422 when the file is missing/invalid.
 */
export const createValidateCsvFile =
  (payrollService: PayrollService): PayrollUploadHandler =>
  (req, res, next) => {
    if (!req.file || req.file.fieldname !== 'csv') {
      return next(new AppError('Not able to process csv file.', 422));
    }

    try {
      const { reportId, payrollData } = payrollService.parseCsvFile(req.file.buffer);
      res.locals.reportId = reportId;
      res.locals.payrollData = payrollData;
      return next();
    } catch {
      return next(new AppError('Internal server error!', 500));
    }
  };
