const { body, validationResult } = require('express-validator');

const loginValidation = [
  body('username_email').isString().withMessage('Username or email must be a string').notEmpty().withMessage('Username or email is required'),

  body('password').isString().withMessage('Password must be a string').notEmpty().withMessage('Password is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        data: null,
        error_details: errors.array(),
      });
    }
    next();
  },
];

module.exports = {
  loginValidation,
};
