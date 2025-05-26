const { Book, book_request, Form, StudentForm, user } = require('../models')

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

//Student getting thier Information
const getInfo = async (req, res) => {
  const { userId, role } = req.cookies;

  if (!userId || role !== 'Student') {
    return res.status(401).json({ success: false, msg: 'Unauthorized access' });
  }

  try {
    const User = await user.findByPk(userId);

    if (!User) {
      return res.status(404).json({ success: false, msg: 'Student not found' });
    }

    const readonlyFields = {};
    const editableFields = {};

    for (const [key, value] of Object.entries(User.dataValues || {})) {
      if (key === 'UserId') continue;
      if (value) {
        readonlyFields[key] = value;
      } else {
        editableFields[key] = '';
      }
    }

    return res.status(200).json({
      success: true,
      msg: 'Student data retrieved successfully',
      readonlyFields,
      editableFields
    });

  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
  }
};


//Student Adding their Information
const addInfo = async (req, res) => {
  const { userId, role } = req.cookies;

  if (!userId || role !== 'Student') {
    return res.status(401).json({ success: false, msg: 'Unauthorized access' });
  }

  try {
    const User = await user.findByPk(userId);

    if (!User) {
      return res.status(404).json({ success: false, msg: 'Student not found' });
    }

    const updates = {};

    for (const [key, value] of Object.entries(req.body)) {
      if (User[key] === null || User[key] === '') {
        updates[key] = value;
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        msg: 'No missing fields to update or all fields already filled'
      });
    }

    await User.update(updates);

    return res.status(200).json({
      success: true,
      msg: 'Missing fields updated successfully',
      updatedFields: updates
    });

  } catch (error) {
    return res.status(400).json({ success: false, msg: error.message });
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
      return res.status(200).json({
        success: true,
        msg: "No requests found",
        requests: []
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

//Api to get Forms
const getForm = async (req, res) => {
  try {
    const id = req.cookies.userId; // Replace with req.user.id from JWT in production

    if (!id) {
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    // Step 1: Get the latest form (ordered by createdAt)
    const latestForm = await Form.findOne({
      order: [['createdAt', 'DESC']],
      raw: true,
    });

    if (!latestForm) {
      return res.status(404).json({ message: 'No form found.' });
    }

    const selectedFields = latestForm.selectedFields; // Already an array

    // Step 2: Get user data
    const User = await user.findByPk(id, { raw: true });

    // Step 3: Define mapping from form labels to DB field names
    const mapping = {
      'fullname': 'fullname',
      'email': 'email',
      'phoneno': 'phoneno',
      'address': 'address',
      'cnic': 'cnic',
      'regno': 'regno',
    };

    // Step 4: Build response with values
    const fieldsWithValues = selectedFields.map((label) => {
      const userField = mapping[label.toLowerCase()];
      return {
        label,
        value: userField && User && User[userField] ? User[userField] : 'N/A',
      };
    });

    res.status(200).json({ fields: fieldsWithValues });
  } catch (error) {
    console.error('Error loading form with values:', error);
    res.status(500).json({ message: 'Failed to load form data.' });
  }
};

//Api to submit form 

const submitForm = async (req, res) => {
  try {
    let {
      formId,
      fullName,
      regNo,
      phoneNo,
      address,
      email,
      cnic
    } = req.body;

    // Get studentId from cookies (userId key)
    const studentId = req.cookies.userId;  // assuming cookie name is userId

    if (!studentId) {
      return res.status(400).json({ message: "Student ID not found in cookies" });
    }

    if (!formId) {
      const latestForm = await Form.findOne({ order: [['createdAt', 'DESC']] });
      formId = latestForm?.id;
      if (!formId) {
        return res.status(400).json({ message: "Form not found" });
      }
    }

    const foundUser = await user.findByPk(studentId);
    if (!foundUser) {
      return res.status(404).json({ message: "User not found" });
    }

    fullName = fullName || foundUser.fullname || "N/A";
    email = email || foundUser.email || "N/A";
    cnic = cnic || foundUser.cnic || "N/A";
    regNo = regNo || "N/A";
    phoneNo = phoneNo || "N/A";
    address = address || "N/A";

    const studentForm = await StudentForm.create({
      formId,
      studentId,
      fullName,
      regNo,
      phoneNo,
      address,
      email,
      cnic
    });

    res.status(201).json({ message: "Form submitted successfully", studentForm });

  } catch (err) {
    console.error("Form submission error:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

module.exports = {
    getBooks,
    reqBooks,
    getRequestStatus,
    getForm,
    submitForm,
    addInfo,
    getInfo
}
