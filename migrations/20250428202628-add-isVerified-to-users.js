'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'isVerified', {
      type: Sequelize.BOOLEAN, // or Sequelize.ENUM('admin', 'user') if you want enum
      allowNull: false,
      defaultValue: false // or false depending on your case
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'isVerified');
  }
};
