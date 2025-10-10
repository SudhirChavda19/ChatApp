const bcrypt = require("bcrypt");
const User = require("../models/user.model");

const createUser = async ({ userName, password, email }) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      password: hashedPassword,
      email,
    });

    if (newUser) await newUser.save();
    return newUser;
  } catch (error) {
    console.log("Error in create user dao :", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const getUserById = async (userId) => {
  try {
    return await User.findOne({ _id: userId });
  } catch (error) {
    console.log("Error in getUserById dao :", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const updateUserById = async (userId, updatedata) => {
console.log('updatedata :', updatedata);
  try {
    return await User.findByIdAndUpdate(
      userId,
      updatedata,
      {
        new: true,
      }
    );
  } catch (error) {
    console.log("Error in updateUserById dao :", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const getUserByEmail = async (email) => {
  try {
    return await User.findOne({ email });
  } catch (error) {
    console.log("Error in getUserByEmail dao :", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  createUser,
  getUserById,
  getUserByEmail,
  updateUserById,
};
