'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class StudentForm extends Model {
    static associate(models) {
      // Each student form belongs to one user (student)
      StudentForm.belongsTo(models.user, { 
        foreignKey: 'studentId',
        as: 'student',
      });

      // Each student form belongs to one form
      StudentForm.belongsTo(models.Form, {
        foreignKey: 'formId',
        as: 'form',
      });
    }
  }

  StudentForm.init(
    {
      formId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Forms', // 👈 Table name (not model name); check if yours is pluralized
          key: 'id',
        },
      },
      studentId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users', // 👈 Table name (not model name); Sequelize expects exact table name
          key: 'id',
        },
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cnic: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      regNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'StudentForm',
      tableName: 'StudentForms', // 👈 Optional but makes things more explicit and avoids issues
      underscored: false,        // set to true if your DB column names use snake_case
    }
  );

  return StudentForm;
};
