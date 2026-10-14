import type { PayrollRow } from '../../../src/types/domain';

/** Two employees work the same day in the same job group. */
export const payrollDifferentEmployee: PayrollRow[] = [
  { pay_date: '2016-11-01', hours_worked: 1, employee_id: 1, job_group: 'A' },
  { pay_date: '2016-11-01', hours_worked: 1, employee_id: 2, job_group: 'A' },
];
