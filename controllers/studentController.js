const { Book, book_request } = require('../models')

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


module.exports = {
    getBooks,
    reqBooks,
    getRequestStatus
}