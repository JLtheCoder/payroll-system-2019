import { format, isValid, parse } from 'date-fns';
import type { PayrollRow, RawPayrollRow } from '../../types/domain';

/**
 * Converts raw CSV string values into typed, normalised rows and sorts them by
 * employee id and then pay date.
 */
export const formatPayrollData = (payrollData: RawPayrollRow[]): PayrollRow[] => {
  const formatted = payrollData.map((row): PayrollRow => {
    const parsedDate = parse(row.pay_date, 'd/M/yyyy', new Date());

    if (!isValid(parsedDate)) {
      throw new Error(`Invalid pay date: ${row.pay_date}`);
    }

    return {
      employee_id: Number.parseInt(row.employee_id, 10),
      hours_worked: Number.parseFloat(row.hours_worked),
      pay_date: format(parsedDate, 'yyyy-MM-dd'),
      job_group: row.job_group,
    };
  });

  return sortPayrollData(formatted);
};

const sortPayrollData = (payrollData: PayrollRow[]): PayrollRow[] =>
  // `pay_date` is already ISO `yyyy-MM-dd`, so a string comparison is safe.
  [...payrollData].sort((a, b) => {
    if (a.employee_id !== b.employee_id) {
      return a.employee_id - b.employee_id;
    }

    if (a.pay_date < b.pay_date) {
      return -1;
    }

    if (a.pay_date > b.pay_date) {
      return 1;
    }

    return 0;
  });

export default formatPayrollData;
