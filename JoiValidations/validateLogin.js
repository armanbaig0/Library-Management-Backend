const joi = require('joi');

const loginSchema = joi.object({
    email : joi.string().email().required(),
    password: joi.string().min(8).required(),
    role: joi.string().valid('Admin', 'Student').required()
});

module.exports = loginSchema