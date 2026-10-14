/** The two job groups the partner supports, and their hourly rates. */
export type JobGroup = 'A' | 'B';

export const JOB_GROUP_RATES: Record<JobGroup, number> = {
  A: 20,
  B: 30,
};

/** A single timekeeping row exactly as parsed from the CSV (all strings). */
export interface RawPayrollRow {
  pay_date: string;
  hours_worked: string;
  employee_id: string;
  job_group: JobGroup;
}

/** A timekeeping row after normalisation/parsing (typed values). */
export interface PayrollRow {
  pay_date: string;
  hours_worked: number;
  employee_id: number;
  job_group: JobGroup;
}

/** A row of the generated payroll report. */
export interface ReportRow {
  employee_id: number;
  pay_period: string;
  amount_paid: number;
}

/** An entry in the list of previously uploaded reports. */
export interface ReportListItem {
  report_id: string;
  created_date: Date;
}

/** The result of parsing an uploaded time report CSV. */
export interface ParsedCsv {
  reportId: string;
  payrollData: RawPayrollRow[];
}
