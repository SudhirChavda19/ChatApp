const express = require("express");
const { searchUser, getUser, updateUser } = require("../controllers/user.controller");
const { auth } = require("../middleware/auth");
const { validate, idValidation, userUpdateValidation } = require("../middleware/requestValidation");

const UserRouter = express.Router();

UserRouter.get("/search", auth, searchUser);

UserRouter.get("/getUser/:id", auth, idValidation(), validate,  getUser);

UserRouter.patch("/updateUser/:id", auth, idValidation(), userUpdateValidation(), validate,  updateUser);

module.exports = UserRouter;