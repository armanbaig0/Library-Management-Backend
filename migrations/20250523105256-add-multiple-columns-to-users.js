'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'regno',{
      type : Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'phoneno', {
      type: Sequelize.STRING,
      allowNull: true,
  });
    await queryInterface.addColumn('users', 'address', {
      type: Sequelize.STRING,
      allowNull: true,
  });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'regno');
    await queryInterface.removeColumn('users', 'phoneno');
    await queryInterface.removeColumn('users', 'address');
  }
};
