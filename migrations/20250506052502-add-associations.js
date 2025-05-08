module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('book_request', {
      fields: ['book_id'],
      type: 'foreign key',
      name: 'book_request_book_id_fk', // Custom name for the foreign key
      references: {
        table: 'books', // The table to reference
        field: 'book_id', // The field in the referenced table
      },
      onDelete: 'CASCADE', // Optional: Defines behavior when the referenced row is deleted
      onUpdate: 'CASCADE', // Optional: Defines behavior when the referenced row is updated
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('book_request', 'book_request_book_id_fk');
  }
};
