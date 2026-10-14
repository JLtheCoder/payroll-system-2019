function getReport(reportService) {
  return async (req, res, next) => {
    try {
      const reportData = await reportService.get(req.params.reportId);
      if (!reportData) {
        const notFound = new Error('Report does not exist.');
        notFound.status = 404;
        throw notFound;
      }

      return res.json({ data: reportData });
    } catch(err) {
      return next(err);
    }
  }
}

module.exports = getReport;
