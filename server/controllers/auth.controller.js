const bcrypt = require("bcrypt");
import User from "../models/user.model.js";
const generateTokenAndSetCookie = require("../utils/generateToken.js");

exports.signup = (req, res) => {
  try {
    const { userName, email, password, confirmPassword } = req.body;


  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
