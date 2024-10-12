const { body, validationResult } = require('express-validator');

const updateUserValidation = [
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

  body('password')
    .optional()
    .isString()
    .withMessage('Password must be a string')
    .isLength({ min: 8, max: 255 })
    .withMessage('Password must be between 8 and 255 characters long'),

  body('confirm_password')
    .custom((value, { req }) => {
      if (req.body.password && (!value || value.trim() === '' || value === null || value === undefined)) {
        throw new Error('Confirm password is required if password is provided');
      }
      if (value && value !== req.body.password) {
        throw new Error('Confirm password must match password');
      }
      return true;
    }),

  body('role_code')
    .optional()
    .isString()
    .withMessage('Role code must be a string'),

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
  updateUserValidation,
};
