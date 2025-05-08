'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Set book_id to NULL for invalid book_id values
    await queryInterface.sequelize.query(`
      UPDATE book_request
      SET book_id = NULL
      WHERE book_id IS NOT NULL
      AND book_id NOT IN (SELECT book_id FROM books);
    `);

    // Step 2: Update book_id for rows with matching book_name and book_author
    await queryInterface.sequelize.query(`
      UPDATE book_request
      SET book_id = (
        SELECT book_id
        FROM books
        WHERE books.book_name = book_request.book_name
        AND books.book_author = book_request.book_author
        LIMIT 1
      )
      WHERE book_id IS NULL
      AND EXISTS (
        SELECT 1
        FROM books
        WHERE books.book_name = book_request.book_name
        AND books.book_author = book_request.book_author
      );
    `);

    // Step 3: Delete book_request rows without a valid book_id
    await queryInterface.sequelize.query(`
      DELETE FROM book_request
      WHERE book_id IS NULL;
    `);

    // Step 4: Alter book_id to be non-nullable
    await queryInterface.changeColumn('book_request', 'book_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'books',
        key: 'book_id'
      }
    });

    // Step 5: Add foreign key constraint (if not already present)
    await queryInterface.addConstraint('book_request', {
      fields: ['book_id'],
      type: 'foreign key',
      name: 'fk_book_id',
      references: {
        table: 'books',
        field: 'book_id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove foreign key constraint
    await queryInterface.removeConstraint('book_request', 'fk_book_id');

    // Revert book_id to allowNull: true
    await queryInterface.changeColumn('book_request', 'book_id', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};