const { body, validationResult } = require('express-validator');

const updateProfileValidation = [
  body('username')
    .optional()
    .isString()
    .withMessage('Username must be a string')
    .isAlphanumeric()
    .withMessage('Username must contain only alphanumeric characters')
    .isLength({ min: 4, max: 255 })
    .withMessage('Username must be between 4 and 255 characters long'),

  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string')
    .isLength({ min: 3, max: 255 })
    .withMessage('Name must be between 3 and 255 characters long'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Email is invalid'),

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
  updateProfileValidation,
};
