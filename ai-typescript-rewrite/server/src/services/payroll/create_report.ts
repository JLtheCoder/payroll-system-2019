import { JOB_GROUP_RATES, type PayrollRow, type ReportRow } from '../../types/domain';
import { paymentUtils } from './payment_utils';

/**
 * Aggregates normalised payroll rows into a payroll report: one row per
 * employee + pay period, with the amount paid summed across all matching rows
 * (across every uploaded report).
 */
export const createReport = (payrollData: PayrollRow[]): ReportRow[] => {
  if (!Array.isArray(payrollData) || payrollData.length === 0) {
    return [];
  }

  // Insertion order is preserved, so the report keeps the order of first
  // appearance from the (already sorted) payroll data.
  const reportDataMap = new Map<string, ReportRow>();

  for (const row of payrollData) {
    const rate = JOB_GROUP_RATES[row.job_group];

    if (rate === undefined) {
      throw new Error(`Unknown job group: ${row.job_group}`);
    }

    const payment = row.hours_worked * rate;
    const payPeriod = paymentUtils.findPayPeriod(row.pay_date);
    const key = JSON.stringify({
      pay_period: payPeriod,
      employee_id: row.employee_id,
    });

    const existing = reportDataMap.get(key);

    if (existing) {
      existing.amount_paid += payment;
    } else {
      reportDataMap.set(key, {
        employee_id: row.employee_id,
        pay_period: payPeriod,
        amount_paid: payment,
      });
    }
  }

  return [...reportDataMap.values()];
};

export default createReport;
