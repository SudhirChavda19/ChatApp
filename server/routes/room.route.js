const express = require("express");

const {validate, createRoomValidation, idValidation, updateroomStatusValidation } = require("../middleware/requestValidation");
const { auth } = require("../middleware/auth");
const { createRoom, GetRoomByUser, updateRoomStatus, removeRoom } = require("../controllers/room.controller");

const RoomRoute = express.Router();

RoomRoute.post("/createRoom", auth, createRoomValidation(), validate, createRoom);

RoomRoute.get("/getRoomUsers/:id", auth, idValidation(), validate, GetRoomByUser);

RoomRoute.patch("/updateRoomStatus/:id", auth, updateroomStatusValidation(), validate, updateRoomStatus);

RoomRoute.delete("/removeRoom/:id", auth, idValidation(), validate, removeRoom);

module.exports = RoomRoute;