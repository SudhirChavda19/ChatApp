const jwt = require("jsonwebtoken");

module.exports.generateTokenAndSetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "5d",
  });

  res.cookie("jwt", token, {
    maxAge: 5 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    path: "/",
    sameSite: "strict",
    // secure: process.env.NODE_ENV !== "development",
  });
};
