import { dataAccess } from '../../data/access/index';
import createReport from './create_report';
import formatPayrollData from './format_payroll_data';
import parseCsvFile from './parse_csv_file';
import { createSavePayrollData } from './save_payroll_data';
import type { PayrollService } from './types';

/**
 * The payroll service. Pure functions are exported directly; anything touching
 * the database is built from the injected data access layer.
 */
export const payrollService: PayrollService = {
  parseCsvFile,
  formatPayrollData,
  createReport,
  savePayrollData: createSavePayrollData(dataAccess),
};

export type { PayrollService } from './types';
