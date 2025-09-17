const express = require("express");
const {signUp, signIn, forgotPassword, signOut} = require("../controllers/auth.controller");
const validator = require("../middleware/requestValidation");

const router = express.Router();

router.post("/signup", validator.signUpValidation(), validator.validate, signUp);

router.post("/signin", validator.signInValidation(), validator.validate, signIn);

router.post("/forgotpassword", validator.forgotPasswordValidation(), validator.validate, forgotPassword);

router.post("/signout", signOut)

module.exports = router;