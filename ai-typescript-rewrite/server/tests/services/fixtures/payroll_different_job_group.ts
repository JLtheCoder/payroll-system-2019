import type { PayrollRow } from '../../../src/types/domain';

/** Employee 1 works one hour in job group A and one in job group B, same day. */
export const payrollDifferentJobGroup: PayrollRow[] = [
  { pay_date: '2016-11-01', hours_worked: 1, employee_id: 1, job_group: 'A' },
  { pay_date: '2016-11-01', hours_worked: 1, employee_id: 1, job_group: 'B' },
];
