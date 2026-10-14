const config = require('../../config');

module.exports = (sequelize, DataTypes) => {
  const payroll_data = sequelize.define(
    'payroll_data', {
      report_upload_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      pay_date: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      hours_worked: {
        allowNull: false,
        type: config.databaseUrl ? DataTypes.FLOAT : DataTypes.REAL,
      },
      employee_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      job_group: {
        allowNull: false,
        type: DataTypes.STRING,
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
      tableName: 'payroll_data',
      createdAt: 'created_date',
      updatedAt: 'modified_date',
      underscored: true,
    },
  );
  payroll_data.associate = (models) => {
    models.payroll_data.belongsTo(
      models.report_upload,
      { targetKey: 'id', foreignKey: 'report_upload_id' },
    );
  };
  return payroll_data;
};