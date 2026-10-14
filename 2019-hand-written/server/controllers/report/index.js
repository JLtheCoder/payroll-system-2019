const getReportList = require('./get_report_list');
const getReport = require('./get_report');
const reportService = require('../../services/report')

module.exports = {
  getReportList: getReportList(reportService),
  getReport: getReport(reportService),
};
