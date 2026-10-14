import { describe, expect, it } from 'vitest';
import { parseCsvFile } from '../../src/services/payroll/parse_csv_file';

const CSV = [
  'date,hours worked,employee id,job group',
  '1/11/2016,10,1,A',
  '14/11/2016,5,1,A',
  'report id,43,,',
].join('\n');

describe('Payroll Service: parseCsvFile', () => {
  it('extracts the report id from the footer row', () => {
    const { reportId } = parseCsvFile(Buffer.from(CSV));
    expect(reportId).toBe('43');
  });

  it('returns the data rows without the header or footer', () => {
    const { payrollData } = parseCsvFile(Buffer.from(CSV));

    expect(payrollData).toHaveLength(2);
    expect(payrollData[0]).toEqual({
      pay_date: '1/11/2016',
      hours_worked: '10',
      employee_id: '1',
      job_group: 'A',
    });
    expect(payrollData[1]).toMatchObject({ pay_date: '14/11/2016', hours_worked: '5' });
  });

  it('throws when the footer row is missing', () => {
    expect(() => parseCsvFile(Buffer.from('date,hours worked,employee id,job group'))).toThrow(
      /footer row/,
    );
  });
});
