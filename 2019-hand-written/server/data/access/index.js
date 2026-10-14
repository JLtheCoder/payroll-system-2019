const db = require('../db');

function getReportDataByReportId(reportId) {
  return db.report_data.findAll({
    attributes: ['employee_id', 'pay_period', 'amount_paid'],
    include: [
      {
        model: db.report_upload,
        required: true,
        where: { csv_report_id: reportId },
      },
    ],
  })
}

function saveReportUpload(reportId) {
  return db.report_upload.create({
    csv_report_id: reportId,
  }).catch((err) => {
    if (err.name === 'SequelizeUniqueConstraintError') {
      return null;
    }

    return new Error('Internal server error.');
  });
}

function savePayrollData(data) {
  return db.payroll_data.bulkCreate(data);
}

function saveReportData(data) {
  return db.report_data.bulkCreate(data);
}

function listAllReports() {
  return db.report_upload.findAll({
    attributes: [['csv_report_id', 'report_id'], 'created_date']
  });
}

module.exports = {
  getReportDataByReportId,
  saveReportUpload,
  savePayrollData,
  saveReportData,
  listAllReports,
};