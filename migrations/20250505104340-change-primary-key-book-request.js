'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     * We are removing the current primary key on 'book_id' and setting the new primary key on 'request_id'.
     */

    // Remove the existing primary key constraint (if it's on book_id)
    await queryInterface.removeConstraint('book_request', 'book_request_pkey');  // Replace 'book_request_pkey' with the actual constraint name if different.

    // Add the new primary key constraint on 'request_id'
    await queryInterface.addConstraint('book_request', {
      fields: ['request_id'],
      type: 'primary key',
      name: 'book_request_pkey',  // Name for the primary key constraint
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     * This will undo the changes made in the 'up' method.
     */

    
    // Remove the primary key on 'request_id'
    await queryInterface.removeConstraint('book_request', 'book_request_pkey');

    // Optionally, revert back to the old primary key (book_id)
    await queryInterface.addConstraint('book_request', {
      fields: ['book_id'],
      type: 'primary key',
      name: 'book_request_pkey',  // Name for the primary key constraint
    });
  }
};
