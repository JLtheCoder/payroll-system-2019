import type { PayrollRow } from '../../../src/types/domain';

/** Employee 1 works two dates that fall in the same pay period. */
export const payrollSamePayPeriod: PayrollRow[] = [
  { pay_date: '2016-11-01', hours_worked: 1, employee_id: 1, job_group: 'A' },
  { pay_date: '2016-11-15', hours_worked: 1, employee_id: 1, job_group: 'A' },
];
