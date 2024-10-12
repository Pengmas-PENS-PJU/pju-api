const { body, validationResult } = require('express-validator');

const updatePasswordValidation = [
  body('old_password').isString().withMessage('Old password must be a string').notEmpty().withMessage('Old password is required'),

  body('new_password').isString().withMessage('New password must be a string').notEmpty().withMessage('New password is required').isLength({ min: 8, max: 255 }).withMessage('New password must be between 8 and 255 characters long'),

  body('confirm_password')
    .isString()
    .withMessage('Confirm password must be a string')
    .notEmpty()
    .withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.new_password) {
        throw new Error('Confirm password must match with new password');
      }
      return true;
    }),

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
  updatePasswordValidation,
};
