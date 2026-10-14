const paymentUtils = require('./payment_utils');

function createReport(payrollData) {
  if (!Array.isArray(payrollData) || !payrollData.length) {
    return [];
  }

  const reportDataMap = new Map();
  const payRate = {
    'A': 20,
    'B': 30,
  };
  
  payrollData.forEach((row) => {
    const rate = payRate[row.job_group];
    const newPayment = row.hours_worked * rate;
    const payPeriod = paymentUtils.findPayPeriod(row.pay_date);
    const key = JSON.stringify({
      pay_period: payPeriod,
      employee_id: row.employee_id
    });

    if (reportDataMap.has(key)) {
      const payment = reportDataMap.get(key);
      reportDataMap.set(key, payment + newPayment);
    } else {
      reportDataMap.set(key, newPayment);
    }
  });

  const reportDataArray = [];

  const iterator = reportDataMap.entries();
  let keyValuePair = iterator.next().value;
  while (keyValuePair) {
    reportDataArray.push({...JSON.parse(keyValuePair[0]), amount_paid: keyValuePair[1]});
    keyValuePair = iterator.next().value;
  }

  return reportDataArray;
}

module.exports = createReport;
