const express = require('express')
const router = express.Router()
const  studentController = require('../controllers/studentController')

router.get('/get-books', studentController.getBooks)

router.post('/req-book', studentController.reqBooks)

router.get('/request-status', studentController.getRequestStatus)

router.get('/get-Form', studentController.getForm)

router.post('/submit-Form', studentController.submitForm)

router.post('/add-Info', studentController.addInfo)

router.get('/get-Info', studentController.getInfo)

module.exports = router