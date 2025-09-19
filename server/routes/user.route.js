const express = require("express");
const { searchUser } = require("../controllers/user.controller");
const { auth } = require("../middleware/auth");

const UserRouter = express.Router();

UserRouter.get("/search", auth, searchUser);

module.exports = UserRouter;