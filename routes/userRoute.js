const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const validateLoginWithJoi = require('../middlewares/validateLoginJoi')
const validateVerifyOtp = require('../middlewares/validateverifyotp')
const verifyToken = require('../middlewares/verifyToken')

// Protect the route
router.get('/profile', verifyToken, (req, res) => {
res.json({ message: `Hello ${req.user.fullname}, this is your profile.` });
});

//Post /users -Creating new users
router.post('/signup', userController.createUser)

// POST /otp - sends otp to emails
router.post('/otp', userController.sendOtp)

//POST /Otp - Verify Otp 
router.post('/verify-otp',validateVerifyOtp ,userController.verifyOtp)

// POST /login - login from existing user
router.post('/login',validateLoginWithJoi, userController.loginUser)

// Forgot-Passwort 
router.post('/forgot-password', userController.forgotPassword)

// POST /login - login from existing user
router.post('/forgot-verify', userController.ForgotOtp)

//POST /ChangePass - changing password for user
router.post('/ChangePass', userController.ChangePass)

// Post / LogoutUser 
router.post('/logout', userController.logOut)

//Get / getting all data of students to display as in a form.. 
router.get('/get-students', userController.getStudents)
    

module.exports = router
