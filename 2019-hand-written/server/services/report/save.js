function save(dataAccess) {
  return (reportData, reportUploadId) => {
    const newReportData = [];
    reportData.forEach((row) => {
      newReportData.push({
        ...row, report_upload_id: reportUploadId
      });
    });
    dataAccess.saveReportData(newReportData);
  };
}

module.exports = save;
