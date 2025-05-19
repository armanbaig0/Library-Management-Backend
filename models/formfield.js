'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FormField extends Model {
    static associate(models) {
      // Each FormField belongs to a Form
      FormField.belongsTo(models.Form, { foreignKey: 'form_id', as: 'form' });
    }
  }
  FormField.init({
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'FormField',
  });
  return FormField;
};
