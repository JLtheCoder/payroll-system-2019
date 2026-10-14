import { parse } from 'csv-parse/sync';
import type { ParsedCsv, RawPayrollRow } from '../../types/domain';

const COLUMNS = ['pay_date', 'hours_worked', 'employee_id', 'job_group'] as const;

/**
 * Parses an uploaded time report from its raw bytes into the report id and the
 * individual timekeeping rows.
 *
 * The footer row (`report id,<id>,,`) reuses the header column names, so the
 * report id arrives under the `hours_worked` key.
 */
export const parseCsvFile = (bufferData: Buffer): ParsedCsv => {
  const csvString = bufferData.toString();

  const records = parse(csvString.trim(), {
    columns: [...COLUMNS],
    skip_empty_lines: true,
  }) as RawPayrollRow[];

  if (records.length < 2) {
    throw new Error('CSV file is missing a footer row containing the report id.');
  }

  const footer = records[records.length - 1];
  const reportId = String(footer.hours_worked);
  const payrollData = records.slice(1, records.length - 1);

  return { reportId, payrollData };
};

export default parseCsvFile;
