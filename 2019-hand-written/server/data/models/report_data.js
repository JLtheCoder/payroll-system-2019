const config = require('../../config');

module.exports = (sequelize, DataTypes) => {
  const report_data = sequelize.define(
    'report_data', {
      report_upload_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      employee_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      pay_period: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      amount_paid: {
        allowNull: false,
        type: config.databaseUrl ? DataTypes.FLOAT : DataTypes.REAL,
      },
      created_date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      modified_date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'report_data',
      createdAt: 'created_date',
      updatedAt: 'modified_date',
      underscored: true,
    },
  );
  report_data.associate = (models) => {
    models.report_data.belongsTo(
      models.report_upload,
      { targetKey: 'id', foreignKey: 'report_upload_id' },
    );
  };
  return report_data;
};