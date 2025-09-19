const express = require("express");
const {signUp, signIn, forgotPassword, signOut} = require("../controllers/auth.controller");
const validator = require("../middleware/requestValidation");
const { auth } = require("../middleware/auth");

const authRouter = express.Router();

authRouter.post("/signup", validator.signUpValidation(), validator.validate, signUp);

authRouter.post("/signin", validator.signInValidation(), validator.validate, signIn);

authRouter.post("/forgotpassword", validator.forgotPasswordValidation(), validator.validate, forgotPassword);

authRouter.post("/signout", auth,  signOut)

module.exports = authRouter;