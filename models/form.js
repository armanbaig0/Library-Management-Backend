'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Form extends Model {
    static associate(models) {
      Form.hasMany(models.StudentForm, {
      foreignKey: 'formId',
      as: 'formSubmissions'
});
    }
  }
  Form.init({
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    selectedFields: {
      type: DataTypes.JSONB, // ✅ PostgreSQL-specific
      allowNull: true,       // can be empty initially
      defaultValue: []
    }
  }, {
    sequelize,
    modelName: 'Form',
  });
  return Form;
};
