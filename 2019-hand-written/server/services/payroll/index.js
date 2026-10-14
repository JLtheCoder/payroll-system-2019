const parseCsvFile = require('./parse_csv_file');
const formatPayrollData = require('./format_payroll_data');
const createReport = require('./create_report');
const savePayrollData = require('./save_payroll_data');
const dataAccess = require('../../data/access');

module.exports = {
  createReport,
  parseCsvFile,
  formatPayrollData,
  savePayrollData: savePayrollData(dataAccess),
};
