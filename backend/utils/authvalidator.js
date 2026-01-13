const helper = require("./helper");
const { body, validationResult } = require("express-validator");

module.exports = {
  // Signup
  signUpValidator: [
    body("name").notEmpty().withMessage("Name is required"),
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email"),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
      .withMessage(
        "Password must contain at least one lowercase letter, uppercase letter, number, and special character"
      ),
  ],

  // Login
  loginValidator: [
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],

  //Check validation
  validate: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return helper.error(res, "", errors.array(), 400);
    }
    next();
  },
};
