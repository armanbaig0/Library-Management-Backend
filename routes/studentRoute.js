const express = require('express')
const router = express.Router()
const  studentController = require('../controllers/studentController')

router.get('/get-books', studentController.getBooks)

router.post('/req-book', studentController.reqBooks)

router.get('/request-status', studentController.getRequestStatus)


module.exports = router