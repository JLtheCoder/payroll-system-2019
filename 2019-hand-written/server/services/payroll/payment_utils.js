const moment = require('moment');

function findPayPeriod(payrollDate) {
  const dateInMonth = moment(payrollDate).get('date');

  if (dateInMonth <= 15) {
    const beginning = moment(payrollDate).startOf('month').format('D/MM/YYYY');
    const endMoment = moment(payrollDate);
    endMoment.set('date', 15);
    const end = endMoment.format('D/MM/YYYY');

    return `${beginning} - ${end}`;
  }

  const beginningMoment = moment(payrollDate);
  beginningMoment.set('date', 16);
  const beginning = beginningMoment.format('D/MM/YYYY');
  const end = moment(payrollDate).endOf('month').format('D/MM/YYYY');

  return `${beginning} - ${end}`;
}

module.exports = {
  findPayPeriod,
};
