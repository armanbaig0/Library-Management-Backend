'use strict';
/** @type {import('sequelize').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('book_request', {
      book_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      student_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      book_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      book_author: {
        type: DataTypes.STRING,
        allowNull: false
      },
      request_date: {
        type: DataTypes.DATE,
        defaultValue : DataTypes.NOW
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('book_request');
  }
};