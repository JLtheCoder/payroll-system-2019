function saveUploadId(dataAccess) {
  return (reportId) => {
    return dataAccess.saveReportUpload(reportId);
  };
}

module.exports = saveUploadId;