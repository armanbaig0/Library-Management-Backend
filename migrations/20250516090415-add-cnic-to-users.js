'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'cnic', {
      type: Sequelize.STRING, // or Sequelize.ENUM('admin', 'user') if you want enum
      allowNull: false,
      unique: true,
       // or false depending on your case
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'cnic');
  }
};
