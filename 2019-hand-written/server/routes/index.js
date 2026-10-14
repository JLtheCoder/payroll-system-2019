const logger = require('morgan');
const apiRoutes = require('./api'); 
const errors = require('./errors');

function init(expressServer) {
  expressServer.use(logger('short'));
  expressServer.use('/api', apiRoutes);
  expressServer.use(errors.defaultHandler);
}

module.exports = {
  init,
};
