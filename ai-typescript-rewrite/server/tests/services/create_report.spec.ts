import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { createReport } from '../../src/services/payroll/create_report';
import { paymentUtils } from '../../src/services/payroll/payment_utils';
import { payrollDifferentEmployee } from './fixtures/payroll_different_employee';
import { payrollDifferentJobGroup } from './fixtures/payroll_different_job_group';
import { payrollDifferentPayPeriod } from './fixtures/payroll_different_payperiod';
import { payrollSamePayPeriod } from './fixtures/payroll_same_payperiod';

const FAKE_PAY_PERIOD_1 = '1/11/2016 - 15/11/2016';
const FAKE_PAY_PERIOD_2 = '16/11/2016 - 30/11/2016';

describe('Payroll Service: create payroll report', () => {
  let findPayPeriodSpy: MockInstance;

  beforeEach(() => {
    // The pay period is stubbed so the tests focus purely on the aggregation
    // logic (pay period calculation is covered separately).
    findPayPeriodSpy = vi.spyOn(paymentUtils, 'findPayPeriod');
  });

  afterEach(() => {
    findPayPeriodSpy.mockRestore();
  });

  describe('when employee 1 works two dates in the same pay period', () => {
    beforeEach(() => {
      findPayPeriodSpy
        .mockReturnValueOnce(FAKE_PAY_PERIOD_1)
        .mockReturnValueOnce(FAKE_PAY_PERIOD_1);
    });

    it('combines the hours into a single period', () => {
      const result = createReport(payrollSamePayPeriod);

      expect(result).toHaveLength(1);
      expect(result).toContainEqual({
        employee_id: 1,
        pay_period: FAKE_PAY_PERIOD_1,
        amount_paid: 40,
      });
    });
  });

  describe('when employee 1 works in different pay periods', () => {
    beforeEach(() => {
      findPayPeriodSpy
        .mockReturnValueOnce(FAKE_PAY_PERIOD_1)
        .mockReturnValueOnce(FAKE_PAY_PERIOD_2);
    });

    it('produces one entry per pay period', () => {
      const result = createReport(payrollDifferentPayPeriod);

      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        employee_id: 1,
        pay_period: FAKE_PAY_PERIOD_1,
        amount_paid: 20,
      });
      expect(result).toContainEqual({
        employee_id: 1,
        pay_period: FAKE_PAY_PERIOD_2,
        amount_paid: 20,
      });
    });
  });

  describe('when employee 1 works job group A and B for one hour on the same day', () => {
    beforeEach(() => {
      findPayPeriodSpy
        .mockReturnValueOnce(FAKE_PAY_PERIOD_1)
        .mockReturnValueOnce(FAKE_PAY_PERIOD_1);
    });

    it('sums both job group rates ($20 + $30)', () => {
      const result = createReport(payrollDifferentJobGroup);

      expect(result).toHaveLength(1);
      expect(result).toContainEqual({
        employee_id: 1,
        pay_period: FAKE_PAY_PERIOD_1,
        amount_paid: 50,
      });
    });
  });

  describe('when employee 1 and employee 2 work the same job group and day', () => {
    beforeEach(() => {
      findPayPeriodSpy
        .mockReturnValueOnce(FAKE_PAY_PERIOD_1)
        .mockReturnValueOnce(FAKE_PAY_PERIOD_1);
    });

    it('produces one entry per employee', () => {
      const result = createReport(payrollDifferentEmployee);

      expect(result).toHaveLength(2);
      expect(result).toContainEqual({
        employee_id: 1,
        pay_period: FAKE_PAY_PERIOD_1,
        amount_paid: 20,
      });
      expect(result).toContainEqual({
        employee_id: 2,
        pay_period: FAKE_PAY_PERIOD_1,
        amount_paid: 20,
      });
    });
  });

  describe('when there is no payroll data', () => {
    it('returns an empty report', () => {
      expect(createReport([])).toEqual([]);
    });
  });
});
