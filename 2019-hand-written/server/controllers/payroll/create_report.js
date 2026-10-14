function createReport(reportService, payrollService) {
  return async (req, res, next) => {
    try {
      const reportUploadData = await reportService.saveUploadId(res.locals.reportId);
      if (!reportUploadData) {
        const conflictError = new Error('Payroll with same report id is uploaded already.');
        conflictError.status = 409;
        throw conflictError;
      }
      
      const sortedPayrollData = payrollService.formatPayrollData(res.locals.payrollData);
      const reportData = payrollService.createReport(sortedPayrollData);

      await Promise.all([
        payrollService.savePayrollData(sortedPayrollData, reportUploadData.id),
        reportService.save(reportData, reportUploadData.id),
      ]);

      return res.json({ data: reportData });
    } catch(err) {
      return next (err);
    }
  }
}

module.exports = createReport;
