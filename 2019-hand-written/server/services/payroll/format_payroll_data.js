const moment = require('moment');

function sortPayrollData(payrollData) {
  return payrollData.sort((a, b) => {
    if (a.employee_id < b.employee_id) {
      return -1;
    }

    if (a.employee_id === b.employee_id) {
      return moment(a.pay_date)
        .isBefore(moment(b.pay_date)) ? -1 : 1;
    }

    return 1;
  });
}

function formatPayrollData(payrollData) {
  const newPayrollData = [];
  payrollData.forEach((row) => {
    const newRow = {
      employee_id: Number.parseInt(row.employee_id, 10),
      hours_worked: Number.parseFloat(row.hours_worked),
      pay_date: moment(row.pay_date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
      job_group: row.job_group,
    };
    newPayrollData.push(newRow);
  });

  return sortPayrollData(newPayrollData);
}

module.exports = formatPayrollData;
