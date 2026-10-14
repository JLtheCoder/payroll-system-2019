const createReport = require('./create_report');
const validateCsvFile = require('./validate_csv_file');
const payrollService = require('../../services/payroll');
const reportService = require('../../services/report')

module.exports = {
  createReport: createReport(reportService, payrollService),
  validateCsvFile: validateCsvFile(payrollService),
};
