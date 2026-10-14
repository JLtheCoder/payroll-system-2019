const path = require('path');
const file = require('file');
const Sequelize = require('sequelize');
const config = require('../../config');

const sequelize = config.databaseUrl ? 
  new Sequelize(config.databaseUrl) :
  new Sequelize('database', null, null, {
    host: 'localhost',
    dialect: 'sqlite',
    operatorsAliases: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: !config.isProduction ? console.log : false,
    storage: path.join(__dirname, './database.sqlite'),
  });

const db = {};

file.walkSync(path.join(__dirname, '../models'), (start, dirs, names) => {
  names.forEach((name) => {
    const model = sequelize.import(path.join(start, name));
    db[model.name] = model;
  });
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

if (!config.isProduction) {
  sequelize.sync();
}

db.sequelize = sequelize;

module.exports = db;
