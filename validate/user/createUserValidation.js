const { body, validationResult } = require('express-validator');

const createUserValidation = [
  body('username')
    .isString()
    .withMessage('Username must be a string')
    .notEmpty()
    .withMessage('Username is required')
    .isAlphanumeric()
    .withMessage('Username must contain only alphanumeric characters')
    .isLength({ min: 4, max: 255 })
    .withMessage('Username must be between 4 and 255 characters long'),

  body('name').isString().withMessage('Name must be a string').notEmpty().withMessage('Name is required').isLength({ min: 3, max: 255 }).withMessage('Name must be between 3 and 255 characters long'),

  body('email').isEmail().withMessage('Email is invalid').notEmpty().withMessage('Email is required'),

  body('password').isString().withMessage('Password must be a string').notEmpty().withMessage('Password is required').isLength({ min: 8, max: 255 }).withMessage('Password must be between 8 and 255 characters long'),

  body('confirm_password')
    .isString()
    .withMessage('Confirm password must be a string')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Confirm password must match password');
      }
      return true;
    }),

  body('role_code').isString().withMessage('Role code must be a string').notEmpty().withMessage('Role code is required'),

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
  createUserValidation,
};
