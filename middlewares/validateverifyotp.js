// middlewares/validateverifyOtp
const verifyOtpSchema = require('../JoiValidations/verifyOtp')

module.exports = (req, res, next) => {
    const { error } = verifyOtpSchema.validate(req.body);
  
    if (error) {
      return res.status(400).json({ 
          success : false,
          message: error.details[0].message });
    }
  
    next();
  };