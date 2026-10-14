function validateCsvFile(payrollService) {
  return (req, res, next) => {
    if (!req.file || req.file.fieldname !== 'csv') {
      const unprocessableError = new Error('Not able to process csv file.');
      unprocessableError.status = 422;
      return next(unprocessableError);
    }
  
    return payrollService.parseCsvFile(req.file.buffer)
      .then(({reportId, payrollData}) => {
        res.locals.reportId = reportId;
        res.locals.payrollData = payrollData;
        return next();
      })
      .catch(() => {
        const serverError = new Error('Internal server error!');
        serverError.status = 500;
        return next(serverError);
      })
  };
}

module.exports = validateCsvFile;
