function get(dataAccess) {
  return async (reportId) => {
    const reportData = await dataAccess.getReportDataByReportId(reportId);

    if (!Array.isArray(reportData) || !reportData.length) {
      return null;
    }

    const newReportData = []
    reportData.forEach((row) => {
      const newRow = {
        employee_id: row.employee_id,
        pay_period: row.pay_period,
        amount_paid: row.amount_paid,
      };
      newReportData.push(newRow);
    });

    return newReportData;
  };
}

module.exports = get;