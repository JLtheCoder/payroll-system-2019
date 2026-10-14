function list(dataAccess) {
  return () => {
    return dataAccess.listAllReports();
  }
}

module.exports = list;