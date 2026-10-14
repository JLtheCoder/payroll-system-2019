import { payrollService } from '../../services/payroll/index';
import { reportService } from '../../services/report/index';
import { createCreateReport } from './create_report';
import { createValidateCsvFile } from './validate_csv_file';

export const payrollController = {
  validateCsvFile: createValidateCsvFile(payrollService),
  createReport: createCreateReport(reportService, payrollService),
};
