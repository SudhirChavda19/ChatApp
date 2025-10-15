const express = require("express");
const { auth } = require("../middleware/auth");
const { validate, sendMessageValidation, idValidation } = require("../middleware/requestValidation");
const { sendMessage, GetRoomMessages } = require("../controllers/message.controller");

const MessageRoute = express.Router();

MessageRoute.post("/sendMessage", auth, sendMessageValidation(), validate, sendMessage);

MessageRoute.get("/getMessages/:id", auth, idValidation(), validate, GetRoomMessages);

module.exports = MessageRoute;