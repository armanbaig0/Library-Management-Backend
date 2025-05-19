'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Form extends Model {
    static associate(models) {
      // One Form has many FormFields
      Form.hasMany(models.FormField, { foreignKey: 'form_id', as: 'fields' });
    }
  }
  Form.init({
    label: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Form',
  });
  return Form;
};
