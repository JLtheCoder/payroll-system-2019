const saveUploadId = require('./save_upload_id');
const dataAccess = require('../../data/access');
const save = require('./save');
const get = require('./get');
const list = require('./list');

module.exports = {
  saveUploadId: saveUploadId(dataAccess),
  save: save(dataAccess),
  get: get(dataAccess),
  list: list(dataAccess),
};