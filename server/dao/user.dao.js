const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const createUser = async (user) => {
  try {
    const { userName, password, email } = user;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      password: hashedPassword,
      email,
    });
    return newUser;
  } catch (error) {
    console.log("Error in create user dao :", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const getUserById = async (userId) => {};

module.expoers = {
  createUser,
  getUserById,
};
