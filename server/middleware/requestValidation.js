const {
  body,
  validationResult,
  check,
  query,
  param,
} = require("express-validator");

const forgotPasswordValidation = () => [
  body()
    .custom((value, { req }) => Object.keys(req.body).length !== 0)
    .withMessage("Data Not found"),
  check("emailId").exists().withMessage("email-Id can't be null"),
  body("emailId")
    .notEmpty()
    .withMessage("email-Id can't be empty")
    .trim()
    .isEmail()
    .withMessage("enter valid emailid"),
];
const resetPasswordValidation = () => [
  body()
    .custom((value, { req }) => Object.keys(req.body).length !== 0)
    .withMessage("Data Not found"),
  check("newPassword").exists().withMessage("newPassword can't be null"),
  body("newPassword")
    .notEmpty()
    .withMessage("newPassword can't be empty")
    .trim()
    .matches(
      /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])[A-Za-z0-9!@#$%^&*]{6,}$/
    )
    .withMessage(
      "Invalid newPassword, newPassword must have atleast one uppercase, one number,one special character and minimum 6 length"
    ),
  check("confirmPassword")
    .exists()
    .withMessage("confirmPassword can't be null"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword can't be empty")
    .trim(),
  check("confirmPassword")
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage("Password not matched"),
];

const signUpValidation = () => [
  body()
    .custom((value, { req }) => Object.keys(req.body).length !== 0)
    .withMessage("Data Not found"),
  check("userName").exists().withMessage("user name can't be null"),
  body("userName").trim().notEmpty().withMessage("user name can't be empty"),
  body("email")
    .notEmpty()
    .withMessage("email adress can't be empty")
    .trim()
    .isEmail()
    .withMessage("enter valid email adress"),
  check("password").exists().withMessage("password can't be null"),
  body("password")
    .notEmpty()
    .withMessage("password can't be empty")
    .trim()
    .isLength({ min: 6 })
    .withMessage(
      "password must be atleast 6 character long"
    ),
  check("confirmPassword")
    .exists()
    .withMessage("confirmPassword can't be null"),
  body("confirmPassword")
    .notEmpty()
    .withMessage("confirmPassword can't be empty")
    .trim(),
  check("confirmPassword")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Password not matched"),
];

const signInValidation = () => [
  body()
    .custom((value, { req }) => Object.keys(req.body).length !== 0)
    .withMessage("Data Not found"),
  check("email").exists().withMessage("email adress can't be null"),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("email adress can't be empty")
    .isEmail()
    .withMessage("enter valid email address"),
  check("password").exists().withMessage("password can't be null"),
  body("password")
    .notEmpty()
    .withMessage("password can't be empty")
    .isLength({ min: 6 })
    .withMessage("password must be atleast 6 character long"),
];

const searchValidation = () => [
  query("question").notEmpty().withMessage("enter the question in query"),
];

const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    // const extractedErrors = [];
    errors.array().filter((err) => err);
    return res.status(400).json({
        status: "Fail",
        message: errors.errors[0].msg,
    });
};

module.exports = {
    validate,
    signUpValidation,
    signInValidation,
    forgotPasswordValidation
}
