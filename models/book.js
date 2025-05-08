'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
       // Book has many book_requests
      Book.hasMany(models.book_request, {
      foreignKey: 'book_id',
      as: 'requests'
  });
    }
  }
  Book.init({
    book_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    book_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    book_author: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    book_path: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_available: {
      type : DataTypes.BOOLEAN,
      allowNull : false,
      defaultValue: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
     defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    tableName: 'books',
    modelName: 'Book',
    });
  return Book;
};