
const { generateTokenAndSetCookie } = require("../utils/generateToken.js");

const signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    const user = await User.findOne({ email });
    console.log("user :", user);

    if (user) {
      return res.status(400).json({
        status: "Fail",
        message: "User Already Exists",
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
        message: "Invalid User Data",
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
    const user = await User.findOne({ email });
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
