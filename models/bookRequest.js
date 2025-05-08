'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class book_request extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // book_request belongs to Book
      book_request.belongsTo(models.Book, {
      foreignKey: 'book_id',
      as: 'book'
  });
    }
  }
  book_request.init({
    request_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'books',  // table name, not model name
        key: 'book_id',
      },
    },
    student_name: {
        type: DataTypes.STRING,
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
    request_date: {
        type: DataTypes.DATE,
        defaultValue : DataTypes.NOW
    },
    status: {
      type : DataTypes.STRING,
      allowNull : false,
      defaultValue : "pending"
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
    tableName: 'book_request',
    modelName: 'book_request',
    });
  return book_request;
};