import type { ParsedCsv, PayrollRow, RawPayrollRow, ReportRow } from '../../types/domain';

export interface PayrollService {
  /** Parses an uploaded CSV into a report id and raw rows. */
  parseCsvFile(bufferData: Buffer): ParsedCsv;
  /** Normalises and sorts raw rows. */
  formatPayrollData(payrollData: RawPayrollRow[]): PayrollRow[];
  /** Aggregates rows into a payroll report. */
  createReport(payrollData: PayrollRow[]): ReportRow[];
  /** Persists normalised rows for archival. */
  savePayrollData(payrollData: PayrollRow[], reportUploadId: number): Promise<void>;
}
