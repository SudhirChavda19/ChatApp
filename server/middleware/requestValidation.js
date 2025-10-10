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
  check("email").exists().withMessage("email-Id can't be null"),
  body("email")
    .notEmpty()
    .withMessage("email-Id can't be empty")
    .trim()
    .isEmail()
    .withMessage("enter valid email address"),
  check("newPassword").exists().withMessage("new password can't be null"),
  body("newPassword")
    .notEmpty()
    .withMessage("new password can't be empty")
    .trim()
    .isLength({ min: 6 })
    .withMessage("new password must be atleast 6 character long")
    .isLength({ max: 30 })
    .withMessage("new password maximum 30 character long"),
];

const signUpValidation = () => [
  body()
    .custom((value, { req }) => Object.keys(req.body).length !== 0)
    .withMessage("Data Not found"),
  check("userName").exists().withMessage("user name can't be null"),
  body("userName")
    .trim()
    .notEmpty()
    .withMessage("user name can't be empty")
    .isLength({ min: 4 })
    .withMessage("user name must be atleast 4 character long")
    .isLength({ max: 30 })
    .withMessage("user name maximum 30 character long"),
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
    .withMessage("password must be atleast 6 character long")
    .isLength({ max: 30 })
    .withMessage("password maximum 30 character long"),
  // check("confirmPassword")
  //   .exists()
  //   .withMessage("confirmPassword can't be null"),
  // body("confirmPassword")
  //   .notEmpty()
  //   .withMessage("confirmPassword can't be empty")
  //   .trim(),
  // check("confirmPassword")
  //   .custom((value, { req }) => value === req.body.password)
  //   .withMessage("Password not matched"),
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
    .withMessage("password must be atleast 6 character long")
    .isLength({ max: 30 })
    .withMessage("new password maximum 30 character long"),
];

const createRoomValidation = () => [
  body("senderId").trim().notEmpty().withMessage("Sender Id not found"),
  body("receiverId").trim().notEmpty().withMessage("Receiver Id not found"),
];

const idValidation = () => [
  param("id").trim().notEmpty().withMessage("Id not found"),
];

const sendMessageValidation = () => [
  body("roomId").trim().notEmpty().withMessage("Room Id not found"),
  body("senderId").trim().notEmpty().withMessage("Sender Id not found"),
  body("receiverId").trim().notEmpty().withMessage("Receive Id not found"),
  body("message")
    .isLength({ max: 2000 })
    .withMessage("message maximum 2000 character long"),
];

const updateroomStatusValidation = () => [
  param("id").trim().notEmpty().withMessage("Id not found"),
  body("status").notEmpty().withMessage("update status not found"),
];

const userUpdateValidation = () => [
  body()
    .custom((value, { req }) => Object.keys(req.body).length !== 0)
    .withMessage("Data Not found"),
  body("userName")
    .optional()
    .trim()
    .isLength({ min: 4 })
    .withMessage("user name must be atleast 4 character long")
    .isLength({ max: 30 })
    .withMessage("user name maximum 30 character long"),
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("enter valid email adress"),
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
  forgotPasswordValidation,
  createRoomValidation,
  idValidation,
  updateroomStatusValidation,
  sendMessageValidation,
  userUpdateValidation,
};
