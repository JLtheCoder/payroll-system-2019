import { describe, expect, it } from 'vitest';
import { findPayPeriod } from '../../src/services/payroll/payment_utils';

describe('Payroll Service: findPayPeriod', () => {
  it('maps days 1-15 to the first half of the month', () => {
    expect(findPayPeriod('2016-11-01')).toBe('1/11/2016 - 15/11/2016');
    expect(findPayPeriod('2016-11-15')).toBe('1/11/2016 - 15/11/2016');
  });

  it('maps days 16+ to the second half of the month', () => {
    expect(findPayPeriod('2016-11-16')).toBe('16/11/2016 - 30/11/2016');
    expect(findPayPeriod('2016-11-20')).toBe('16/11/2016 - 30/11/2016');
  });

  it('respects the length of the month', () => {
    expect(findPayPeriod('2016-02-20')).toBe('16/02/2016 - 29/02/2016');
    expect(findPayPeriod('2016-02-05')).toBe('1/02/2016 - 15/02/2016');
  });
});
