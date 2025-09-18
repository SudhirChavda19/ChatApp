const bcrypt = require("bcrypt");
const User = require("../models/user.model.js");
const { generateTokenAndSetCookie } = require("../utils/generateToken.js");

const signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("user :", user);

    if (user) {
      return res.status(400).json({
        status: "Fail",
        message: "Username already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      password: hashedPassword,
      email,
    });

    if (newUser) {
      await newUser.save();
      return res.status(201).json({
        status: "Success",
        message: "User created successfully",
        data: { user: { email: newUser.email } },
      });
    } else {
      return res.status(400).json({
        status: "Fail",
        message: "Invalid user data",
      });
    }
  } catch (error) {
    console.log("Error in signin controller :", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("req.body :", req.body);
    const user = await User.findOne({ email });
    console.log("user :", user);
    if (!user) {
      return res.status(400).json({
        status: "Fail",
        message: "User Not Found",
      });
    }

    generateTokenAndSetCookie(user._id, res);
    
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: "Fail", message: "Wrong Password" });
    }

    return res.status(200).json({
      status: "Success",
      message: "Signed in successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error in signin controller", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email }).promise();
    console.log("user :", user);
    if (!user) {
      return res.status(400).json({
        status: "Fail",
        message: "User Not Found",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    await user.save();

    const expirationTime = new Date(Date.now() + 0);
    const expiredCookieString = `email=; HttpOnly; Expires=${expirationTime.toUTCString()}; Path=/`;
    res.setHeader("Set-Cookie", expiredCookieString);

    return res.status(201).json({
      status: "Success",
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log("Error in forgotPassword controller", error);
    return res.status(500).json({
      status: "Fail",
      message: "Internal Server Error",
    });
  }
};

const signOut = (req, res) => {
  try {
    // const expirationTime = new Date(Date.now() + 0);
    // const expiredCookieString = `jwt=; HttpOnly;
    // Expires=${expirationTime.toUTCString()}; Path=/`;
    // res.setHeader("Set-Cookie", expiredCookieString);
    // return res.status(200).json({
    //   status: 200,
    //   message: "Signed out successfully",
    // });
    res.clearCookie("email", { path: "/" });
    res.clearCookie("jwt", { path: "/" }).status(200).json({
      status: 200,
      message: "Signed out successfully",
    });
  } catch (error) {
    console.log("Error in signOut controller", error);
    return res.status(500).json({
      status: "Fail",
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  signUp,
  signIn,
  forgotPassword,
  signOut,
};
