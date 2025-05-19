const { Book, book_request, Form, FormField, user } = require('../models')

// fetching all books from admin and shows to student
const getBooks = async(req, res) =>{
   
    try{
         // fetch all books from database
          const books = await Book.findAll();

          if(books.length === 0){
            return res.status(404).json({
                success: false,
                msg: "No books found"
              });
          }
          //Return all books
          return res.status(200).json({
            success: true,
            msg: "Books retrieved successfully",
            books: books
          });

    }catch(error){
        return res.status(400).json({
            success: false,
            msg: error.message
          });
    }
};

//Student make Request for Books 
const reqBooks = async(req, res) => {
  try {
      const {student_name, book_name, book_author} = req.body;
      
      // Find book to get book_id
      const book = await Book.findOne({ 
          where: { book_name, book_author }
      });
      
      if (!book) {
          return res.status(404).json({
              success: false,
              msg: "Book not found"
          });
      }

      const newBook = await book_request.create({
          student_name,
          book_name,
          book_author,
          book_id: book.book_id
      });
      
      return res.status(200).json({
          success: true,
          msg: "Request Made Successfully",
          book: newBook
      });
  } catch (error) {
      return res.status(400).json({
          success: false,
          msg: error.message
      });
  }
};

// API to get student's request status
const getRequestStatus = async (req, res) => {
  try {
    const { student_name } = req.query;

    // Check if student_name is missing or empty
    if (!student_name || student_name.trim() === '') {
      return res.status(400).json({
        success: false,
        msg: "student_name is required"
      });
    }

    const requests = await book_request.findAll({
      where: { student_name },
      include: [
        {
          model: Book,
          as: 'book',
          attributes: ['book_path', 'is_available']
        }
      ]
    });

    if (requests.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No requests found for this student"
      });
    }

    // Map requests to include book_path directly in the response
    const formattedRequests = requests.map(request => ({
      ...request.toJSON(),
      book_path: request.book ? request.book.book_path : null,
      is_available: request.book ? request.book.is_available : false
    }));

    return res.status(200).json({
      success: true,
      msg: "Requests retrieved successfully",
      requests: formattedRequests
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      msg: error.message
    });
  }
};

const getForm = async (req, res) => {
   try {
    const id = 2; // ya req.user.id (auth lagao)
    
    // 1. Get the form labels from FormField table
    const formFields = await FormField.findAll({
      where: { form_id: 10 },
      attributes: ['label'],
      raw: true
    });

    // 2. Get the student record from Users table
    const User = await user.findByPk(id, { raw: true });

    // 3. Map form labels to user fields & build response
    const fieldsWithValues = formFields.map(({ label }) => {
      // Example mapping (label to user column):
      // You might want to define a proper mapping here
      const mapping = {
      'fullname': 'fullname',      // label in FormField is 'fullname', user table column is 'name'
      'email': 'email',
      'phone no': 'phone_no',
      'address': 'address',
      'cnic': 'cnic',
      'reg no': 'reg_no'
};


      const userField = mapping[label];

      return {
        label,
        value: userField && User && User[userField] ? User[userField] : 'N/A'
      };
    });

    res.status(200).json({ fields: fieldsWithValues });
  } catch (error) {
    console.error('Error loading form with values:', error);
    res.status(500).json({ message: 'Failed to load form data.' });
  }
};

module.exports = {
    getBooks,
    reqBooks,
    getRequestStatus,
    getForm
}