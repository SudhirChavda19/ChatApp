const express = require("express");
const {signup, signin, logout, forgotPassword} = require("../controllers/auth.controller.js");
const validator = require("../middleware/requestValidation");

const router = express.Router();

router.post("/signup", validator.signUpValidation(), validator.validate, signup);

router.post("/signin", validator.signUpValidation(), validator.validate, signin);

router.post("/logout", logout)

module.exports = router;