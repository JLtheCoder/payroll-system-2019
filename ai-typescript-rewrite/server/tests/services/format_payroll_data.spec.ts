import { describe, expect, it } from 'vitest';
import { formatPayrollData } from '../../src/services/payroll/format_payroll_data';
import type { RawPayrollRow } from '../../src/types/domain';

describe('Payroll Service: formatPayrollData', () => {
  it('casts values to their proper types and normalises dates to ISO', () => {
    const raw: RawPayrollRow[] = [
      { pay_date: '16/11/2016', hours_worked: '5.5', employee_id: '2', job_group: 'B' },
      { pay_date: '1/11/2016', hours_worked: '10', employee_id: '1', job_group: 'A' },
    ];

    expect(formatPayrollData(raw)).toEqual([
      { employee_id: 1, hours_worked: 10, pay_date: '2016-11-01', job_group: 'A' },
      { employee_id: 2, hours_worked: 5.5, pay_date: '2016-11-16', job_group: 'B' },
    ]);
  });

  it('sorts by employee id and then by pay date', () => {
    const raw: RawPayrollRow[] = [
      { pay_date: '20/11/2016', hours_worked: '1', employee_id: '1', job_group: 'A' },
      { pay_date: '2/11/2016', hours_worked: '1', employee_id: '1', job_group: 'A' },
      { pay_date: '2/11/2016', hours_worked: '1', employee_id: '2', job_group: 'A' },
    ];

    expect(formatPayrollData(raw).map((row) => row.pay_date)).toEqual([
      '2016-11-02',
      '2016-11-20',
      '2016-11-02',
    ]);
  });

  it('rejects an unparseable date', () => {
    const raw: RawPayrollRow[] = [
      { pay_date: 'not-a-date', hours_worked: '1', employee_id: '1', job_group: 'A' },
    ];

    expect(() => formatPayrollData(raw)).toThrow(/Invalid pay date/);
  });
});
