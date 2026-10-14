import type { PayrollRow } from '../../../src/types/domain';

/** Employee 1 works one date in each of two different pay periods. */
export const payrollDifferentPayPeriod: PayrollRow[] = [
  { pay_date: '2016-11-01', hours_worked: 1, employee_id: 1, job_group: 'A' },
  { pay_date: '2016-11-16', hours_worked: 1, employee_id: 1, job_group: 'A' },
];
