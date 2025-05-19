const { Book, book_request, Form, FormField  } = require('../models')
const fs = require('fs')
const path = require('path')
const logger = require('../utils/logger')


  // Admin is entering Books 
const addBooks = async (req, res) => {
  let status, response
  try{
     const {book_name, book_author } = req.body
     const file = req.file

     if(!file){
      status = 404,
      response = {message : "Success"}
     }
     // Check for book already entered
     const  isExist = await Book.findOne({ where: { book_path : file.filename } });
     if( isExist ){
      return res.status(200).json({
          success : false,
          msg: "Book already Entered!"
      });
     }

     // Entering new book
      const newBook = await Book.create({book_name, book_author, 
        book_path : file.filename
      });
        return res.status(200).json({
        success : true,
        msg: "Book Entered Successfully",
        book : newBook
    });

  }catch (error) {
    // logger function
  }
  return res.status(status).json({response});
};

//Deleting books
const delBooks = async (req, res) => {
  try {
    const { book_id, book_name, book_author } = req.body;

    // Find the book in the database by its unique ID, name, and author
    const book = await Book.findOne({ where: { book_id, book_name, book_author } });

    if (!book) {
      return res.status(404).json({
        success: false,
        msg: 'Book not found'
      });
    }

    // Get the file path for the uploaded PDF (assuming book_path contains the file name)
    const filePath = path.join(__dirname, '../public/files', book.book_path);

    // Delete the file from the file system
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json({
          success: false,
          msg: 'Failed to delete book file'
        });
      }

      // Delete the book from the database
      await Book.destroy({
        where: { book_id, book_name, book_author }
      });

      return res.status(200).json({
        success: true,
        msg: 'Book Deleted Successfully',
      });
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message
    });
  }
};

//Admin is getting all requests from database 
const getRequest = async(req, res) =>{
  try{
    // fetch all Requests from database
     const request = await book_request.findAll();

     if(request.length === 0){
       return res.status(404).json({
           success: false,
           msg: "No Requests found"
         });
     }
     //Return all books
     return res.status(200).json({
       success: true,
       msg: "Requests retrieved successfully",
       request: request
     });

}catch(error){
   return res.status(400).json({
       success: false,
       msg: error.message
     });
}
};

// Hnadle Students Requests
const handleRequest = async (req, res) => {
  try {
    const { request_id, action } = req.body; // action: 'accept' or 'reject'
    
    const request = await book_request.findOne({ where: { request_id } });
    if (!request) {
      return res.status(404).json({
        success: false,
        msg: 'Request not found'
      });
    }

    if (action === 'accept') {
      await book_request.update(
        { status: 'accepted' },
        { where: { request_id } }
      );
      
      // Make book available for download
      await Book.update(
        { is_available: true },
        { where: { book_id: request.book_id } }
      );

      return res.status(200).json({
        success: true,
        msg: 'Request accepted successfully'
      });
    } else if (action === 'reject') {
      await book_request.update(
        { status: 'rejected' },
        { where: { request_id } }
      );

      return res.status(200).json({
        success: true,
        msg: 'Request rejected successfully'
      });
    } else {
      return res.status(400).json({
        success: false,
        msg: 'Invalid action'
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message
    });
  }
};

const makeForm = async (req, res) => {
    try {
    const { label, fields } = req.body;

    // Create form entry
    const form = await Form.create({ label });

    // Create form fields with form_id FK
    const formFieldsData = fields.map(field => ({
      label: field.label,
      form_id: form.id
    }));

    await FormField.bulkCreate(formFieldsData);

    res.status(201).json({ message: 'Form and fields saved successfully', formId: form.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to save form' });
  }
};

module.exports = {
    addBooks,
    getRequest,
    delBooks,
    handleRequest,
    makeForm
}