// middlewares/validateLoginWithJoi.js
const loginSchema = require('../JoiValidations/validateLogin');

module.exports = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ 
        message: error.details[0].message });
  }

  next();
};