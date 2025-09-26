const express = require("express");

const {validate, createRoomValidation, getRoomByUserIdValidation, updateroomStatusValidation } = require("../middleware/requestValidation");
const { auth } = require("../middleware/auth");
const { createRoom, GetRoomByUser, updateRoomStatus } = require("../controllers/room.controller");

const RoomRoute = express.Router();

RoomRoute.post("/createRoom", auth, createRoomValidation(), validate, createRoom);

RoomRoute.get("/getRoomUsers/:id", auth, getRoomByUserIdValidation(), validate, GetRoomByUser);

RoomRoute.patch("/updateRoomStatus/:id", auth, updateroomStatusValidation(), validate, updateRoomStatus);

module.exports = RoomRoute;