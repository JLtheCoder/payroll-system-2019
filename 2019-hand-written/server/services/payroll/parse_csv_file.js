const parse = require('csv-parse');

function parseAsync(csv) {
  return new Promise((resolve, reject) => {
    parse(csv.trim(), {
      columns: ['pay_date', 'hours_worked', 'employee_id', 'job_group']
    }, (err, records) => {
      return err ? reject(err) : resolve(records);
    });
  });
}

function parseCsvFile(bufferData) {
  const csvStringStream = bufferData.toString();

  return parseAsync(csvStringStream)
    .then((records) => {
      // ReportId is in second column, which is labelled as hours_worked
      const reportId = records[records.length - 1].hours_worked;
      const payrollData = records.splice(1, records.length - 2);

      return { reportId, payrollData };
    })
}

module.exports = parseCsvFile;
