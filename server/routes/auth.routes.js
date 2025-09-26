const express = require("express");
const {signUp, signIn, forgotPassword, signOut} = require("../controllers/auth.controller");
const {validate, signUpValidation, signInValidation, forgotPasswordValidation} = require("../middleware/requestValidation");
const { auth } = require("../middleware/auth");

const authRouter = express.Router();

authRouter.post("/signup", signUpValidation(), validate, signUp);

authRouter.post("/signin", signInValidation(), validate, signIn);

authRouter.post("/forgotpassword", forgotPasswordValidation(), validate, forgotPassword);

authRouter.post("/signout", auth,  signOut)

module.exports = authRouter;