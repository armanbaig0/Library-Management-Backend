const { user } = require('../models')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()
const mailer = require('../helpers/mailer');
const { where } = require('sequelize');
  
//SignUp api
 const createUser = async (req, res) => {
    try {
        const { fullname, email, password, } = req.body
        // Check for Email already registered
        const  isExist = await user.findOne({ where: { email } });
           if( isExist ){
            return res.status(400).json({
                success : false,
                msg: "Email Already Exists!"
            });
           }
        // hash the passsword
        const hashed = await bcrypt.hash(password, 10)

        const newUser = await user.create({
            fullname,
            email,
            password: hashed,
            role : "Student",
            isVerified : false,
        });

        const gotp = await generate6d();

        await user.update(
            {
                otp: gotp,
                otpExpires: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes expiry
            },
            {
                where: { email: email }
            }
        );

        const msg = `<p>Hello ${fullname},</p><h4>Your OTP is: ${gotp}</h4>`;
        mailer.sendMail(email, 'Mail OTP Verification', msg);

        return res.status(200).json({
            success : true,
            msg: "Registered Successfully",
            user: newUser
        });

    } catch (error) {
        return res.status(400).json({
            success : false,
            msg: error.message
        });
    }
};

//Send Otp to Emails
const generate6d = async() =>{
   return Math.floor(100000 + Math.random() * 900000);
};

const sendOtp = async(req, res) =>{
    try{
 
     const {email} = req.body;
     const userData = await user.findOne({ where : { email } }); // this is where user enters his email
 
     if(!userData){
         return req.status(400).json({
             success: false,
             msg: "Email doesn't exists!"
         })
     }
 
      const gotp = await generate6d();
      
      await user.update(
         {
             otp : gotp,
             otpExpires: new Date(Date.now() + 5 * 60 * 1000)
         },
         {
             where :{ email : email }
         }
      );
      const msg = `<p>Hello ${userData.fullname},</p><h4>Your OTP is: ${gotp}</h4>`;
 
     mailer.sendMail(email, 'Mail OTP Verification', msg);
 
     return res.status(200).json({
         success : true,
         msg: "Otp has been sent to your Email, please check!"
     });
 
    }catch (error) {
         return res.status(400).json({
             success : false,
             msg: error.message
         });
    }
 };
 
//Verify Otp send to email 
const verifyOtp = async (req, res) =>{
  try{

   const { email, otp } = req.body;
      const otpData = await user.findOne({
        where : {email, otp}
      });

      if(!otpData){
        return res.status(400).json({
            success : false,
            msg: "Otp did not match!"
        });
      }
      //check if otp is expired
      if (new Date(otpData.otpExpires) < new Date()) {
        return res.status(400).json({
            success: false,
            msg: "OTP has expired. Please request a new one."
        });
    }
    await user.update(
        { 
          isVerified: true,  
        },
        { where: { email : email }
    });
    return res.status(200).json({
        success : true,
        msg: "User Verified Successfully"
    });

  }catch(error){
    return res.status(400).json({
        success : false,
        msg: error.message
    });
  }
};

// Login Api 
const loginUser = async (req, res) => {
    try {
        
        const {email, password, role} = req.body;
        const User = await user.findOne({ where: { email } });

        if (!User) {
            return res.status(400).json({ error: "Email does not exist" });
        }

        if (User.role !== role) {
            return res.status(400).json({ message: "Selected role does not match with registered role" });
        }

        if (!User.isVerified) {
            return res.status(400).json({ message: "Please Verify Yourself First" });
        }

        const passwordMatch = await bcrypt.compare(password, User.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: "Incorrect password" });
        }

        {/* Creating JWT */ }
            const token = jwt.sign(
                { 
                  id : User.id,
                  fullname : User.fullname,
                  email: User.Email, 
                  role: User.role,
                    }, // payload
                process.env.SECRET_KEY,                       // SECRET_KEY
                { expiresIn: '1h' }               // token expiry
            );
       
            return res.status(200).json({ 
            success: true,
            message: "Login successful", 
            token,
            role: User.role,
            user: {
                id: User.id,
                fullname: User.fullname,
                email: User.email

            }
        });

    } catch (error) {
        return res.status(500).json({ 
          success: false,
          msg : error.message    
        });
    }
};

//Forgot-Password API 
const forgotPassword = async(req, res) => {
    try{        

        const {email} = req.body;
        const userData = await user.findOne({ where : { email }  }); // this is where user enters his email

        if(!userData){
            return res.status(400).json({
                success: false,
                msg: "Email doesn't exists!"
            })
        }

        const gotp = await generate6d();
     
     await user.update(
        {
            otp : gotp,
            otpExpires: new Date(Date.now() + 5 * 60 * 1000)
        },
        {
            where :{ email : email }
        }
     );
     const msg = `<p>Hello ${userData.fullname},</p><h4>Your OTP For Forgot Password is: ${gotp}</h4>`;

    await mailer.sendMail(email, 'Mail OTP Verification', msg);

    return res.status(200).json({
        success : true,
        msg: "Otp has been sent to your Email, please check!"
    });

    }catch (error) {
        return res.status(400).json({
            success : false,
            msg: error.message
        });
    }
};

//VerifyOtp for forgot password
const ForgotOtp = async (req, res) =>{
    try{
  
     const { email, otp } = req.body;
        const otpData = await user.findOne({
          where : {email, otp}
        });
  
        if(!otpData){
          return res.status(400).json({
              success : false,
              msg: "Otp did not match!"
          });
        }
        //check if otp is expired
        if (new Date(otpData.otpExpires) < new Date()) {
          return res.status(400).json({
              success: false,
              msg: "OTP has expired. Please request a new one."
          });
      }
      return res.status(200).json({
          success : true,
          msg: "Email Verified Successfully"
      });
  
    }catch(error){
      return res.status(400).json({
          success : false,
          msg: error.message
      });
    }
  };

//Api For changing password
const ChangePass = async (req, res) =>{

    try {
        const { email, new_password } = req.body
        const  isExist = await user.findOne({ where: { email } });
           if( !isExist ){
            return res.status(400).json({
                success : false,
                msg: "Email does not exists!"
            });
           }
        
        // hash the passsword
        const hashed = await bcrypt.hash(new_password, 10)

        const newPass = await user.update({
            password: hashed,
        },
        {
            where : {email : email}
        }
    );
        return res.status(200).json({
            success : true,
            msg: "Password Changed Successfully",
            user: newPass
        });

    } catch (error) {
        return res.status(400).json({
            success : false,
            msg: error.message
        });
    }
};
  
// Api for Logout
const logOut = async (req, res) =>{
    try {
        res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Error logging out' });
    }
};

module.exports = {
    createUser,
    loginUser,
    forgotPassword,
    sendOtp,
    verifyOtp,
    ForgotOtp,
    ChangePass,
    logOut
}