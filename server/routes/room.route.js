const express = require("express");

const {validate, createRoomValidation, getRoomByUserIdValidation } = require("../middleware/requestValidation");
const { auth } = require("../middleware/auth");
const { createRoom, GetRoomByUser } = require("../controllers/room.controller");

const RoomRoute = express.Router();

RoomRoute.post("/createRoom", auth, createRoomValidation(), validate, createRoom);

RoomRoute.get("/getRoomUsers/:id", auth, getRoomByUserIdValidation(), validate, GetRoomByUser);

module.exports = RoomRoute;