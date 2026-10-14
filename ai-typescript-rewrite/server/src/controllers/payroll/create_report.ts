import { AppError } from '../../errors';
import type { PayrollService } from '../../services/payroll/index';
import type { ReportService } from '../../services/report/index';
import type { PayrollUploadHandler } from './validate_csv_file';

/**
 * Generates and stores a payroll report from the CSV data prepared by the
 * validate-csv middleware. Returns 409 when the report id was uploaded before.
 */
export const createCreateReport =
  (reportService: ReportService, payrollService: PayrollService): PayrollUploadHandler =>
  async (req, res, next) => {
    try {
      const reportUploadData = await reportService.saveUploadId(res.locals.reportId);

      if (!reportUploadData) {
        throw new AppError('Payroll with same report id is uploaded already.', 409);
      }

      const sortedPayrollData = payrollService.formatPayrollData(res.locals.payrollData);
      const reportData = payrollService.createReport(sortedPayrollData);

      await Promise.all([
        payrollService.savePayrollData(sortedPayrollData, reportUploadData.id),
        reportService.save(reportData, reportUploadData.id),
      ]);

      return res.json({ data: reportData });
    } catch (err) {
      return next(err);
    }
  };
