function defaultHandler(err, req, res, next) {
  const status = err.status || 500;

  console.error(err);

  return res.status(status).json({
    error: err.message,
    status,
  });
}

module.exports = {
  defaultHandler,
};