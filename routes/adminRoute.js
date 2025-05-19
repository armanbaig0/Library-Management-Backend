const express = require('express')
const router = express.Router()
const adminController = require('../controllers/adminController')
// multer disk storage setup 
const path = require('path')
const multer = require('multer')

const storage = multer.diskStorage({
    destination : function(req, file, cb){      // cb stands CallBack
        cb(null, path.join(__dirname, '../public/files'));
    },
    filename : function(req, file, cb){
        const name = file.originalname;
        cb(null, name);
    } 

})
const upload = multer({ storage });

router.post('/add-books',upload.single('pdf'), adminController.addBooks)

router.get('/get-req', adminController.getRequest)

router.delete('/del-book', adminController.delBooks)

router.post("/handle-request", adminController.handleRequest)

router.post("/make-Form", adminController.makeForm)
module.exports = router