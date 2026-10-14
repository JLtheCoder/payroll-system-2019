function savePayrollData(dataAccess) {
  return (payrollData, reportUploadId) => {
    const newPayrollData = [];
    payrollData.forEach((row) => {
      newPayrollData.push({
        ...row, report_upload_id: reportUploadId
      });
    });
    dataAccess.savePayrollData(newPayrollData);
  };
}

module.exports = savePayrollData;