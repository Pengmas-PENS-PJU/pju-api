const { body, validationResult } = require("express-validator");

const validateCreateUser = [
  body("email").isEmail().withMessage("Email is invalid").normalizeEmail(),

  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters long"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/\d/)
    .withMessage("Password must contain a number"),

  body("role")
    .isIn(["ADMIN", "OPERATOR"])
    .withMessage("Role must be either admin or user"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// validate update

module.exports = {
  validateCreateUser,
};
