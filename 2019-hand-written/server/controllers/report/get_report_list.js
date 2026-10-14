function getReportList(reportService) {
  return async (req, res, next) => {
    try {
      const reportIds = await reportService.list();
      return res.json({ data: reportIds });
    } catch(err) {
      return next;
    }
  }
}

module.exports = getReportList;
