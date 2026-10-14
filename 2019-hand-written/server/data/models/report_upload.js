module.exports = (sequelize, DataTypes) => {
  const report_upload = sequelize.define(
    'report_upload', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      csv_report_id: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
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
      tableName: 'report_upload',
      createdAt: 'created_date',
      updatedAt: 'modified_date',
      underscored: true,
    },
  );
  return report_upload;
};