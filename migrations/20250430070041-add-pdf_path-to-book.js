'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('books', 'book_path', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue : "" // or false depending on your need
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('books', 'book_path');
  }
};
