//JoiVlidations/verifyOtp
const Joi = require('joi');

const verifyOtpSchema = Joi.object({
    email : Joi.string().email().required(),
    otp: Joi.string().length(6).required()
});


module.exports =  verifyOtpSchema