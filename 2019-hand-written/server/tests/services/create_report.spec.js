const chai = require('chai');
const sinon = require('sinon');

const { expect } = chai;
const createReport = require('../../services/payroll/create_report');
const paymentUtils = require('../../services/payroll/payment_utils');

describe('Payroll Service: Create payroll report', () => {
  let findPayPeriodStub;
  let payPeriodResponse1;
  let payPeriodPesponse2;
  const FAKE_PAY_PERIOD_1 = '1/11/2016 - 15/11/2016';
  const FAKE_PAY_PERIOD_2 = '16/11/2016 - 30/11/2016'

  beforeEach(() => {
    findPayPeriodStub = sinon.stub(paymentUtils, 'findPayPeriod');
    findPayPeriodStub
      .onFirstCall().returns(payPeriodResponse1)
      .onSecondCall().returns(payPeriodPesponse2);
  });

  afterEach(() => {
    findPayPeriodStub.restore();
  });

  context('When employee 1 work on two different date, but on the same payriod', () => {
    const fakePayrollData = require('./fixtures/payroll_same_payperiod');
    let result;

    before(() => {
      payPeriodResponse1 = FAKE_PAY_PERIOD_1;
      payPeriodPesponse2 = FAKE_PAY_PERIOD_1;
    })

    beforeEach(() => {
      result = createReport(fakePayrollData);
    });

    it('should comine the working hour to same period', () => {
      expect(result).to.have.lengthOf(1);
      expect(result).to.deep.contain({
        employee_id: 1,
        pay_period: FAKE_PAY_PERIOD_1,
        amount_paid: 40,
      });
    });
  });

  context('When employee 1 work on different payriod', () => {
    const fakePayrollData = require('./fixtures/payroll_different_payperiod');
    let result;

    before(() => {
      payPeriodResponse1 = FAKE_PAY_PERIOD_1;
      payPeriodPesponse2 = FAKE_PAY_PERIOD_2;
    })

    beforeEach(() => {
      result = createReport(fakePayrollData);
    });

    it('should have two entry on differet pay period on report', () => {
      expect(result).to.have.lengthOf(2);
      expect(result).to.deep.contain({
        employee_id: 1,
        pay_period: FAKE_PAY_PERIOD_1,
        amount_paid: 20,
      });
      expect(result).to.deep.contain({
        employee_id: 1,
        pay_period: FAKE_PAY_PERIOD_2,
        amount_paid: 20,
      });
    });
  });

  context('When employee 1 work on job group A and B for 1 hour on the same day', () => {

    const fakePayrollData = require('./fixtures/payroll_different_job_group');
    let result;

    before(() => {
      payPeriodResponse1 = FAKE_PAY_PERIOD_1;
      payPeriodPesponse2 = FAKE_PAY_PERIOD_1;
    })

    beforeEach(() => {
      result = createReport(fakePayrollData);
    });

    it('should get $50 on the pay period', () => {
      expect(result).to.have.lengthOf(1);
      expect(result).to.deep.contain({
        employee_id: 1,
        pay_period: FAKE_PAY_PERIOD_1,
        amount_paid: 50,
      });
    });
  });

  context('When employee 1 and employee 2 work on same job group and same day', () => {

    const fakePayrollData = require('./fixtures/payroll_different_employee');
    let result;

    before(() => {
      payPeriodResponse1 = FAKE_PAY_PERIOD_1;
      payPeriodPesponse2 = FAKE_PAY_PERIOD_1;
    })

    beforeEach(() => {
      result = createReport(fakePayrollData);
    }); 

    it('should get one entry for employee 1 and one entry for employee 2', () => {
      expect(result).to.have.lengthOf(2);
      expect(result).to.deep.contain({
        employee_id: 1,
        pay_period: FAKE_PAY_PERIOD_1,
        amount_paid: 20,
      });
      expect(result).to.deep.contain({
        employee_id: 2,
        pay_period: FAKE_PAY_PERIOD_1,
        amount_paid: 20,
      });
    });
  });
});
